import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { loadConfig } from '../config';
import os from 'os';
import path from 'path';
import fs from 'fs';

const RC_FILE = path.join(os.homedir(), '.copydocrc.json');

// Helpers to manage the rc file during tests
function writeRcFile(content: object) {
  fs.writeFileSync(RC_FILE, JSON.stringify(content), 'utf-8');
}

function removeRcFile() {
  try {
    fs.unlinkSync(RC_FILE);
  } catch {
    // ignore if doesn't exist
  }
}

function cleanEnv() {
  delete process.env.COPYDOC_PROVIDER;
  delete process.env.COPYDOC_API_KEY;
  delete process.env.COPYDOC_BASE_URL;
  delete process.env.COPYDOC_MODEL;
}

describe('loadConfig() - config file', () => {
  beforeEach(() => {
    cleanEnv();
  });

  afterEach(() => {
    removeRcFile();
    cleanEnv();
  });

  test('loadConfig() reads ~/.copydocrc.json when it exists', () => {
    writeRcFile({ provider: 'anthropic', api_key: 'test-key-from-file' });
    const config = loadConfig();
    expect(config.api_key).toBe('test-key-from-file');
    expect(config.provider).toBe('anthropic');
  });

  test('loadConfig() reads optional fields from config file', () => {
    writeRcFile({
      provider: 'anthropic',
      api_key: 'test-key',
      base_url: 'https://custom.gateway.example.com',
      model: 'claude-custom-model',
    });
    const config = loadConfig();
    expect(config.base_url).toBe('https://custom.gateway.example.com');
    expect(config.model).toBe('claude-custom-model');
  });

  test('loadConfig() does not throw when config file does not exist', () => {
    removeRcFile();
    process.env.COPYDOC_API_KEY = 'env-key';
    expect(() => loadConfig()).not.toThrow();
  });
});

describe('loadConfig() - env var overrides', () => {
  beforeEach(() => {
    cleanEnv();
  });

  afterEach(() => {
    removeRcFile();
    cleanEnv();
  });

  test('env vars (COPYDOC_API_KEY) override config file values', () => {
    writeRcFile({ provider: 'anthropic', api_key: 'file-key' });
    process.env.COPYDOC_API_KEY = 'env-key';
    const config = loadConfig();
    expect(config.api_key).toBe('env-key');
  });

  test('COPYDOC_PROVIDER env var overrides config file provider', () => {
    writeRcFile({ provider: 'anthropic', api_key: 'file-key' });
    process.env.COPYDOC_PROVIDER = 'openai';
    const config = loadConfig();
    expect(config.provider).toBe('openai');
  });

  test('COPYDOC_BASE_URL env var overrides config file base_url', () => {
    writeRcFile({ provider: 'anthropic', api_key: 'file-key', base_url: 'https://file-url.example.com' });
    process.env.COPYDOC_BASE_URL = 'https://env-url.example.com';
    const config = loadConfig();
    expect(config.base_url).toBe('https://env-url.example.com');
  });

  test('COPYDOC_MODEL env var overrides config file model', () => {
    writeRcFile({ provider: 'anthropic', api_key: 'file-key', model: 'file-model' });
    process.env.COPYDOC_MODEL = 'env-model';
    const config = loadConfig();
    expect(config.model).toBe('env-model');
  });

  test('env vars work without a config file present', () => {
    removeRcFile();
    process.env.COPYDOC_API_KEY = 'env-only-key';
    process.env.COPYDOC_PROVIDER = 'anthropic';
    const config = loadConfig();
    expect(config.api_key).toBe('env-only-key');
    expect(config.provider).toBe('anthropic');
  });
});

describe('loadConfig() - missing API key throws', () => {
  beforeEach(() => {
    cleanEnv();
  });

  afterEach(() => {
    removeRcFile();
    cleanEnv();
  });

  test('missing API key throws error with "copydoc init" suggestion', () => {
    removeRcFile();
    expect(() => loadConfig()).toThrow(
      "No API key found. Run 'copydoc init' to set up configuration, or set COPYDOC_API_KEY environment variable."
    );
  });

  test('missing API key from both file and env throws the same error message', () => {
    writeRcFile({ provider: 'anthropic' }); // no api_key in file
    expect(() => loadConfig()).toThrow(
      "No API key found. Run 'copydoc init' to set up configuration, or set COPYDOC_API_KEY environment variable."
    );
  });
});

describe('loadConfig() - default provider', () => {
  beforeEach(() => {
    cleanEnv();
  });

  afterEach(() => {
    removeRcFile();
    cleanEnv();
  });

  test('default provider is "anthropic" when not specified in file or env', () => {
    writeRcFile({ api_key: 'test-key' }); // no provider
    const config = loadConfig();
    expect(config.provider).toBe('anthropic');
  });

  test('default provider is "anthropic" when using only env vars', () => {
    removeRcFile();
    process.env.COPYDOC_API_KEY = 'env-key';
    // no COPYDOC_PROVIDER set
    const config = loadConfig();
    expect(config.provider).toBe('anthropic');
  });
});
