import { describe, expect, test } from 'bun:test';
import { parseArgs } from '../cli';

describe('parseArgs', () => {
  test('parses install command', () => {
    const result = parseArgs(['bun', 'cli.ts', 'install']);
    expect(result.command).toBe('install');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({});
  });

  test('parses uninstall command', () => {
    const result = parseArgs(['bun', 'cli.ts', 'uninstall']);
    expect(result.command).toBe('uninstall');
  });

  test('parses status command', () => {
    const result = parseArgs(['bun', 'cli.ts', 'status']);
    expect(result.command).toBe('status');
  });

  test('parses help command', () => {
    const result = parseArgs(['bun', 'cli.ts', 'help']);
    expect(result.command).toBe('help');
  });

  test('parses --tool flag with value', () => {
    const result = parseArgs(['bun', 'cli.ts', 'install', '--tool', 'cursor']);
    expect(result.command).toBe('install');
    expect(result.flags['tool']).toBe('cursor');
  });

  test('parses --global flag as boolean', () => {
    const result = parseArgs(['bun', 'cli.ts', 'install', '--global']);
    expect(result.flags['global']).toBe(true);
  });

  test('parses --copy flag as boolean', () => {
    const result = parseArgs(['bun', 'cli.ts', 'install', '--copy']);
    expect(result.flags['copy']).toBe(true);
  });

  test('parses combined flags', () => {
    const result = parseArgs(['bun', 'cli.ts', 'install', '--tool', 'codex', '--global', '--copy']);
    expect(result.command).toBe('install');
    expect(result.flags['tool']).toBe('codex');
    expect(result.flags['global']).toBe(true);
    expect(result.flags['copy']).toBe(true);
  });

  test('returns empty command when no args given', () => {
    const result = parseArgs(['bun', 'cli.ts']);
    expect(result.command).toBe('');
  });

  test('extra positional args are stored in args array', () => {
    const result = parseArgs(['bun', 'cli.ts', 'install', 'extra1', 'extra2']);
    expect(result.args).toEqual(['extra1', 'extra2']);
  });
});
