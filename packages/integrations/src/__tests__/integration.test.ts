import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { installAll, installTool } from '../install';
import { uninstallAll } from '../uninstall';
import { getStatusForDir, formatStatus } from '../status';

// Resolve real skills dir from the monorepo root
const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-integration-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// -------------------------------------------------------------------
// Scenario 1: Multi-tool auto-detect install
// -------------------------------------------------------------------

describe('Multi-tool auto-detect install (cursor + codex)', () => {
  test('installAll configures .cursor/mcp.json with mcpServers.copydoc', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const mcpPath = path.join(tmpDir, '.cursor', 'mcp.json');
    expect(fs.existsSync(mcpPath)).toBe(true);

    const parsed = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
    expect(parsed.mcpServers).toBeDefined();
    expect(parsed.mcpServers.copydoc).toBeDefined();
  });

  test('installAll creates 8 copydoc-*.mdc files in .cursor/rules/', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    expect(fs.existsSync(rulesDir)).toBe(true);

    const mdcFiles = fs.readdirSync(rulesDir).filter(
      (f) => f.startsWith('copydoc-') && f.endsWith('.mdc'),
    );
    expect(mdcFiles.length).toBe(8);
  });

  test('installAll creates .codex/config.toml containing [mcp_servers.copydoc]', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const tomlPath = path.join(tmpDir, '.codex', 'config.toml');
    expect(fs.existsSync(tomlPath)).toBe(true);

    const content = fs.readFileSync(tomlPath, 'utf8');
    expect(content).toContain('[mcp_servers.copydoc]');
  });

  test('installAll creates .agents/skills/copy-workflow symlink', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const linkPath = path.join(tmpDir, '.agents', 'skills', 'copy-workflow');
    const stat = fs.lstatSync(linkPath);
    expect(stat.isSymbolicLink()).toBe(true);
  });
});

// -------------------------------------------------------------------
// Scenario 2: Single-tool install
// -------------------------------------------------------------------

describe('Single-tool install (codex only)', () => {
  test('installTool codex configures .codex/config.toml', async () => {
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installTool('codex', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const tomlPath = path.join(tmpDir, '.codex', 'config.toml');
    expect(fs.existsSync(tomlPath)).toBe(true);

    const content = fs.readFileSync(tomlPath, 'utf8');
    expect(content).toContain('[mcp_servers.copydoc]');
  });

  test('installTool codex does not create .cursor/ artifacts', async () => {
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installTool('codex', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    expect(fs.existsSync(path.join(tmpDir, '.cursor', 'mcp.json'))).toBe(false);
    expect(fs.existsSync(path.join(tmpDir, '.cursor', 'rules'))).toBe(false);
  });

  test('installTool codex creates .agents/skills/copy-workflow symlink', async () => {
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installTool('codex', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const linkPath = path.join(tmpDir, '.agents', 'skills', 'copy-workflow');
    const stat = fs.lstatSync(linkPath);
    expect(stat.isSymbolicLink()).toBe(true);
  });
});

// -------------------------------------------------------------------
// Scenario 3: Status output
// -------------------------------------------------------------------

describe('Status output after multi-tool install', () => {
  test('getStatusForDir shows cursor as detected after install', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const results = await getStatusForDir(tmpDir);
    const cursorResult = results.find((r) => r.tool === 'cursor');
    expect(cursorResult).toBeDefined();
    expect(cursorResult!.detected).toBe(true);
  });

  test('getStatusForDir shows codex as detected after install', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const results = await getStatusForDir(tmpDir);
    const codexResult = results.find((r) => r.tool === 'codex');
    expect(codexResult).toBeDefined();
    expect(codexResult!.detected).toBe(true);
    expect(codexResult!.configured).toBe(true);
  });

  test('formatStatus contains "detected" for cursor and codex', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const results = await getStatusForDir(tmpDir);
    const output = formatStatus(results);

    // Both cursor and codex lines show "detected"
    expect(output).toContain('Cursor');
    expect(output).toContain('Codex');
    expect(output).toContain('detected');
  });

  test('formatStatus shows "not found" for opencode (no local or global marker)', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const results = await getStatusForDir(tmpDir);
    const output = formatStatus(results);

    // opencode has no global fallback, only checks projectDir/.opencode.json
    expect(output).toContain('not found');

    const opencodeResult = results.find((r) => r.tool === 'opencode');
    expect(opencodeResult!.detected).toBe(false);
  });

  test('formatStatus output contains header line', async () => {
    const results = await getStatusForDir(tmpDir);
    const output = formatStatus(results);
    expect(output).toContain('Copyskills Integration Status');
  });

  test('formatStatus contains all six tool names', async () => {
    const results = await getStatusForDir(tmpDir);
    const output = formatStatus(results);
    for (const name of ['Cursor', 'Codex', 'OpenCode', 'Hermes', 'OpenClaw', 'Pi']) {
      expect(output).toContain(name);
    }
  });
});

// -------------------------------------------------------------------
// Scenario 4: Uninstall all
// -------------------------------------------------------------------

describe('Uninstall all after multi-tool install', () => {
  test('uninstallAll removes mcpServers.copydoc from .cursor/mcp.json or deletes the file', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });
    await uninstallAll({ projectDir: tmpDir, global: false });

    const mcpPath = path.join(tmpDir, '.cursor', 'mcp.json');
    if (fs.existsSync(mcpPath)) {
      const parsed = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
      expect(parsed.mcpServers?.copydoc).toBeUndefined();
    }
    // File may or may not exist depending on whether copydoc was the only entry
  });

  test('uninstallAll removes [mcp_servers.copydoc] section from .codex/config.toml', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });
    await uninstallAll({ projectDir: tmpDir, global: false });

    const tomlPath = path.join(tmpDir, '.codex', 'config.toml');
    if (fs.existsSync(tomlPath)) {
      const content = fs.readFileSync(tomlPath, 'utf8');
      expect(content).not.toContain('[mcp_servers.copydoc]');
    }
  });

  test('uninstallAll removes .agents/skills/copy-workflow symlink', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });
    await uninstallAll({ projectDir: tmpDir, global: false });

    const linkPath = path.join(tmpDir, '.agents', 'skills', 'copy-workflow');
    let exists = false;
    try {
      fs.lstatSync(linkPath);
      exists = true;
    } catch {
      exists = false;
    }
    expect(exists).toBe(false);
  });

  test('uninstallAll removes copydoc-*.mdc files from .cursor/rules/', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });
    await uninstallAll({ projectDir: tmpDir, global: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    if (fs.existsSync(rulesDir)) {
      const remaining = fs.readdirSync(rulesDir).filter(
        (f) => f.startsWith('copydoc-') && f.endsWith('.mdc'),
      );
      expect(remaining.length).toBe(0);
    }
  });

  test('uninstallAll deletes .cursor/mcp.json entirely when copydoc was the only entry', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await installAll({ projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });
    await uninstallAll({ projectDir: tmpDir, global: false });

    // When copydoc was the only mcpServer entry, the file should be deleted
    const mcpPath = path.join(tmpDir, '.cursor', 'mcp.json');
    expect(fs.existsSync(mcpPath)).toBe(false);
  });
});

// -------------------------------------------------------------------
// Scenario 5: Idempotent install
// -------------------------------------------------------------------

describe('Idempotent install', () => {
  test('running installAll twice does not throw', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    const ctx = { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false };
    await installAll(ctx);
    await expect(installAll(ctx)).resolves.toBeDefined();
  });

  test('running installAll twice does not duplicate mcpServers.copydoc in .cursor/mcp.json', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    const ctx = { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false };
    await installAll(ctx);
    await installAll(ctx);

    const mcpPath = path.join(tmpDir, '.cursor', 'mcp.json');
    const parsed = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
    // copydoc should appear exactly once as an object, not an array
    expect(typeof parsed.mcpServers.copydoc).toBe('object');
    expect(Array.isArray(parsed.mcpServers.copydoc)).toBe(false);
  });

  test('running installAll twice does not duplicate [mcp_servers.copydoc] in .codex/config.toml', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    const ctx = { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false };
    await installAll(ctx);
    await installAll(ctx);

    const tomlPath = path.join(tmpDir, '.codex', 'config.toml');
    const content = fs.readFileSync(tomlPath, 'utf8');
    const occurrences = (content.match(/\[mcp_servers\.copydoc\]/g) ?? []).length;
    expect(occurrences).toBe(1);
  });
});

// -------------------------------------------------------------------
// Scenario 6: Uninstall with nothing installed
// -------------------------------------------------------------------

describe('Uninstall with nothing installed', () => {
  test('uninstallAll on a clean directory with .cursor/ and .codex/ does not throw', async () => {
    fs.mkdirSync(path.join(tmpDir, '.cursor'));
    fs.mkdirSync(path.join(tmpDir, '.codex'));

    await expect(
      uninstallAll({ projectDir: tmpDir, global: false }),
    ).resolves.toBeUndefined();
  });

  test('uninstallAll on a completely empty temp dir does not throw', async () => {
    await expect(
      uninstallAll({ projectDir: tmpDir, global: false }),
    ).resolves.toBeUndefined();
  });
});

// -------------------------------------------------------------------
// Scenario 7: Verify .mdc file content
// -------------------------------------------------------------------

describe('Verify .mdc file content after Cursor install', () => {
  test('.mdc files start with --- frontmatter', async () => {
    await installTool('cursor', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    const mdcFiles = fs.readdirSync(rulesDir).filter(
      (f) => f.startsWith('copydoc-') && f.endsWith('.mdc'),
    );
    expect(mdcFiles.length).toBeGreaterThan(0);

    const firstFile = fs.readFileSync(path.join(rulesDir, mdcFiles[0]), 'utf8');
    expect(firstFile.startsWith('---')).toBe(true);
  });

  test('.mdc files contain description: in frontmatter', async () => {
    await installTool('cursor', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    const mdcFiles = fs.readdirSync(rulesDir).filter(
      (f) => f.startsWith('copydoc-') && f.endsWith('.mdc'),
    );

    const firstFile = fs.readFileSync(path.join(rulesDir, mdcFiles[0]), 'utf8');
    expect(firstFile).toContain('description:');
  });

  test('.mdc files have non-empty body content after the closing --- of frontmatter', async () => {
    await installTool('cursor', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    const mdcFiles = fs.readdirSync(rulesDir).filter(
      (f) => f.startsWith('copydoc-') && f.endsWith('.mdc'),
    );

    const firstFile = fs.readFileSync(path.join(rulesDir, mdcFiles[0]), 'utf8');
    const parts = firstFile.split('---');
    // parts[0] = '' (before first ---), parts[1] = frontmatter, parts[2+] = body
    const body = parts.slice(2).join('---').trim();
    expect(body.length).toBeGreaterThan(50);
  });

  test('.mdc files contain Anti-Slop section', async () => {
    await installTool('cursor', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    const mdcFiles = fs.readdirSync(rulesDir).filter(
      (f) => f.startsWith('copydoc-') && f.endsWith('.mdc'),
    );

    const firstFile = fs.readFileSync(path.join(rulesDir, mdcFiles[0]), 'utf8');
    expect(firstFile).toMatch(/Anti-Slop/i);
  });

  test('.mdc files contain alwaysApply: false in frontmatter', async () => {
    await installTool('cursor', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    const mdcFiles = fs.readdirSync(rulesDir).filter(
      (f) => f.startsWith('copydoc-') && f.endsWith('.mdc'),
    );

    for (const file of mdcFiles) {
      const content = fs.readFileSync(path.join(rulesDir, file), 'utf8');
      expect(content).toContain('alwaysApply: false');
    }
  });

  test('all 8 copydoc-*.mdc files are present (one per Layer 2 domain skill)', async () => {
    await installTool('cursor', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    const mdcFiles = fs.readdirSync(rulesDir).filter(
      (f) => f.startsWith('copydoc-') && f.endsWith('.mdc'),
    );
    expect(mdcFiles.length).toBe(8);
  });

  test('expected domain skill .mdc files are all present', async () => {
    await installTool('cursor', { projectDir: tmpDir, skillsDir: SKILLS_DIR, global: false, copy: false });

    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    const mdcFiles = fs.readdirSync(rulesDir);

    const expectedFiles = [
      'copydoc-email-copy.mdc',
      'copydoc-marketing-copy.mdc',
      'copydoc-ux-copy.mdc',
      'copydoc-editorial-copy.mdc',
      'copydoc-brand-copy.mdc',
      'copydoc-sales-copy.mdc',
      'copydoc-social-copy.mdc',
      'copydoc-conversion-copy.mdc',
    ];

    for (const expected of expectedFiles) {
      expect(mdcFiles).toContain(expected);
    }
  });
});
