import { createInterface } from 'readline/promises';
import fs from 'fs';
import path from 'path';
import type { SkillLoader, Brief } from '@copydoc/core';
import { createAssembler, selectFramework, createAntiSlopChecker } from '@copydoc/core';
import { loadConfig } from '../config';
import { createProvider } from '../providers/adapter';

function sanitizeFilename(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export async function writeCommand(
  loader: SkillLoader,
  description: string,
  outputDir: string = './output',
): Promise<void> {
  const config = loadConfig();
  const provider = createProvider(config);
  const assembler = createAssembler(loader, selectFramework);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let goal = description;
  let audience: string | undefined;
  let avoids: string[] | undefined;

  try {
    const goalInput = await rl.question('What\'s the goal? (what should the reader do?): ');
    goal = goalInput.trim() || description;

    const audienceInput = await rl.question('Who is this for?: ');
    audience = audienceInput.trim() || undefined;

    const avoidsInput = await rl.question('Any words to avoid? (comma-separated, or skip): ');
    const avoidsStr = avoidsInput.trim();
    if (avoidsStr) {
      avoids = avoidsStr.split(',').map((w) => w.trim()).filter((w) => w.length > 0);
    }
  } finally {
    rl.close();
  }

  const brief: Brief = {
    type: description,
    goal,
  };

  if (audience) {
    brief.audience = { who: audience };
  }

  if (avoids && avoids.length > 0) {
    brief.brand_voice = { avoids };
  }

  const { systemPrompt, userPrompt } = assembler.assemble(brief);

  console.log('');
  console.log(`Selecting framework... ${selectFramework(description, goal).framework}`);
  console.log(`Loading domain... ${description}`);
  console.log('\nDrafting...\n');

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

  // Save output
  fs.mkdirSync(outputDir, { recursive: true });
  const timestamp = Date.now();
  const slug = sanitizeFilename(description);
  const filename = `${slug}-${timestamp}.md`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, fullOutput, 'utf-8');
  console.log(`\nSaved to ${filepath}`);
}
