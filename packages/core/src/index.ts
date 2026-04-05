export const VERSION = '0.1.0';

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

export { selectFramework, routeToDomain } from './frameworks.js';
