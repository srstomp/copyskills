import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '../../../..');
let dir: string;
beforeAll(() => {
  fs.mkdirSync(path.join(root, 'output'), { recursive: true });
  dir = fs.mkdtempSync(path.join(root, 'output/lint-tests-'));
});
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));
function file(name: string, text: string) {
  const target = path.join(dir, name);
  fs.writeFileSync(target, text);
  return target;
}
async function cli(args: string[]) {
  const env = { ...process.env };
  delete env.COPYDOC_API_KEY;
  delete env.OPENAI_API_KEY;
  const proc = Bun.spawn([process.execPath, 'packages/cli/src/cli.ts', 'lint', ...args], { cwd: root, env, stdout: 'pipe', stderr: 'pipe' });
  const [stdout, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
  return { stdout, stderr, code };
}
describe('copydoc lint', () => {
  test('JSON result and exit 1 on errors, without API configuration', async () => {
    const result = await cli([file('long.txt', 'a'.repeat(61)), '--kind', 'title', '--locale', 'fr', '--json']);
    expect(result.code).toBe(1);
    expect(JSON.parse(result.stdout)).toEqual({ issues: [{ rule: 'length', severity: 'error', message: 'title has 61 characters' }], errors: 1, warnings: 0 });
  });
  test('warnings exit 0 and human output includes rule and summary', async () => {
    const result = await cli([file('short.md', 'Short title'), '--kind', 'title', '--locale', 'fr']);
    expect(result.code).toBe(0);
    expect(result.stdout).toBe('WARN length: title has 11 characters\n0 errors, 1 warnings\n');
  });
  test('items lines ignores blank lines and identifies batch items', async () => {
    const result = await cli([file('lines.txt', 'red\n\nblue\n  \ngreen\n'), '--items', 'lines', '--kind', 'title', '--locale', 'fr', '--min', '5', '--json']);
    expect(result.code).toBe(1);
    expect(JSON.parse(result.stdout)).toEqual({ errors: 2, warnings: 1, issues: [
      { rule: 'length', severity: 'error', message: 'title has 3 characters', item: 0 },
      { rule: 'length', severity: 'error', message: 'title has 4 characters', item: 1 },
      { rule: 'length', severity: 'warn', message: 'title has 5 characters', item: 2 },
    ] });
  });
  test('directory uses sorted md/txt files as a batch; multiple files also form a batch', async () => {
    const batch = path.join(dir, 'batch');
    fs.mkdirSync(batch);
    fs.writeFileSync(path.join(batch, 'b.txt'), '24');
    fs.writeFileSync(path.join(batch, 'a.md'), '23');
    fs.writeFileSync(path.join(batch, 'c.json'), '25');
    const facts = file('facts.md', '23');
    for (const targets of [[batch], [path.join(batch, 'a.md'), path.join(batch, 'b.txt')]]) {
      const result = await cli([...targets, '--facts', facts, '--locale', 'fr', '--json']);
      expect(result.code).toBe(1);
      expect(JSON.parse(result.stdout)).toEqual({ errors: 1, warnings: 0, issues: [{ rule: 'number', severity: 'error', message: 'Number 24 is not in the fact sheet', item: 1 }] });
    }
  });
  test('human output identifies the item', async () => {
    const result = await cli([file('repeat-a.txt', '23'), file('repeat-b.txt', '24'), '--facts', file('zero-facts.md', '23'), '--locale', 'fr']);
    expect(result.code).toBe(1);
    expect(result.stdout).toBe('ERROR number [item 1]: Number 24 is not in the fact sheet\n1 errors, 0 warnings\n');
  });
  test('human phrase output includes item, first line and suggestion from a fixture', async () => {
    const target = file('phrase.txt', 'Clean first line\nUse jargon here\nUse jargon again');
    const script = `
      import { runCli } from './packages/cli/src/cli.ts';
      const loader = { resolveReference: () => '# {lint: error}\\n- jargon - Use plain words' };
      await runCli(['bun', 'copydoc', 'lint', ${JSON.stringify(target)}, '--items', 'lines'], loader);
    `;
    const proc = Bun.spawn([process.execPath, '-e', script], { cwd: root, stdout: 'pipe', stderr: 'pipe' });
    const [stdout, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
    expect(stderr).toBe('');
    expect(code).toBe(1);
    expect(stdout).toBe('ERROR phrase [item 1] line 1: Banned pattern: jargon (Use plain words)\nERROR phrase [item 2] line 1: Banned pattern: jargon (Use plain words)\n2 errors, 0 warnings\n');
  });
  test('clean copy exits 0', async () => {
    const result = await cli(['--json', file('clean.txt', 'Clear and specific copy.'), '--locale', 'fr']);
    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ issues: [], errors: 0, warnings: 0 });
  });
  test('usage errors exit 2 with a diagnostic', async () => {
    const target = file('usage.txt', 'Content');
    for (const args of [[], ['missing-lint-file.txt'], [target, '--kind', 'email'], [target, '--min', 'NaN'], [target, '--max'], [target, '--items', 'words'], [target, target, '--items', 'lines'], [target, '--facts', 'missing-facts.txt'], [target, '--unknown'], [target, '--min', '10', '--max', '5']]) {
      const result = await cli(args);
      expect(result.code).toBe(2);
      expect(result.stderr).toMatch(/lint:/);
    }
  });
});
