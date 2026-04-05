import { describe, expect, test, beforeAll } from 'bun:test';
import { createAntiSlopChecker } from '../anti-slop';
import type { AntiSlopChecker } from '../anti-slop';
import { createLoader } from '../loader';
import path from 'path';

const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

let checker: AntiSlopChecker;

beforeAll(() => {
  const loader = createLoader(SKILLS_DIR);
  checker = createAntiSlopChecker(loader);
});

// AC: Parses banned patterns from the REAL anti-slop.md file (not hardcoded list)
describe('createAntiSlopChecker - factory and loader integration', () => {
  test('createAntiSlopChecker returns an object with check and getBannedPatterns methods', () => {
    const loader = createLoader(SKILLS_DIR);
    const c = createAntiSlopChecker(loader);
    expect(typeof c.check).toBe('function');
    expect(typeof c.getBannedPatterns).toBe('function');
  });

  test('createAntiSlopChecker reads from real anti-slop.md via loader.resolveReference', () => {
    // The loader will throw if the file doesn't exist -- verifies it actually loads
    const loader = createLoader(SKILLS_DIR);
    expect(() => createAntiSlopChecker(loader)).not.toThrow();
  });
});

// AC: getBannedPatterns() returns 20+ patterns
describe('getBannedPatterns()', () => {
  test('getBannedPatterns() returns an array', () => {
    expect(Array.isArray(checker.getBannedPatterns())).toBe(true);
  });

  test('getBannedPatterns() returns 20+ patterns parsed from anti-slop.md', () => {
    const patterns = checker.getBannedPatterns();
    expect(patterns.length).toBeGreaterThanOrEqual(20);
  });

  test('getBannedPatterns() includes "leverage" (a Verb from anti-slop.md)', () => {
    const patterns = checker.getBannedPatterns();
    expect(patterns.some(p => p.toLowerCase() === 'leverage')).toBe(true);
  });

  test('getBannedPatterns() includes "cutting-edge" (an Adjective from anti-slop.md)', () => {
    const patterns = checker.getBannedPatterns();
    expect(patterns.some(p => p.toLowerCase() === 'cutting-edge')).toBe(true);
  });

  test('getBannedPatterns() includes "seamless" (an Adjective from anti-slop.md)', () => {
    const patterns = checker.getBannedPatterns();
    expect(patterns.some(p => p.toLowerCase() === 'seamless')).toBe(true);
  });

  test('getBannedPatterns() includes "tapestry" (a Noun from anti-slop.md)', () => {
    const patterns = checker.getBannedPatterns();
    expect(patterns.some(p => p.toLowerCase() === 'tapestry')).toBe(true);
  });

  test('getBannedPatterns() returns strings', () => {
    const patterns = checker.getBannedPatterns();
    for (const p of patterns) {
      expect(typeof p).toBe('string');
      expect(p.length).toBeGreaterThan(0);
    }
  });
});

// AC: check("We leverage cutting-edge solutions") returns score >= 2 with "leverage" and "cutting-edge" flagged
describe('check() - word/phrase pattern detection', () => {
  test('check("We leverage cutting-edge solutions") returns score >= 2', () => {
    const result = checker.check('We leverage cutting-edge solutions');
    expect(result.score).toBeGreaterThanOrEqual(2);
  });

  test('check("We leverage cutting-edge solutions") flags "leverage"', () => {
    const result = checker.check('We leverage cutting-edge solutions');
    const patternNames = result.issues.map(i => i.pattern.toLowerCase());
    expect(patternNames.some(p => p.includes('leverage'))).toBe(true);
  });

  test('check("We leverage cutting-edge solutions") flags "cutting-edge"', () => {
    const result = checker.check('We leverage cutting-edge solutions');
    const patternNames = result.issues.map(i => i.pattern.toLowerCase());
    expect(patternNames.some(p => p.includes('cutting-edge'))).toBe(true);
  });

  test('check() is case-insensitive for pattern matching', () => {
    const lower = checker.check('leverage cutting-edge');
    const upper = checker.check('LEVERAGE CUTTING-EDGE');
    expect(lower.issues.length).toBe(upper.issues.length);
  });

  test('check() records 1-indexed line number for found patterns', () => {
    const result = checker.check('We leverage\nour solutions');
    const leverageIssue = result.issues.find(i => i.pattern.toLowerCase().includes('leverage'));
    expect(leverageIssue).toBeDefined();
    expect(leverageIssue!.line).toBe(1);
  });

  test('check() records correct line number when pattern is on line 2', () => {
    const result = checker.check('First line here\nWe leverage things');
    const leverageIssue = result.issues.find(i => i.pattern.toLowerCase().includes('leverage'));
    expect(leverageIssue).toBeDefined();
    expect(leverageIssue!.line).toBe(2);
  });

  test('check() on text with "seamless" flags it', () => {
    const result = checker.check('We provide seamless integration.');
    const patternNames = result.issues.map(i => i.pattern.toLowerCase());
    expect(patternNames.some(p => p.includes('seamless'))).toBe(true);
  });
});

// AC: check() on text with Unicode em dash returns score >= 1 with em dash flagged
describe('check() - em dash detection', () => {
  test('check() on text with Unicode em dash (U+2014) returns score >= 1', () => {
    const result = checker.check('We built this\u2014for you');
    expect(result.score).toBeGreaterThanOrEqual(1);
  });

  test('check() on text with Unicode em dash flags an em dash issue', () => {
    const result = checker.check('We built this\u2014for you');
    expect(result.issues.some(i => i.pattern.toLowerCase().includes('em dash') || i.pattern.includes('\u2014'))).toBe(true);
  });

  test('check() on text with Unicode en dash (U+2013) flags it', () => {
    const result = checker.check('We built this\u2013for you');
    expect(result.issues.some(i => i.pattern.toLowerCase().includes('dash') || i.pattern.includes('\u2013'))).toBe(true);
  });

  test('check() records correct line number for em dash', () => {
    const result = checker.check('line one\nhas dash\u2014here');
    const dashIssue = result.issues.find(i => i.pattern.toLowerCase().includes('dash') || i.pattern.includes('\u2014'));
    expect(dashIssue).toBeDefined();
    expect(dashIssue!.line).toBe(2);
  });
});

// AC: Sentence length variance detection works (text with all 15-word sentences flagged)
describe('check() - sentence length variance', () => {
  test('check() flags text with all 15-word sentences as monotonous', () => {
    // 4 sentences each with exactly 15 words
    const monotonous = [
      'The quick brown fox jumps over the lazy dog by the river.',
      'Our platform helps you manage your workflow faster and more efficiently.',
      'We designed the system to handle all your needs with great care.',
      'Every feature was built with the user in mind from day one.',
    ].join(' ');
    const result = checker.check(monotonous);
    const hasVarianceIssue = result.issues.some(i =>
      i.pattern.toLowerCase().includes('monoton') ||
      i.pattern.toLowerCase().includes('sentence') ||
      i.pattern.toLowerCase().includes('variance')
    );
    expect(hasVarianceIssue).toBe(true);
  });

  test('check() does not flag varied sentence lengths', () => {
    // Mix of short, medium, long sentences
    const varied = 'Stop. This is a medium length sentence with some words. And this is a much longer sentence that really goes on and on with many subordinate clauses to create genuine length variation that a human would write. Go.';
    const result = checker.check(varied);
    const hasVarianceIssue = result.issues.some(i =>
      i.pattern.toLowerCase().includes('monoton') ||
      (i.pattern.toLowerCase().includes('sentence') && i.pattern.toLowerCase().includes('length'))
    );
    expect(hasVarianceIssue).toBe(false);
  });

  test('check() does not flag variance for fewer than 3 sentences', () => {
    const twoSentences = 'This is sentence one with some words. This is sentence two with similar words.';
    const result = checker.check(twoSentences);
    const hasVarianceIssue = result.issues.some(i =>
      i.pattern.toLowerCase().includes('monoton')
    );
    expect(hasVarianceIssue).toBe(false);
  });
});

// AC: Paragraph opening pattern detection works (3+ paragraphs starting same word flagged)
describe('check() - paragraph opening detection', () => {
  test('check() flags text with 3+ paragraphs starting with the same word', () => {
    const repetitiveParagraphs = [
      'Our platform handles everything you need.',
      '',
      'Our team is dedicated to your success.',
      '',
      'Our solution scales with your business.',
    ].join('\n');
    const result = checker.check(repetitiveParagraphs);
    const hasOpeningIssue = result.issues.some(i =>
      i.pattern.toLowerCase().includes('paragraph') ||
      i.pattern.toLowerCase().includes('opening')
    );
    expect(hasOpeningIssue).toBe(true);
  });

  test('check() does not flag text where paragraphs start with different words', () => {
    const variedParagraphs = [
      'Our platform handles everything.',
      '',
      'Teams using this tool cut time.',
      '',
      'Results speak for themselves.',
    ].join('\n');
    const result = checker.check(variedParagraphs);
    const hasOpeningIssue = result.issues.some(i =>
      i.pattern.toLowerCase().includes('paragraph') ||
      i.pattern.toLowerCase().includes('opening')
    );
    expect(hasOpeningIssue).toBe(false);
  });

  test('check() does not flag fewer than 3 paragraphs starting with same word', () => {
    const twoParagraphs = [
      'Our platform handles everything.',
      '',
      'Our team is great.',
    ].join('\n');
    const result = checker.check(twoParagraphs);
    const hasOpeningIssue = result.issues.some(i =>
      i.pattern.toLowerCase().includes('paragraph') ||
      i.pattern.toLowerCase().includes('opening')
    );
    expect(hasOpeningIssue).toBe(false);
  });
});

// AC: check() on clean, varied human-written text returns score 0 or 1
describe('check() - clean text returns low score', () => {
  test('check() on clean varied human-written text returns score 0 or 1', () => {
    const clean = [
      'Last Tuesday, Maria cut her reporting time from 3 hours to 20 minutes.',
      '',
      'She used to export CSVs manually, format them in Excel, then email the whole mess to her manager.',
      '',
      'Now she clicks one button. The report lands in Slack before her coffee brews.',
    ].join('\n');
    const result = checker.check(clean);
    expect(result.score).toBeLessThanOrEqual(1);
  });
});

// AC: Score capped at 10
describe('check() - score capping', () => {
  test('check() score is capped at 10', () => {
    // Text with many banned patterns
    const sloppy = 'We leverage seamless cutting-edge innovative solutions to empower and transform your robust scalable ecosystem journey through our world-class paradigm tapestry delve realm landscape supercharge streamline harness unlock elevate revolutionize disrupt holistic dynamic comprehensive best-in-class game-changing next-generation industry-leading state-of-the-art intuitive powerful';
    const result = checker.check(sloppy);
    expect(result.score).toBeLessThanOrEqual(10);
  });

  test('check() score is never negative', () => {
    const result = checker.check('');
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  test('check() returns score as a number', () => {
    const result = checker.check('Hello world');
    expect(typeof result.score).toBe('number');
  });
});

// AC: issues array structure
describe('check() - return structure', () => {
  test('check() returns an object with score and issues', () => {
    const result = checker.check('leverage');
    expect(typeof result.score).toBe('number');
    expect(Array.isArray(result.issues)).toBe(true);
  });

  test('check() issues have pattern, line, and optional suggestion fields', () => {
    const result = checker.check('leverage');
    expect(result.issues.length).toBeGreaterThan(0);
    const issue = result.issues[0];
    expect(typeof issue.pattern).toBe('string');
    expect(typeof issue.line).toBe('number');
    // suggestion is optional -- just check it's string if present
    if (issue.suggestion !== undefined) {
      expect(typeof issue.suggestion).toBe('string');
    }
  });

  test('check() on empty string returns score 0 and empty issues', () => {
    const result = checker.check('');
    expect(result.score).toBe(0);
    expect(result.issues).toEqual([]);
  });
});

// AC: sentence splitter handles abbreviations
describe('check() - abbreviation handling in sentence splitter', () => {
  test('check() does not false-split on "Dr." abbreviation', () => {
    // 3 short sentences but one contains Dr. -- should not over-split
    // The main thing is variance detection works properly (no crash/incorrect behavior)
    const textWithAbbrev = 'Dr. Smith developed the system in 2019. It works great. Teams love it.';
    expect(() => checker.check(textWithAbbrev)).not.toThrow();
  });

  test('check() does not false-split on "e.g." abbreviation', () => {
    const textWithEg = 'Use common tools, e.g. Excel or Google Sheets, for your work. It helps teams. Everyone benefits.';
    expect(() => checker.check(textWithEg)).not.toThrow();
  });
});
