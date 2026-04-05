import type { SkillLoader } from './loader.js';
import type { AntiSlopResult, AntiSlopIssue } from './types.js';

export interface AntiSlopChecker {
  check(text: string): AntiSlopResult;
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

  function check(text: string): AntiSlopResult {
    if (!text || text.trim().length === 0) {
      return { score: 0, issues: [] };
    }

    const issues: AntiSlopIssue[] = [];
    const lines = text.split('\n');

    // --- 1. Word/phrase scan (case-insensitive) ---
    for (const entry of patternEntries) {
      const pattern = entry.pattern;
      // Escape special regex characters in pattern
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Use word boundary where possible; patterns with non-word chars use lookahead/lookbehind
      const hasWordChars = /^\w/.test(pattern) && /\w$/.test(pattern);
      const regexStr = hasWordChars ? `\\b${escaped}\\b` : escaped;

      try {
        const regex = new RegExp(regexStr, 'i');

        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
          if (regex.test(lines[lineIdx])) {
            issues.push({
              pattern,
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
    const EM_DASH = '\u2014';
    const EN_DASH = '\u2013';

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      if (lines[lineIdx].includes(EM_DASH)) {
        issues.push({
          pattern: 'Em dash (--)',
          line: lineIdx + 1,
          suggestion: 'Use a comma, period, or restructure the sentence',
        });
        break;
      }
    }

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      if (lines[lineIdx].includes(EN_DASH)) {
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

    // --- 5. Score calculation ---
    // Count distinct pattern types found
    // Each unique pattern name contributes 1; structural issues (variance, openings) also contribute 1 each
    const uniquePatterns = new Set(issues.map(i => i.pattern));
    const score = Math.min(10, uniquePatterns.size);

    return { score, issues };
  }

  return { check, getBannedPatterns };
}
