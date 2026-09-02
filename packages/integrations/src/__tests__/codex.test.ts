import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { codexInstaller } from '../tools/codex';

const COPYDOC_TOML_SECTION = '[mcp_servers.copydoc]';
const tempDirs: string[] = [];

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-codex-test-'));
  tempDirs.push(dir);
  return dir;
}

function makeSkills(): string {
  const root = tempDir();
  for (const name of ['copy-workflow', 'quality-frameworks']) {
    const skillDir = path.join(root, name);
    fs.mkdirSync(path.join(skillDir, 'references'), { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), `---\nname: ${name}\ndescription: Test\n---\n`);
    fs.writeFileSync(path.join(skillDir, 'references', 'test.md'), '# Test\n');
  }
  return root;
}

function makeContext(projectDir: string, skillsDir: string, copy = true) {
  return { projectDir, skillsDir, global: false, copy };
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('codexInstaller', () => {
  test('uses the codex tool name', () => {
    expect(codexInstaller.name).toBe('codex');
  });

  test('creates project MCP config with a non-interactive, versioned package command', async () => {
    const projectDir = tempDir();
    await codexInstaller.install(makeContext(projectDir, makeSkills()));

    const content = fs.readFileSync(path.join(projectDir, '.codex', 'config.toml'), 'utf8');
    expect(content).toContain(COPYDOC_TOML_SECTION);
    expect(content).toContain('command = "npx"');
    expect(content).toContain('args = ["--yes", "@copydoc/mcp@0.1.1"]');
  });

  test('preserves existing config and does not duplicate the MCP section', async () => {
    const projectDir = tempDir();
    const configPath = path.join(projectDir, '.codex', 'config.toml');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, '[other]\nkey = "value"\n');
    const context = makeContext(projectDir, makeSkills());

    await codexInstaller.install(context);
    await codexInstaller.install(context);

    const content = fs.readFileSync(configPath, 'utf8');
    expect(content).toContain('[other]');
    expect(content.split(COPYDOC_TOML_SECTION)).toHaveLength(2);
  });

  test('copies every skill into the Codex .agents/skills discovery directory', async () => {
    const projectDir = tempDir();
    await codexInstaller.install(makeContext(projectDir, makeSkills()));

    for (const name of ['copy-workflow', 'quality-frameworks']) {
      const installed = path.join(projectDir, '.agents', 'skills', name);
      expect(fs.lstatSync(installed).isSymbolicLink()).toBe(false);
      expect(fs.existsSync(path.join(installed, 'SKILL.md'))).toBe(true);
      expect(fs.existsSync(path.join(installed, 'references', 'test.md'))).toBe(true);
    }
    expect(fs.existsSync(path.join(projectDir, '.codex', 'skills'))).toBe(false);
  });

  test('can create per-skill links for local development', async () => {
    const projectDir = tempDir();
    const skillsDir = makeSkills();
    await codexInstaller.install(makeContext(projectDir, skillsDir, false));

    const installed = path.join(projectDir, '.agents', 'skills', 'copy-workflow');
    expect(fs.lstatSync(installed).isSymbolicLink()).toBe(true);
    expect(fs.realpathSync(installed)).toBe(fs.realpathSync(path.join(skillsDir, 'copy-workflow')));
  });

  test('does not overwrite a skill directory it does not own', async () => {
    const projectDir = tempDir();
    const existing = path.join(projectDir, '.agents', 'skills', 'copy-workflow');
    fs.mkdirSync(existing, { recursive: true });
    fs.writeFileSync(path.join(existing, 'SKILL.md'), '# User version\n');

    const result = await codexInstaller.install(makeContext(projectDir, makeSkills()));

    expect(fs.readFileSync(path.join(existing, 'SKILL.md'), 'utf8')).toBe('# User version\n');
    expect(result.actions.some((action) => action.includes('was not modified'))).toBe(true);
  });

  test('global mode writes only to the supplied home directory', async () => {
    const projectDir = tempDir();
    const fakeHome = tempDir();
    await codexInstaller.install({
      projectDir,
      skillsDir: makeSkills(),
      global: true,
      copy: true,
      homeDir: fakeHome,
    });

    expect(fs.existsSync(path.join(fakeHome, '.codex', 'config.toml'))).toBe(true);
    expect(fs.existsSync(path.join(fakeHome, '.agents', 'skills', 'copy-workflow', 'SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, '.codex'))).toBe(false);
    expect(fs.existsSync(path.join(projectDir, '.agents'))).toBe(false);
  });

  test('uninstall removes only installer-owned skills and preserves other config', async () => {
    const projectDir = tempDir();
    const configPath = path.join(projectDir, '.codex', 'config.toml');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, '[other]\nkey = "value"\n');
    const context = makeContext(projectDir, makeSkills());
    await codexInstaller.install(context);

    const userSkill = path.join(projectDir, '.agents', 'skills', 'user-skill');
    fs.mkdirSync(userSkill, { recursive: true });
    fs.writeFileSync(path.join(userSkill, 'SKILL.md'), '# Keep me\n');
    await codexInstaller.uninstall({ projectDir, global: false });

    expect(fs.existsSync(path.join(projectDir, '.agents', 'skills', 'copy-workflow'))).toBe(false);
    expect(fs.existsSync(userSkill)).toBe(true);
    const content = fs.readFileSync(configPath, 'utf8');
    expect(content).toContain('[other]');
    expect(content).not.toContain(COPYDOC_TOML_SECTION);
  });

  test('uninstall removes the legacy .codex/skills/copydoc path', async () => {
    const projectDir = tempDir();
    const legacyPath = path.join(projectDir, '.codex', 'skills', 'copydoc');
    fs.mkdirSync(legacyPath, { recursive: true });
    fs.writeFileSync(path.join(legacyPath, 'old.md'), 'old');

    await codexInstaller.uninstall({ projectDir, global: false });

    expect(fs.existsSync(legacyPath)).toBe(false);
  });

  test('reports configured only when both MCP config and installed skills are present', async () => {
    const projectDir = tempDir();
    expect(await codexInstaller.isConfigured(projectDir)).toBe(false);

    await codexInstaller.install(makeContext(projectDir, makeSkills()));
    expect(await codexInstaller.isConfigured(projectDir)).toBe(true);

    fs.rmSync(path.join(projectDir, '.agents', 'skills', 'copy-workflow'), {
      recursive: true,
      force: true,
    });
    expect(await codexInstaller.isConfigured(projectDir)).toBe(false);
  });
});
