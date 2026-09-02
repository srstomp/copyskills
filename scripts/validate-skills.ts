import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(repoRoot, 'skills');
const errors: string[] = [];

function markdownFiles(root: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(target));
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(target);
  }
  return files;
}

const skillDirectories = fs
  .readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const skillName of skillDirectories) {
  const skillPath = path.join(skillsRoot, skillName, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    errors.push(`${skillName}: missing SKILL.md`);
    continue;
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    errors.push(`${skillName}: missing YAML frontmatter`);
    continue;
  }

  const name = frontmatter[1].match(/^name:\s*["']?([^\n"']+)["']?\s*$/m)?.[1];
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1];
  if (name !== skillName) errors.push(`${skillName}: frontmatter name is ${name ?? 'missing'}`);
  if (!description) errors.push(`${skillName}: frontmatter description is missing`);
}

const pathPattern = /(?:\.\.\/|references\/)[A-Za-z0-9_./-]+\.md/g;
for (const markdownPath of markdownFiles(skillsRoot)) {
  const content = fs.readFileSync(markdownPath, 'utf8');
  for (const match of content.matchAll(pathPattern)) {
    const referencedPath = match[0];
    const resolved = path.resolve(path.dirname(markdownPath), referencedPath);
    if (!resolved.startsWith(`${skillsRoot}${path.sep}`) || !fs.existsSync(resolved)) {
      errors.push(`${path.relative(repoRoot, markdownPath)}: unresolved ${referencedPath}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${skillDirectories.length} skills and their Markdown references`);
