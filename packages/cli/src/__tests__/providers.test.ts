import { describe, expect, test, mock, beforeEach } from 'bun:test';

// We mock the Anthropic SDK before importing anything that depends on it.
// Bun's mock.module() intercepts the module import.

const mockCreate = mock(async (params: {
  model: string;
  max_tokens: number;
  messages: Array<{ role: string; content: string }>;
  system?: string;
}) => {
  return {
    content: [{ type: 'text', text: 'Hello from mock!' }],
    id: 'msg_mock',
    model: params.model,
    role: 'assistant',
    stop_reason: 'end_turn',
    type: 'message',
    usage: { input_tokens: 10, output_tokens: 5 },
  };
});

let mockStreamTextValues = ['Hello ', 'world', '!'];

const mockStreamFn = mock((_params: unknown) => {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const t of mockStreamTextValues) {
        yield { type: 'content_block_delta', delta: { type: 'text_delta', text: t } };
      }
    },
  };
});

// Track constructor calls for base_url test
let lastConstructorOpts: { apiKey?: string; baseURL?: string } | undefined;

class MockAnthropicClient {
  messages: { create: typeof mockCreate; stream: typeof mockStreamFn };

  constructor(opts?: { apiKey?: string; baseURL?: string }) {
    lastConstructorOpts = opts;
    this.messages = {
      create: mockCreate,
      stream: mockStreamFn,
    };
  }
}

mock.module('@anthropic-ai/sdk', () => ({
  default: MockAnthropicClient,
  Anthropic: MockAnthropicClient,
}));

import { createProvider } from '../providers/adapter';
import type { CopydocConfig } from '../config';

function makeConfig(overrides: Partial<CopydocConfig> = {}): CopydocConfig {
  return {
    provider: 'anthropic',
    api_key: 'test-api-key',
    ...overrides,
  };
}

describe('CopyProvider interface - createProvider()', () => {
  test('CopyProvider interface has generate() method', () => {
    const provider = createProvider(makeConfig());
    expect(typeof provider.generate).toBe('function');
  });

  test('CopyProvider interface has stream() method', () => {
    const provider = createProvider(makeConfig());
    expect(typeof provider.stream).toBe('function');
  });
});

describe('createProvider("anthropic") - returns working Anthropic provider', () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockStreamFn.mockClear();
    lastConstructorOpts = undefined;
  });

  test('createProvider("anthropic") returns working Anthropic provider (mock SDK in tests)', async () => {
    const provider = createProvider(makeConfig({ provider: 'anthropic' }));
    const result = await provider.generate('You are helpful.', 'Say hello');
    expect(result).toBe('Hello from mock!');
  });

  test('Anthropic provider uses "claude-sonnet-4-20250514" as default model', async () => {
    const provider = createProvider(makeConfig());
    await provider.generate('system', 'user');
    const callArgs = mockCreate.mock.calls[0][0] as { model: string };
    expect(callArgs.model).toBe('claude-sonnet-4-20250514');
  });

  test('Anthropic provider uses custom model when config.model is set', async () => {
    const provider = createProvider(makeConfig({ model: 'claude-custom-model' }));
    await provider.generate('system', 'user');
    const callArgs = mockCreate.mock.calls[0][0] as { model: string };
    expect(callArgs.model).toBe('claude-custom-model');
  });

  test('Anthropic provider passes system and prompt correctly to generate()', async () => {
    const provider = createProvider(makeConfig());
    await provider.generate('Be concise.', 'What is 2+2?');
    const callArgs = mockCreate.mock.calls[0][0] as {
      system: string;
      messages: Array<{ role: string; content: string }>;
    };
    expect(callArgs.system).toBe('Be concise.');
    expect(callArgs.messages[0].role).toBe('user');
    expect(callArgs.messages[0].content).toBe('What is 2+2?');
  });

  test('Anthropic provider uses max_tokens 4096', async () => {
    const provider = createProvider(makeConfig());
    await provider.generate('system', 'user');
    const callArgs = mockCreate.mock.calls[0][0] as { max_tokens: number };
    expect(callArgs.max_tokens).toBe(4096);
  });

  test('Anthropic provider stream() returns AsyncIterable yielding text deltas', async () => {
    mockStreamTextValues = ['chunk1', ' chunk2', ' chunk3'];
    const provider = createProvider(makeConfig());
    const chunks: string[] = [];
    for await (const chunk of provider.stream('system', 'user')) {
      chunks.push(chunk);
    }
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join('')).toContain('chunk');
  });

  test('Anthropic provider respects custom base_url', () => {
    createProvider(makeConfig({ base_url: 'https://my-gateway.example.com' }));
    expect(lastConstructorOpts?.baseURL).toBe('https://my-gateway.example.com');
  });
});

describe('createProvider() - unimplemented providers', () => {
  test('createProvider("openai") throws "not yet implemented"', () => {
    expect(() => createProvider(makeConfig({ provider: 'openai' }))).toThrow(
      'Provider not yet implemented'
    );
  });

  test('createProvider("gemini") throws "not yet implemented"', () => {
    expect(() => createProvider(makeConfig({ provider: 'gemini' }))).toThrow(
      'Provider not yet implemented'
    );
  });
});
