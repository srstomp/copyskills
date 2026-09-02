import { describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { installerRegistry, installAll, installTool } from '../install';
import type { ToolName } from '../types';

const ALL_TOOLS: ToolName[] = ['cursor', 'codex', 'opencode', 'hermes', 'openclaw', 'pi'];

const REAL_SKILLS_DIR = path.resolve(__dirname, '../../../..', 'skills');

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-install-test-'));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('installerRegistry', () => {
  test('contains all six tool names', () => {
    for (const tool of ALL_TOOLS) {
      expect(installerRegistry[tool]).toBeDefined();
    }
  });

  test('each registry entry has name, install, uninstall, isConfigured', () => {
    for (const tool of ALL_TOOLS) {
      const installer = installerRegistry[tool];
      expect(installer.name).toBe(tool);
      expect(typeof installer.install).toBe('function');
      expect(typeof installer.uninstall).toBe('function');
      expect(typeof installer.isConfigured).toBe('function');
    }
  });
});

describe('installAll', () => {
  test('calls installer for each detected tool and returns InstallResult[]', async () => {
    const dir = makeTempDir();
    try {
      // Create .cursor/ so cursor is detected
      fs.mkdirSync(path.join(dir, '.cursor'));
      const results = await installAll({
        projectDir: dir,
        skillsDir: REAL_SKILLS_DIR,
        global: false,
        copy: false,
      });
      // Should be an array
      expect(Array.isArray(results)).toBe(true);
      // At least one result for cursor
      const cursorResult = results.find((r) => r.tool === 'cursor');
      expect(cursorResult).toBeDefined();
      expect(cursorResult?.tool).toBe('cursor');
      expect(Array.isArray(cursorResult?.actions)).toBe(true);
    } finally {
      cleanup(dir);
    }
  });

  test('returns empty array when no tools are detected', async () => {
    const dir = makeTempDir();
    try {
      const results = await installAll({
        projectDir: dir,
        skillsDir: dir,
        global: false,
        copy: false,
        homeDir: dir,
      });
      expect(results).toEqual([]);
    } finally {
      cleanup(dir);
    }
  });
});

describe('installTool', () => {
  test('installs cursor and returns InstallResult with tool name', async () => {
    const dir = makeTempDir();
    try {
      const result = await installTool('cursor', {
        projectDir: dir,
        skillsDir: REAL_SKILLS_DIR,
        global: false,
        copy: false,
      });
      expect(result.tool).toBe('cursor');
      expect(Array.isArray(result.actions)).toBe(true);
    } finally {
      cleanup(dir);
    }
  });

  test('throws clear error for invalid tool name', async () => {
    const dir = makeTempDir();
    try {
      await expect(
        installTool('invalid-tool' as ToolName, {
          projectDir: dir,
          skillsDir: dir,
          global: false,
          copy: false,
        }),
      ).rejects.toThrow();
    } finally {
      cleanup(dir);
    }
  });
});
