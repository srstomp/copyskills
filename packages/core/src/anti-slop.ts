import type { SkillLoader } from './loader.js';
import type { AntiSlopResult, AntiSlopIssue } from './types.js';

export interface AntiSlopCheckOptions {
  /**
   * Additional banned words/phrases to flag alongside the doc's patterns.
   * Typically sourced from brief.brand_voice.avoids.
   * Matched case-insensitive, with word boundaries when the term is purely word characters.
   */
  extraBannedWords?: string[];
}

export interface AntiSlopChecker {
  check(text: string, options?: AntiSlopCheckOptions): AntiSlopResult;
  getBannedPatterns(): string[];
}

/**
 * Pattern entry parsed from anti-slop.md.
 * suggestion is an optional rewrite hint extracted from the bullet text.
 */
interface PatternEntry {
  pattern: string;
  suggestion?: string;
}

/**
 * Normalize a string for matching: lowercase, collapse smart quotes/dashes
 * to ASCII equivalents, collapse whitespace.
 */
function normalize(text: string): string {
  return text
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/—/g, '--')
    .replace(/–/g, '-')
    .replace(/…/g, '...');
}

/**
 * Convert a parsed pattern string into a regex source.
 *
 * - Strips trailing ellipsis (".." or "..." or "…") -- patterns end at the
 *   characteristic phrase, not at the doc-writer's elision.
 * - Replaces [Placeholder] tokens with a non-greedy wildcard so
 *   "In today's [X]..." matches "In today's fast-paced world".
 * - Otherwise escapes regex metacharacters.
 * - Adds word boundaries when the pattern begins and ends with word chars.
 */
function patternToRegexSource(rawPattern: string): string {
  let pattern = rawPattern.replace(/(\.{2,}|…)$/u, '').trim();
  if (pattern.length === 0) return '';

  const PLACEHOLDER = '\x01PH\x01';
  const placeholderRegex = '[\\w\'\\s-]{1,40}';

  pattern = pattern.replace(/\[[^\]]+\]/g, PLACEHOLDER);

  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withPlaceholders = escaped.replaceAll(PLACEHOLDER, placeholderRegex);

  const startsWithWord = /^\w/.test(rawPattern);
  const endsWithWord = /\w$/.test(pattern);
  const prefix = startsWithWord ? '\\b' : '';
  const suffix = endsWithWord ? '\\b' : '';

  return `${prefix}${withPlaceholders}${suffix}`;
}

/**
 * Parse banned word/phrase patterns from anti-slop.md content.
 *
 * Strategy:
 * - Find sections under headings "Verbs", "Adjectives", "Nouns", "Opening patterns", "Filler phrases"
 * - For each bullet under those sections, extract the pattern and optional suggestion
 * - Also handle the Punctuation section for em dash detection as a structural flag
 */
function parseBannedPatterns(markdown: string): PatternEntry[] {
  const entries: PatternEntry[] = [];

  const lines = markdown.split('\n');

  // Track whether we're inside a relevant section
  let inRelevantSection = false;

  // Headings that contain lists of banned patterns (case-insensitive partial match)
  const relevantSectionKeywords = [
    'verbs',
    'adjectives',
    'nouns',
    'opening patterns',
    'filler phrases',
  ];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect heading transitions (# or ##)
    if (trimmed.startsWith('#')) {
      const headingText = trimmed.replace(/^#+\s*/, '').toLowerCase();
      inRelevantSection = relevantSectionKeywords.some(kw => headingText.includes(kw));
      continue;
    }

    // Process bullet lines inside relevant sections
    if (inRelevantSection && trimmed.startsWith('- ')) {
      const bulletContent = trimmed.slice(2).trim();

      // Skip bold/special punctuation entries like **Em dash**
      // (Em dash is handled separately as a structural check)
      if (bulletContent.startsWith('**')) {
        continue;
      }

      // Extract the pattern: the first token before a dash, colon, or parenthesis
      // e.g. "tapestry (in any non-literal sense)" -> "tapestry"
      // e.g. "landscape (as a metaphor..." -> "landscape"
      // e.g. '"In today\'s [X]..." (opens half of all...)' -> 'In today\'s [X]...'
      let patternRaw = bulletContent;

      // If it starts with a quote, extract quoted phrase
      if (patternRaw.startsWith('"')) {
        const closeQuote = patternRaw.indexOf('"', 1);
        if (closeQuote > 1) {
          patternRaw = patternRaw.slice(1, closeQuote);
        }
      } else {
        // Take everything up to first " (", " -", or " --" that indicates an explanation
        const parenMatch = patternRaw.match(/^([^(]+?)\s*\(/);
        if (parenMatch) {
          patternRaw = parenMatch[1].trim();
        } else {
          // Look for " - " separator (explanation after dash)
          const dashIdx = patternRaw.indexOf(' - ');
          if (dashIdx > 0) {
            patternRaw = patternRaw.slice(0, dashIdx).trim();
          }
        }
      }

      const pattern = patternRaw.trim();
      if (pattern.length > 0) {
        // Extract a suggestion from parenthetical or dash content if present
        let suggestion: string | undefined;
        const parenSuggest = bulletContent.match(/\(([^)]+)\)/);
        if (parenSuggest) {
          suggestion = parenSuggest[1].trim();
        } else {
          const dashSuggest = bulletContent.match(/ - (.+)$/);
          if (dashSuggest) {
            suggestion = dashSuggest[1].trim();
          }
        }

        entries.push({ pattern, suggestion });
      }
    }
  }

  return entries;
}

/**
 * Abbreviations that should not trigger sentence splits.
 * These are common title/honorific/etc abbreviations ending in a period.
 */
const ABBREV_PATTERN = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e|Fig|vol|approx|dept|est|govt|Inc|Ltd|Corp|Co|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\./gi;

/**
 * Split text into sentences, respecting common abbreviations.
 * Splits on `. `, `.\n`, `! `, `!\n`, `? `, `?\n`
 */
function splitIntoSentences(text: string): string[] {
  // Replace abbreviation periods with a placeholder to avoid false splits
  const placeholder = '\x00ABBREV\x00';
  const protected_ = text.replace(ABBREV_PATTERN, (match) => match.slice(0, -1) + placeholder);

  // Split on sentence-ending punctuation followed by space or newline
  const parts = protected_.split(/(?<=[.!?])(?:\s+|\n)/);

  // Restore placeholder
  return parts
    .map(s => s.replace(new RegExp(placeholder, 'g'), '.').trim())
    .filter(s => s.length > 0);
}

/**
 * Count words in a string (split by whitespace).
 */
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Heuristic for the tricolon trap.
 *
 * Three items form a jingle when they share grammatical shape: same suffix
 * (-ly / -ed / -ing / -ble / -ic / -ive), or near-identical lengths, or all
 * end with the same final letter cluster.
 *
 * Returns false for mixed-form trios like "fast, reliable, and built for scale",
 * which is the human pattern the doc encourages.
 */
function isJingleTricolon(a: string, b: string, c: string): boolean {
  const items = [a, b, c].map(s => s.toLowerCase());

  if (items.some(s => s.length < 3)) return false;

  // All three share an identical 2- to 4-char suffix
  for (const n of [2, 3, 4]) {
    if (items.every(s => s.length > n)) {
      const last = items[0].slice(-n);
      if (items.every(s => s.slice(-n) === last)) return true;
    }
  }

  // At least two share a common adjective/adverb suffix family.
  // Catches "fast, reliable, scalable" via shared -ble suffix on 2 of 3.
  const adjFamilies = ['able', 'ible', 'ive', 'ous', 'less', 'ful', 'ish', 'ic', 'ant', 'ent', 'ed', 'ing', 'ly'];
  for (const fam of adjFamilies) {
    const matches = items.filter(s => s.length > fam.length && s.endsWith(fam)).length;
    if (matches >= 2) return true;
  }

  // Near-identical lengths (max - min <= 2)
  const lengths = items.map(s => s.length);
  if (Math.max(...lengths) - Math.min(...lengths) <= 2) return true;

  return false;
}

/**
 * Count specificity markers in text: numbers, percentages, dollar amounts,
 * time durations, version numbers, and capitalized multi-word proper nouns.
 *
 * Deliberately conservative -- favors precision over recall so a flag means
 * the text really does lack concrete details.
 */
function countSpecifics(text: string): number {
  let count = 0;

  // Numbers, percentages, dollar amounts, multipliers
  count += (text.match(/\b\d+(?:[.,]\d+)?%?/g) ?? []).length;
  count += (text.match(/\$\d+(?:[.,]\d+)?[kKmMbB]?/g) ?? []).length;
  count += (text.match(/\b\d+x\b/gi) ?? []).length;

  // Time durations / dates
  count += (text.match(/\b\d+\s*(?:second|minute|hour|day|week|month|year|sec|min|hr|mo|yr)s?\b/gi) ?? []).length;
  count += (text.match(/\b(?:19|20)\d{2}\b/g) ?? []).length;

  // Capitalized proper nouns of 2+ words (likely product/company/customer names)
  count += (text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b/g) ?? []).length;

  // Hyphenated specifics like "v2.1", "Q3", "H1"
  count += (text.match(/\b[QH][1-4]\b/g) ?? []).length;
  count += (text.match(/\bv\d+(?:\.\d+)*\b/gi) ?? []).length;

  return count;
}

/**
 * Calculate standard deviation of an array of numbers.
 */
function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

export function createAntiSlopChecker(loader: SkillLoader): AntiSlopChecker {
  // Load and parse anti-slop.md at construction time
  const markdown = loader.resolveReference('quality-frameworks/references/anti-slop.md');
  const patternEntries = parseBannedPatterns(markdown);

  function getBannedPatterns(): string[] {
    return patternEntries.map(e => e.pattern);
  }

  function check(text: string, options?: AntiSlopCheckOptions): AntiSlopResult {
    if (!text || text.trim().length === 0) {
      return { score: 0, issues: [] };
    }

    const issues: AntiSlopIssue[] = [];
    const rawLines = text.split('\n');
    const normalizedLines = rawLines.map(normalize);

    // Merge doc patterns with caller-supplied brand-voice avoids
    const extras = (options?.extraBannedWords ?? [])
      .map(w => (typeof w === 'string' ? w.trim() : ''))
      .filter(w => w.length > 0);
    const allEntries: PatternEntry[] = [
      ...patternEntries,
      ...extras.map(w => ({
        pattern: w,
        suggestion: 'Brand voice excludes this term',
      })),
    ];

    // --- 1. Word/phrase scan (case-insensitive, normalized) ---
    for (const entry of allEntries) {
      const normalizedPattern = normalize(entry.pattern);
      const regexStr = patternToRegexSource(normalizedPattern);
      if (!regexStr) continue;

      try {
        const regex = new RegExp(regexStr, 'i');

        for (let lineIdx = 0; lineIdx < normalizedLines.length; lineIdx++) {
          if (regex.test(normalizedLines[lineIdx])) {
            issues.push({
              pattern: entry.pattern,
              line: lineIdx + 1,
              suggestion: entry.suggestion,
            });
            break; // Only record first occurrence per pattern
          }
        }
      } catch {
        // Skip patterns that produce invalid regex
      }
    }

    // --- 2. Em dash and en dash detection ---
    // Catches Unicode em dash (U+2014), Unicode en dash (U+2013),
    // and the ASCII double-hyphen "--" surrogate commonly emitted by LLMs.
    const EM_DASH = '\u2014';
    const EN_DASH = '\u2013';
    const DOUBLE_HYPHEN = /(^|[^-])--($|[^-])/;

    for (let lineIdx = 0; lineIdx < rawLines.length; lineIdx++) {
      const line = rawLines[lineIdx];
      if (line.includes(EM_DASH) || DOUBLE_HYPHEN.test(line)) {
        issues.push({
          pattern: 'Em dash',
          line: lineIdx + 1,
          suggestion: 'Use a comma, period, or restructure the sentence',
        });
        break;
      }
    }

    for (let lineIdx = 0; lineIdx < rawLines.length; lineIdx++) {
      if (rawLines[lineIdx].includes(EN_DASH)) {
        issues.push({
          pattern: 'En dash',
          line: lineIdx + 1,
          suggestion: 'Use a hyphen for ranges or restructure the sentence',
        });
        break;
      }
    }

    // --- 3. Sentence length variance ---
    const sentences = splitIntoSentences(text);
    if (sentences.length >= 3) {
      const wordCounts = sentences.map(wordCount);
      const sd = stdDev(wordCounts);
      if (sd < 3) {
        // Find which line has the first sentence (approximate with line 1)
        issues.push({
          pattern: 'Monotonous sentence length -- all sentences are similar length',
          line: 1,
          suggestion: 'Vary sentence length: mix short punches (4-6 words) with medium and longer sentences',
        });
      }
    }

    // --- 4. Paragraph opening patterns ---
    const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
    if (paragraphs.length >= 3) {
      // Extract the first word of each paragraph (lowercased)
      const firstWords = paragraphs.map(p => {
        const firstWord = p.split(/\s+/)[0];
        return firstWord.replace(/[^a-zA-Z'-]/g, '').toLowerCase();
      }).filter(w => w.length > 0);

      // Count occurrences of each first word
      const wordFreq: Record<string, number> = {};
      for (const word of firstWords) {
        wordFreq[word] = (wordFreq[word] ?? 0) + 1;
      }

      const dominantWord = Object.entries(wordFreq).find(([, count]) => count >= 3);
      if (dominantWord) {
        issues.push({
          pattern: `Paragraph opening repetition -- "${dominantWord[0]}" starts ${dominantWord[1]}+ paragraphs`,
          line: 1,
          suggestion: 'Vary paragraph openings: mix subject-first, verb-first, questions, and fragments',
        });
      }
    }

    // --- 5. Tricolon detection (jingle-rhythm 3-item lists) ---
    // Catches "fast, reliable, and scalable", "design, build, and deploy" style lists
    // where all three items share the same shape (same suffix family or near-equal length).
    const tricolonRegex = /\b([\w-]+),\s+([\w-]+),?\s+(?:and|or)\s+([\w-]+)\b/gi;
    let tricolonFlagged = false;
    for (let lineIdx = 0; lineIdx < normalizedLines.length && !tricolonFlagged; lineIdx++) {
      for (const m of normalizedLines[lineIdx].matchAll(tricolonRegex)) {
        const [, a, b, c] = m;
        if (isJingleTricolon(a, b, c)) {
          issues.push({
            pattern: `Tricolon trap: "${a}, ${b}, and ${c}"`,
            line: lineIdx + 1,
            suggestion: 'Break the rhythm: add a fourth item, drop one, or mix grammatical forms',
          });
          tricolonFlagged = true;
          break;
        }
      }
    }

    // --- 6. Specificity heuristic ---
    // Counts concrete markers (numbers, percentages, dollar amounts, time
    // durations, named entities) per 200 words. Below 1 specific per 200 words
    // signals high slop risk per the reference doc. Only fires above 80 words
    // to avoid flagging short ad copy that's specific by other means.
    const totalWords = wordCount(text);
    if (totalWords >= 80) {
      const specificCount = countSpecifics(text);
      const expected = totalWords / 200;
      if (specificCount < Math.max(1, expected)) {
        issues.push({
          pattern: `Low specificity: ${specificCount} concrete details across ${totalWords} words`,
          line: 1,
          suggestion: 'Add numbers, names, timeframes, or specific behaviors -- vague claims read as slop',
        });
      }
    }

    // --- 7. Score calculation ---
    // Count distinct pattern types found
    // Each unique pattern name contributes 1; structural issues (variance, openings) also contribute 1 each
    const uniquePatterns = new Set(issues.map(i => i.pattern));
    const score = Math.min(10, uniquePatterns.size);

    return { score, issues };
  }

  return { check, getBannedPatterns };
}
