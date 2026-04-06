import Anthropic from '@anthropic-ai/sdk';
import type { CopydocConfig } from '../config';
import type { CopyProvider } from './adapter';

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;

export function createAnthropicProvider(config: CopydocConfig): CopyProvider {
  const clientOptions: ConstructorParameters<typeof Anthropic>[0] = {
    apiKey: config.api_key,
  };

  if (config.base_url) {
    clientOptions.baseURL = config.base_url;
  }

  const client = new Anthropic(clientOptions);
  const model = config.model || DEFAULT_MODEL;

  return {
    async generate(system: string, prompt: string): Promise<string> {
      const message = await client.messages.create({
        model,
        max_tokens: MAX_TOKENS,
        system,
        messages: [{ role: 'user', content: prompt }],
      });

      const firstBlock = message.content[0];
      if (firstBlock?.type === 'text') {
        return firstBlock.text;
      }
      return '';
    },

    async *stream(system: string, prompt: string): AsyncIterable<string> {
      const streamRunner = client.messages.stream({
        model,
        max_tokens: MAX_TOKENS,
        system,
        messages: [{ role: 'user', content: prompt }],
      });

      for await (const event of streamRunner) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          yield event.delta.text;
        }
      }
    },
  };
}
