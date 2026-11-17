import { afterAll, describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(__dirname, '../../../..');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-locale-commands-'));
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe('generation command locale routing with the real linter and assembler', () => {
  test.each(['write', 'critique', 'adapt'])('%s --locale nl-BE uses Dutch lint rules', async command => {
    const script = `
      import { mock } from 'bun:test';
      mock.module(${JSON.stringify(path.join(root, 'packages/cli/src/config.ts'))}, () => ({ loadConfig: () => ({}), resolveConfigPath: () => "unused" }));
      mock.module(${JSON.stringify(path.join(root, 'packages/cli/src/providers/adapter.ts'))}, () => ({ createProvider: () => ({
        generate: async () => 'Critique response',
        stream: async function* (system, user) { console.log(JSON.stringify({ system, user })); yield 'moeiteloos'; },
      }) }));
      const { runCli } = await import(${JSON.stringify(path.join(root, 'packages/cli/src/cli.ts'))});
      const loader = {
        getSkill: () => ({ body: 'Domain workflow' }),
        resolveReference: ref => ref.endsWith('locales/nl.md') ? '# Dutch {lint: error}\\n- moeiteloos' : '# English {lint: error}\\n- leverage',
      };
      await runCli(['bun', 'copydoc', ${JSON.stringify(command)}, 'moeiteloos', '--locale', 'nl-BE', '--to', 'email'], loader);
    `;
    const proc = Bun.spawn([process.execPath, '-e', script], { cwd: dir, stdin: 'pipe', stdout: 'pipe', stderr: 'pipe' });
    const readOutput = async () => {
      let output = '';
      const prompts = ["What's the goal?", 'Who is this for?', 'Any words to avoid?'];
      let answered = 0;
      for await (const chunk of proc.stdout) {
        output += new TextDecoder().decode(chunk);
        if (command === 'write' && answered < prompts.length && output.includes(prompts[answered])) {
          proc.stdin.write('\n');
          answered++;
          if (answered === prompts.length) proc.stdin.end();
        }
      }
      return output;
    };
    const [stdout, stderr, code] = await Promise.all([readOutput(), new Response(proc.stderr).text(), proc.exited]);
    expect(stderr).toBe('');
    expect(code).toBe(0);
    expect(stdout).toContain('ERROR phrase line 1: Banned pattern: moeiteloos');
    if (command === 'write') {
      expect(stdout).toContain('# Language Rules: nl-BE (MANDATORY)');
      expect(stdout).toContain('Language: nl-BE. Write natively in this language');
      const saved = fs.readdirSync(path.join(dir, 'output'));
      expect(fs.readFileSync(path.join(dir, 'output', saved[0]), 'utf8')).toBe('moeiteloos');
    }
  });
});
