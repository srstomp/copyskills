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
    if (literal) return escapeRegex(part);
    if (/^\[[^\]\n]+\]$/u.test(part)) return "[\\p{L}\\p{N} '\\-]{1,40}";
    if (part === '...' || part === '…') return '[^.!?\\r\\n]{0,60}';
    if (/^ +$/.test(part)) return '\\s+';
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
function numbers(text: string, facts = false): RegExpMatchArray[] {
  return [...text.matchAll(facts ? /\d+(?:[.,]\d+)*/gu : /\d+(?:[.,]\d+)?/gu)].filter(match => {
    const index = match.index!;
    // At most two UTF-16 units are needed for the preceding Unicode character.
    return !/[\p{L}_]$/u.test(text.slice(Math.max(0, index - 2), index));
  });
}
function numberValues(value: string, facts = false): number[] {
  const readings = [value, ...(facts ? value.split(',') : [])];
  return readings.flatMap(reading => {
    const decimal = Number(reading.replace(',', '.'));
    return /^\d+[.,]\d{3}$/.test(reading)
      ? [decimal, Number(reading.replace(/[.,]/, ''))] : [decimal];
  }).filter(Number.isFinite);
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
    for (const match of [...matches].sort((a, b) => (b.end - b.start) - (a.end - a.start))) {
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
      const facts = new Set(numbers(options.facts, true).flatMap(n => numberValues(n[0], true)));
      // Also scan CSV fields independently, including fields after an identifier.
      for (const number of numbers(options.facts.replace(/,/g, ' '))) {
        for (const value of numberValues(number[0])) facts.add(value);
      }
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
      let masked = normalize(text).toLowerCase();
      for (const number of numbers(masked).reverse()) {
        masked = masked.slice(0, number.index) + '#' + masked.slice(number.index! + number[0].length);
      }
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
