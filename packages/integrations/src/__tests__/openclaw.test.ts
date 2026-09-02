import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { openclawInstaller } from '../tools/openclaw';
import { detectTool } from '../detect';

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-openclaw-test-'));
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

function makeContext(projectDir: string, skillsDir: string, copy = false) {
  return { projectDir, skillsDir, global: false, copy };
}

function configPath(projectDir: string): string {
  return path.join(projectDir, '.openclaw', 'openclaw.json');
}

// -------------------------------------------------------------------
// installer name
// -------------------------------------------------------------------

describe('openclawInstaller.name', () => {
  test('name is openclaw', () => {
    expect(openclawInstaller.name).toBe('openclaw');
  });
});

// -------------------------------------------------------------------
// install -- creates config when file does not exist
// -------------------------------------------------------------------

describe('openclawInstaller.install - creates openclaw.json when file does not exist', () => {
  test('creates .openclaw/openclaw.json with mcp.servers.copydoc entry', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await openclawInstaller.install(makeContext(dir, skillsDir));

    const cfgPath = configPath(dir);
    expect(fs.existsSync(cfgPath)).toBe(true);

    const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(parsed.mcp).toBeDefined();
    expect(parsed.mcp.servers).toBeDefined();
    expect(parsed.mcp.servers.copydoc).toBeDefined();
    expect(parsed.mcp.servers.copydoc.command).toBe('npx');
    expect(parsed.mcp.servers.copydoc.args).toEqual(['--yes', '@copydoc/mcp@0.1.1']);
  });

  test('adds skillsDir to skills.load.extraDirs', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await openclawInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(configPath(dir), 'utf8'));
    expect(parsed.skills).toBeDefined();
    expect(parsed.skills.load).toBeDefined();
    expect(Array.isArray(parsed.skills.load.extraDirs)).toBe(true);
    expect(parsed.skills.load.extraDirs).toContain(skillsDir);
  });

  test('returns InstallResult with tool=openclaw and non-empty actions', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    const result = await openclawInstaller.install(makeContext(dir, skillsDir));

    expect(result.tool).toBe('openclaw');
    expect(Array.isArray(result.actions)).toBe(true);
    expect(result.actions.length).toBeGreaterThan(0);
  });
});

// -------------------------------------------------------------------
// install -- merges into existing config
// -------------------------------------------------------------------

describe('openclawInstaller.install - merges into existing openclaw.json', () => {
  test('preserves other top-level keys when merging copydoc entry', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const cfgPath = configPath(dir);
    fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
    fs.writeFileSync(cfgPath, JSON.stringify({ theme: 'dark', editor: { fontSize: 14 } }, null, 2));

    await openclawInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(parsed.theme).toBe('dark');
    expect(parsed.editor).toEqual({ fontSize: 14 });
    expect(parsed.mcp.servers.copydoc).toBeDefined();
  });

  test('preserves other mcp.servers entries when merging copydoc', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const cfgPath = configPath(dir);
    fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
    fs.writeFileSync(
      cfgPath,
      JSON.stringify(
        { mcp: { servers: { other: { command: 'other-cmd', args: [] } } } },
        null,
        2,
      ),
    );

    await openclawInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(parsed.mcp.servers.other).toEqual({ command: 'other-cmd', args: [] });
    expect(parsed.mcp.servers.copydoc).toBeDefined();
  });

  test('preserves other extraDirs entries when adding skillsDir', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const cfgPath = configPath(dir);
    const existingDir = '/some/existing/dir';
    fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
    fs.writeFileSync(
      cfgPath,
      JSON.stringify({ skills: { load: { extraDirs: [existingDir] } } }, null, 2),
    );

    await openclawInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(parsed.skills.load.extraDirs).toContain(existingDir);
    expect(parsed.skills.load.extraDirs).toContain(skillsDir);
  });

  test('creates nested mcp.servers path when existing file has no mcp key', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const cfgPath = configPath(dir);
    fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
    fs.writeFileSync(cfgPath, JSON.stringify({ theme: 'light' }, null, 2));

    await openclawInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(parsed.mcp.servers.copydoc.command).toBe('npx');
  });
});

// -------------------------------------------------------------------
// install -- idempotent
// -------------------------------------------------------------------

describe('openclawInstaller.install - idempotent', () => {
  test('running install twice does not duplicate the copydoc entry', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await openclawInstaller.install(makeContext(dir, skillsDir));
    await openclawInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(configPath(dir), 'utf8'));
    expect(typeof parsed.mcp.servers.copydoc).toBe('object');
    expect(Array.isArray(parsed.mcp.servers.copydoc)).toBe(false);
  });

  test('running install twice does not duplicate the skillsDir in extraDirs', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await openclawInstaller.install(makeContext(dir, skillsDir));
    await openclawInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(configPath(dir), 'utf8'));
    const count = parsed.skills.load.extraDirs.filter((d: string) => d === skillsDir).length;
    expect(count).toBe(1);
  });
});

// -------------------------------------------------------------------
// uninstall
// -------------------------------------------------------------------

describe('openclawInstaller.uninstall', () => {
  test('removes copydoc key from mcp.servers', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await openclawInstaller.install(makeContext(dir, skillsDir));

    await openclawInstaller.uninstall({ projectDir: dir, global: false });

    const cfgPath = configPath(dir);
    if (fs.existsSync(cfgPath)) {
      const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      expect(parsed.mcp?.servers?.copydoc).toBeUndefined();
    }
  });

  test('removes skillsDir from skills.load.extraDirs', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await openclawInstaller.install(makeContext(dir, skillsDir));

    await openclawInstaller.uninstall({ projectDir: dir, global: false });

    const cfgPath = configPath(dir);
    if (fs.existsSync(cfgPath)) {
      const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      const extraDirs: string[] = parsed.skills?.load?.extraDirs ?? [];
      expect(extraDirs).not.toContain(skillsDir);
    }
  });

  test('preserves other mcp.servers entries after removing copydoc', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const cfgPath = configPath(dir);
    fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
    fs.writeFileSync(
      cfgPath,
      JSON.stringify(
        { mcp: { servers: { other: { command: 'other-cmd', args: [] } } } },
        null,
        2,
      ),
    );
    await openclawInstaller.install(makeContext(dir, skillsDir));
    await openclawInstaller.uninstall({ projectDir: dir, global: false });

    const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(parsed.mcp.servers.other).toEqual({ command: 'other-cmd', args: [] });
    expect(parsed.mcp?.servers?.copydoc).toBeUndefined();
  });

  test('preserves other extraDirs entries after removing skillsDir', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const cfgPath = configPath(dir);
    const existingDir = '/some/existing/dir';
    fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
    fs.writeFileSync(
      cfgPath,
      JSON.stringify({ skills: { load: { extraDirs: [existingDir] } } }, null, 2),
    );
    await openclawInstaller.install(makeContext(dir, skillsDir));
    await openclawInstaller.uninstall({ projectDir: dir, global: false });

    const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(parsed.skills.load.extraDirs).toContain(existingDir);
    expect(parsed.skills.load.extraDirs).not.toContain(skillsDir);
  });

  test('does not throw when openclaw.json does not exist', async () => {
    const dir = tempDir();
    await expect(
      openclawInstaller.uninstall({ projectDir: dir, global: false }),
    ).resolves.toBeUndefined();
  });
});

// -------------------------------------------------------------------
// isConfigured
// -------------------------------------------------------------------

describe('openclawInstaller.isConfigured', () => {
  test('returns true when openclaw.json exists and contains mcp.servers.copydoc', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await openclawInstaller.install(makeContext(dir, skillsDir));

    const result = await openclawInstaller.isConfigured(dir);
    expect(result).toBe(true);
  });

  test('returns false when openclaw.json does not exist', async () => {
    const dir = tempDir();
    const result = await openclawInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false when openclaw.json exists but has no mcp.servers.copydoc', async () => {
    const dir = tempDir();
    const cfgPath = configPath(dir);
    fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
    fs.writeFileSync(cfgPath, JSON.stringify({ theme: 'dark' }, null, 2));

    const result = await openclawInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false when mcp.servers exists but copydoc key is missing', async () => {
    const dir = tempDir();
    const cfgPath = configPath(dir);
    fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
    fs.writeFileSync(
      cfgPath,
      JSON.stringify({ mcp: { servers: { other: { command: 'other', args: [] } } } }, null, 2),
    );

    const result = await openclawInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });
});

// -------------------------------------------------------------------
// detection
// -------------------------------------------------------------------

describe('detectTool - openclaw', () => {
  test('returns detected: true when .openclaw/ directory exists in projectDir', async () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, '.openclaw'));

    const result = await detectTool('openclaw', dir);
    expect(result.tool).toBe('openclaw');
    expect(result.detected).toBe(true);
  });

  test('returns detected: false when .openclaw/ does not exist', async () => {
    const dir = tempDir();

    const result = await detectTool('openclaw', dir);
    expect(result.tool).toBe('openclaw');
    expect(result.detected).toBe(false);
  });
});
