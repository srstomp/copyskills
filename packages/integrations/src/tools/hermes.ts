import fs from 'fs';
import path from 'path';
import type { InstallContext, InstallResult, ToolInstaller, UninstallContext } from '../types';

// The indented YAML block that represents the copydoc MCP server entry.
const COPYDOC_ENTRY_LINES = [
  '  copydoc:',
  '    command: npx',
  '    args: ["--yes", "@copydoc/mcp@0.1.1"]',
];

const COPYDOC_ENTRY_BLOCK = COPYDOC_ENTRY_LINES.join('\n') + '\n';

const FULL_CONFIG = `mcp_servers:\n${COPYDOC_ENTRY_BLOCK}`;

// In production, ~/.hermes/; in tests, <projectDir>/.hermes/
function hermesDir(projectDir: string): string {
  return path.join(projectDir, '.hermes');
}

function configYamlPath(projectDir: string): string {
  return path.join(hermesDir(projectDir), 'config.yaml');
}

function skillsLinkPath(projectDir: string): string {
  return path.join(hermesDir(projectDir), 'skills', 'copydoc');
}

function readYaml(yamlPath: string): string | null {
  try {
    return fs.readFileSync(yamlPath, 'utf8');
  } catch {
    return null;
  }
}

// Check if `copydoc:` appears under the `mcp_servers:` key (i.e. indented).
function hasCopydocEntry(content: string): boolean {
  const lines = content.split('\n');
  let inMcpServers = false;
  for (const line of lines) {
    if (line === 'mcp_servers:') {
      inMcpServers = true;
      continue;
    }
    if (inMcpServers) {
      // A non-empty line that does not start with whitespace means we've left mcp_servers
      if (line.length > 0 && !/^\s/.test(line)) {
        inMcpServers = false;
        continue;
      }
      if (line.trim() === 'copydoc:') {
        return true;
      }
    }
  }
  return false;
}

// Insert the copydoc block after `mcp_servers:` line, before the next top-level key
// (or at end of file if there is no next top-level key inside the mcp_servers block).
function insertCopydocUnderMcpServers(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inserted = false;
  let inMcpServers = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === 'mcp_servers:') {
      result.push(line);
      inMcpServers = true;
      continue;
    }

    if (inMcpServers && !inserted) {
      // Detect the end of the mcp_servers block: a non-empty line not starting with whitespace
      const isTopLevel = line.length > 0 && !/^\s/.test(line);
      if (isTopLevel) {
        // Insert before this next top-level key
        for (const entryLine of COPYDOC_ENTRY_LINES) {
          result.push(entryLine);
        }
        inserted = true;
        inMcpServers = false;
      }
    }

    result.push(line);
  }

  // If we reached end of file while still in mcp_servers (no subsequent top-level key)
  if (inMcpServers && !inserted) {
    for (const entryLine of COPYDOC_ENTRY_LINES) {
      result.push(entryLine);
    }
  }

  let joined = result.join('\n');
  // Ensure file ends with single newline
  joined = joined.replace(/\n+$/, '') + '\n';
  return joined;
}

// Append the full mcp_servers block to an existing config that lacks one
function appendMcpServersBlock(content: string): string {
  const separator = content.endsWith('\n') ? '\n' : '\n\n';
  return content + separator + FULL_CONFIG;
}

function writeCopydocConfig(projectDir: string): string {
  const yamlPath = configYamlPath(projectDir);
  const hermesConfigDir = path.dirname(yamlPath);
  if (!fs.existsSync(hermesConfigDir)) {
    fs.mkdirSync(hermesConfigDir, { recursive: true });
  }

  const existing = readYaml(yamlPath);

  if (existing === null) {
    fs.writeFileSync(yamlPath, FULL_CONFIG);
    return 'created .hermes/config.yaml with mcp_servers.copydoc entry';
  }

  if (hasCopydocEntry(existing)) {
    return 'mcp_servers.copydoc already present in .hermes/config.yaml (no change)';
  }

  if (existing.includes('mcp_servers:')) {
    const updated = insertCopydocUnderMcpServers(existing);
    fs.writeFileSync(yamlPath, updated);
    return 'appended copydoc entry under mcp_servers in .hermes/config.yaml';
  }

  // No mcp_servers key at all -- append the whole block
  const updated = appendMcpServersBlock(existing);
  fs.writeFileSync(yamlPath, updated);
  return 'added mcp_servers.copydoc block to .hermes/config.yaml';
}

// Remove all lines belonging to the `  copydoc:` entry under mcp_servers.
// Lines are "owned" by copydoc if they are indented more deeply than `  copydoc:` (2 spaces).
function removeCopydocEntry(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let skipping = false;

  for (const line of lines) {
    // Start skipping when we see the copydoc key at 2-space indent
    if (line === '  copydoc:') {
      skipping = true;
      continue;
    }

    if (skipping) {
      // Stop skipping when we see a line at <= 2-space indent that is non-empty
      // (i.e. another sibling key or a top-level key)
      if (line.length > 0 && !/^   /.test(line)) {
        skipping = false;
        result.push(line);
      }
      // else: still owned by copydoc block, skip it
      continue;
    }

    result.push(line);
  }

  let cleaned = result.join('\n');
  // Collapse excess trailing blank lines to a single newline
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  if (!cleaned.endsWith('\n')) {
    cleaned += '\n';
  }
  return cleaned;
}

export const hermesInstaller: ToolInstaller = {
  name: 'hermes',

  async install(ctx: InstallContext): Promise<InstallResult> {
    const actions: string[] = [];

    // Step 1: write config.yaml
    const configAction = writeCopydocConfig(ctx.projectDir);
    actions.push(configAction);

    // Step 2: skills symlink
    const skillsDir = path.join(hermesDir(ctx.projectDir), 'skills');
    if (!fs.existsSync(skillsDir)) {
      fs.mkdirSync(skillsDir, { recursive: true });
    }

    const linkPath = skillsLinkPath(ctx.projectDir);
    const linkExists = (() => {
      try {
        fs.lstatSync(linkPath);
        return true;
      } catch {
        return false;
      }
    })();

    if (linkExists) {
      actions.push('.hermes/skills/copydoc already exists (no change)');
    } else {
      const linkDir = path.dirname(linkPath);
      const relTarget = path.relative(linkDir, ctx.skillsDir);
      fs.symlinkSync(relTarget, linkPath);
      actions.push(`created symlink .hermes/skills/copydoc -> ${relTarget}`);
    }

    return { tool: 'hermes', actions };
  },

  async uninstall(ctx: UninstallContext): Promise<void> {
    const yamlPath = configYamlPath(ctx.projectDir);
    const existing = readYaml(yamlPath);

    if (existing !== null && hasCopydocEntry(existing)) {
      const updated = removeCopydocEntry(existing);
      fs.writeFileSync(yamlPath, updated);
    }

    const linkPath = skillsLinkPath(ctx.projectDir);
    try {
      const stat = fs.lstatSync(linkPath);
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(linkPath);
      } else if (stat.isDirectory()) {
        fs.rmSync(linkPath, { recursive: true, force: true });
      }
    } catch {
      // Does not exist, nothing to do
    }
  },

  async isConfigured(projectDir: string): Promise<boolean> {
    const yamlPath = configYamlPath(projectDir);
    const content = readYaml(yamlPath);
    if (content === null) return false;
    return hasCopydocEntry(content);
  },
};
