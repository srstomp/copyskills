import { describe, expect, test } from 'bun:test';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createLoader } from '@copydoc/core';
import path from 'path';
import { registerResources } from '../resources';

// Skills dir: from packages/mcp-server/src/__tests__/ up to repo root, then skills/
const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

function makeServer(): McpServer {
  return new McpServer(
    { name: 'test-server', version: '0.1.0' },
    { capabilities: { resources: {} } },
  );
}

describe('registerResources', () => {
  test('registerResources registers without throwing', () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    expect(() => registerResources(server, loader)).not.toThrow();
  });
});

describe('copydoc://skills resource', () => {
  test('copydoc://skills returns JSON with 15 skills', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    // Access private registered resources to test them
    // We use the underlying server to call resources/read
    const result = await readResource(server, 'copydoc://skills');
    expect(result).toBeDefined();
    const content = result.contents[0];
    expect(content.mimeType).toBe('application/json');
    const parsed = JSON.parse(content.text as string);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(15);
    // Each entry should have name and description
    for (const item of parsed) {
      expect(typeof item.name).toBe('string');
      expect(typeof item.description).toBe('string');
    }
  });
});

describe('copydoc://frameworks/{name} resource', () => {
  test('copydoc://frameworks/pas returns PAS framework markdown', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    const result = await readResource(server, 'copydoc://frameworks/pas');
    const content = result.contents[0];
    expect(content.mimeType).toBe('text/markdown');
    expect(typeof content.text).toBe('string');
    // PAS content should mention PAS or Problem-Agitate
    expect((content.text as string).length).toBeGreaterThan(100);
  });
});

describe('copydoc://domains/{domain}/workflow resource', () => {
  test('copydoc://domains/email-copy/workflow returns email-copy SKILL.md body', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    const result = await readResource(server, 'copydoc://domains/email-copy/workflow');
    const content = result.contents[0];
    expect(content.mimeType).toBe('text/markdown');
    const text = content.text as string;
    // Should contain workflow content from email-copy SKILL.md body
    expect(text.length).toBeGreaterThan(100);
    expect(text).toContain('Email');
  });
});

describe('copydoc://domains/{domain}/references resource', () => {
  test('copydoc://domains/email-copy/references returns JSON array of 4 references', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    const result = await readResource(server, 'copydoc://domains/email-copy/references');
    const content = result.contents[0];
    expect(content.mimeType).toBe('application/json');
    const parsed = JSON.parse(content.text as string);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(4);
  });
});

describe('copydoc://domains/{domain}/references/{ref} resource', () => {
  test('copydoc://domains/email-copy/references/cold-outreach returns markdown content', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    const result = await readResource(server, 'copydoc://domains/email-copy/references/cold-outreach');
    const content = result.contents[0];
    expect(content.mimeType).toBe('text/markdown');
    const text = content.text as string;
    expect(text.length).toBeGreaterThan(100);
  });
});

describe('copydoc://quality/rubric resource', () => {
  test('copydoc://quality/rubric returns quality-frameworks SKILL.md body', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    const result = await readResource(server, 'copydoc://quality/rubric');
    const content = result.contents[0];
    expect(content.mimeType).toBe('text/markdown');
    const text = content.text as string;
    expect(text.length).toBeGreaterThan(100);
  });
});

describe('copydoc://quality/anti-slop resource', () => {
  test('copydoc://quality/anti-slop returns anti-slop.md content', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    const result = await readResource(server, 'copydoc://quality/anti-slop');
    const content = result.contents[0];
    expect(content.mimeType).toBe('text/markdown');
    const text = content.text as string;
    expect(text.length).toBeGreaterThan(100);
  });
});

describe('copydoc://headlines resources', () => {
  test('copydoc://headlines/patterns returns proven-patterns.md content', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    const result = await readResource(server, 'copydoc://headlines/patterns');
    const content = result.contents[0];
    expect(content.mimeType).toBe('text/markdown');
    const text = content.text as string;
    expect(text.length).toBeGreaterThan(100);
  });

  test('copydoc://headlines/power-words returns power-words.md content', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    const result = await readResource(server, 'copydoc://headlines/power-words');
    const content = result.contents[0];
    expect(content.mimeType).toBe('text/markdown');
    const text = content.text as string;
    expect(text.length).toBeGreaterThan(100);
  });
});

describe('Invalid URI handling', () => {
  test('unknown URI throws McpError with descriptive message', async () => {
    const server = makeServer();
    const loader = createLoader(SKILLS_DIR);
    registerResources(server, loader);

    // The SDK throws McpError for unrecognized URIs, which is a descriptive error
    let thrown: Error | null = null;
    try {
      await readResource(server, 'copydoc://unknown/whatever');
    } catch (err) {
      thrown = err as Error;
    }
    expect(thrown).not.toBeNull();
    // McpError includes the unknown URI in the message
    expect(thrown!.message).toContain('copydoc://unknown/whatever');
  });
});

// Helper to simulate resource reads through the server's internal handlers
// The McpServer registers resources which we can invoke via the internal handlers
async function readResource(server: McpServer, uri: string) {
  // Access the underlying Server and call the resources/read handler
  const underlyingServer = server.server;
  // We need to call the handler directly. Use the internal setRequestHandler mechanism.
  // Instead, we trigger a direct invocation by using the protocol's internal request handlers.
  // Since McpServer registers request handlers on the underlying Server, we simulate a request.
  const response = await (underlyingServer as unknown as { _requestHandlers: Map<string, (req: unknown, extra: unknown) => unknown> })
    ._requestHandlers
    .get('resources/read')?.({ method: 'resources/read', params: { uri } }, {});
  return response as { contents: Array<{ uri: string; mimeType?: string; text?: string }> };
}
