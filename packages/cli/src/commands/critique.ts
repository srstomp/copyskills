import fs from 'fs';
import type { SkillLoader } from '@copydoc/core';
import { createAssembler, selectFramework, createLinter } from '@copydoc/core';
import { printLintResult } from './lint';
import { loadConfig } from '../config';
import { createProvider } from '../providers/adapter';

function resolveInput(input: string): string {
  // Try existsSync first - if the file exists, read it
  try {
    if (fs.existsSync(input)) {
      return fs.readFileSync(input, 'utf-8');
    }
  } catch {
    // Ignore errors from existsSync (e.g. path too long, permission)
  }
  // Otherwise treat as inline text
  return input;
}

export async function critiqueCommand(loader: SkillLoader, input: string, locale: string = 'en'): Promise<void> {
  const config = loadConfig();
  const provider = createProvider(config);
  const assembler = createAssembler(loader, selectFramework);

  const text = resolveInput(input);

  const { systemPrompt, userPrompt } = assembler.assembleCritique(text);

  const response = await provider.generate(systemPrompt, userPrompt);

  console.log(response);

  const result = createLinter(loader).lint(text, { locale });

  console.log('');
  printLintResult(result);
}
