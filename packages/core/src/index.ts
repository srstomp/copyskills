import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLoader } from './loader.js';

export const VERSION = '0.1.1';

export type {
  Brief,
  QualityScores,
  AntiSlopIssue,
  AntiSlopResult,
  FrameworkSelection,
  CopyOutput,
  AssembledPrompt,
  SkillMetadata,
  SkillContent,
} from './types.js';

export { createLoader } from './loader.js';
export type { SkillLoader } from './loader.js';

/** Resolve the skill library bundled with @copydoc/core. */
export function resolveSkillsDir(): string {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(moduleDir, 'skills'),
    path.join(moduleDir, '..', 'dist', 'skills'),
    path.join(moduleDir, '..', '..', '..', 'skills'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'copy-workflow', 'SKILL.md'))) {
      return candidate;
    }
  }

  throw new Error(
    `Could not find the bundled copywriting skills. Checked: ${candidates.join(', ')}`,
  );
}

/** Create a loader for the skill library bundled with @copydoc/core. */
export function createBundledLoader() {
  return createLoader(resolveSkillsDir());
}

export { selectFramework, routeToDomain } from './frameworks.js';

export { createAntiSlopChecker } from './anti-slop.js';
export type { AntiSlopChecker } from './anti-slop.js';

export { createAssembler } from './assembler.js';
export type { Assembler } from './assembler.js';
