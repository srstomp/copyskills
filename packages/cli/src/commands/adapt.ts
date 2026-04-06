import fs from 'fs';
import type { SkillLoader } from '@copydoc/core';
import { createAssembler, selectFramework, createAntiSlopChecker } from '@copydoc/core';
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

  const result = createAntiSlopChecker(loader).check(fullOutput);

  console.log('--- Quality Check ---');
  console.log(`AI-tell score: ${result.score}/10 (lower is better)`);
  if (result.issues.length === 0) {
    console.log('No issues found.');
  } else {
    console.log(`Issues found: ${result.issues.length}`);
    for (const issue of result.issues.slice(0, 5)) {
      const suggestion = issue.suggestion ? ` -> ${issue.suggestion}` : '';
      console.log(`  Line ${issue.line}: "${issue.pattern}"${suggestion}`);
    }
  }
}
