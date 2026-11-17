import { afterEach, beforeEach, expect, test } from 'bun:test';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { loadRun, parseTask, readJSON, readText, writeText, type Run } from '../parse';
import * as bundles from '../bundles';
import * as scores from '../score';
import { checkOutput } from '../guards';
import { splitSentences } from '../units';

let root: string, run: Run;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'eval-review-'));
  cpSync(join(import.meta.dir, 'fixtures'), join(root, 'eval'), { recursive: true });
  run = loadRun('demo', root);
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

test('loads every real task from all three sets', () => {
  const repo = resolve(import.meta.dir, '../../..');
  const ids = ['tasks', 'holdout', 'report-only'].flatMap(set => readdirSync(join(repo, 'eval', set)).filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md').map(file => {
    const task = parseTask(readText(join(repo, 'eval', set, file)));
    expect(task.id).toBe(file.slice(0, -3));
    return task.id;
  }));
  expect(ids.length).toBe(23);
  expect(new Set(ids).size).toBe(23);
});

test('double braces are exact tokens for presence, unknowns and sentence splitting', () => {
  const task = { ...run.tasks[0], deliverables: [{ name: 'body' }], placeholders: ['{{resident_name}}', '{domain}'] };
  expect(checkOutput(task, { body: 'Hallo {{resident_name}}, open {domain}.' }, '').hard).toEqual([]);
  expect(checkOutput(task, { body: 'Hallo {resident_name}, open {domain}.' }, '').hard).toEqual(['Missing placeholder {{resident_name}}', 'Unknown placeholder {resident_name}']);
  expect(checkOutput(task, { body: 'Hallo {{resident_name}}, open {{domain}}.' }, '').hard).toEqual(['Missing placeholder {domain}', 'Unknown placeholder {{domain}}']);
  expect(checkOutput(task, { body: '{{resident_name}} {domain} {{unknown}}' }, '').hard).toEqual(['Unknown placeholder {{unknown}}']);
  expect(splitSentences('Use {{Name. Value\n\n- Item}} and {Name. Value\n\n- Item}. Next.')).toEqual(['Use {{Name. Value\n\n- Item}} and {Name. Value\n\n- Item}.', 'Next.']);
});

test('samples none suppresses approved and pending project samples in both bundles', () => {
  const repo = resolve(import.meta.dir, '../../..');
  const task = parseTask(readText(join(repo, 'eval/tasks/sakedeal-02.md')));
  expect(task.samples).toBe('none');
  expect(task.project).toBe('sakedeal');
  run.tasks[0] = { ...run.tasks[0], project: task.project, samples: task.samples };
  const sample = join(root, 'eval/samples/sakedeal/judge.md');
  for (const status of ['approved', 'pending']) {
    writeText(sample, `---\nstatus: ${status}\n---\nSECRET SAKЕ SAMPLE`);
    run.config.pendingSamples = true;
    bundles.readBundles(run); bundles.judgeBundles(run);
    for (const path of ['read/demo-nl.md', 'judge/demo-nl.order1.md', 'judge/demo-nl.order2.md']) {
      const text = readText(join(run.dir, path));
      expect(text).toContain('Audience: People checking their account');
      expect(text).not.toContain('SAMPLE');
      expect(text).not.toContain('Voice samples');
    }
  }
});

test('fact-check bundles preserve deliverables and facts, hide arms and shuffle deterministically', () => {
  for (const arm of ['A', 'B']) for (const n of [1, 2]) writeText(join(run.dir, `out/${arm}/demo-nl/${n}.md`), `## body\nUnique ${arm}${n}.\n## title\nTitle ${arm}${n}\n## flags\nPRIVATE NOTES`);
  bundles.factcheckBundles(run, 11);
  const map = readJSON<any>(join(run.dir, 'keys/demo-nl.factcheck.map.json'));
  const text = readText(join(run.dir, 'factcheck/demo-nl.md'));
  expect(text).toContain('## Facts\n\nThe overview has 7 items.');
  expect(text).not.toMatch(/PRIVATE NOTES|arm [AB]|out\//);
  expect(Object.keys(map)).toEqual(['F1', 'F2', 'F3', 'F4']);
  expect(Object.values(map).map((v: any) => `${v.arm}${v.n}`).sort()).toEqual(['A1', 'A2', 'B1', 'B2']);
  for (const [label, item] of Object.entries(map) as any) expect(text).toContain(`## ${label}\n\n### title\n\nTitle ${item.arm}${item.n}\n\n### body\n\nUnique ${item.arm}${item.n}.`);
  bundles.factcheckBundles(run, 11);
  expect(readText(join(run.dir, 'factcheck/demo-nl.md'))).toBe(text);
  bundles.factcheckBundles(run, 12);
  expect(readJSON(join(run.dir, 'keys/demo-nl.factcheck.map.json'))).not.toEqual(map);
});

test('fact-check scores every output including zero, rejecting unknown, duplicate and missing labels', () => {
  bundles.factcheckBundles(run);
  const rows = run.tasks.flatMap(task => Object.entries(readJSON<any>(join(run.dir, `keys/${task.id}.factcheck.map.json`))).map(([label, item]: any) => ({ task: task.id, label, unsupported: item.arm === 'B' ? ['Invented delivery promise', 'Invented guarantee'] : [] })));
  const file = join(root, 'facts.jsonl');
  const save = (values: unknown[]) => writeText(file, values.map(v => JSON.stringify(v)).join('\n'));
  save(rows);
  const result = scores.factcheckScore(run, file);
  expect(result.outputs.map(o => [o.task, o.arm, o.n, o.unsupported.length]).sort()).toEqual(run.tasks.flatMap(t => ['A', 'B'].flatMap(arm => [1, 2].map(n => [t.id, arm, n, arm === 'B' ? 2 : 0]))).sort());
  expect(readJSON(join(run.dir, 'factcheck-score.json'))).toEqual(result);
  for (const change of [{ label: 'F99' }, { task: 'unknown' }, { unsupported: 'bad' }, { unsupported: [1] }]) {
    save([{ ...rows[0], ...change }, ...rows.slice(1)]);
    expect(() => scores.factcheckScore(run, file)).toThrow();
  }
  save([...rows, rows[0]]); expect(() => scores.factcheckScore(run, file)).toThrow('Duplicate');
  save(rows.slice(1)); expect(() => scores.factcheckScore(run, file)).toThrow('Missing');
});

test('keys are removed from reader directories on regeneration', () => {
  writeText(join(run.dir, 'read/demo-nl.map.json'), '{"OLD":"ARM"}');
  writeText(join(run.dir, 'judge/demo-nl.order1.map.json'), '{"OLD":"ARM"}');
  bundles.readBundles(run); bundles.judgeBundles(run);
  expect(existsSync(join(run.dir, 'read/demo-nl.map.json'))).toBe(false);
  expect(existsSync(join(run.dir, 'judge/demo-nl.order1.map.json'))).toBe(false);
  expect(readJSON(join(run.dir, 'keys/demo-nl.read.map.json'))).toEqual({ X1: { arm: 'B', n: 2 }, X2: { arm: 'A', n: 2 }, X3: { arm: 'A', n: 1 }, X4: { arm: 'B', n: 1 } });
});
