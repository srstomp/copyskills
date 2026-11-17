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
    // Ignore errors from existsSync
  }
  // Otherwise treat as inline text
  return input;
}

export async function adaptCommand(
  loader: SkillLoader,
  source: string,
  targetFormat: string,
  locale: string = 'en',
): Promise<void> {
  const config = loadConfig();
  const provider = createProvider(config);
  const assembler = createAssembler(loader, selectFramework);

  const sourceText = resolveInput(source);

  const { systemPrompt, userPrompt } = assembler.assembleAdapt(sourceText, targetFormat);

  let fullOutput = '';
  for await (const chunk of provider.stream(systemPrompt, userPrompt)) {
    process.stdout.write(chunk);
    fullOutput += chunk;
  }

  console.log('\n');

  const result = createLinter(loader).lint(fullOutput, { locale });

  printLintResult(result);
}
