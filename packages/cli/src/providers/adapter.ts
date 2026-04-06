import type { CopydocConfig } from '../config';
import { createAnthropicProvider } from './anthropic';

export interface CopyProvider {
  generate(system: string, prompt: string): Promise<string>;
  stream(system: string, prompt: string): AsyncIterable<string>;
}

export function createProvider(config: CopydocConfig): CopyProvider {
  switch (config.provider) {
    case 'anthropic':
      return createAnthropicProvider(config);
    case 'openai':
      throw new Error('Provider not yet implemented: openai');
    case 'gemini':
      throw new Error('Provider not yet implemented: gemini');
    default: {
      const _exhaustive: never = config.provider;
      throw new Error(`Provider not yet implemented: ${_exhaustive}`);
    }
  }
}
