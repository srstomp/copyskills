import { describe, expect, test } from 'bun:test';
import { createLinter } from '../lint';
import type { SkillLoader } from '../loader';

const base = 'quality-frameworks/references/';
function linter(files: Record<string, string> = {}) {
  const loader: SkillLoader = {
    listSkills: () => [], getSkill: () => { throw new Error('unused'); },
    getReference: () => '', listReferences: () => [],
    resolveReference: (path) => {
      const value = files[path.slice(base.length)];
      if (value === undefined) throw new Error('Reference not found');
      return value;
    },
  };
  return createLinter(loader);
}
const fixture = {
  'anti-slop.md': `# Ordinary heading
- ignored
## Banned {lint: error}
- **leverage** (Use plain verbs)
- "best in class" - Be concrete
- "—" Avoid this dash
- " – " Avoid this dash too
### Softer {lint: warn}
- unlock [anything] potential - Name the benefit
- from...to… (Say what changes)
# Unmarked
- excluded
`,
  'locales/en.md': '# Local {lint: warn}\n- awesome - Be precise',
  'locales/nl.md': '# Nederlands {lint: error}\n- één\n- moeiteloos',
  'locales/de.md': '# Deutsch {lint: warn}\n- für (Alternative)',
};

describe('phrase rules', () => {
  test('explicit markers, suggestions, first line and section endings', () => {
    const result = linter(fixture).lint('ignored excluded\nLEVERAGE leverage best in class awesome');
    expect(result).toEqual({ errors: 2, warnings: 1, issues: [
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: leverage', line: 2, suggestion: '(Use plain verbs)' },
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: best in class', line: 2, suggestion: 'Be concrete' },
      { rule: 'phrase', severity: 'warn', message: 'Banned pattern: awesome', line: 2, suggestion: 'Be precise' },
    ] });
  });
  test('all heading levels and setext headings set or end a section', () => {
    const checker = linter({ 'anti-slop.md': '# Top {lint: error}\n- first\n###### Bottom {lint: warn}\n- second\nPlain heading\n============\n- ignored\nMarked heading {lint: error}\n------------\n- third' });
    expect(checker.lint('first second ignored third').issues).toEqual([
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: first', line: 1 },
      { rule: 'phrase', severity: 'warn', message: 'Banned pattern: second', line: 1 },
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: third', line: 1 },
    ]);
  });
  test('one issue per pattern even across files and avoid; brand phrases are errors', () => {
    const checker = linter({ 'anti-slop.md': '# {lint: warn}\n- jargon', 'locales/en.md': '# {lint: warn}\n- jargon' });
    expect(checker.lint('jargon JARGON', { avoid: ['JARGON', ''] })).toEqual({ errors: 1, warnings: 0, issues: [
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: jargon', line: 1 },
    ] });
  });
  test('unquoted dash suggestions and quoted patterns with delimiters', () => {
    const checker = linter({ 'anti-slop.md': '# {lint: warn}\n- plain words - Try detail\n- "a (b) - c" (Keep literal)' });
    expect(checker.lint('plain words; a (b) - c').issues).toEqual([
      { rule: 'phrase', severity: 'warn', message: 'Banned pattern: plain words', line: 1, suggestion: 'Try detail' },
      { rule: 'phrase', severity: 'warn', message: 'Banned pattern: a (b) - c', line: 1, suggestion: '(Keep literal)' },
    ]);
  });
  test('placeholder accepts 1-40 permitted Unicode characters', () => {
    const checker = linter(fixture);
    expect(checker.lint('unlock élève’s 2-day potential').issues).toContainEqual({ rule: 'phrase', severity: 'warn', message: 'Banned pattern: unlock [anything] potential', line: 1, suggestion: 'Name the benefit' });
    for (const value of ['', 'a'.repeat(41), 'a.b', 'a/b', 'a\nb']) {
      expect(checker.lint(`unlock ${value} potential`).issues).toEqual([]);
    }
  });
  test('inner gaps stay within 60 characters and cannot cross sentence ends; trailing ellipsis is stripped', () => {
    const checker = linter(fixture);
    for (const gap of ['', ' a better way ', 'a'.repeat(60)]) {
      expect(checker.lint(`from${gap}to`).issues).toEqual([{ rule: 'phrase', severity: 'warn', message: 'Banned pattern: from...to', line: 1, suggestion: '(Say what changes)' }]);
    }
    for (const gap of ['a'.repeat(61), '. ', '! ', '? ', '\n']) expect(checker.lint(`from${gap}to`).issues).toEqual([]);
  });
  test('primary language chooses the right files, with Unicode word boundaries', () => {
    const checker = linter(fixture);
    expect(checker.lint('geen néén éénmaal _één één2 leverage', { locale: 'nl-BE' }).issues).toEqual([]);
    expect(checker.lint('één', { locale: 'nl-NL' }).issues).toEqual([{ rule: 'phrase', severity: 'error', message: 'Banned pattern: één', line: 1 }]);
    expect(checker.lint('hier FÜR dich; dafür', { locale: 'de-DE' }).issues).toEqual([{ rule: 'phrase', severity: 'warn', message: 'Banned pattern: für', line: 1, suggestion: '(Alternative)' }]);
    expect(checker.lint('leverage awesome', { locale: 'EN-GB' }).issues).toEqual([
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: leverage', line: 1, suggestion: '(Use plain verbs)' },
      { rule: 'phrase', severity: 'warn', message: 'Banned pattern: awesome', line: 1, suggestion: 'Be precise' },
    ]);
    expect(checker.lint('leverage', { locale: 'fr' })).toEqual({ issues: [], errors: 0, warnings: 0 });
    expect(linter({ 'anti-slop.md': '' }).lint('clean')).toEqual({ issues: [], errors: 0, warnings: 0 });
  });
  test('dashes match literal characters and curly quotes normalize', () => {
    const checker = linter(fixture);
    expect(checker.lint('a - b').issues).toEqual([]);
    expect(checker.lint('a—b – c').issues.map(({ message, severity }) => [message, severity])).toEqual([
      ['Banned pattern: —', 'error'], ['Banned pattern:  – ', 'error'],
    ]);
    expect(checker.lint('It’s “fine”', { avoid: ["it's", '"fine"'] }).issues).toEqual([
      { rule: 'phrase', severity: 'error', message: "Banned pattern: it's", line: 1 },
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: "fine"', line: 1 },
    ]);
  });
});

const clean = () => linter({ 'anti-slop.md': '' });
describe('single text rules', () => {
  test.each([
    ['title', 29, 'warn'], ['title', 30, null], ['title', 60, null], ['title', 61, 'error'],
    ['meta', 119, 'warn'], ['meta', 120, null], ['meta', 155, null], ['meta', 156, 'warn'],
    ['meta', 160, 'warn'], ['meta', 161, 'error'],
  ] as const)('%s at %i characters has severity %s', (kind, count, severity) => {
    const result = clean().lint(`  ${'a'.repeat(count)}  `, { kind });
    expect(result.issues.map((i) => [i.rule, i.severity])).toEqual(severity ? [['length', severity]] : []);
    if (severity) expect(result.issues[0].message).toContain(String(count));
  });
  test('body ignores budgets; min/max replace error bounds; characters are Unicode code points', () => {
    expect(clean().lint('short', { min: 30, max: 2 }).issues).toEqual([]);
    expect(clean().lint('a'.repeat(29), { kind: 'title', min: 30 }).issues.map(i => [i.rule, i.severity])).toEqual([['length', 'error']]);
    expect(clean().lint('a'.repeat(61), { kind: 'title', max: 70 }).issues).toEqual([]);
    expect(clean().lint('a'.repeat(31), { kind: 'title', max: 30 }).issues.map(i => [i.rule, i.severity])).toEqual([['length', 'error']]);
    expect(clean().lint('a'.repeat(120), { kind: 'meta', min: 121 }).issues).toEqual([{ rule: 'length', severity: 'error', message: 'meta has 120 characters' }]);
    expect(clean().lint('a'.repeat(161), { kind: 'meta', max: 170 }).issues).toEqual([]);
    expect(clean().lint('😀'.repeat(31), { kind: 'title' }).issues).toEqual([]);
  });
  test('repeated sentences report normalized content and count', () => {
    expect(clean().lint('Classic izakaya staples. '.repeat(5)).issues).toEqual([
      { rule: 'repeat', severity: 'error', message: 'Sentence "classic izakaya staples" occurs 5 times' },
    ]);
    expect(clean().lint('Classic  IZAKAYA staples!\nclassic izakaya staples?').issues).toEqual([
      { rule: 'repeat', severity: 'error', message: 'Sentence "classic izakaya staples" occurs 2 times' },
    ]);
    expect(clean().lint('Two words. Two words.\nThree unique words.').issues).toEqual([]);
    expect(clean().lint('Three label words\nThree label words').issues[0]).toEqual({ rule: 'repeat', severity: 'error', message: 'Sentence "three label words" occurs 2 times' });
  });
  test('labels compare without trailing punctuation', () => {
    expect(clean().lint('Three label words:\nTHREE label words;\nThree label words').issues).toEqual([
      { rule: 'repeat', severity: 'error', message: 'Sentence "three label words" occurs 3 times' },
    ]);
  });
  test('numbers require facts, normalize decimal comma and skip letter-prefixed tokens', () => {
    const text = '23 items, 15,5 cm, 2.75 kg, v2 KID2 v3.5 4x';
    expect(clean().lint(text).issues).toEqual([]);
    expect(clean().lint(text, { facts: '15.5 cm; 2,75 kg; KID23' }).issues).toEqual([
      { rule: 'number', severity: 'error', message: 'Number 23 is not in the fact sheet' },
      { rule: 'number', severity: 'error', message: 'Number 4 is not in the fact sheet' },
    ]);
    expect(clean().lint('23', { facts: '' })).toEqual({ issues: [{ rule: 'number', severity: 'error', message: 'Number 23 is not in the fact sheet' }], errors: 1, warnings: 0 });
  });
});

describe('batch rules', () => {
  test('common skeleton reports distinct item indices and skips number-containing sequences', () => {
    const result = clean().lintBatch(['one two three four 10', 'one two three four 20', 'one two three four 30', 'different words here today', 'nothing alike at all']);
    expect(result.issues).toEqual([
      { rule: 'skeleton', severity: 'error', message: 'Sequence "one two three four" occurs in items 0, 1, 2' },
      { rule: 'opener', severity: 'error', message: 'Opener "one two three" occurs in items 0, 1, 2' },
    ]);
    expect(clean().lintBatch(['A 10 B C', 'A 20 B C', 'A 30 B C', 'D E F G', 'H I J K']).issues).toEqual([{ rule: 'opener', severity: 'error', message: 'Opener \"a # b\" occurs in items 0, 1, 2' }]);
  });
  test('masked opener matches numbers, Unicode and curly apostrophes', () => {
    expect(clean().lintBatch(['Één 10 d’items red', "één 20 d'items blue", "ÉÉN 30 d'items green", 'New ending here', 'Another different entry']).issues).toEqual([
      { rule: 'opener', severity: 'error', message: 'Opener "één # d\'items" occurs in items 0, 1, 2' },
    ]);
  });
  test('threshold counts items, not occurrences, and needs half the batch rounded up', () => {
    expect(clean().lintBatch(['one two three four one two three four', 'one two three four', 'other', 'another', 'last']).issues).toEqual([]);
    expect(clean().lintBatch(['a b c d', 'a b c d', 'a b c d', 'e', 'f', 'g', 'h']).issues).toEqual([]);
    expect(clean().lintBatch(['a b c d', 'a b c d', 'e f g h', 'i j k l']).issues).toEqual([]);
    expect(clean().lintBatch(['red one two three', 'blue one two three', 'green one two three']).issues).toEqual([]);
  });
  test('each item receives all single-text rules and severities', () => {
    const result = clean().lintBatch(['Classic izakaya staples. Classic izakaya staples.', 'Offer 23'], { avoid: ['Offer'], kind: 'title', min: 10, facts: '' });
    expect(result).toEqual({ errors: 4, warnings: 0, issues: [
      { rule: 'repeat', severity: 'error', message: 'Sentence "classic izakaya staples" occurs 2 times', item: 0 },
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: Offer', line: 1, item: 1 },
      { rule: 'length', severity: 'error', message: 'title has 8 characters', item: 1 },
      { rule: 'number', severity: 'error', message: 'Number 23 is not in the fact sheet', item: 1 },
    ] });
  });
});

describe('review regressions', () => {
  test('numbers compare numeric values and all missing values are reported', () => {
    expect(clean().lint('15 34,50', { facts: '15.0 34.5' }).issues).toEqual([]);
    expect(clean().lint('23 24', { facts: '15' }).issues).toEqual([
      { rule: 'number', severity: 'error', message: 'Number 23 is not in the fact sheet' },
      { rule: 'number', severity: 'error', message: 'Number 24 is not in the fact sheet' },
    ]);
  });
  test('a CSV row splits on commas; a lone decimal comma stays one number', () => {
    expect(clean().lint('45 720 16 34.5', { facts: 'DS45,Dassai 45,720,16,34.50' }).issues).toEqual([]);
    expect(clean().lint('720 16 34.5', { facts: 'DS45,720,16,34.50' }).issues).toEqual([]);
    expect(clean().lint('€ 34,50 or 34.5', { facts: 'Prijs: € 34,50' }).issues).toEqual([]);
    // A decimal-comma fact does not license its halves: a rounded or invented number is still an error.
    expect(clean().lint('34 euro, 50 ml, 15%', { facts: 'Prijs: € 34,50. Alcohol: 15,5%' }).issues.map(i => i.message)).toEqual([
      'Number 34 is not in the fact sheet',
      'Number 50 is not in the fact sheet',
      'Number 15 is not in the fact sheet',
    ]);
  });
  test('a dash price is not a CSV row, and a quoted decimal in a CSV row keeps its reading', () => {
    expect(clean().lint('€ 39,95 en 15,5%', { facts: 'Prijs: € 34,- (was € 39,95). Alcohol 15,5%' }).issues).toEqual([]);
    expect(clean().lint('39 euro, 95 ml', { facts: 'Prijs: € 34,- (was € 39,95)' }).errors).toBe(2);
    expect(clean().lint('€ 34,50 for 720 ml', { facts: 'DS45,Dassai 45,720,"34,50"' }).issues).toEqual([]);
  });
  test('batch masking keeps numbers that belong to a code', () => {
    const items = ['DS45 Dassai is dry and clean.', 'DS46 Dassai is round and soft.', 'DS47 Dassai is light and floral.'];
    expect(clean().lintBatch(items).issues.filter(i => i.rule === 'opener')).toEqual([]);
  });
  test('large prices with thousands and decimal separators', () => {
    expect(clean().lint('€ 1.234,56', { facts: '1234.56' }).issues).toEqual([]);
    expect(clean().lint('€1,234.56', { facts: '1234,56' }).issues).toEqual([]);
    expect(clean().lint('1.234.567', { facts: '1234567' }).issues).toEqual([]);
  });
  test('long whitespace runs and long batch items stay linear', () => {
    const start = performance.now();
    linter(fixture).lint("In today's" + ' '.repeat(200_000) + 'x');
    clean().lintBatch(['12 '.repeat(300_000), 'a b c d', 'a b c d']);
    expect(performance.now() - start).toBeLessThan(2000);
  });
  test('literal avoid phrases match across NBSP, line breaks and double spaces', () => {
    for (const text of ['world\u00a0class', 'world\nclass', 'world  class']) {
      expect(clean().lint(text, { avoid: ['world class'] }).errors).toBe(1);
    }
  });
  test.each(['1.200', '1,200'])('thousands ambiguity is accepted on either side: %s', value => {
    expect(clean().lint(value, { facts: '1200' }).issues).toEqual([]);
    expect(clean().lint('1200', { facts: value }).issues).toEqual([]);
    expect(clean().lint(value, { facts: '1.2' }).issues).toEqual([]);
  });
  test('units count while letter and underscore prefixes skip the whole number', () => {
    expect(clean().lint('v2 KID2 v3.5 _42 é20 𐐀21 720ml 900ml 4x', { facts: '720' }).issues).toEqual([
      { rule: 'number', severity: 'error', message: 'Number 900 is not in the fact sheet' },
      { rule: 'number', severity: 'error', message: 'Number 4 is not in the fact sheet' },
    ]);
  });
  test('200 KB of numbers with facts finishes within two seconds', async () => {
    const script = `import { createLinter } from ${JSON.stringify(new URL('../lint.ts', import.meta.url).pathname)};
      const checker = createLinter({ resolveReference: () => '' });
      console.log(JSON.stringify(checker.lint('12 '.repeat(66666), { facts: '12' })));`;
    const proc = Bun.spawn([process.execPath, '-e', script], { stdout: 'pipe', stderr: 'pipe' });
    const timer = setTimeout(() => proc.kill(), 2000);
    try {
      const [output, code] = await Promise.all([new Response(proc.stdout).text(), proc.exited]);
      expect(code).toBe(0);
      expect(JSON.parse(output)).toEqual({ issues: [], errors: 0, warnings: 0 });
    } finally { clearTimeout(timer); proc.kill(); }
  });
  test.each(['nl_NL', '../locales/nl', 'abcd', ''])('rejects invalid locale %s', locale => {
    expect(() => clean().lint('copy', { locale })).toThrow(`Invalid locale: ${locale}`);
    expect(() => clean().lintBatch([], { locale })).toThrow(`Invalid locale: ${locale}`);
  });
  test.each(['[X]', 'from...to', 'delv*', '...'])('avoid is literal: %s', phrase => {
    expect(clean().lint(phrase, { avoid: [phrase] }).issues).toEqual([
      { rule: 'phrase', severity: 'error', message: `Banned pattern: ${phrase}`, line: 1 },
    ]);
    expect(clean().lint('X from something to delve', { avoid: [phrase] }).issues).toEqual([]);
  });
  test('avoid placeholder chains stay literal', () => {
    const start = performance.now();
    expect(clean().lint('a'.repeat(300), { avoid: ['[a][a][a][a][a]x'] }).issues).toEqual([]);
    expect(performance.now() - start).toBeLessThan(500);
  });
  test('pattern spaces match whitespace runs and both sides normalize NFC', () => {
    const checker = linter({ 'anti-slop.md': '# {lint: error}\n- café  noir\n- élan' });
    expect(checker.lint('café\u00a0\nnoir; élan').issues).toEqual([
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: café  noir', line: 1 },
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: élan', line: 2 },
    ]);
  });
  test('markdown word suffix stars accept letters and keep the word start boundary', () => {
    const checker = linter({ 'anti-slop.md': '# {lint: error}\n- delv*\n- try  simpl* now' });
    for (const word of ['delve', 'delves', 'delved', 'delving', 'delv']) {
      expect(checker.lint(word).issues.map(i => i.message)).toEqual(['Banned pattern: delv*']);
    }
    expect(checker.lint('predelve _delve').issues).toEqual([]);
    expect(checker.lint('try simply now').issues.map(i => i.message)).toEqual(['Banned pattern: try  simpl* now']);
  });
  test('overlapping first matches prefer the longest regardless of pattern order', () => {
    for (const patterns of ['- perfect\n- elke gelegenheid\n- perfect voor elke gelegenheid', '- perfect voor elke gelegenheid\n- elke gelegenheid\n- perfect']) {
      const checker = linter({ 'anti-slop.md': `# {lint: error}\n${patterns}` });
      expect(checker.lint('Perfect voor elke gelegenheid').issues).toEqual([
        { rule: 'phrase', severity: 'error', message: 'Banned pattern: perfect voor elke gelegenheid', line: 1 },
      ]);
    }
  });
  test('partial overlaps keep the longer match and disjoint first matches remain', () => {
    const checker = linter({ 'anti-slop.md': '# {lint: error}\n- one two\n- two three four' });
    expect(checker.lint('one two three four').issues.map(i => i.message)).toEqual(['Banned pattern: two three four']);
    expect(checker.lint('one two. two three four').issues.map(i => i.message)).toEqual([
      'Banned pattern: one two', 'Banned pattern: two three four',
    ]);
    expect(checker.lint('one two\ntwo three four').issues.map(i => i.line)).toEqual([1, 2]);
    const chain = linter({ 'anti-slop.md': '# {lint: error}\n- one two\n- two three\n- three four five' });
    expect(chain.lint('one two three four five').issues.map(i => i.message)).toEqual([
      'Banned pattern: one two', 'Banned pattern: three four five',
    ]);
  });
  test.each([{ max: 25 }, { min: 5 }, { min: 5, max: 25 }])('explicit bounds disable default warnings: %j', bounds => {
    expect(clean().lint('Short title', { kind: 'title', ...bounds }).issues).toEqual([]);
  });
  test('ellipsis ends repeated sentences', () => {
    expect(clean().lint('Three clear words…Three clear words…').issues).toEqual([
      { rule: 'repeat', severity: 'error', message: 'Sentence "three clear words" occurs 2 times' },
    ]);
  });
  test.each(['z. B.', 'z.B.', 'd. h.', 'bzw.', 'bijv.', 'o.a.', 'd.w.z.', 'e.g.', 'i.e.', 'etc.'])('abbreviation %s does not create a repeated fragment', abbreviation => {
    expect(clean().lint(`Try ${abbreviation} three clear words. Choose ${abbreviation} three clear words.`).issues).toEqual([]);
    expect(clean().lint(`Try ${abbreviation} three clear words. Try ${abbreviation} three clear words.`).issues).toEqual([
      { rule: 'repeat', severity: 'error', message: `Sentence "try ${abbreviation.toLowerCase()} three clear words" occurs 2 times` },
    ]);
  });
  test.each(['---', '==='])('a list item above %s stays a pattern', underline => {
    const checker = linter({ 'anti-slop.md': `# {lint: error}\n- jargon\n${underline}\n- fluff` });
    expect(checker.lint('jargon fluff').issues.map(i => i.message)).toEqual(['Banned pattern: jargon', 'Banned pattern: fluff']);
  });
});
