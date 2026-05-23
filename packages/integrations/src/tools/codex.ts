import fs from 'fs';
import path from 'path';
import type { InstallContext, InstallResult, ToolInstaller, UninstallContext } from '../types';

const SECTION_HEADER = '[mcp_servers.copydoc]';

const SECTION_CONTENT = `[mcp_servers.copydoc]
command = "npx"
args = ["@copydoc/mcp"]
`;

function configTomlPath(projectDir: string): string {
  return path.join(projectDir, '.codex', 'config.toml');
}

function skillsLinkPath(projectDir: string): string {
  return path.join(projectDir, '.codex', 'skills', 'copydoc');
}

function readToml(tomlPath: string): string | null {
  try {
    return fs.readFileSync(tomlPath, 'utf8');
  } catch {
    return null;
  }
}

function appendCopydocSection(projectDir: string): string {
  const tomlPath = configTomlPath(projectDir);
  // Ensure parent .codex/ directory exists before writing
  const codexDir = path.dirname(tomlPath);
  if (!fs.existsSync(codexDir)) {
    fs.mkdirSync(codexDir, { recursive: true });
  }
  const existing = readToml(tomlPath);

  if (existing === null) {
    fs.writeFileSync(tomlPath, SECTION_CONTENT);
    return 'created .codex/config.toml with [mcp_servers.copydoc] section';
  }

  if (existing.includes(SECTION_HEADER)) {
    return '[mcp_servers.copydoc] already present in config.toml (no change)';
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  fs.writeFileSync(tomlPath, existing + separator + SECTION_CONTENT);
  return 'appended [mcp_servers.copydoc] section to .codex/config.toml';
}

function removeCopydocSection(projectDir: string): string | null {
  const tomlPath = configTomlPath(projectDir);
  const existing = readToml(tomlPath);
  if (existing === null) {
    return null;
  }
  if (!existing.includes(SECTION_HEADER)) {
    return null;
  }

  const lines = existing.split('\n');
  const result: string[] = [];
  let inSection = false;

  for (const line of lines) {
    if (line.trim() === SECTION_HEADER) {
      inSection = true;
      continue;
    }
    if (inSection) {
      // Stop skipping when we hit the next section header or end
      if (line.startsWith('[')) {
        inSection = false;
        result.push(line);
      }
      // Skip all lines belonging to the copydoc section
    } else {
      result.push(line);
    }
  }

  // Clean up excess trailing newlines (collapse to one)
  let cleaned = result.join('\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  fs.writeFileSync(tomlPath, cleaned);
  return 'removed [mcp_servers.copydoc] section from .codex/config.toml';
}

function ensureSkillsDir(projectDir: string): void {
  const skillsDir = path.join(projectDir, '.codex', 'skills');
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }
}

function copyDirRecursive(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export const codexInstaller: ToolInstaller = {
  name: 'codex',

  async install(ctx: InstallContext): Promise<InstallResult> {
    const actions: string[] = [];

    // Step 1: write config.toml
    const tomlAction = appendCopydocSection(ctx.projectDir);
    actions.push(tomlAction);

    // Step 2: set up skills link
    ensureSkillsDir(ctx.projectDir);
    const linkPath = skillsLinkPath(ctx.projectDir);

    const linkExists = (() => { try { fs.lstatSync(linkPath); return true; } catch { return false; } })();

    if (linkExists) {
      // Already exists -- skip to keep install idempotent
      actions.push('.codex/skills/copydoc already exists (no change)');
    } else if (ctx.copy) {
      copyDirRecursive(ctx.skillsDir, linkPath);
      actions.push(`copied skills directory to .codex/skills/copydoc`);
    } else {
      const linkDir = path.dirname(linkPath);
      const relTarget = path.relative(linkDir, ctx.skillsDir);
      fs.symlinkSync(relTarget, linkPath);
      actions.push(`created symlink .codex/skills/copydoc -> ${relTarget}`);
    }

    return { tool: 'codex', actions };
  },

  async uninstall(ctx: UninstallContext): Promise<void> {
    // Remove TOML section
    removeCopydocSection(ctx.projectDir);

    // Remove symlink or copied directory
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
    const tomlPath = configTomlPath(projectDir);
    const content = readToml(tomlPath);
    if (content === null) return false;
    return content.includes(SECTION_HEADER);
  },
};
