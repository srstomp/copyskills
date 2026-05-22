import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CopydocConfig } from '../config';
import type { CopyProvider } from './adapter';

// Note: The @google/generative-ai SDK does not support custom base_url natively.
// If a custom base_url is needed with Gemini, use a reverse proxy at the network level.

const DEFAULT_MODEL = 'gemini-2.0-flash';

export function createGeminiProvider(config: CopydocConfig): CopyProvider {
  const client = new GoogleGenerativeAI(config.api_key);
  const modelName = config.model || DEFAULT_MODEL;

  return {
    async generate(system: string, prompt: string): Promise<string> {
      const model = client.getGenerativeModel({ model: modelName, systemInstruction: system });
      const result = await model.generateContent(prompt);
      return result.response.text();
    },

    async *stream(system: string, prompt: string): AsyncIterable<string> {
      const model = client.getGenerativeModel({ model: modelName, systemInstruction: system });
      const streamResult = await model.generateContentStream(prompt);
      for await (const chunk of streamResult.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    },
  };
}
