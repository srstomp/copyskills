import fs from 'fs';
import path from 'path';

// Layer 2 domain skills -- the only ones to convert to .mdc
const LAYER_2_SKILLS = [
  'email-copy',
  'marketing-copy',
  'ux-copy',
  'editorial-copy',
  'brand-copy',
  'sales-copy',
  'social-copy',
  'conversion-copy',
] as const;

export type Layer2Skill = (typeof LAYER_2_SKILLS)[number];

export interface SkillInput {
  name: string;
  description: string;
  body: string;
}

/**
 * Parse SKILL.md content into frontmatter metadata and body.
 * Replicates the logic from packages/core/src/loader.ts without importing from core.
 */
function parseFrontmatter(content: string): { metadata: Record<string, string>; body: string } {
  const parts = content.split('---');
  // parts[0] is empty (before first ---), parts[1] is frontmatter, parts[2+] is body
  if (parts.length < 3) {
    // No frontmatter found
    return { metadata: {}, body: content.trim() };
  }
  const frontmatterLines = parts[1].trim().split('\n');
  const metadata: Record<string, string> = {};
  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove surrounding quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      metadata[key] = value;
    }
  }
  const body = parts.slice(2).join('---').trim();
  return { metadata, body };
}

/**
 * Convert a skill to Cursor .mdc rule format.
 *
 * Uses Agent-Selected mode: alwaysApply: false, empty globs, non-empty description.
 * Cursor reads the description and fetches the rule when the task involves that domain.
 */
export function convertSkillToMdc(skill: SkillInput, antiSlopContent: string): string {
  const name = skill.name || 'copydoc-skill';
  const description = skill.description || `Copydoc ${name} skill.`;

  const frontmatterDescription = `Copydoc ${name}: ${description}. Use when writing or reviewing ${name} copy.`;

  const frontmatter = [
    '---',
    `description: ${frontmatterDescription}`,
    'globs: ',
    'alwaysApply: false',
    '---',
  ].join('\n');

  const bodyPreamble = `# ${name}\n\nWhen writing ${name} copy, follow this workflow:\n\n`;
  const bodyContent = bodyPreamble + skill.body;
  const antiSlopSection = `\n\n---\n\n## Anti-Slop Rules\n\n${antiSlopContent}`;

  return `${frontmatter}\n${bodyContent}${antiSlopSection}`;
}

/**
 * Convert all Layer 2 domain skills to Cursor .mdc rule files.
 *
 * Reads SKILL.md for each of the 8 domain skills, reads the anti-slop reference,
 * converts each to .mdc format, writes them to outputDir, and returns the list
 * of written file paths.
 */
export async function convertAllSkills(skillsDir: string, outputDir: string): Promise<string[]> {
  // Read anti-slop content once
  const antiSlopPath = path.join(skillsDir, 'quality-frameworks', 'references', 'anti-slop.md');
  const antiSlopRaw = fs.readFileSync(antiSlopPath, 'utf-8');
  const { body: antiSlopContent } = parseFrontmatter(antiSlopRaw);

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  const writtenPaths: string[] = [];

  for (const skillName of LAYER_2_SKILLS) {
    const skillMdPath = path.join(skillsDir, skillName, 'SKILL.md');
    const rawContent = fs.readFileSync(skillMdPath, 'utf-8');
    const { metadata, body } = parseFrontmatter(rawContent);

    const skill: SkillInput = {
      name: metadata.name ?? skillName,
      description: metadata.description ?? '',
      body,
    };

    const mdcContent = convertSkillToMdc(skill, antiSlopContent);

    const outputFileName = `copydoc-${skillName}.mdc`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, mdcContent, 'utf-8');
    writtenPaths.push(outputPath);
  }

  return writtenPaths;
}
