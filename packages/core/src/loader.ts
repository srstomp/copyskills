import fs from 'fs';
import path from 'path';
import type { SkillContent } from './types.js';

export interface SkillLoader {
  listSkills(): string[];
  getSkill(name: string): SkillContent;
  getReference(skill: string, ref: string): string;
  listReferences(skill: string): string[];
  resolveReference(relativePath: string): string;
}

function parseFrontmatter(content: string): { metadata: Record<string, string>; body: string } {
  const parts = content.split('---');
  // parts[0] is empty (before first ---), parts[1] is frontmatter, parts[2+] is body
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

export function createLoader(skillsDir: string): SkillLoader {
  function listSkills(): string[] {
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    const skills: string[] = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillMdPath = path.join(skillsDir, entry.name, 'SKILL.md');
        if (fs.existsSync(skillMdPath)) {
          skills.push(entry.name);
        }
      }
    }
    return skills;
  }

  function getSkill(name: string): SkillContent {
    const skillPath = path.join(skillsDir, name, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      throw new Error(`Skill not found: '${name}'. No SKILL.md at ${skillPath}`);
    }
    const content = fs.readFileSync(skillPath, 'utf-8');
    const { metadata, body } = parseFrontmatter(content);
    return {
      metadata: {
        name: metadata.name ?? name,
        description: metadata.description ?? '',
      },
      body,
    };
  }

  function getReference(skill: string, ref: string): string {
    const refPath = path.join(skillsDir, skill, 'references', `${ref}.md`);
    if (!fs.existsSync(refPath)) {
      throw new Error(`Reference not found: '${ref}' for skill '${skill}'. No file at ${refPath}`);
    }
    return fs.readFileSync(refPath, 'utf-8');
  }

  function listReferences(skill: string): string[] {
    const refsDir = path.join(skillsDir, skill, 'references');
    if (!fs.existsSync(refsDir)) {
      return [];
    }
    const entries = fs.readdirSync(refsDir);
    return entries
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.slice(0, -'.md'.length));
  }

  function resolveReference(relativePath: string): string {
    const fullPath = path.join(skillsDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Reference not found at relative path: '${relativePath}'. Resolved to ${fullPath}`);
    }
    return fs.readFileSync(fullPath, 'utf-8');
  }

  return {
    listSkills,
    getSkill,
    getReference,
    listReferences,
    resolveReference,
  };
}
