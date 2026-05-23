import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { codexInstaller } from '../tools/codex';

const COPYDOC_TOML_SECTION = '[mcp_servers.copydoc]';

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-codex-test-'));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

function makeContext(projectDir: string, skillsDir: string, copy = false) {
  return { projectDir, skillsDir, global: false, copy };
}

let tempDirs: string[] = [];

function tempDir(): string {
  const d = makeTempDir();
  tempDirs.push(d);
  return d;
}

afterEach(() => {
  for (const d of tempDirs) {
    cleanup(d);
  }
  tempDirs = [];
});

describe('codexInstaller.name', () => {
  test('name is codex', () => {
    expect(codexInstaller.name).toBe('codex');
  });
});

describe('codexInstaller.install - config.toml', () => {
  test('creates .codex/config.toml with [mcp_servers.copydoc] section when file does not exist', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));

    await codexInstaller.install(makeContext(dir, skillsDir));

    const tomlPath = path.join(dir, '.codex', 'config.toml');
    expect(fs.existsSync(tomlPath)).toBe(true);
    const content = fs.readFileSync(tomlPath, 'utf8');
    expect(content).toContain(COPYDOC_TOML_SECTION);
    expect(content).toContain('command = "npx"');
    expect(content).toContain('@copydoc/mcp');
  });

  test('appends copydoc section to existing config.toml without overwriting other content', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));
    const tomlPath = path.join(dir, '.codex', 'config.toml');
    fs.writeFileSync(tomlPath, '[other_section]\nkey = "value"\n');

    await codexInstaller.install(makeContext(dir, skillsDir));

    const content = fs.readFileSync(tomlPath, 'utf8');
    expect(content).toContain('[other_section]');
    expect(content).toContain('key = "value"');
    expect(content).toContain(COPYDOC_TOML_SECTION);
    expect(content).toContain('command = "npx"');
  });

  test('running install twice is idempotent (no duplicate TOML sections)', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));

    await codexInstaller.install(makeContext(dir, skillsDir));
    await codexInstaller.install(makeContext(dir, skillsDir));

    const tomlPath = path.join(dir, '.codex', 'config.toml');
    const content = fs.readFileSync(tomlPath, 'utf8');
    const occurrences = content.split(COPYDOC_TOML_SECTION).length - 1;
    expect(occurrences).toBe(1);
  });

  test('creates .codex/skills/ directory if it does not exist', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));

    await codexInstaller.install(makeContext(dir, skillsDir));

    expect(fs.existsSync(path.join(dir, '.codex', 'skills'))).toBe(true);
  });
});

describe('codexInstaller.install - symlink', () => {
  test('creates symlink at .codex/skills/copydoc pointing to skills directory', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));

    await codexInstaller.install(makeContext(dir, skillsDir));

    const symlinkPath = path.join(dir, '.codex', 'skills', 'copydoc');
    const stat = fs.lstatSync(symlinkPath);
    expect(stat.isSymbolicLink()).toBe(true);
    const resolved = fs.realpathSync(symlinkPath);
    expect(resolved).toBe(fs.realpathSync(skillsDir));
  });

  test('--copy flag copies files instead of symlinking', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    // Put a file in skillsDir so we can verify it was copied
    fs.writeFileSync(path.join(skillsDir, 'test-skill.md'), '# Test Skill\n');
    fs.mkdirSync(path.join(dir, '.codex'));

    await codexInstaller.install(makeContext(dir, skillsDir, true));

    const destPath = path.join(dir, '.codex', 'skills', 'copydoc');
    const stat = fs.lstatSync(destPath);
    // Should NOT be a symlink when copy mode is used
    expect(stat.isSymbolicLink()).toBe(false);
    expect(stat.isDirectory()).toBe(true);
    // The copied file should exist
    expect(fs.existsSync(path.join(destPath, 'test-skill.md'))).toBe(true);
  });
});

describe('codexInstaller.install - return value', () => {
  test('returns InstallResult with tool=codex and non-empty actions array', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));

    const result = await codexInstaller.install(makeContext(dir, skillsDir));

    expect(result.tool).toBe('codex');
    expect(Array.isArray(result.actions)).toBe(true);
    expect(result.actions.length).toBeGreaterThan(0);
  });
});

describe('codexInstaller.uninstall', () => {
  test('removes [mcp_servers.copydoc] section from config.toml', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));
    await codexInstaller.install(makeContext(dir, skillsDir));

    await codexInstaller.uninstall({ projectDir: dir, global: false });

    const tomlPath = path.join(dir, '.codex', 'config.toml');
    const content = fs.readFileSync(tomlPath, 'utf8');
    expect(content).not.toContain(COPYDOC_TOML_SECTION);
    expect(content).not.toContain('@copydoc/mcp');
  });

  test('uninstall preserves other TOML sections', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));
    const tomlPath = path.join(dir, '.codex', 'config.toml');
    fs.writeFileSync(tomlPath, '[other_section]\nkey = "value"\n');
    await codexInstaller.install(makeContext(dir, skillsDir));

    await codexInstaller.uninstall({ projectDir: dir, global: false });

    const content = fs.readFileSync(tomlPath, 'utf8');
    expect(content).toContain('[other_section]');
    expect(content).toContain('key = "value"');
    expect(content).not.toContain(COPYDOC_TOML_SECTION);
  });

  test('removes .codex/skills/copydoc symlink', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));
    await codexInstaller.install(makeContext(dir, skillsDir));

    await codexInstaller.uninstall({ projectDir: dir, global: false });

    const symlinkPath = path.join(dir, '.codex', 'skills', 'copydoc');
    expect(fs.existsSync(symlinkPath)).toBe(false);
  });

  test('uninstall does not throw when config.toml does not exist', async () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));

    await expect(codexInstaller.uninstall({ projectDir: dir, global: false })).resolves.toBeUndefined();
  });
});

describe('codexInstaller.isConfigured', () => {
  test('returns true when config.toml exists and contains [mcp_servers.copydoc]', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));
    await codexInstaller.install(makeContext(dir, skillsDir));

    const result = await codexInstaller.isConfigured(dir);
    expect(result).toBe(true);
  });

  test('returns false when config.toml does not exist', async () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));

    const result = await codexInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false when config.toml exists but does not contain [mcp_servers.copydoc]', async () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, '.codex'));
    fs.writeFileSync(path.join(dir, '.codex', 'config.toml'), '[other_section]\nkey = "value"\n');

    const result = await codexInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });
});
