import { describe, expect, test } from 'bun:test';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createLoader } from '@copydoc/core';
import path from 'path';
import { registerTools } from '../tools';

// Skills dir: from packages/mcp-server/src/__tests__/ up to repo root, then skills/
const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

function makeServer(): McpServer {
  return new McpServer(
    { name: 'test-server', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );
}

// Helper to call a tool via the server's internal request handlers
async function callTool(server: McpServer, name: string, args: Record<string, unknown>) {
  const underlyingServer = server.server;
  const response = await (underlyingServer as unknown as {
    _requestHandlers: Map<string, (req: unknown, extra: unknown) => unknown>;
  })
    ._requestHandlers
    .get('tools/call')?.({ method: 'tools/call', params: { name, arguments: args } }, {});
  return response as {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  };
}

// Helper to list tools
async function listTools(server: McpServer) {
  const underlyingServer = server.server;
  const response = await (underlyingServer as unknown as {
    _requestHandlers: Map<string, (req: unknown, extra: unknown) => unknown>;
  })
    ._requestHandlers
    .get('tools/list')?.({ method: 'tools/list', params: {} }, {});
  return response as { tools: Array<{ name: string; inputSchema: unknown }> };
}

describe('registerTools', () => {
  test('registerTools registers without throwing', () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    expect(() => registerTools(server, loader)).not.toThrow();
  });
});

describe('tools/list returns 3 tools with correct names and input schemas', () => {
  test('tools/list returns 3 tools', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await listTools(server);
    expect(result.tools).toHaveLength(3);
  });

  test('tools/list includes select_framework', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await listTools(server);
    const names = result.tools.map((t) => t.name);
    expect(names).toContain('select_framework');
  });

  test('tools/list includes score_copy', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await listTools(server);
    const names = result.tools.map((t) => t.name);
    expect(names).toContain('score_copy');
  });

  test('tools/list includes check_anti_slop', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await listTools(server);
    const names = result.tools.map((t) => t.name);
    expect(names).toContain('check_anti_slop');
  });
});

describe('select_framework tool', () => {
  test("select_framework('cold outreach email', 'book a demo') returns PAS with rationale", async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'select_framework', {
      copy_type: 'cold outreach email',
      goal: 'book a demo',
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.framework).toBe('PAS');
    expect(typeof parsed.path).toBe('string');
    expect(parsed.path.length).toBeGreaterThan(0);
    expect(typeof parsed.rationale).toBe('string');
    expect(parsed.rationale.length).toBeGreaterThan(0);
  });

  test('select_framework returns framework, path, rationale fields', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'select_framework', {
      copy_type: 'landing page hero',
      goal: 'increase signups',
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(typeof parsed.framework).toBe('string');
    expect(typeof parsed.path).toBe('string');
    expect(typeof parsed.rationale).toBe('string');
  });
});

describe('check_anti_slop tool', () => {
  test('check_anti_slop returns score >= 2 for AI slop text', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'check_anti_slop', {
      text: 'We leverage cutting-edge solutions',
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(typeof parsed.ai_tell_score).toBe('number');
    expect(parsed.ai_tell_score).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(parsed.issues)).toBe(true);
  });

  test('check_anti_slop returns issues with pattern, line, suggestion fields', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'check_anti_slop', {
      text: 'We leverage cutting-edge solutions',
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.issues.length).toBeGreaterThan(0);
    for (const issue of parsed.issues) {
      expect(typeof issue.pattern).toBe('string');
      expect(typeof issue.line).toBe('number');
      // suggestion is optional
    }
  });

  test('check_anti_slop returns score 0 and empty issues for clean text', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'check_anti_slop', {
      text: 'Short clear text.',
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.ai_tell_score).toBe(0);
    expect(parsed.issues).toHaveLength(0);
  });
});

describe('score_copy tool', () => {
  test('score_copy returns ai_tell_score with -1 for LLM-dependent dimensions', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'score_copy', {
      text: 'We leverage cutting-edge solutions to transform your business.',
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);

    // ai_tell_score is computed
    expect(typeof parsed.scores.ai_tell_score).toBe('number');
    expect(parsed.scores.ai_tell_score).toBeGreaterThanOrEqual(0);

    // LLM-dependent dimensions are -1
    expect(parsed.scores.clarity).toBe(-1);
    expect(parsed.scores.specificity).toBe(-1);
    expect(parsed.scores.voice_match).toBe(-1);
    expect(parsed.scores.persuasion).toBe(-1);
    expect(parsed.scores.action).toBe(-1);
    expect(parsed.scores.overall).toBe(-1);
  });

  test('score_copy returns issues array and summary string', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'score_copy', {
      text: 'We leverage cutting-edge solutions to transform your business.',
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(Array.isArray(parsed.issues)).toBe(true);
    expect(typeof parsed.summary).toBe('string');
    expect(parsed.summary).toContain('AI-tell score:');
    expect(parsed.summary).toContain('issues found');
  });

  test('score_copy accepts optional context parameter', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'score_copy', {
      text: 'Short clean copy.',
      context: { audience: 'developers', goal: 'sign up', brand_voice: 'direct' },
    });

    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(typeof parsed.scores.ai_tell_score).toBe('number');
  });
});

describe('Invalid tool inputs return validation errors', () => {
  test('select_framework with missing copy_type returns isError response', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'select_framework', { goal: 'book a demo' });
    // SDK returns isError: true with validation message rather than throwing
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('copy_type');
  });

  test('check_anti_slop with missing text returns isError response', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'check_anti_slop', {});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('text');
  });

  test('score_copy with missing text returns isError response', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerTools(server, loader);

    const result = await callTool(server, 'score_copy', {});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('text');
  });
});
