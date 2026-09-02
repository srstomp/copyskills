import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(repoRoot, 'skills');
const destination = path.join(repoRoot, 'packages', 'core', 'dist', 'skills');

fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });

const skillCount = fs
  .readdirSync(destination, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(destination, entry.name, 'SKILL.md')))
  .length;

if (skillCount === 0) {
  throw new Error('No skills were copied into @copydoc/core');
}

console.log(`Copied ${skillCount} skills into @copydoc/core`);
