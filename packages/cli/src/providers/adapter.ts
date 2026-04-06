import type { CopydocConfig } from '../config';
import { createAnthropicProvider } from './anthropic';
import { createOpenAIProvider } from './openai';
import { createGeminiProvider } from './gemini';

export interface CopyProvider {
  generate(system: string, prompt: string): Promise<string>;
  stream(system: string, prompt: string): AsyncIterable<string>;
}

export function createProvider(config: CopydocConfig): CopyProvider {
  switch (config.provider) {
    case 'anthropic':
      return createAnthropicProvider(config);
    case 'openai':
      return createOpenAIProvider(config);
    case 'gemini':
      return createGeminiProvider(config);
    default: {
      const _exhaustive: never = config.provider;
      throw new Error(
        `Unknown provider: ${_exhaustive}. Supported: anthropic, openai, gemini`
      );
    }
  }
}
