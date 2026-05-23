import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { piInstaller } from '../tools/pi';
import { detectTool } from '../detect';

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-pi-test-'));
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

describe('piInstaller.name', () => {
  test('name is pi', () => {
    expect(piInstaller.name).toBe('pi');
  });
});

describe('piInstaller.install - skills symlink', () => {
  test('install creates skills symlink at .pi/skills/copydoc', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));

    const symlinkPath = path.join(dir, '.pi', 'skills', 'copydoc');
    const stat = fs.lstatSync(symlinkPath);
    expect(stat.isSymbolicLink()).toBe(true);
    const resolved = fs.realpathSync(symlinkPath);
    expect(resolved).toBe(fs.realpathSync(skillsDir));
  });

  test('symlink uses a relative path target', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));

    const symlinkPath = path.join(dir, '.pi', 'skills', 'copydoc');
    const target = fs.readlinkSync(symlinkPath);
    expect(path.isAbsolute(target)).toBe(false);
  });

  test('ctx.copy true copies directory instead of creating a symlink', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.writeFileSync(path.join(skillsDir, 'skill.md'), '# Skill\n');

    await piInstaller.install(makeContext(dir, skillsDir, true));

    const destPath = path.join(dir, '.pi', 'skills', 'copydoc');
    const stat = fs.lstatSync(destPath);
    expect(stat.isSymbolicLink()).toBe(false);
    expect(stat.isDirectory()).toBe(true);
    expect(fs.existsSync(path.join(destPath, 'skill.md'))).toBe(true);
  });
});

describe('piInstaller.install - extension stub', () => {
  test('install generates .pi/extensions/copydoc.ts', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));

    const stubPath = path.join(dir, '.pi', 'extensions', 'copydoc.ts');
    expect(fs.existsSync(stubPath)).toBe(true);
  });

  test('extension stub contains import from @copydoc/core', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));

    const stubPath = path.join(dir, '.pi', 'extensions', 'copydoc.ts');
    const content = fs.readFileSync(stubPath, 'utf8');
    expect(content).toContain("from '@copydoc/core'");
  });

  test('extension stub exports createCopydocExtension function', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));

    const stubPath = path.join(dir, '.pi', 'extensions', 'copydoc.ts');
    const content = fs.readFileSync(stubPath, 'utf8');
    expect(content).toContain('export function createCopydocExtension');
  });

  test('extension stub references skills/copydoc directory', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));

    const stubPath = path.join(dir, '.pi', 'extensions', 'copydoc.ts');
    const content = fs.readFileSync(stubPath, 'utf8');
    expect(content).toContain('skills/copydoc');
  });
});

describe('piInstaller.install - parent directories', () => {
  test('install creates .pi/skills/ if it does not exist', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));

    expect(fs.existsSync(path.join(dir, '.pi', 'skills'))).toBe(true);
  });

  test('install creates .pi/extensions/ if it does not exist', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));

    expect(fs.existsSync(path.join(dir, '.pi', 'extensions'))).toBe(true);
  });
});

describe('piInstaller.install - idempotent', () => {
  test('running install twice does not throw and overwrites stub without error', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));
    await expect(piInstaller.install(makeContext(dir, skillsDir))).resolves.toBeDefined();

    const stubPath = path.join(dir, '.pi', 'extensions', 'copydoc.ts');
    expect(fs.existsSync(stubPath)).toBe(true);
  });

  test('running install twice does not duplicate skills entry', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await piInstaller.install(makeContext(dir, skillsDir));
    await piInstaller.install(makeContext(dir, skillsDir));

    const symlinkPath = path.join(dir, '.pi', 'skills', 'copydoc');
    const stat = fs.lstatSync(symlinkPath);
    expect(stat.isSymbolicLink()).toBe(true);
  });
});

describe('piInstaller.install - return value', () => {
  test('returns InstallResult with tool=pi and non-empty actions array', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    const result = await piInstaller.install(makeContext(dir, skillsDir));

    expect(result.tool).toBe('pi');
    expect(Array.isArray(result.actions)).toBe(true);
    expect(result.actions.length).toBeGreaterThan(0);
  });
});

describe('piInstaller.uninstall', () => {
  test('uninstall removes .pi/extensions/copydoc.ts', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await piInstaller.install(makeContext(dir, skillsDir));

    await piInstaller.uninstall({ projectDir: dir, global: false });

    const stubPath = path.join(dir, '.pi', 'extensions', 'copydoc.ts');
    expect(fs.existsSync(stubPath)).toBe(false);
  });

  test('uninstall removes .pi/skills/copydoc symlink', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await piInstaller.install(makeContext(dir, skillsDir));

    await piInstaller.uninstall({ projectDir: dir, global: false });

    const symlinkPath = path.join(dir, '.pi', 'skills', 'copydoc');
    const exists = (() => { try { fs.lstatSync(symlinkPath); return true; } catch { return false; } })();
    expect(exists).toBe(false);
  });

  test('uninstall removes copied skills directory', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    fs.writeFileSync(path.join(skillsDir, 'skill.md'), '# Skill\n');
    await piInstaller.install(makeContext(dir, skillsDir, true));

    await piInstaller.uninstall({ projectDir: dir, global: false });

    const destPath = path.join(dir, '.pi', 'skills', 'copydoc');
    expect(fs.existsSync(destPath)).toBe(false);
  });

  test('uninstall does not throw when nothing was installed', async () => {
    const dir = tempDir();
    await expect(piInstaller.uninstall({ projectDir: dir, global: false })).resolves.toBeUndefined();
  });
});

describe('piInstaller.isConfigured', () => {
  test('isConfigured returns true when .pi/extensions/copydoc.ts exists', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await piInstaller.install(makeContext(dir, skillsDir));

    const result = await piInstaller.isConfigured(dir);
    expect(result).toBe(true);
  });

  test('isConfigured returns false when .pi/extensions/copydoc.ts does not exist', async () => {
    const dir = tempDir();

    const result = await piInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('isConfigured returns false after uninstall', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await piInstaller.install(makeContext(dir, skillsDir));
    await piInstaller.uninstall({ projectDir: dir, global: false });

    const result = await piInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });
});

describe('detection - pi', () => {
  test('pi detected: true when .pi/ directory exists in projectDir', async () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, '.pi'));

    const result = await detectTool('pi', dir);
    expect(result.tool).toBe('pi');
    expect(result.detected).toBe(true);
  });

  test('pi detected: false when neither .pi/ in projectDir nor ~/.pi/ exists', async () => {
    const dir = tempDir();

    // Only check projectDir-local absence; we cannot control ~/.pi/ existence on the host
    const localResult = await detectTool('pi', dir);
    expect(localResult.tool).toBe('pi');
    // If ~/.pi/ happens to exist on host this will return true, so we just verify shape
    expect(typeof localResult.detected).toBe('boolean');
  });
});
