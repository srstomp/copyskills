import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { opencodeInstaller } from '../tools/opencode';
import { detectTool } from '../detect';

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-opencode-test-'));
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

// -------------------------------------------------------------------
// installer name
// -------------------------------------------------------------------

describe('opencodeInstaller.name', () => {
  test('name is opencode', () => {
    expect(opencodeInstaller.name).toBe('opencode');
  });
});

// -------------------------------------------------------------------
// install
// -------------------------------------------------------------------

describe('opencodeInstaller.install - creates .opencode.json when file does not exist', () => {
  test('creates .opencode.json with mcpServers.copydoc entry', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await opencodeInstaller.install(makeContext(dir, skillsDir));

    const configPath = path.join(dir, '.opencode.json');
    expect(fs.existsSync(configPath)).toBe(true);

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.mcpServers).toBeDefined();
    expect(parsed.mcpServers.copydoc).toBeDefined();
    expect(parsed.mcpServers.copydoc.command).toBe('npx');
    expect(parsed.mcpServers.copydoc.args).toEqual(['@copydoc/mcp']);
  });

  test('returns InstallResult with tool=opencode and non-empty actions', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    const result = await opencodeInstaller.install(makeContext(dir, skillsDir));

    expect(result.tool).toBe('opencode');
    expect(Array.isArray(result.actions)).toBe(true);
    expect(result.actions.length).toBeGreaterThan(0);
  });
});

describe('opencodeInstaller.install - merges into existing .opencode.json', () => {
  test('preserves other top-level keys when merging copydoc entry', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const configPath = path.join(dir, '.opencode.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify({ theme: 'dark', keybindings: { save: 'ctrl+s' } }, null, 2),
    );

    await opencodeInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.theme).toBe('dark');
    expect(parsed.keybindings).toEqual({ save: 'ctrl+s' });
    expect(parsed.mcpServers.copydoc).toBeDefined();
  });

  test('preserves other mcpServers entries when merging copydoc', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const configPath = path.join(dir, '.opencode.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          mcpServers: {
            other: { command: 'other-cmd', args: [] },
          },
        },
        null,
        2,
      ),
    );

    await opencodeInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.mcpServers.other).toEqual({ command: 'other-cmd', args: [] });
    expect(parsed.mcpServers.copydoc).toBeDefined();
  });

  test('adds mcpServers key when existing file has none', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const configPath = path.join(dir, '.opencode.json');
    fs.writeFileSync(configPath, JSON.stringify({ theme: 'light' }, null, 2));

    await opencodeInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.mcpServers).toBeDefined();
    expect(parsed.mcpServers.copydoc.command).toBe('npx');
  });
});

describe('opencodeInstaller.install - idempotent', () => {
  test('running install twice does not duplicate the copydoc entry', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();

    await opencodeInstaller.install(makeContext(dir, skillsDir));
    await opencodeInstaller.install(makeContext(dir, skillsDir));

    const configPath = path.join(dir, '.opencode.json');
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    // copydoc should appear exactly once as an object, not be nested weirdly
    expect(typeof parsed.mcpServers.copydoc).toBe('object');
    expect(Array.isArray(parsed.mcpServers.copydoc)).toBe(false);
  });
});

describe('opencodeInstaller.install - graceful handling of unexpected structure', () => {
  test('treats non-object mcpServers value as missing and replaces it', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const configPath = path.join(dir, '.opencode.json');
    // Intentionally broken structure: mcpServers is a string, not an object
    fs.writeFileSync(configPath, JSON.stringify({ mcpServers: 'corrupt' }, null, 2));

    // Should not throw
    await opencodeInstaller.install(makeContext(dir, skillsDir));

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.mcpServers.copydoc).toBeDefined();
  });
});

// -------------------------------------------------------------------
// uninstall
// -------------------------------------------------------------------

describe('opencodeInstaller.uninstall', () => {
  test('removes copydoc key from mcpServers', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await opencodeInstaller.install(makeContext(dir, skillsDir));

    await opencodeInstaller.uninstall({ projectDir: dir, global: false });

    const configPath = path.join(dir, '.opencode.json');
    // File may or may not exist depending on whether it became empty
    if (fs.existsSync(configPath)) {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(parsed.mcpServers?.copydoc).toBeUndefined();
    }
  });

  test('deletes .opencode.json when copydoc was the only content', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await opencodeInstaller.install(makeContext(dir, skillsDir));

    await opencodeInstaller.uninstall({ projectDir: dir, global: false });

    const configPath = path.join(dir, '.opencode.json');
    expect(fs.existsSync(configPath)).toBe(false);
  });

  test('preserves other top-level keys after removing copydoc', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    const configPath = path.join(dir, '.opencode.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          theme: 'dark',
          mcpServers: {
            other: { command: 'other-cmd', args: [] },
          },
        },
        null,
        2,
      ),
    );
    await opencodeInstaller.install(makeContext(dir, skillsDir));

    await opencodeInstaller.uninstall({ projectDir: dir, global: false });

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.theme).toBe('dark');
    expect(parsed.mcpServers.other).toEqual({ command: 'other-cmd', args: [] });
    expect(parsed.mcpServers.copydoc).toBeUndefined();
  });

  test('does not throw when .opencode.json does not exist', async () => {
    const dir = tempDir();
    await expect(
      opencodeInstaller.uninstall({ projectDir: dir, global: false }),
    ).resolves.toBeUndefined();
  });
});

// -------------------------------------------------------------------
// isConfigured
// -------------------------------------------------------------------

describe('opencodeInstaller.isConfigured', () => {
  test('returns true when .opencode.json exists and contains mcpServers.copydoc', async () => {
    const dir = tempDir();
    const skillsDir = tempDir();
    await opencodeInstaller.install(makeContext(dir, skillsDir));

    const result = await opencodeInstaller.isConfigured(dir);
    expect(result).toBe(true);
  });

  test('returns false when .opencode.json does not exist', async () => {
    const dir = tempDir();
    const result = await opencodeInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false when .opencode.json exists but has no mcpServers.copydoc', async () => {
    const dir = tempDir();
    const configPath = path.join(dir, '.opencode.json');
    fs.writeFileSync(configPath, JSON.stringify({ theme: 'dark' }, null, 2));

    const result = await opencodeInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false when mcpServers exists but copydoc key is missing', async () => {
    const dir = tempDir();
    const configPath = path.join(dir, '.opencode.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify({ mcpServers: { other: { command: 'other', args: [] } } }, null, 2),
    );

    const result = await opencodeInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });
});

// -------------------------------------------------------------------
// detection
// -------------------------------------------------------------------

describe('detectTool - opencode', () => {
  test('returns detected: true when .opencode.json exists in projectDir', async () => {
    const dir = tempDir();
    fs.writeFileSync(path.join(dir, '.opencode.json'), JSON.stringify({}));

    const result = await detectTool('opencode', dir);
    expect(result.tool).toBe('opencode');
    expect(result.detected).toBe(true);
  });

  test('returns detected: false when .opencode.json does not exist', async () => {
    const dir = tempDir();

    const result = await detectTool('opencode', dir);
    expect(result.tool).toBe('opencode');
    expect(result.detected).toBe(false);
  });
});
