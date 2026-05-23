import { describe, expect, test } from 'bun:test';
import { formatStatus } from '../status';
import type { DetectionResult } from '../detect';
import type { ToolName } from '../types';

const ALL_TOOLS: ToolName[] = ['cursor', 'codex', 'opencode', 'hermes', 'openclaw', 'pi'];

function makeResults(overrides: Partial<Record<ToolName, Partial<DetectionResult>>> = {}): DetectionResult[] {
  return ALL_TOOLS.map((tool) => ({
    tool,
    detected: false,
    configured: false,
    ...overrides[tool],
  }));
}

describe('formatStatus', () => {
  test('returns a multi-line string', () => {
    const results = makeResults();
    const output = formatStatus(results);
    expect(typeof output).toBe('string');
    const lines = output.split('\n');
    expect(lines.length).toBeGreaterThan(1);
  });

  test('contains one row per tool', () => {
    const results = makeResults();
    const output = formatStatus(results);
    for (const tool of ALL_TOOLS) {
      expect(output.toLowerCase()).toContain(tool);
    }
  });

  test('shows header line', () => {
    const results = makeResults();
    const output = formatStatus(results);
    expect(output).toContain('Copyskills Integration Status');
  });

  test('shows "detected" label when tool is detected', () => {
    const results = makeResults({ cursor: { detected: true, configured: false } });
    const output = formatStatus(results);
    expect(output).toContain('detected');
  });

  test('shows "not found" when tool is not detected', () => {
    const results = makeResults();
    const output = formatStatus(results);
    expect(output).toContain('not found');
  });

  test('shows "configured" when tool is configured', () => {
    const results = makeResults({ cursor: { detected: true, configured: true } });
    const output = formatStatus(results);
    expect(output).toContain('configured');
  });

  test('shows "not configured" when detected but not configured', () => {
    const results = makeResults({ codex: { detected: true, configured: false } });
    const output = formatStatus(results);
    expect(output).toContain('not configured');
  });

  test('shows details when present', () => {
    const results = makeResults({
      cursor: { detected: true, configured: true, details: 'MCP + 8 rules' },
    });
    const output = formatStatus(results);
    expect(output).toContain('MCP + 8 rules');
  });
});
