import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { loadRun, parseTask, parseOutput, writeJSON } from '../parse';
import { splitSentences, outputUnits, writeUnits } from '../units';
import { readBundles, judgeBundles, calibrationBundles, factcheckBundles } from '../bundles';
import { normalizeQuote, validateReader, readScore, judgeScore, ownerSheet, ownerScore, calibrationScore, factcheckScore } from '../score';
import { checkOutput, runGuards, longestSharedRun } from '../guards';
import { interval } from '../stats';
import { report } from '../report';

const fixtures = join(import.meta.dir, 'fixtures');
let root: string;
let run: ReturnType<typeof loadRun>;
const json = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'eval-scripts-test-'));
  cpSync(fixtures, join(root, 'eval'), { recursive: true });
  run = loadRun('demo', root);
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('parsing and units', () => {
  test('parses task metadata, facts without source numbers, and known sections', () => {
    const task = run.tasks[0];
    expect(task.id).toBe('demo-nl');
    expect(task.deliverables).toEqual([{ name: 'title', min_chars: 2, max_chars: 40 }, { name: 'body', min_words: 8, max_words: 90 }]);
    expect(task.placeholders).toEqual(['{link}']);
    expect(task.facts).toBe('The overview has 7 items.');
    expect(task.brief).toBe('Explain the account overview and link to it.');
    expect(parseOutput('## body\nFirst.\n\n### Detail\nMore.\n## flags\nIgnore.', task)).toEqual({ body: 'First.\n\n### Detail\nMore.' });
    expect(() => parseTask('No frontmatter')).toThrow('front matter');
  });
  test.each(['e.g.', 'bijv.', 'o.a.', 'z.B.', 'ca.', 'incl.', 'nr.', 'St.'])('protects %s', abbr => {
    expect(splitSentences(`Use ${abbr} Examples here. Next one!`)).toEqual([`Use ${abbr} Examples here.`, 'Next one!']);
  });
  test('splits punctuation, Unicode capitals, quotes, blank lines, lists and headings', () => {
    expect(splitSentences('First.” Next!) “Third?” Één… 7 items.\n\nNew paragraph\n- List one.\n* List two\n1. List three\n### Details\nLast line')).toEqual([
      'First.”', 'Next!)', '“Third?”', 'Één…', '7 items.', 'New paragraph', '- List one.', '* List two', '1. List three', '### Details', 'Last line',
    ]);
  });
  test('preserves decimals, placeholders, lower-case continuations and soft line breaks', () => {
    expect(splitSentences('Use 7,5 or 7.5 and {Name. Value}. Next\nline stays. lowercase stays.')).toEqual([
      'Use 7,5 or 7.5 and {Name. Value}.', 'Next\nline stays. lowercase stays.',
    ]);
  });
  test('character budgets make a whole unit and writes all outputs', () => {
    expect(outputUnits(run.tasks[0], { title: 'One. Two.', body: 'First. Second.' }, 'A', 1).map(u => [u.unit, u.text])).toEqual([
      ['title', 'One. Two.'], ['body#1', 'First.'], ['body#2', 'Second.'],
    ]);
    const units = writeUnits(run);
    expect(units.length).toBe(48);
    expect(readFileSync(join(run.dir, 'units.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line))).toEqual(units);
  });
});

test('headings stay whole and reordered deliverables keep task-defined unit IDs', () => {
  expect(splitSentences('### Why? Read this.\nText follows. Next!')).toEqual(['### Why? Read this.', 'Text follows.', 'Next!']);
  const sections = parseOutput('## body\nFirst. Next!\n## title\nHello. Again.\n## decisions\nIgnore.', run.tasks[0]);
  expect(outputUnits(run.tasks[0], sections, 'B', 2)).toEqual([
    { arm: 'B', task: 'demo-nl', n: 2, unit: 'title', text: 'Hello. Again.' },
    { arm: 'B', task: 'demo-nl', n: 2, unit: 'body#1', text: 'First.' },
    { arm: 'B', task: 'demo-nl', n: 2, unit: 'body#2', text: 'Next!' },
  ]);
});

describe('blind bundles', () => {
  test('read bundles show every unit once, approved samples and no provenance', () => {
    for (const arm of ['A', 'B']) for (const n of [1, 2]) writeFileSync(join(run.dir, `out/${arm}/demo-nl/${n}.md`), `## title\nOverzicht ${arm}${n}\n## body\nBekijk ${arm}${n}. Open de lijst. Kies een regel. Lees de uitleg. Ga naar {link}.`);
    readBundles(run, 11);
    const bundle = readFileSync(join(run.dir, 'read/demo-nl.md'), 'utf8');
    const map = json(join(run.dir, 'keys/demo-nl.read.map.json'));
    expect(bundle).toContain('nl-NL');
    expect(bundle).toContain('People checking their account');
    expect(bundle).toContain('Je krijgt een helder overzicht');
    expect(bundle).not.toMatch(/arm [AB]|out\/|demo\/|counts per arm/i);
    expect(Object.values(map).sort((a: any, b: any) => `${a.arm}${a.n}`.localeCompare(`${b.arm}${b.n}`))).toEqual([
      { arm: 'A', n: 1 }, { arm: 'A', n: 2 }, { arm: 'B', n: 1 }, { arm: 'B', n: 2 },
    ]);
    const lines = bundle.split('\n').filter(line => /^\[X\d+ /.test(line));
    expect(lines.length).toBe(24);
    expect(new Set(lines.map(line => line.split(']')[0])).size).toBe(24);
    for (const label of Object.keys(map)) {
      const { arm, n } = map[label];
      expect(lines.filter(l => l.startsWith(`[${label} `))).toEqual([
        `[${label} title] Overzicht ${arm}${n}`, `[${label} body#1] Bekijk ${arm}${n}.`,
        `[${label} body#2] Open de lijst.`, `[${label} body#3] Kies een regel.`,
        `[${label} body#4] Lees de uitleg.`, `[${label} body#5] Ga naar {link}.`,
      ]);
    }
    readBundles(run, 11);
    expect(readFileSync(join(run.dir, 'read/demo-nl.md'), 'utf8')).toBe(bundle);
    readBundles(run, 12);
    expect(json(join(run.dir, 'keys/demo-nl.read.map.json'))).not.toEqual(map);
  });
  test('sample approval and arm enablement are required unless pendingSamples is true', () => {
    writeFileSync(join(root, 'eval/samples/demo/judge.md'), 'Status: pending-owner-approval\n\nPENDING VOICE');
    readBundles(run, 1);
    expect(readFileSync(join(run.dir, 'read/demo-nl.md'), 'utf8')).not.toContain('PENDING VOICE');
    run.config.pendingSamples = true;
    readBundles(run, 1);
    expect(readFileSync(join(run.dir, 'read/demo-nl.md'), 'utf8')).toContain('PENDING VOICE');
    run.config.samples = { A: false, B: false };
    readBundles(run, 1);
    expect(readFileSync(join(run.dir, 'read/demo-nl.md'), 'utf8')).not.toContain('PENDING VOICE');
  });
  test('judge bundles pair equal indices and swap every side', () => {
    for (const arm of ['A', 'B']) for (const n of [1, 2]) writeFileSync(join(run.dir, `out/${arm}/demo-nl/${n}.md`), `## title\nOverview ${arm}${n}\n## body\nUnique copy ${arm}${n}.`);
    judgeBundles(run, 1);
    const one = json(join(run.dir, 'keys/demo-nl.order1.map.json'));
    const two = json(join(run.dir, 'keys/demo-nl.order2.map.json'));
    expect(Object.keys(one)).toEqual(['P1', 'P2']);
    expect(one.P1['1']).not.toBe(one.P2['1']);
    for (const pair of ['P1', 'P2']) {
      expect(one[pair]['1']).toBe(two[pair]['2']);
      expect(one[pair]['2']).toBe(two[pair]['1']);
    }
    const bundle = readFileSync(join(run.dir, 'judge/demo-nl.order1.md'), 'utf8');
    expect(bundle.split('#### body\n\n').slice(1).map(part => part.split('\n\n')[0].trim())).toEqual(['Unique copy B1.', 'Unique copy A1.', 'Unique copy A2.', 'Unique copy B2.']);
    expect(readFileSync(join(run.dir, 'judge/demo-nl.order2.md'), 'utf8').split('#### body\n\n').slice(1).map(part => part.split('\n\n')[0].trim())).toEqual(['Unique copy A1.', 'Unique copy B1.', 'Unique copy B2.', 'Unique copy A2.']);
    expect(one).toEqual({ P1: { '1': 'B', '2': 'A' }, P2: { '1': 'A', '2': 'B' } });
    expect(bundle).toContain('Explain the account overview');
    expect(bundle.match(/### Copy [12]/g)).toEqual(['### Copy 1', '### Copy 2', '### Copy 1', '### Copy 2']);
    expect(bundle).not.toMatch(/arm [AB]|out\//i);
  });
});

describe('reader and judge scoring', () => {
  test('quote normalization and first-30-character prefix validation', () => {
    expect(normalizeQuote(' “Hello”—  WORLD\n ‘yes’ ')).toBe('"hello"- world \'yes\'');
    const units = [{ arm: 'A', task: 'demo-nl', n: 1, unit: 'body#1', text: '“Hello”— world with enough words for a longer prefix.' }];
    const map = { 'demo-nl': { X1: { arm: 'A', n: 1 } } };
    const flag = { task: 'demo-nl', label: 'X1', unit: 'body#1', quote: '"HELLO"- world', reason: 'Voice', fix: 'Change' };
    expect(validateReader([JSON.stringify(flag)], map, units, 'reader A').flags).toEqual([JSON.stringify(['demo-nl', 'A', 1, 'body#1'])]);
    for (const change of [{ task: 'missing' }, { label: 'X2' }, { unit: 'body#9' }, { quote: 'world' }, { quote: '' }]) {
      expect(() => validateReader([JSON.stringify({ ...flag, ...change })], map, units, 'reader A')).toThrow('reader A');
    }
    const long = { ...flag, quote: units[0].text.slice(0, 40) + 'different ending' };
    expect(validateReader([JSON.stringify(long)], map, units, 'reader A').flags).toEqual([JSON.stringify(['demo-nl', 'A', 1, 'body#1'])]);
  });
  test('exactly 5% invalid is tolerated, above 5% names the reader and failures', () => {
    readBundles(run, 1);
    const units = writeUnits(run);
    const maps = { 'demo-nl': json(join(run.dir, 'keys/demo-nl.read.map.json')) };
    const valid = readFileSync(join(fixtures, 'readerA.jsonl'), 'utf8').trim().split('\n')[0];
    expect(validateReader([...Array(19).fill(valid), '{broken'], maps, units, 'reader B').failures).toEqual([expect.stringContaining('line 20')]);
    expect(() => validateReader([...Array(18).fill(valid), '{broken'], maps, units, 'reader B')).toThrow(/reader B.*line 19/s);
  });
  test('quote prefixes count Unicode characters and normalize all Unicode dashes', () => {
    const units = [{ arm: 'A', task: 'demo-nl', n: 1, unit: 'title', text: '😀'.repeat(15) + 'Hello world beyond the emojis.' }];
    const maps = { 'demo-nl': { X1: { arm: 'A', n: 1 } } };
    const flag = { task: 'demo-nl', label: 'X1', unit: 'title', quote: '😀'.repeat(15) + 'Wrong text after the emojis.', reason: 'Voice', fix: 'Rewrite' };
    expect(() => validateReader([JSON.stringify(flag)], maps, units, 'reader A')).toThrow('Quote does not match');
    expect(normalizeQuote('Hello―world')).toBe('hello-world');
  });
  test('counts agreed flags once and averages output shares rather than pooling units', () => {
    readBundles(run, 1);
    const result = readScore(run, join(fixtures, 'readerA.jsonl'), join(fixtures, 'readerB.jsonl'));
    const task = result.tasks.find(t => t.task === 'demo-nl')!;
    expect(task.arms.A).toMatchObject({ units: 12, flagsA: 4, flagsB: 5, agreed: 4, shareAgreed: 1 / 3 });
    expect(task.arms.B).toMatchObject({ units: 12, flagsA: 4, flagsB: 4, agreed: 4, shareAgreed: 1 / 3 });
    expect(task.difference).toBe(0);
    expect(json(join(run.dir, 'read-score.json')).tasks).toEqual(result.tasks);
    // One arm: an output with 1/1 defects and another with 0/6 gives 0.5, not 1/7.
    const map = json(join(run.dir, 'keys/demo-nl.read.map.json'));
    const label = Object.keys(map).find(k => map[k].arm === 'A' && map[k].n === 1)!;
    const path = join(run.dir, 'out/A/demo-nl/1.md');
    writeFileSync(path, '## title\nJe overzicht\n## body\n');
    writeUnits(run);
    const flags = join(root, 'one.jsonl');
    writeFileSync(flags, JSON.stringify({ task: 'demo-nl', label, unit: 'title', quote: 'Je overzicht', reason: 'Voice', fix: 'Change' }));
    const rescored = readScore(run, flags, flags).tasks[0];
    expect(rescored.arms.A).toEqual({ units: 7, flagsA: 1, flagsB: 1, agreed: 1, shareAgreed: 0.5, outputs: [
      { n: 1, units: 1, flagsA: 1, flagsB: 1, agreed: 1, shareAgreed: 1 },
      { n: 2, units: 6, flagsA: 0, flagsB: 0, agreed: 0, shareAgreed: 0 },
    ] });
    expect(rescored.difference).toBe(0.5);
  });
  test('order flips average to B preference 0.5 and missing judgements fail', () => {
    judgeBundles(run, 1);
    const result = judgeScore(run, [join(fixtures, 'judgeX.order1.jsonl'), join(fixtures, 'judgeX.order2.jsonl')]);
    expect(result.tasks[0].pairs).toEqual([
      { judge: 1, pair: 'P1', orders: [1, 0], preference: 0.5 },
      { judge: 1, pair: 'P2', orders: [0, 1], preference: 0.5 },
    ]);
    expect(result.tasks.map(t => [t.task, t.preference, t.score])).toEqual([['demo-nl', 0.5, 0], ['demo-en', 0.5, 0]]);
    writeFileSync(join(root, 'missing.jsonl'), '');
    expect(() => judgeScore(run, [join(root, 'missing.jsonl'), join(fixtures, 'judgeX.order2.jsonl')])).toThrow(/missing/i);
  });
});

test('maps preferences to arms, pools judges equally and handles ties', () => {
  judgeBundles(run, 5);
  const files: string[] = [];
  for (const judge of [1, 2]) for (const order of [1, 2]) {
    const rows = run.tasks.flatMap(t => {
      const map = json(join(run.dir, `keys/${t.id}.order${order}.map.json`));
      return ['P1', 'P2'].map(pair => ({ task: t.id, pair, prefer: judge === 2 ? 'tie' : map[pair]['1'] === 'B' ? 1 : 2, reason: 'Voice fits' }));
    });
    const path = join(root, `judge${judge}.order${order}.jsonl`);
    writeFileSync(path, rows.map(r => JSON.stringify(r)).join('\n'));
    files.push(path);
  }
  expect(judgeScore(run, files).tasks.map(t => [t.preference, t.score])).toEqual([[0.75, 0.25], [0.75, 0.25]]);
  expect(() => judgeScore(run, files.slice(0, 3))).toThrow('order1 and order2');
  const duplicate = readFileSync(files[0], 'utf8');
  writeFileSync(files[0], duplicate + '\n' + duplicate.split('\n')[0]);
  expect(() => judgeScore(run, files)).toThrow('duplicate');
});

describe('guards and statistics', () => {
  test('every hard guard detects crafted bad content and accepts valid content', () => {
    const task = run.tasks[0];
    expect(checkOutput(task, { title: '😀😀', body: 'Bekijk de 7 items in je overzicht via {link}.' }, '').hard).toEqual([]);
    expect(checkOutput(task, { title: `  ${'😀'.repeat(40)}  `, body: 'Bekijk de 7 items in je overzicht via {link}.' }, '').hard).toEqual([]);
    const bad = checkOutput(task, { title: 'x', body: '99 {changed}' }, '99 changed');
    expect(bad.budget).toEqual(['title: min_chars 2, got 1', 'body: min_words 8, got 2']);
    expect(bad.hard.join('\n')).not.toMatch(/min_|max_/);
    expect(bad.hard.join('\n')).toContain('Missing placeholder {link}');
    expect(bad.hard.join('\n')).toContain('Unknown placeholder {changed}');
    expect(bad.hard.join('\n')).toContain('Number 99');
    expect(checkOutput(task, {}, '').hard.join('\n')).toMatch(/title.*missing|missing.*title/i);
    const empty = checkOutput(task, { title: '  ', body: ' ' }, '');
    expect(empty.hard.join('\n')).toMatch(/empty/i);
    expect(empty.budget).toEqual([]); // an empty section is structural, not also a missed minimum
    expect(checkOutput(task, { title: '😀'.repeat(41), body: 'word '.repeat(91) + '{link}' }, '').budget.join('\n')).toMatch(/title: max_chars/);
    expect(checkOutput(task, { title: 'Okay', body: 'word '.repeat(91) + '{link}' }, '').budget.join('\n')).toMatch(/body: max_words/);
    expect(checkOutput(task, { title: 'Okay', body: 'Archive 99 items in your overview via {link}.' }, '').hard.join('\n')).toContain('Number 99');
  });
  test('number errors stay out of noisy errors and copy check finds contiguous words', () => {
    const task = run.tasks[1];
    const result = checkOutput(task, { title: 'Clear title', body: '99 items. The same sentence here. The same sentence here. {link}' }, '99 items the same sentence here the same sentence here');
    expect(result.lint.some(i => i.rule === 'number')).toBe(false);
    expect(result.lint.some(i => i.rule === 'repeat' && i.severity === 'error')).toBe(true);
    expect(result.longestSharedRun).toBe(10);
    expect(result.copyFlag).toBe(true);
    expect(longestSharedRun('One, TWO three four five six!', 'Start one two three four five six end')).toBe(6);
    expect(longestSharedRun('one two X three four', 'one two three four')).toBe(2);
    expect(runGuards(run).outputs.map(o => o.hard)).toEqual(Array(8).fill([]));
  });
  test('one-sided t bounds match hand calculation and handle insufficient tasks', () => {
    const s = interval([1, 2, 3, 4, 5]);
    expect(s.mean).toBe(3);
    expect(s.sd).toBeCloseTo(Math.sqrt(2.5), 12);
    expect(s.lower).toBeCloseTo(3 - 2.131846786 * Math.sqrt(2.5) / Math.sqrt(5), 8);
    expect(s.upper).toBeCloseTo(3 + 2.131846786 * Math.sqrt(2.5) / Math.sqrt(5), 8);
    expect(interval([1]).lower).toBeNull();
    expect(interval([]).mean).toBeNull();
    expect(interval(Array.from({ length: 42 }, (_, i) => i)).lower).toBeCloseTo(20.5 - 1.683851013 * Math.sqrt(150.5) / Math.sqrt(42), 8);
  });
});

describe('owner, calibration, report and CLI', () => {
  test('owner sheet has 8 agreed and 7 neither, only NL, shuffled without reasons', () => {
    readBundles(run, 1);
    readScore(run, join(fixtures, 'readerA.jsonl'), join(fixtures, 'readerB.jsonl'));
    ownerSheet(run, 3);
    const sheet = readFileSync(join(run.dir, 'owner-check.md'), 'utf8');
    const key = json(join(run.dir, 'keys/owner-check.key.json'));
    expect(key.items.filter((i: any) => i.expected === 'off').length).toBe(8);
    expect(key.items.filter((i: any) => i.expected === 'natural').length).toBe(7);
    expect(key.items.every((i: any) => i.task === 'demo-nl')).toBe(true);
    expect(sheet.match(/^answer: natural \/ off$/gm)?.length).toBe(15);
    expect(sheet).toContain('email; People checking their account');
    expect(sheet).not.toMatch(/SECRET|READER|reason|demo-nl|agreed/i);
    let index = 0;
    const filled = sheet.replace(/answer: natural \/ off/g, () => `answer: ${key.items[index++].expected}`);
    const path = join(root, 'filled.md');
    writeFileSync(path, filled);
    expect(ownerScore(run, path)).toEqual({ matches: 15, total: 15, confirmed: 8, agreed: 8, pass: true });
    expect(() => ownerScore(run, join(run.dir, 'owner-check.md'))).toThrow(/answer/i);
    writeFileSync(path, filled.replace(/^answer: off$/gm, 'answer: natural'));
    expect(ownerScore(run, path)).toEqual({ matches: 7, total: 15, confirmed: 0, agreed: 8, pass: false });
    ownerSheet(run, 3);
    expect(readFileSync(join(run.dir, 'owner-check.md'), 'utf8')).toBe(sheet);
  });
  test('calibration groups nl-owner with nl and reports clean false alarms and seeded recall', () => {
    mkdirSync(join(root, 'eval/calibration'), { recursive: true });
    const rows = [{ id: 'nl1', group: 'nl', text: 'Een heldere zin.' }, { id: 'owner', group: 'nl-owner', text: 'Goede eigen tekst.' }, { id: 'en1', group: 'en', text: 'Clear writing.' }, { id: 'dev1', group: 'en-dev', text: 'Check your API key.' }];
    for (const kind of ['clean', 'seeded']) writeFileSync(join(root, `eval/calibration/${kind}.jsonl`), rows.map(row => JSON.stringify({ ...row, ...(kind === 'seeded' ? { id: `${row.id}-s`, clean_id: row.id, text: `Bad ${row.text}` } : {}) })).join('\n'));
    calibrationBundles(root, 2);
    const flags: any[] = [];
    const locations = new Map<string, string>();
    for (const group of ['nl', 'en', 'en-dev']) for (const half of [1, 2]) {
      const bundleId = `${group}-${half}`;
      const map = json(join(root, `eval/calibration/keys/${bundleId}.map.json`));
      const bundle = readFileSync(join(root, `eval/calibration/read/${bundleId}.md`), 'utf8');
      expect(bundle).toBe(Object.entries(map).map(([label, item]: any) => `[${label} p] ${item.text}`).join('\n\n') + '\n');
      for (const item of Object.values(map) as any[]) locations.set(`${item.kind}:${item.id}`, bundleId);
      expect(bundle).not.toMatch(/clean|seeded|nl-owner/);
      for (const [label, item] of Object.entries(map) as [string, any][]) if (item.kind === 'seeded') flags.push({ task: bundleId, label, unit: 'p', quote: item.text, reason: 'Defect', fix: 'Clean' });
    }
    expect(locations.size).toBe(8);
    for (const row of rows) expect(locations.get(`clean:${row.id}`)).not.toBe(locations.get(`seeded:${row.id}-s`));
    const path = join(root, 'calib.jsonl');
    writeFileSync(path, flags.map(row => JSON.stringify(row)).join('\n'));
    const result = calibrationScore(root, path, path);
    expect(result.groups.map(g => [g.group, g.agreed.falseAlarm, g.agreed.recall, g.pass])).toEqual([['nl', 0, 1, true], ['en', 0, 1, true], ['en-dev', 0, 1, true]]);
    expect(result.owner.agreed).toBe(0.5);
    const initial = readFileSync(join(root, 'eval/calibration/read/nl-1.md'), 'utf8');
    calibrationBundles(root, 2);
    expect(readFileSync(join(root, 'eval/calibration/read/nl-1.md'), 'utf8')).toBe(initial);
    writeFileSync(path, '');
    expect(calibrationScore(root, path, path).groups.map(g => [g.agreed.falseAlarm, g.agreed.recall, g.pass])).toEqual([[0, 0, false], [0, 0, false], [0, 0, false]]);
  });
  function factEvidence() {
    factcheckBundles(run);
    const rows = run.tasks.flatMap(t => Object.keys(json(join(run.dir, `keys/${t.id}.factcheck.map.json`))).map(label => ({ task: t.id, label, unsupported: [] })));
    const path = join(root, 'factcheck.jsonl');
    writeFileSync(path, rows.map(row => JSON.stringify(row)).join('\n'));
    return factcheckScore(run, path);
  }
  test('report writes estimates, guard and budget details, and cannot keep fewer than 10 tasks', () => {
    readBundles(run, 1); judgeBundles(run, 1);
    readScore(run, join(fixtures, 'readerA.jsonl'), join(fixtures, 'readerB.jsonl'));
    judgeScore(run, [join(fixtures, 'judgeX.order1.jsonl'), join(fixtures, 'judgeX.order2.jsonl')]);
    runGuards(run);
    factEvidence();
    const text = report(run);
    expect(text).toContain('Outcome: **inconclusive**; directional only: 2 usable dev tasks');
    expect(text).toContain('mean 0.0000, sd 0.0000, n tasks 2, one-sided 95% lower 0.0000, upper 0.0000');
    expect(text).toContain('| demo-nl | 0.0000 | 0.0000 |');
    expect(text).toContain('| demo-en | 0.0000 | 0.0000 |');
    expect(text).toContain('| demo-nl | A | 1 | 0 |');
    expect(text).toContain('| demo-nl | dev | body | 90 words | 0.1667 | 0.1667 |'); // 15 tokens / 90
    expect(readFileSync(join(run.dir, 'results.md'), 'utf8')).toBe(text);
  });
  function evidence(preference = 0.2, defects = 0.1, lintDifference = 0) {
    const original = run.tasks[0];
    run.tasks = Array.from({ length: 10 }, (_, i) => ({ ...original, id: `dev-${i}` }));
    run.config.tasks = run.tasks.map(t => t.id);
    for (const t of run.tasks) for (const arm of ['A', 'B']) {
      cpSync(join(run.dir, 'out', arm, 'demo-nl'), join(run.dir, 'out', arm, t.id), { recursive: true });
    }
    writeJSON(join(run.dir, 'judge-score.json'), { tasks: run.tasks.map(t => ({ task: t.id, preference: preference + 0.5, score: preference, pairs: [] })) });
    writeJSON(join(run.dir, 'read-score.json'), { tasks: run.tasks.map(t => ({ task: t.id, difference: defects })) });
    const guards = runGuards(run);
    guards.outputs.forEach(o => { o.lintErrors = o.arm === 'B' ? Math.max(lintDifference, 0) : Math.max(-lintDifference, 0); });
    writeJSON(join(run.dir, 'guards.json'), guards);
    factEvidence();
    return guards;
  }
  function firstBatch(preference: number) {
    const dir = join(run.dir, '..', 'demo-batch1');
    mkdirSync(dir, { recursive: true });
    writeJSON(join(dir, 'judge-score.json'), { tasks: run.tasks.map(t => ({ task: t.id, preference: preference + 0.5, score: preference, pairs: [] })) });
    run.config.pool = 'demo-batch1';
  }
  test('one batch never keeps; a pooled second batch keeps; defects never decide', () => {
    evidence();
    expect(report(run)).toContain('Outcome: **second batch needed**');
    evidence(-0.2);
    expect(report(run)).toContain('Outcome: **revert**; preference is below zero');
    evidence(0.2, 0.1, 1);
    expect(report(run)).toContain('Outcome: **revert**; lint errors are worse');
    evidence();
    const fact = json(join(run.dir, 'factcheck-score.json'));
    fact.outputs.forEach((o: any) => { o.unsupported = o.arm === 'B' ? ['Unsupported promise'] : []; });
    writeJSON(join(run.dir, 'factcheck-score.json'), fact);
    expect(report(run)).toContain('Outcome: **revert**; unsupported claims are worse beyond their interval');
    expect(report(run)).toContain('| dev-0 | 0.0000 | 1.0000 | 1.0000 |');
    evidence(0, 0, 0);
    expect(report(run)).toContain('Outcome: **second batch needed**');
    // Second batch: pooled per-task preference (0.2 + 0.2) / 2 clears zero and batch 2 leans towards B.
    evidence(0.2, -0.1);
    firstBatch(0.2);
    const text = report(run);
    expect(text).toContain('Outcome: **keep**; pooled preference lower bound is above zero');
    expect(text).toContain('Pooled with demo-batch1: mean 0.2000');
    expect(text).toContain('## Defects (reported only)');
    // Pooled mean is positive (0.3) but the second batch alone does not lean towards B.
    evidence(0, 0);
    firstBatch(0.6);
    expect(report(run)).toContain('Outcome: **inconclusive**; pooled preference does not establish improvement');
    // Pooling is per task: batch 2 alone would keep, but pooled with a mixed batch 1 it does not.
    evidence(0.1, 0);
    firstBatch(0);
    const mixed = json(join(run.dir, '..', 'demo-batch1', 'judge-score.json'));
    mixed.tasks.forEach((t: any, i: number) => { t.score = i % 2 ? 0.1 : -0.5; });
    writeJSON(join(run.dir, '..', 'demo-batch1', 'judge-score.json'), mixed);
    const pooledText = report(run);
    expect(pooledText).toContain('Pooled with demo-batch1: mean -0.0500, sd 0.1581, n tasks 10');
    expect(pooledText).toContain('Outcome: **inconclusive**; pooled preference does not establish improvement');
    // Missing evidence on an otherwise eligible pooled keep blocks keep.
    evidence();
    firstBatch(0.2);
    rmSync(join(run.dir, 'factcheck-score.json'));
    expect(report(run)).toContain('Outcome: **inconclusive**; missing scoring or guard evidence');
    // Duplicated output indices in guards hide a missing output and block keep.
    const dup = evidence();
    firstBatch(0.2);
    dup.outputs.find(o => o.arm === 'B' && o.n === 2)!.n = 1;
    writeJSON(join(run.dir, 'guards.json'), dup);
    expect(report(run)).toContain('Outcome: **inconclusive**; missing scoring or guard evidence');
    // A pool that names this run itself is rejected.
    evidence();
    run.config.pool = 'demo';
    expect(() => report(run)).toThrow('pool must name another run folder');
    // A missing first-batch task blocks keep.
    evidence();
    firstBatch(0.2);
    const first = json(join(run.dir, '..', 'demo-batch1', 'judge-score.json'));
    first.tasks.pop();
    writeJSON(join(run.dir, '..', 'demo-batch1', 'judge-score.json'), first);
    expect(report(run)).toContain('Outcome: **inconclusive**; missing scoring or guard evidence');
  });
  test('fact-check means and intervals use task differences and allow noise crossing zero', () => {
    evidence();
    const fact = json(join(run.dir, 'factcheck-score.json'));
    fact.outputs.forEach((o: any) => {
      const difference = Number(o.task.slice(4)) < 5 ? 0 : 2;
      const count = (o.n === 1 ? 0 : 2) + (o.arm === 'B' ? difference : 0);
      o.unsupported = Array(count).fill('Unsupported delivery promise');
    });
    writeJSON(join(run.dir, 'factcheck-score.json'), fact);
    const text = report(run);
    expect(text).toContain('| dev-0 | 1.0000 | 1.0000 | 0.0000 |');
    expect(text).toContain('| dev-5 | 1.0000 | 3.0000 | 2.0000 |');
    expect(text).toContain('B minus A: mean 1.0000, sd 1.0541, n tasks 10, one-sided 95% lower 0.3890, upper 1.6110');
    expect(text).toContain('Outcome: **revert**; unsupported claims are worse');
    fact.outputs.forEach((o: any) => {
      const count = o.arm === 'A' ? 2 : Number(o.task.slice(4)) < 5 ? 0 : 4;
      o.unsupported = Array(count).fill('Unsupported delivery promise');
    });
    writeJSON(join(run.dir, 'factcheck-score.json'), fact);
    expect(report(run)).toContain('Outcome: **second batch needed**');
    expect(report(run)).toContain('B minus A: mean 0.0000, sd 2.1082, n tasks 10, one-sided 95% lower -1.2221, upper 1.2221');
  });
  test('dev candidate hard failures revert; holdout/report evidence cannot change outcome', () => {
    const guards = evidence();
    guards.outputs.find(o => o.arm === 'B')!.hard = ['Missing placeholder {link}'];
    writeJSON(join(run.dir, 'guards.json'), guards);
    expect(report(run)).toContain('Outcome: **revert**; candidate B has more structural failures than A (1 vs 0 outputs)');
    expect(report(run)).toContain('- dev-0 B1: Missing placeholder {link}');
    // Equal failure counts in both arms (the A/A base rate) do not revert.
    const both = evidence();
    both.outputs.find(o => o.arm === 'A')!.hard = ['title: missing deliverable'];
    both.outputs.find(o => o.arm === 'B')!.hard = ['Missing placeholder {link}'];
    writeJSON(join(run.dir, 'guards.json'), both);
    expect(report(run)).toContain('Outcome: **second batch needed**');
    // Limits: one missed limit in one task is inside the interval and does not revert...
    const one = evidence();
    one.outputs.find(o => o.arm === 'B')!.budget = ['body: max_words 90, got 95'];
    writeJSON(join(run.dir, 'guards.json'), one);
    const oneText = report(run);
    expect(oneText).toContain('Outcome: **second batch needed**');
    expect(oneText).toContain('B minus A: mean 0.0500, sd 0.1581, n tasks 10, one-sided 95% lower -0.0417, upper 0.1417');
    expect(oneText).toContain('| dev-0 | 0.0000 | 0.5000 | 0.5000 |');
    expect(oneText).toContain('- dev-0 B1: body: max_words 90, got 95');
    // ...but B missing limits in every task does, and A missing them does not.
    const all = evidence();
    all.outputs.filter(o => o.arm === 'B' && o.n === 1).forEach(o => { o.budget = ['body: max_words 90, got 95']; });
    writeJSON(join(run.dir, 'guards.json'), all);
    expect(report(run)).toContain('Outcome: **revert**; character or word limits are missed more often beyond their interval');
    all.outputs.forEach(o => { o.budget = o.arm === 'A' ? ['body: max_words 90, got 95'] : []; });
    writeJSON(join(run.dir, 'guards.json'), all);
    expect(report(run)).toContain('Outcome: **second batch needed**');
    // A guards file without limit data (older format) cannot support a decision.
    const old = evidence();
    old.outputs.forEach((o: any) => { delete o.budget; });
    writeJSON(join(run.dir, 'guards.json'), old);
    expect(report(run)).toContain('Outcome: **inconclusive**; missing scoring or guard evidence');
    evidence();
    run.tasks[0].set = 'holdout';
    run.tasks[1].set = 'report';
    const noisyGuards = json(join(run.dir, 'guards.json'));
    noisyGuards.outputs.filter((o: any) => ['dev-0', 'dev-1'].includes(o.task) && o.arm === 'B').forEach((o: any) => { o.hard = ['Missing placeholder {link}']; o.budget = ['Budget exceeded']; o.lintErrors = 999; });
    writeJSON(join(run.dir, 'guards.json'), noisyGuards);
    const fact = json(join(run.dir, 'factcheck-score.json'));
    fact.outputs.filter((o: any) => ['dev-0', 'dev-1'].includes(o.task) && o.arm === 'B').forEach((o: any) => { o.unsupported = ['Invented holdout claim']; });
    writeJSON(join(run.dir, 'factcheck-score.json'), fact);
    const text = report(run);
    expect(text).toContain('Outcome: **inconclusive**; directional only: 8 usable dev tasks');
    expect(text).toContain('n tasks 8');
    expect(text).toContain('| dev-0 | holdout | 0.2000 | 0.1000 | 999.0000 | 1.0000 | 1: Missing placeholder {link}; Budget exceeded; 2: Missing placeholder {link}; Budget exceeded |');
    expect(text).toContain('| dev-1 | report | 0.2000 | 0.1000 | 999.0000 | 1.0000 | 1: Missing placeholder {link}; Budget exceeded; 2: Missing placeholder {link}; Budget exceeded |');
  });
  test('report tolerates absent scores but cannot keep missing evidence', () => {
    expect(report(run)).toContain('Outcome: **inconclusive**; missing scoring or guard evidence');
    expect(report(run)).toContain('mean n/a, sd n/a, n tasks 0');
    evidence();
    rmSync(join(run.dir, 'factcheck-score.json'));
    expect(report(run)).toContain('Outcome: **inconclusive**; missing scoring or guard evidence');
    evidence();
    const fact = json(join(run.dir, 'factcheck-score.json'));
    fact.outputs.pop();
    writeJSON(join(run.dir, 'factcheck-score.json'), fact);
    expect(report(run)).toContain('Outcome: **inconclusive**; missing scoring or guard evidence');
    evidence();
    rmSync(join(run.dir, 'read-score.json'));
    // Defects are reported only, so a missing read score does not block a decision.
    expect(report(run)).toContain('Outcome: **second batch needed**');
  });
  test('real CLI accepts seed, writes units, rejects unknown command and invalid inputs', () => {
    const entry = resolve(import.meta.dir, '../eval.ts');
    const result = Bun.spawnSync([process.execPath, entry, 'units', 'demo', '--seed', '7'], { cwd: root });
    expect(result.exitCode).toBe(0);
    expect(readFileSync(join(run.dir, 'units.jsonl'), 'utf8')).toContain('"unit":"body#5","text":"Ga naar {link}."');
    const unknown = Bun.spawnSync([process.execPath, entry, 'unknown'], { cwd: root });
    expect(unknown.exitCode).toBe(1);
    expect(unknown.stderr.toString()).toContain('Unknown command');
    const invalid = Bun.spawnSync([process.execPath, entry, 'units', 'demo', '--seed', 'oops'], { cwd: root });
    expect(invalid.exitCode).toBe(1);
    expect(invalid.stderr.toString()).toContain('seed');
  });
  test('real CLI runs the fixture workflow and prints scored content', () => {
    const entry = resolve(import.meta.dir, '../eval.ts');
    const cli = (...args: string[]) => {
      const result = Bun.spawnSync([process.execPath, entry, ...args], { cwd: root });
      if (result.exitCode !== 0) throw new Error(`${args[0]}: ${result.stderr.toString()}`);
      return result.stdout.toString();
    };
    cli('read-bundles', 'demo');
    factEvidence();
    cli('factcheck-bundles', 'demo');
    expect(cli('factcheck-score', 'demo', join(root, 'factcheck.jsonl'))).toContain('| demo-nl | A | 1 | 0 |');
    expect(cli('read-score', 'demo', join(fixtures, 'readerA.jsonl'), join(fixtures, 'readerB.jsonl'))).toContain('| demo-nl | A | 12 | 4 | 5 | 4 | 0.3333 | 0.0000 |');
    cli('judge-bundles', 'demo');
    expect(cli('judge-score', 'demo', join(fixtures, 'judgeX.order1.jsonl'), join(fixtures, 'judgeX.order2.jsonl'))).toContain('| demo-nl | 0.5000 | 0.0000 |');
    expect(cli('guards', 'demo')).toContain('| demo-nl | A | none | 0 |');
    expect(cli('report', 'demo')).toContain('Outcome: **inconclusive**; directional only: 2 usable dev tasks');
    cli('owner-sheet', 'demo');
    const sheet = readFileSync(join(run.dir, 'owner-check.md'), 'utf8');
    const key = json(join(run.dir, 'keys/owner-check.key.json'));
    let index = 0;
    writeFileSync(join(root, 'filled.md'), sheet.replace(/answer: natural \/ off/g, () => `answer: ${key.items[index++].expected}`));
    expect(cli('owner-score', 'demo', join(root, 'filled.md'))).toBe('Matches: 15/15; confirmed agreed flags: 8/8; pass\n');
    const invalid = Bun.spawnSync([process.execPath, entry, 'read-score', 'demo', join(root, 'filled.md'), join(fixtures, 'readerB.jsonl')], { cwd: root });
    expect(invalid.exitCode).toBe(1);
    expect(invalid.stderr.toString()).toContain('filled.md:');
    expect(invalid.stderr.toString()).toContain('invalid flags (>5%)');
  }, 20_000);
});
