import type { SkillLoader } from './loader.js';
import { languageOf } from './locale.js';

export type Severity = 'error' | 'warn';
export interface LintIssue {
  rule: string;
  severity: Severity;
  message: string;
  line?: number;
  item?: number;
  suggestion?: string;
}
export interface LintOptions {
  locale?: string;
  kind?: 'title' | 'meta' | 'body';
  min?: number;
  max?: number;
  facts?: string;
  avoid?: string[];
}
export interface LintResult { issues: LintIssue[]; errors: number; warnings: number }
export interface Linter {
  lint(text: string, options?: LintOptions): LintResult;
  lintBatch(items: string[], options?: LintOptions): LintResult;
}

interface Pattern {
  text: string;
  severity: Severity;
  suggestion?: string;
  regex: RegExp;
}

function normalize(text: string): string {
  return text.normalize('NFC').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compile(text: string, severity: Severity, suggestion?: string, literal = false): Pattern | undefined {
  text = normalize(text);
  if (!literal) text = text.replace(/(?:\.\.\.|…)+$/u, '');
  if (!text.trim()) return;
  const parts = literal ? [text] : text.split(/(\[[^\]\n]+\]|\.\.\.|…|\p{L}+\*| +)/u);
  const body = parts.map(part => {
    if (literal) return escapeRegex(part).replace(/\s+/gu, '\\s{1,4}');
    if (/^\[[^\]\n]+\]$/u.test(part)) return "[\\p{L}\\p{N} '\\-]{1,40}";
    if (part === '...' || part === '…') return '[^.!?\\r\\n]{0,60}';
    // Bounded: an unbounded \s+ next to the [X] and ... classes backtracks quadratically on long space runs.
    if (/^ +$/.test(part)) return '\\s{1,4}';
    if (/^\p{L}+\*$/u.test(part)) return escapeRegex(part.slice(0, -1)) + '\\p{L}*';
    return escapeRegex(part);
  }).join('');
  const start = /^[\p{L}\p{N}]/u.test(text) ? '(?<![\\p{L}\\p{N}_])' : '';
  const end = /[\p{L}\p{N}]$/u.test(text) ? '(?![\\p{L}\\p{N}_])' : '';
  return { text, severity, ...(suggestion ? { suggestion } : {}), regex: new RegExp(start + body + end, 'iu') };
}

function parsePatterns(markdown: string): Pattern[] {
  const patterns: Pattern[] = [];
  let severity: Severity | undefined;
  const lines = markdown.split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const heading = /^ {0,3}#{1,6}(?:\s+|$)/.test(line) ||
      (line.trim() !== '' && !/^\s*(?:[-+*]|\d+[.)])\s/u.test(line) && /^ {0,3}(?:=+|-+)\s*$/.test(lines[index + 1] ?? ''));
    if (heading) {
      severity = line.match(/\{lint: (error|warn)\}/)?.[1] as Severity | undefined;
      continue;
    }
    if (!severity || !/^\s*- /.test(line)) continue;
    const bullet = normalize(line.replace(/^\s*- /, '').replace(/\*\*/g, '').trim());
    const quoted = bullet.match(/^"([^"]+)"(.*)$/);
    let text: string;
    let suggestion: string;
    if (quoted) {
      text = quoted[1];
      suggestion = quoted[2].trim().replace(/^-\s*/, '');
    } else {
      const delimiter = bullet.search(/ \(| - /);
      text = delimiter < 0 ? bullet : bullet.slice(0, delimiter);
      suggestion = delimiter < 0 ? '' : bullet.slice(delimiter).trim().replace(/^-\s*/, '');
    }
    const pattern = compile(text, severity, suggestion);
    if (pattern) patterns.push(pattern);
  }
  return patterns;
}

// Match the whole numeric candidate before checking its prefix, so v2.5
// cannot leak a partial match for 5.
function numbers(text: string): RegExpMatchArray[] {
  return [...text.matchAll(/\d+(?:[.,]\d+)*/gu)].filter(match => {
    const index = match.index!;
    // At most two UTF-16 units are needed for the preceding Unicode character.
    return !/[\p{L}_]$/u.test(text.slice(Math.max(0, index - 2), index));
  });
}
/** Numeric readings of a number token: "15,5" = 15.5; "1.200" = 1.2 or 1200; "1.234,56" = 1234.56. */
function numberValues(value: string): number[] {
  const separators = [...value.matchAll(/[.,]/g)];
  if (separators.length === 0) return [Number(value)];
  const last = separators[separators.length - 1];
  const tail = value.slice(last.index! + 1);
  if (separators.length === 1) {
    const decimal = Number(value.replace(',', '.'));
    return tail.length === 3 ? [decimal, Number(value.replace(/[.,]/, ''))] : [decimal];
  }
  if (separators.every(sep => sep[0] === last[0]) && tail.length === 3) return [Number(value.replace(/[.,]/g, ''))];
  return [Number(`${value.slice(0, last.index).replace(/[.,]/g, '')}.${tail}`)];
}

function splitSentences(text: string): string[] {
  // Protect abbreviation periods while preserving their spelling in repeat reports.
  const protectedText = text.replace(/(?<![\p{L}\p{N}_])(?:z\.\s*B\.|d\.\s*h\.|bzw\.|bijv\.|o\.a\.|d\.w\.z\.|e\.g\.|i\.e\.|etc\.)/giu,
    abbreviation => abbreviation.replace(/\./g, '\u0000'));
  return protectedText.split(/…+|[.!?]+(?:\s+|$)|[\r\n]+/u).map(part => part.replace(/\u0000/g, '.'));
}
function words(text: string): string[] { return text.match(/[\p{L}\p{N}']+/gu) ?? []; }
function result(issues: LintIssue[]): LintResult {
  return { issues, errors: issues.filter(i => i.severity === 'error').length, warnings: issues.filter(i => i.severity === 'warn').length };
}

export function createLinter(loader: SkillLoader): Linter {
  const cache = new Map<string, Pattern[]>();
  function patternsFor(locale: string): Pattern[] {
    const language = languageOf(locale);
    if (!cache.has(language)) {
      const patterns = language === 'en'
        ? parsePatterns(loader.resolveReference('quality-frameworks/references/anti-slop.md')) : [];
      let local = '';
      try {
        local = loader.resolveReference(`quality-frameworks/references/locales/${language}.md`);
      } catch (error) {
        if (!(error instanceof Error) || !(/Reference not found/.test(error.message) || ('code' in error && error.code === 'ENOENT'))) throw error;
      }
      patterns.push(...parsePatterns(local));
      cache.set(language, patterns);
    }
    return cache.get(language)!;
  }

  function lint(text: string, options: LintOptions = {}): LintResult {
    const issues: LintIssue[] = [];
    const normalized = normalize(text);
    const patterns = [...patternsFor(options.locale ?? 'en')];
    for (const phrase of options.avoid ?? []) {
      const pattern = compile(phrase, 'error', undefined, true);
      if (pattern) patterns.push(pattern);
    }
    const seen = new Set<string>();
    const matches: { issue: LintIssue; start: number; end: number }[] = [];
    for (const pattern of patterns) {
      const key = pattern.text.toLowerCase();
      if (seen.has(key)) continue;
      // Prefer error if a phrase is listed by both a file and brand voice.
      const severity = patterns.some(p => p.text.toLowerCase() === key && p.severity === 'error') ? 'error' : pattern.severity;
      seen.add(key);
      const hit = pattern.regex.exec(normalized);
      if (hit) matches.push({
        start: hit.index, end: hit.index + hit[0].length,
        issue: { rule: 'phrase', severity, message: `Banned pattern: ${pattern.text}`, line: normalized.slice(0, hit.index).split('\n').length, ...(pattern.suggestion ? { suggestion: pattern.suggestion } : {}) },
      });
    }
    const reported: typeof matches = [];
    // Errors first, so a warning can never hide an overlapping error; then longer matches first.
    const rank = (m: (typeof matches)[number]) => (m.issue.severity === 'error' ? 0 : 1);
    for (const match of [...matches].sort((a, b) => rank(a) - rank(b) || (b.end - b.start) - (a.end - a.start))) {
      if (!reported.some(other => other.issue.line === match.issue.line && other.start < match.end && match.start < other.end)) {
        reported.push(match);
      }
    }
    issues.push(...matches.filter(match => reported.includes(match)).map(match => match.issue));

    if (options.kind === 'title' || options.kind === 'meta') {
      const length = [...text.trim()].length;
      const max = options.max ?? (options.kind === 'title' ? 60 : 160);
      const min = options.min;
      let severity: Severity | undefined;
      if (length > max || (min !== undefined && length < min)) severity = 'error';
      else if (options.min === undefined && options.max === undefined &&
        (length < (options.kind === 'title' ? 30 : 120) || (options.kind === 'meta' && length > 155))) severity = 'warn';
      if (severity) issues.push({ rule: 'length', severity, message: `${options.kind} has ${length} characters` });
    }

    const sentences = new Map<string, number>();
    for (const part of splitSentences(normalized)) {
      const sentence = part.toLowerCase().replace(/\s+/gu, ' ').trim().replace(/[\p{P}\s]+$/u, '');
      if (words(sentence).length >= 3) sentences.set(sentence, (sentences.get(sentence) ?? 0) + 1);
    }
    for (const [sentence, count] of sentences) {
      if (count >= 2) issues.push({ rule: 'repeat', severity: 'error', message: `Sentence "${sentence}" occurs ${count} times` });
    }

    if (options.facts !== undefined) {
      // In a CSV row commas separate fields, not decimals. A row has an unspaced comma touching a
      // non-digit ("DS45,Dassai") or three comma-joined numbers ("45,720,16"); prose with "15,5%" has neither.
      // A comma touching a letter or quote, or three comma-joined numbers, marks a CSV row; a row keeps
      // both readings so a quoted "34,50" field still counts. Unspaced pairs like "300,720" read as one
      // decimal and fail closed (the copy's 300 and 720 are reported).
      const isCsvRow = (line: string) => /[\p{L}"'],\S|\S,[\p{L}"']/u.test(line) || /\d+,\d+,\d+/.test(line);
      const factText = options.facts.split('\n').map(line => (isCsvRow(line) ? `${line} ${line.replace(/,/g, ' ')}` : line)).join('\n');
      const facts = new Set(numbers(factText).flatMap(n => numberValues(n[0])));
      for (const number of numbers(text)) {
        if (!numberValues(number[0]).some(value => facts.has(value))) issues.push({ rule: 'number', severity: 'error', message: `Number ${number[0]} is not in the fact sheet` });
      }
    }
    return result(issues);
  }

  function lintBatch(items: string[], options: LintOptions = {}): LintResult {
    languageOf(options.locale ?? 'en');
    const issues: LintIssue[] = items.flatMap((text, item) => lint(text, options).issues.map(issue => ({ ...issue, item })));
    if (items.length < 3) return result(issues);
    const skeletons = new Map<string, Set<number>>();
    const openers = new Map<string, Set<number>>();
    function record(map: Map<string, Set<number>>, phrase: string, item: number) {
      if (!map.has(phrase)) map.set(phrase, new Set());
      map.get(phrase)!.add(item);
    }
    items.forEach((text, item) => {
      // Mask whole numbers only: a number glued to a letter (DS45, v2.5) stays part of its token.
      const masked = normalize(text).toLowerCase().replace(/\d+(?:[.,]\d+)*/gu,
        (match: string, at: number, all: string) => (/[\p{L}_]$/u.test(all.slice(Math.max(0, at - 2), at)) ? match : '#'));
      const tokens = masked.match(/[\p{L}\p{N}']+|#/gu) ?? [];
      if (tokens.length >= 3) record(openers, tokens.slice(0, 3).join(' '), item);
      for (let i = 0; i <= tokens.length - 4; i++) {
        const sequence = tokens.slice(i, i + 4);
        if (!sequence.includes('#')) record(skeletons, sequence.join(' '), item);
      }
    });
    const threshold = Math.max(3, Math.ceil(items.length / 2));
    for (const [rule, map] of [['skeleton', skeletons], ['opener', openers]] as const) {
      for (const [phrase, indices] of map) {
        if (indices.size >= threshold) issues.push({ rule, severity: 'error', message: `${rule === 'skeleton' ? 'Sequence' : 'Opener'} "${phrase}" occurs in items ${[...indices].join(', ')}` });
      }
    }
    return result(issues);
  }
  return { lint, lintBatch };
}
