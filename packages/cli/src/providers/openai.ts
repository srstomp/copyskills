import OpenAI from 'openai';
import type { CopydocConfig } from '../config';
import type { CopyProvider } from './adapter';

const DEFAULT_MODEL = 'gpt-4o';

export function createOpenAIProvider(config: CopydocConfig): CopyProvider {
  const clientOptions: ConstructorParameters<typeof OpenAI>[0] = {
    apiKey: config.api_key,
  };

  if (config.base_url) {
    clientOptions.baseURL = config.base_url;
  }

  const client = new OpenAI(clientOptions);
  const model = config.model || DEFAULT_MODEL;

  return {
    async generate(system: string, prompt: string): Promise<string> {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
      });

      return response.choices[0]?.message?.content ?? '';
    },

    async *stream(system: string, prompt: string): AsyncIterable<string> {
      const streamResponse = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        stream: true,
      });

      for await (const chunk of streamResponse) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    },
  };
}
