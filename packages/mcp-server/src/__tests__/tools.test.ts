import { describe, expect, test } from 'bun:test';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SkillLoader } from '@copydoc/core';
import { registerTools } from '../tools';

function makeServer(): McpServer {
  const server = new McpServer({ name: 'test-server', version: '0.1.0' }, { capabilities: { tools: {} } });
  const loader: SkillLoader = {
    listSkills: () => [], getSkill: () => { throw new Error('unused'); },
    getReference: () => '', listReferences: () => [],
    resolveReference: (path) => path.endsWith('locales/nl.md') ? '# {lint: warn}\n- moeiteloos (Wees concreet)' : '# {lint: error}\n- leverage',
  };
  registerTools(server, loader);
  return server;
}
async function request(method: string, params: unknown) {
  const server = makeServer();
  const handlers = (server.server as unknown as { _requestHandlers: Map<string, (req: unknown, extra: unknown) => Promise<unknown>> })._requestHandlers;
  return await handlers.get(method)!({ method, params }, {});
}
async function callTool(name: string, args: Record<string, unknown>) {
  return await request('tools/call', { name, arguments: args }) as { content: Array<{ type: string; text: string }>; isError?: boolean };
}
describe('MCP tools', () => {
  test('exposes only select_framework and lint_copy, with lint input schema', async () => {
    const result = await request('tools/list', {}) as { tools: Array<{ name: string; inputSchema: { properties: Record<string, unknown> } }> };
    expect(result.tools.map(t => t.name)).toEqual(['select_framework', 'lint_copy']);
    expect(Object.keys(result.tools[1].inputSchema.properties).sort()).toEqual(['text', 'items', 'locale', 'kind', 'min', 'max', 'facts', 'avoid'].sort());
  });
  test('select_framework routes cold email to PAS', async () => {
    const result = await callTool('select_framework', { copy_type: 'cold outreach email', goal: 'book a demo' });
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.framework).toBe('PAS');
    expect(parsed.path).toBe('persuasion-frameworks/references/pas.md');
    expect(parsed.rationale.length).toBeGreaterThan(0);
  });
  test('lint_copy returns the LintResult as JSON with locale, facts and avoid applied', async () => {
    const result = await callTool('lint_copy', { text: 'Moeiteloos 23 aanbod', locale: 'nl-BE', facts: '15', avoid: ['aanbod'] });
    expect(result.isError).toBeFalsy();
    expect(JSON.parse(result.content[0].text)).toEqual({ errors: 2, warnings: 1, issues: [
      { rule: 'phrase', severity: 'warn', message: 'Banned pattern: moeiteloos', line: 1, suggestion: '(Wees concreet)' },
      { rule: 'phrase', severity: 'error', message: 'Banned pattern: aanbod', line: 1 },
      { rule: 'number', severity: 'error', message: 'Number 23 is not in the fact sheet' },
    ] });
  });
  test('lint_copy accepts items and passes kind and budget overrides', async () => {
    const result = await callTool('lint_copy', { items: ['abcd', 'efghij'], kind: 'title', min: 5, max: 5, locale: 'fr' });
    expect(result.isError).toBeFalsy();
    expect(JSON.parse(result.content[0].text)).toEqual({ errors: 2, warnings: 0, issues: [
      { rule: 'length', severity: 'error', message: 'title has 4 characters', item: 0 },
      { rule: 'length', severity: 'error', message: 'title has 6 characters', item: 1 },
    ] });
  });
  test('lint_copy applies batch repetition rules', async () => {
    const result = await callTool('lint_copy', { items: ['one two three four', 'one two three four', 'one two three four'] });
    expect(JSON.parse(result.content[0].text)).toEqual({ errors: 2, warnings: 0, issues: [
      { rule: 'skeleton', severity: 'error', message: 'Sequence "one two three four" occurs in items 0, 1, 2' },
      { rule: 'opener', severity: 'error', message: 'Opener "one two three" occurs in items 0, 1, 2' },
    ] });
  });
  test('lint_copy accepts empty text and returns a clean result', async () => {
    const result = await callTool('lint_copy', { text: '' });
    expect(JSON.parse(result.content[0].text)).toEqual({ issues: [], errors: 0, warnings: 0 });
  });
  test('lint_copy rejects ambiguous or missing inputs and invalid options', async () => {
    for (const args of [{}, { text: 'x', items: ['x'] }, { text: 'x', kind: 'email' }, { items: [1] }, { text: 'x', max: -1 }]) {
      const result = await callTool('lint_copy', args);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toMatch(/text|kind|items|max/);
    }
  });
});
