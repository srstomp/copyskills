import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { hermesInstaller } from '../tools/hermes';

const COPYDOC_YAML_KEY = 'copydoc:';

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-hermes-test-'));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
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

// The Hermes installer uses projectDir as the base for the .hermes/ config dir in tests.
function makeContext(projectDir: string, skillsDir: string, copy = false) {
  return { projectDir, skillsDir, global: false, copy };
}

describe('hermesInstaller.name', () => {
  test('name is hermes', () => {
    expect(hermesInstaller.name).toBe('hermes');
  });
});

describe('hermesInstaller.install - config.yaml created when file does not exist', () => {
  test('creates .hermes/config.yaml with mcp_servers.copydoc when file does not exist', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));

    await hermesInstaller.install(makeContext(dir, skillsDir));

    const configPath = path.join(dir, '.hermes', 'config.yaml');
    expect(fs.existsSync(configPath)).toBe(true);
    const content = fs.readFileSync(configPath, 'utf8');
    expect(content).toContain('mcp_servers:');
    expect(content).toContain(COPYDOC_YAML_KEY);
    expect(content).toContain('command: npx');
    expect(content).toContain('@copydoc/mcp');
  });
});

describe('hermesInstaller.install - appends copydoc to existing config', () => {
  test('appends copydoc entry to existing config.yaml that already has mcp_servers', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));
    const configPath = path.join(dir, '.hermes', 'config.yaml');
    fs.writeFileSync(
      configPath,
      `mcp_servers:\n  other_tool:\n    command: some-cmd\n    args: ["--flag"]\n`,
    );

    await hermesInstaller.install(makeContext(dir, skillsDir));

    const content = fs.readFileSync(configPath, 'utf8');
    expect(content).toContain('other_tool:');
    expect(content).toContain('some-cmd');
    expect(content).toContain(COPYDOC_YAML_KEY);
    expect(content).toContain('command: npx');
    expect(content).toContain('@copydoc/mcp');
  });

  test('adds mcp_servers key when config exists but has no mcp_servers section', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));
    const configPath = path.join(dir, '.hermes', 'config.yaml');
    fs.writeFileSync(configPath, `theme: dark\nsome_setting: true\n`);

    await hermesInstaller.install(makeContext(dir, skillsDir));

    const content = fs.readFileSync(configPath, 'utf8');
    expect(content).toContain('theme: dark');
    expect(content).toContain('some_setting: true');
    expect(content).toContain('mcp_servers:');
    expect(content).toContain(COPYDOC_YAML_KEY);
    expect(content).toContain('command: npx');
  });
});

describe('hermesInstaller.install - skills symlink', () => {
  test('creates symlink at .hermes/skills/copydoc pointing to skills directory', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));

    await hermesInstaller.install(makeContext(dir, skillsDir));

    const symlinkPath = path.join(dir, '.hermes', 'skills', 'copydoc');
    const stat = fs.lstatSync(symlinkPath);
    expect(stat.isSymbolicLink()).toBe(true);
    const resolved = fs.realpathSync(symlinkPath);
    expect(resolved).toBe(fs.realpathSync(skillsDir));
  });
});

describe('hermesInstaller.uninstall', () => {
  test('removes copydoc entry from config.yaml', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));
    await hermesInstaller.install(makeContext(dir, skillsDir));

    await hermesInstaller.uninstall({ projectDir: dir, global: false });

    const configPath = path.join(dir, '.hermes', 'config.yaml');
    const content = fs.readFileSync(configPath, 'utf8');
    expect(content).not.toContain(COPYDOC_YAML_KEY);
    expect(content).not.toContain('@copydoc/mcp');
  });

  test('removes .hermes/skills/copydoc symlink', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));
    await hermesInstaller.install(makeContext(dir, skillsDir));

    await hermesInstaller.uninstall({ projectDir: dir, global: false });

    const symlinkPath = path.join(dir, '.hermes', 'skills', 'copydoc');
    expect(fs.existsSync(symlinkPath)).toBe(false);
  });

  test('uninstall preserves other mcp_servers entries', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));
    const configPath = path.join(dir, '.hermes', 'config.yaml');
    fs.writeFileSync(
      configPath,
      `mcp_servers:\n  other_tool:\n    command: some-cmd\n    args: ["--flag"]\n`,
    );
    await hermesInstaller.install(makeContext(dir, skillsDir));

    await hermesInstaller.uninstall({ projectDir: dir, global: false });

    const content = fs.readFileSync(configPath, 'utf8');
    expect(content).toContain('other_tool:');
    expect(content).toContain('some-cmd');
    expect(content).not.toContain(COPYDOC_YAML_KEY);
  });

  test('uninstall does not throw when config.yaml does not exist', async () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));

    await expect(
      hermesInstaller.uninstall({ projectDir: dir, global: false }),
    ).resolves.toBeUndefined();
  });
});

describe('hermesInstaller.install - idempotent', () => {
  test('running install twice produces no duplicate copydoc entries', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));

    await hermesInstaller.install(makeContext(dir, skillsDir));
    await hermesInstaller.install(makeContext(dir, skillsDir));

    const configPath = path.join(dir, '.hermes', 'config.yaml');
    const content = fs.readFileSync(configPath, 'utf8');
    const occurrences = content.split(COPYDOC_YAML_KEY).length - 1;
    expect(occurrences).toBe(1);
  });
});

describe('hermesInstaller.isConfigured', () => {
  test('returns true when config.yaml exists and contains copydoc under mcp_servers', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));
    await hermesInstaller.install(makeContext(dir, skillsDir));

    const result = await hermesInstaller.isConfigured(dir);
    expect(result).toBe(true);
  });

  test('returns false when config.yaml does not exist', async () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));

    const result = await hermesInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false when config.yaml exists but has no copydoc entry', async () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, '.hermes'));
    fs.writeFileSync(
      path.join(dir, '.hermes', 'config.yaml'),
      `mcp_servers:\n  other_tool:\n    command: some-cmd\n`,
    );

    const result = await hermesInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });
});
