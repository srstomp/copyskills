import { describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { detectAll, detectTool } from '../detect';

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'copydoc-detect-test-'));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('detectAll', () => {
  test('returns DetectionResult for all six tools', async () => {
    const dir = makeTempDir();
    try {
      const results = await detectAll(dir);
      expect(results).toHaveLength(6);
      const names = results.map((r) => r.tool);
      expect(names).toContain('cursor');
      expect(names).toContain('codex');
      expect(names).toContain('opencode');
      expect(names).toContain('hermes');
      expect(names).toContain('openclaw');
      expect(names).toContain('pi');
    } finally {
      cleanup(dir);
    }
  });

  test('each result has tool, detected, and configured fields', async () => {
    const dir = makeTempDir();
    try {
      const results = await detectAll(dir);
      for (const r of results) {
        expect(typeof r.tool).toBe('string');
        expect(typeof r.detected).toBe('boolean');
        expect(typeof r.configured).toBe('boolean');
      }
    } finally {
      cleanup(dir);
    }
  });
});

describe('detectTool - cursor', () => {
  test('cursor detected: true when .cursor/ directory exists', async () => {
    const dir = makeTempDir();
    try {
      fs.mkdirSync(path.join(dir, '.cursor'));
      const result = await detectTool('cursor', dir);
      expect(result.tool).toBe('cursor');
      expect(result.detected).toBe(true);
    } finally {
      cleanup(dir);
    }
  });

  test('cursor detected: false when .cursor/ does not exist', async () => {
    const dir = makeTempDir();
    try {
      const result = await detectTool('cursor', dir);
      expect(result.detected).toBe(false);
    } finally {
      cleanup(dir);
    }
  });
});

describe('detectTool - codex', () => {
  test('codex detected: true when .codex/ directory exists in project dir', async () => {
    const dir = makeTempDir();
    try {
      fs.mkdirSync(path.join(dir, '.codex'));
      const result = await detectTool('codex', dir);
      expect(result.tool).toBe('codex');
      expect(result.detected).toBe(true);
    } finally {
      cleanup(dir);
    }
  });

  test('codex detected: false when neither .codex/ nor ~/.codex/ exists', async () => {
    const dir = makeTempDir();
    // We cannot guarantee ~/.codex does not exist on the host, so we only
    // verify the type and shape of the result here.
    try {
      const result = await detectTool('codex', dir);
      expect(result.tool).toBe('codex');
      expect(typeof result.detected).toBe('boolean');
    } finally {
      cleanup(dir);
    }
  });
});

describe('detectTool - stub tools', () => {
  test('opencode returns detected: false (stub)', async () => {
    const dir = makeTempDir();
    try {
      const result = await detectTool('opencode', dir);
      expect(result.tool).toBe('opencode');
      expect(result.detected).toBe(false);
    } finally {
      cleanup(dir);
    }
  });

  test('hermes returns detected: false (stub)', async () => {
    const dir = makeTempDir();
    try {
      const result = await detectTool('hermes', dir);
      expect(result.detected).toBe(false);
    } finally {
      cleanup(dir);
    }
  });

  test('openclaw returns detected: false (stub)', async () => {
    const dir = makeTempDir();
    try {
      const result = await detectTool('openclaw', dir);
      expect(result.detected).toBe(false);
    } finally {
      cleanup(dir);
    }
  });

  test('pi detected: true when .pi/ directory exists in project dir', async () => {
    const dir = makeTempDir();
    try {
      fs.mkdirSync(path.join(dir, '.pi'));
      const result = await detectTool('pi', dir);
      expect(result.tool).toBe('pi');
      expect(result.detected).toBe(true);
    } finally {
      cleanup(dir);
    }
  });

  test('pi detected: false when .pi/ does not exist in project dir (home dir may vary)', async () => {
    const dir = makeTempDir();
    // We cannot guarantee ~/.pi does not exist on the host, so we only
    // verify the type and shape of the result here.
    try {
      const result = await detectTool('pi', dir);
      expect(result.tool).toBe('pi');
      expect(typeof result.detected).toBe('boolean');
    } finally {
      cleanup(dir);
    }
  });
});
