import os from 'os';
import path from 'path';
import fs from 'fs';

export interface CopydocConfig {
  provider: 'anthropic' | 'openai' | 'gemini';
  api_key: string;
  base_url?: string;
  model?: string;
}

type PartialConfig = {
  provider?: string;
  api_key?: string;
  base_url?: string;
  model?: string;
};

export function loadConfig(): CopydocConfig {
  const rcPath = path.join(os.homedir(), '.copydocrc.json');
  let fileConfig: PartialConfig = {};

  // Step 1: read ~/.copydocrc.json if it exists
  try {
    const text = fs.readFileSync(rcPath, 'utf-8');
    try {
      fileConfig = JSON.parse(text) as PartialConfig;
    } catch {
      // invalid JSON - treat as empty
      fileConfig = {};
    }
  } catch {
    // file-not-found or permission error - skip
    fileConfig = {};
  }

  // Step 2: override with env vars (later overrides earlier)
  const provider = (process.env.COPYDOC_PROVIDER || fileConfig.provider) as
    | CopydocConfig['provider']
    | undefined;
  const api_key = process.env.COPYDOC_API_KEY || fileConfig.api_key;
  const base_url = process.env.COPYDOC_BASE_URL || fileConfig.base_url;
  const model = process.env.COPYDOC_MODEL || fileConfig.model;

  // Step 3: throw if no api_key
  if (!api_key) {
    throw new Error(
      "No API key found. Run 'copydoc init' to set up configuration, or set COPYDOC_API_KEY environment variable."
    );
  }

  // Step 4: default provider to 'anthropic'
  const resolvedProvider: CopydocConfig['provider'] = provider || 'anthropic';

  const config: CopydocConfig = {
    provider: resolvedProvider,
    api_key,
  };

  if (base_url) {
    config.base_url = base_url;
  }

  if (model) {
    config.model = model;
  }

  return config;
}
