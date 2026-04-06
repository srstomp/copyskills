import { describe, expect, test } from 'bun:test';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createLoader, createAssembler, selectFramework } from '@copydoc/core';
import path from 'path';
import { registerPrompts } from '../prompts';

// Skills dir: from packages/mcp-server/src/__tests__/ up to repo root, then skills/
const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

function makeServer(): McpServer {
  return new McpServer(
    { name: 'test-server', version: '0.1.0' },
    { capabilities: { prompts: {} } },
  );
}

// Helper to list prompts via the server's internal request handlers
async function listPrompts(server: McpServer) {
  const underlyingServer = server.server;
  const response = await (underlyingServer as unknown as {
    _requestHandlers: Map<string, (req: unknown, extra: unknown) => unknown>;
  })
    ._requestHandlers
    .get('prompts/list')?.({ method: 'prompts/list', params: {} }, {});
  return response as {
    prompts: Array<{
      name: string;
      description?: string;
      arguments?: Array<{ name: string; required?: boolean }>;
    }>;
  };
}

// Helper to get a prompt via the server's internal request handlers
async function getPrompt(server: McpServer, name: string, args: Record<string, string>) {
  const underlyingServer = server.server;
  const response = await (underlyingServer as unknown as {
    _requestHandlers: Map<string, (req: unknown, extra: unknown) => unknown>;
  })
    ._requestHandlers
    .get('prompts/get')?.({ method: 'prompts/get', params: { name, arguments: args } }, {});
  return response as {
    messages: Array<{
      role: string;
      content: { type: string; text: string };
    }>;
  };
}

describe('registerPrompts', () => {
  test('registerPrompts registers without throwing', () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    expect(() => registerPrompts(server, loader)).not.toThrow();
  });
});

describe('prompts/list returns 3 prompts with correct names and argument definitions', () => {
  test('prompts/list returns 3 prompts', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await listPrompts(server);
    expect(result.prompts).toHaveLength(3);
  });

  test('prompts/list includes write prompt', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await listPrompts(server);
    const names = result.prompts.map((p) => p.name);
    expect(names).toContain('write');
  });

  test('prompts/list includes critique prompt', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await listPrompts(server);
    const names = result.prompts.map((p) => p.name);
    expect(names).toContain('critique');
  });

  test('prompts/list includes adapt prompt', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await listPrompts(server);
    const names = result.prompts.map((p) => p.name);
    expect(names).toContain('adapt');
  });

  test('write prompt has required type and goal arguments', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await listPrompts(server);
    const writePrompt = result.prompts.find((p) => p.name === 'write');
    expect(writePrompt).toBeDefined();
    const argNames = writePrompt!.arguments?.map((a) => a.name) ?? [];
    expect(argNames).toContain('type');
    expect(argNames).toContain('goal');
  });

  test('critique prompt has required copy_text argument', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await listPrompts(server);
    const critiquePrompt = result.prompts.find((p) => p.name === 'critique');
    expect(critiquePrompt).toBeDefined();
    const argNames = critiquePrompt!.arguments?.map((a) => a.name) ?? [];
    expect(argNames).toContain('copy_text');
  });

  test('adapt prompt has required source_copy and target_format arguments', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await listPrompts(server);
    const adaptPrompt = result.prompts.find((p) => p.name === 'adapt');
    expect(adaptPrompt).toBeDefined();
    const argNames = adaptPrompt!.arguments?.map((a) => a.name) ?? [];
    expect(argNames).toContain('source_copy');
    expect(argNames).toContain('target_format');
  });
});

describe("write prompt with type='cold email' + goal='book demo' returns assembled prompt", () => {
  test('write prompt returns messages array with single user message', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'write', {
      type: 'cold outreach email',
      goal: 'book a demo',
    });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe('user');
    expect(result.messages[0].content.type).toBe('text');
  });

  test('write prompt contains PAS framework content', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'write', {
      type: 'cold outreach email',
      goal: 'book a demo',
    });

    const text = result.messages[0].content.text;
    expect(text.toLowerCase()).toContain('pas');
  });

  test('write prompt contains email-copy workflow content', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'write', {
      type: 'cold outreach email',
      goal: 'book a demo',
    });

    const text = result.messages[0].content.text;
    // The email-copy domain skill body should be present
    const emailSkill = loader.getSkill('email-copy');
    const fragment = emailSkill.body.substring(0, 50);
    expect(text).toContain(fragment);
  });

  test('write prompt combines systemPrompt and userPrompt with separator', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'write', {
      type: 'cold outreach email',
      goal: 'book a demo',
    });

    const text = result.messages[0].content.text;
    expect(text).toContain('---');
  });
});

describe('critique prompt with copy_text returns assembled prompt', () => {
  test('critique prompt returns messages array with single user message', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'critique', {
      copy_text: 'We leverage cutting-edge solutions to transform your business.',
    });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe('user');
    expect(result.messages[0].content.type).toBe('text');
  });

  test('critique prompt contains scoring rubric content from quality-frameworks skill', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'critique', {
      copy_text: 'We leverage cutting-edge solutions.',
    });

    const text = result.messages[0].content.text;
    const qualitySkill = loader.getSkill('quality-frameworks');
    const fragment = qualitySkill.body.substring(0, 50);
    expect(text).toContain(fragment);
  });

  test('critique prompt contains anti-slop rules', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'critique', {
      copy_text: 'We leverage cutting-edge solutions.',
    });

    const text = result.messages[0].content.text;
    const antiSlopContent = loader.resolveReference('quality-frameworks/references/anti-slop.md');
    const fragment = antiSlopContent.substring(0, 50);
    expect(text).toContain(fragment);
  });
});

describe('adapt prompt with source_copy + target_format returns assembled prompt', () => {
  test('adapt prompt returns messages array with single user message', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'adapt', {
      source_copy: 'Our product helps restaurants manage inventory better.',
      target_format: 'LinkedIn post',
    });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe('user');
    expect(result.messages[0].content.type).toBe('text');
  });

  test('adapt prompt contains social-copy domain content for LinkedIn post', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'adapt', {
      source_copy: 'Our product helps restaurants manage inventory better.',
      target_format: 'LinkedIn post',
    });

    const text = result.messages[0].content.text;
    const socialSkill = loader.getSkill('social-copy');
    const fragment = socialSkill.body.substring(0, 50);
    expect(text).toContain(fragment);
  });

  test('adapt prompt contains anti-slop rules', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'adapt', {
      source_copy: 'Our product helps restaurants manage inventory.',
      target_format: 'LinkedIn post',
    });

    const text = result.messages[0].content.text;
    const antiSlopContent = loader.resolveReference('quality-frameworks/references/anti-slop.md');
    const fragment = antiSlopContent.substring(0, 50);
    expect(text).toContain(fragment);
  });
});

describe('all prompts include anti-slop instructions', () => {
  test('write prompt includes anti-slop instructions', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'write', {
      type: 'cold outreach email',
      goal: 'book a demo',
    });

    const text = result.messages[0].content.text;
    // The assembler includes anti-slop content under "Quality Rules (MANDATORY)"
    expect(text).toContain('Quality Rules');
  });

  test('critique prompt includes anti-slop instructions', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'critique', {
      copy_text: 'Short clean text.',
    });

    const text = result.messages[0].content.text;
    expect(text).toContain('Quality Rules');
  });

  test('adapt prompt includes anti-slop instructions', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'adapt', {
      source_copy: 'Our product helps restaurants.',
      target_format: 'LinkedIn post',
    });

    const text = result.messages[0].content.text;
    expect(text).toContain('Quality Rules');
  });
});

describe('optional arguments are passed through to assembler', () => {
  test('write prompt with audience builds brief with audience.who', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'write', {
      type: 'cold outreach email',
      goal: 'book a demo',
      audience: 'restaurant owners in the US',
    });

    const text = result.messages[0].content.text;
    expect(text).toContain('restaurant owners in the US');
  });

  test('write prompt with product includes product name in user prompt', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'write', {
      type: 'cold outreach email',
      goal: 'book a demo',
      product: 'SakeBox - direct from 40+ breweries',
    });

    const text = result.messages[0].content.text;
    expect(text).toContain('SakeBox');
  });

  test('write prompt with constraints includes constraint text in user prompt', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'write', {
      type: 'cold outreach email',
      goal: 'book a demo',
      constraints: '150 words max, plain text',
    });

    const text = result.messages[0].content.text;
    expect(text).toContain('150 words max');
  });

  test('adapt prompt with brand_voice passes tone to assembler', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerPrompts(server, loader);

    const result = await getPrompt(server, 'adapt', {
      source_copy: 'Our product helps restaurants.',
      target_format: 'LinkedIn post',
      brand_voice: 'knowledgeable, casual',
    });

    const text = result.messages[0].content.text;
    expect(text).toContain('knowledgeable, casual');
  });
});
