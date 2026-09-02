import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error('Usage: node scripts/set-version.mjs <major.minor.patch>');
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageDirectories = ['core', 'mcp-server', 'cli', 'integrations'];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(repoRoot, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

for (const directory of packageDirectories) {
  const relativePath = `packages/${directory}/package.json`;
  const manifest = readJson(relativePath);
  manifest.version = version;
  if (manifest.dependencies?.['@copydoc/core']) {
    manifest.dependencies['@copydoc/core'] = `^${version}`;
  }
  writeJson(relativePath, manifest);
}

const codexManifest = readJson('.codex-plugin/plugin.json');
codexManifest.version = version;
writeJson('.codex-plugin/plugin.json', codexManifest);

const claudeManifest = readJson('.claude-plugin/plugin.json');
claudeManifest.version = version;
writeJson('.claude-plugin/plugin.json', claudeManifest);

const claudeMarketplace = readJson('.claude-plugin/marketplace.json');
for (const plugin of claudeMarketplace.plugins ?? []) {
  if (plugin.name === 'copyskills') plugin.version = version;
}
writeJson('.claude-plugin/marketplace.json', claudeMarketplace);

const versionConstantFiles = [
  'packages/core/src/index.ts',
  'packages/cli/src/index.ts',
  'packages/mcp-server/src/index.ts',
];
for (const relativePath of versionConstantFiles) {
  const target = path.join(repoRoot, relativePath);
  const content = fs.readFileSync(target, 'utf8');
  fs.writeFileSync(target, content.replace(/export const VERSION = '[^']+';/, `export const VERSION = '${version}';`));
}

const textFiles = [
  'README.md',
  'USAGE.md',
  'scripts/test-packed-artifacts.sh',
  'packages/mcp-server/src/server.ts',
];

function collectTypeScriptFiles(relativeDirectory) {
  const absoluteDirectory = path.join(repoRoot, relativeDirectory);
  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) collectTypeScriptFiles(relativePath);
    if (entry.isFile() && entry.name.endsWith('.ts')) textFiles.push(relativePath);
  }
}
collectTypeScriptFiles('packages/integrations/src');

for (const relativePath of new Set(textFiles)) {
  const target = path.join(repoRoot, relativePath);
  const content = fs.readFileSync(target, 'utf8')
    .replace(/@copydoc\/mcp@\^?\d+\.\d+\.\d+/g, `@copydoc/mcp@${version}`)
    .replace(/@copydoc\/integrations@\^?\d+\.\d+\.\d+/g, `@copydoc/integrations@${version}`)
    .replace(/\{ name: 'copydoc-mcp', version: '[^']+' \}/g, `{ name: 'copydoc-mcp', version: '${version}' }`);
  fs.writeFileSync(target, content);
}

console.log(`Set Copydoc package and plugin versions to ${version}`);
