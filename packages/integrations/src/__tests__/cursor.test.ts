import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { cursorInstaller } from '../tools/cursor';

const REAL_SKILLS_DIR = path.resolve(__dirname, '../../../..', 'skills');

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-cursor-test-'));
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

describe('cursorInstaller.name', () => {
  test('name is cursor', () => {
    expect(cursorInstaller.name).toBe('cursor');
  });
});

// -------------------------------------------------------------------
// install - creates .cursor/mcp.json when file does not exist
// -------------------------------------------------------------------

describe('cursorInstaller.install - creates .cursor/mcp.json when file does not exist', () => {
  test('creates .cursor/mcp.json with mcpServers.copydoc entry', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const configPath = path.join(dir, '.cursor', 'mcp.json');
    expect(fs.existsSync(configPath)).toBe(true);

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.mcpServers).toBeDefined();
    expect(parsed.mcpServers.copydoc).toBeDefined();
    expect(parsed.mcpServers.copydoc.command).toBe('npx');
    expect(parsed.mcpServers.copydoc.args).toEqual(['--yes', '@copydoc/mcp@0.1.1']);
  });

  test('creates .cursor/ directory if it does not exist', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    expect(fs.existsSync(path.join(dir, '.cursor'))).toBe(true);
  });

  test('returns InstallResult with tool=cursor and non-empty actions', async () => {
    const dir = tempDir();

    const result = await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    expect(result.tool).toBe('cursor');
    expect(Array.isArray(result.actions)).toBe(true);
    expect(result.actions.length).toBeGreaterThan(0);
  });

  test('action message mentions .cursor/mcp.json', async () => {
    const dir = tempDir();

    const result = await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const hasMcpAction = result.actions.some((a) => a.includes('.cursor/mcp.json'));
    expect(hasMcpAction).toBe(true);
  });
});

// -------------------------------------------------------------------
// install - merges into existing .cursor/mcp.json
// -------------------------------------------------------------------

describe('cursorInstaller.install - merges into existing .cursor/mcp.json', () => {
  test('preserves other mcpServers entries when merging copydoc', async () => {
    const dir = tempDir();
    const cursorDir = path.join(dir, '.cursor');
    fs.mkdirSync(cursorDir, { recursive: true });
    const configPath = path.join(cursorDir, 'mcp.json');
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

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.mcpServers.other).toEqual({ command: 'other-cmd', args: [] });
    expect(parsed.mcpServers.copydoc).toBeDefined();
    expect(parsed.mcpServers.copydoc.command).toBe('npx');
  });

  test('adds mcpServers key when existing file has none', async () => {
    const dir = tempDir();
    const cursorDir = path.join(dir, '.cursor');
    fs.mkdirSync(cursorDir, { recursive: true });
    const configPath = path.join(cursorDir, 'mcp.json');
    fs.writeFileSync(configPath, JSON.stringify({ someOtherKey: true }, null, 2));

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.mcpServers).toBeDefined();
    expect(parsed.mcpServers.copydoc.command).toBe('npx');
    expect(parsed.someOtherKey).toBe(true);
  });
});

// -------------------------------------------------------------------
// install - generates .mdc rule files
// -------------------------------------------------------------------

describe('cursorInstaller.install - generates .mdc rule files in .cursor/rules/', () => {
  test('creates .cursor/rules/ directory and writes copydoc-*.mdc files', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const rulesDir = path.join(dir, '.cursor', 'rules');
    expect(fs.existsSync(rulesDir)).toBe(true);

    const files = fs.readdirSync(rulesDir).filter((f) => f.startsWith('copydoc-') && f.endsWith('.mdc'));
    expect(files.length).toBeGreaterThan(0);
  });

  test('generated .mdc files contain valid frontmatter', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const rulesDir = path.join(dir, '.cursor', 'rules');
    const mdcFiles = fs.readdirSync(rulesDir).filter((f) => f.startsWith('copydoc-') && f.endsWith('.mdc'));
    expect(mdcFiles.length).toBeGreaterThan(0);

    const firstFile = fs.readFileSync(path.join(rulesDir, mdcFiles[0]), 'utf8');
    expect(firstFile).toContain('---');
    expect(firstFile).toContain('alwaysApply: false');
  });

  test('action message mentions generated .mdc rules', async () => {
    const dir = tempDir();

    const result = await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const hasMdcAction = result.actions.some((a) => a.toLowerCase().includes('mdc') || a.toLowerCase().includes('rules'));
    expect(hasMdcAction).toBe(true);
  });
});

// -------------------------------------------------------------------
// install - idempotent
// -------------------------------------------------------------------

describe('cursorInstaller.install - idempotent', () => {
  test('running install twice does not duplicate the copydoc entry in mcp.json', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));
    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const configPath = path.join(dir, '.cursor', 'mcp.json');
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(typeof parsed.mcpServers.copydoc).toBe('object');
    expect(Array.isArray(parsed.mcpServers.copydoc)).toBe(false);
  });

  test('running install twice with real skillsDir does not throw', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));
    await expect(cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR))).resolves.toBeDefined();
  });
});

// -------------------------------------------------------------------
// uninstall
// -------------------------------------------------------------------

describe('cursorInstaller.uninstall', () => {
  test('removes copydoc key from mcpServers in mcp.json', async () => {
    const dir = tempDir();
    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    await cursorInstaller.uninstall({ projectDir: dir, global: false });

    const configPath = path.join(dir, '.cursor', 'mcp.json');
    if (fs.existsSync(configPath)) {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(parsed.mcpServers?.copydoc).toBeUndefined();
    }
  });

  test('deletes .cursor/mcp.json when copydoc was the only content', async () => {
    const dir = tempDir();
    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    await cursorInstaller.uninstall({ projectDir: dir, global: false });

    const configPath = path.join(dir, '.cursor', 'mcp.json');
    expect(fs.existsSync(configPath)).toBe(false);
  });

  test('preserves other MCP server entries after removing copydoc', async () => {
    const dir = tempDir();
    const cursorDir = path.join(dir, '.cursor');
    fs.mkdirSync(cursorDir, { recursive: true });
    const configPath = path.join(cursorDir, 'mcp.json');
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
    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    await cursorInstaller.uninstall({ projectDir: dir, global: false });

    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(parsed.mcpServers.other).toEqual({ command: 'other-cmd', args: [] });
    expect(parsed.mcpServers.copydoc).toBeUndefined();
  });

  test('deletes copydoc-*.mdc files from .cursor/rules/', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));
    await cursorInstaller.uninstall({ projectDir: dir, global: false });

    const rulesDir = path.join(dir, '.cursor', 'rules');
    if (fs.existsSync(rulesDir)) {
      const remaining = fs.readdirSync(rulesDir).filter((f) => f.startsWith('copydoc-'));
      expect(remaining.length).toBe(0);
    }
  });

  test('removes .cursor/rules/ when empty after deleting copydoc-*.mdc files', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));
    await cursorInstaller.uninstall({ projectDir: dir, global: false });

    const rulesDir = path.join(dir, '.cursor', 'rules');
    expect(fs.existsSync(rulesDir)).toBe(false);
  });

  test('does not throw when .cursor/mcp.json does not exist', async () => {
    const dir = tempDir();
    await expect(
      cursorInstaller.uninstall({ projectDir: dir, global: false }),
    ).resolves.toBeUndefined();
  });

  test('does not remove .cursor/rules/ when other .mdc files remain', async () => {
    const dir = tempDir();

    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    // Add a non-copydoc .mdc file to the rules dir
    const rulesDir = path.join(dir, '.cursor', 'rules');
    fs.writeFileSync(path.join(rulesDir, 'other-rule.mdc'), '# Other rule\n');

    await cursorInstaller.uninstall({ projectDir: dir, global: false });

    expect(fs.existsSync(rulesDir)).toBe(true);
    expect(fs.existsSync(path.join(rulesDir, 'other-rule.mdc'))).toBe(true);
  });
});

// -------------------------------------------------------------------
// isConfigured
// -------------------------------------------------------------------

describe('cursorInstaller.isConfigured', () => {
  test('returns true when .cursor/mcp.json exists and contains mcpServers.copydoc', async () => {
    const dir = tempDir();
    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));

    const result = await cursorInstaller.isConfigured(dir);
    expect(result).toBe(true);
  });

  test('returns false when .cursor/mcp.json does not exist', async () => {
    const dir = tempDir();
    const result = await cursorInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false when .cursor/mcp.json exists but has no mcpServers.copydoc', async () => {
    const dir = tempDir();
    const cursorDir = path.join(dir, '.cursor');
    fs.mkdirSync(cursorDir, { recursive: true });
    fs.writeFileSync(
      path.join(cursorDir, 'mcp.json'),
      JSON.stringify({ mcpServers: { other: { command: 'x', args: [] } } }, null, 2),
    );

    const result = await cursorInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false when .cursor/mcp.json has no mcpServers key', async () => {
    const dir = tempDir();
    const cursorDir = path.join(dir, '.cursor');
    fs.mkdirSync(cursorDir, { recursive: true });
    fs.writeFileSync(path.join(cursorDir, 'mcp.json'), JSON.stringify({ someKey: true }, null, 2));

    const result = await cursorInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });

  test('returns false after uninstall', async () => {
    const dir = tempDir();
    await cursorInstaller.install(makeContext(dir, REAL_SKILLS_DIR));
    await cursorInstaller.uninstall({ projectDir: dir, global: false });

    const result = await cursorInstaller.isConfigured(dir);
    expect(result).toBe(false);
  });
});
