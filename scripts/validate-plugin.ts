import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors: string[] = [];

function readJson(relativePath: string): Record<string, any> | undefined {
  try {
    return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
  } catch (error) {
    errors.push(`${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

const manifest = readJson('.codex-plugin/plugin.json');
if (manifest) {
  if (manifest.name !== 'copyskills') errors.push('.codex-plugin/plugin.json: name must be copyskills');
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? '')) {
    errors.push('.codex-plugin/plugin.json: version must be semantic x.y.z');
  }
  if (typeof manifest.description !== 'string' || manifest.description.length === 0) {
    errors.push('.codex-plugin/plugin.json: description is required');
  }
  if (typeof manifest.author?.name !== 'string' || manifest.author.name.length === 0) {
    errors.push('.codex-plugin/plugin.json: author.name is required');
  }
  if (manifest.skills !== './skills/') errors.push('.codex-plugin/plugin.json: skills must be ./skills/');

  const skillsPath = path.resolve(repoRoot, manifest.skills ?? '');
  if (!skillsPath.startsWith(`${repoRoot}${path.sep}`) || !fs.existsSync(skillsPath)) {
    errors.push('.codex-plugin/plugin.json: skills path does not exist inside the plugin');
  }
}

const marketplace = readJson('.agents/plugins/marketplace.json');
if (marketplace) {
  if (marketplace.name !== 'copyskills') errors.push('.agents/plugins/marketplace.json: name must be copyskills');
  const plugins = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];
  const entry = plugins.find((plugin: Record<string, any>) => plugin.name === 'copyskills');
  if (!entry) {
    errors.push('.agents/plugins/marketplace.json: missing copyskills plugin entry');
  } else {
    if (entry.source?.source !== 'url' || entry.source?.url !== 'https://github.com/srstomp/copyskills.git') {
      errors.push('.agents/plugins/marketplace.json: copyskills source must point to the Git repository');
    }
    if (entry.policy?.installation !== 'AVAILABLE') {
      errors.push('.agents/plugins/marketplace.json: installation policy must be AVAILABLE');
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validated Codex plugin and marketplace metadata');
