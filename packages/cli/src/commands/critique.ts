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
    // Ignore errors from existsSync (e.g. path too long, permission)
  }
  // Otherwise treat as inline text
  return input;
}

export async function critiqueCommand(loader: SkillLoader, input: string): Promise<void> {
  const config = loadConfig();
  const provider = createProvider(config);
  const assembler = createAssembler(loader, selectFramework);

  const text = resolveInput(input);

  const { systemPrompt, userPrompt } = assembler.assembleCritique(text);

  const response = await provider.generate(systemPrompt, userPrompt);

  console.log(response);

  const result = createAntiSlopChecker(loader).check(text);

  console.log('');
  console.log('--- Programmatic AI-Tell Score ---');
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
