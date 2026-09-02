import { createInterface } from 'readline/promises';
import fs from 'fs';
import { resolveConfigPath } from '../config';

function redactKey(key: string): string {
  if (key.length <= 8) return key.slice(0, 4) + '...';
  return key.slice(0, 8) + '...';
}

export async function initCommand(rcFile = resolveConfigPath()): Promise<void> {
  console.log('Welcome to Copydoc CLI. Let\'s set up your configuration.');
  console.log('');

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const providerInput = await rl.question('Provider (anthropic/openai/gemini) [anthropic]: ');
    const provider = providerInput.trim() || 'anthropic';

    const apiKeyInput = await rl.question('API key: ');
    const api_key = apiKeyInput.trim();

    const baseUrlInput = await rl.question('Base URL (optional, for AI Gateway): ');
    const base_url = baseUrlInput.trim() || undefined;

    const modelInput = await rl.question('Model (optional, uses provider default): ');
    const model = modelInput.trim() || undefined;

    const config: Record<string, string> = { provider, api_key };
    if (base_url) config.base_url = base_url;
    if (model) config.model = model;

    fs.writeFileSync(rcFile, JSON.stringify(config, null, 2), 'utf-8');

    console.log('');
    console.log(`Config saved to ${rcFile} (API key: ${redactKey(api_key)})`);
  } finally {
    rl.close();
  }
}
