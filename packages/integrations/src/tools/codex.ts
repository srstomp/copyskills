import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { InstallContext, InstallResult, ToolInstaller, UninstallContext } from '../types';

const SECTION_HEADER = '[mcp_servers.copydoc]';
const INSTALL_MANIFEST = 'copyskills-install.json';

const SECTION_CONTENT = `[mcp_servers.copydoc]
command = "npx"
args = ["--yes", "@copydoc/mcp@0.1.1"]
`;

interface InstallManifest {
  version: 1;
  skills: string[];
}

function homeDir(ctx: { homeDir?: string }): string {
  return ctx.homeDir ?? os.homedir();
}

function configRoot(ctx: { projectDir: string; global: boolean; homeDir?: string }): string {
  return ctx.global ? path.join(homeDir(ctx), '.codex') : path.join(ctx.projectDir, '.codex');
}

function configTomlPath(ctx: { projectDir: string; global: boolean; homeDir?: string }): string {
  return path.join(configRoot(ctx), 'config.toml');
}

function installManifestPath(ctx: { projectDir: string; global: boolean; homeDir?: string }): string {
  return path.join(configRoot(ctx), INSTALL_MANIFEST);
}

function skillsRoot(ctx: { projectDir: string; global: boolean; homeDir?: string }): string {
  const base = ctx.global ? homeDir(ctx) : ctx.projectDir;
  return path.join(base, '.agents', 'skills');
}

function pathExists(target: string): boolean {
  try {
    fs.lstatSync(target);
    return true;
  } catch {
    return false;
  }
}

function readText(target: string): string | null {
  try {
    return fs.readFileSync(target, 'utf8');
  } catch {
    return null;
  }
}

function readInstallManifest(ctx: { projectDir: string; global: boolean; homeDir?: string }): InstallManifest {
  const raw = readText(installManifestPath(ctx));
  if (raw === null) return { version: 1, skills: [] };

  try {
    const parsed = JSON.parse(raw) as Partial<InstallManifest>;
    if (parsed.version === 1 && Array.isArray(parsed.skills)) {
      return {
        version: 1,
        skills: parsed.skills.filter((name): name is string => typeof name === 'string'),
      };
    }
  } catch {
    // Replace an invalid installer-owned manifest during the next install.
  }

  return { version: 1, skills: [] };
}

function writeInstallManifest(
  ctx: { projectDir: string; global: boolean; homeDir?: string },
  manifest: InstallManifest,
): void {
  const target = installManifestPath(ctx);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`);
}

function appendCopydocSection(ctx: { projectDir: string; global: boolean; homeDir?: string }): string {
  const tomlPath = configTomlPath(ctx);
  fs.mkdirSync(path.dirname(tomlPath), { recursive: true });
  const existing = readText(tomlPath);

  if (existing === null) {
    fs.writeFileSync(tomlPath, SECTION_CONTENT);
    return `created ${tomlPath} with [mcp_servers.copydoc] section`;
  }

  if (existing.includes(SECTION_HEADER)) {
    return '[mcp_servers.copydoc] already present in config.toml (no change)';
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  fs.writeFileSync(tomlPath, existing + separator + SECTION_CONTENT);
  return `appended [mcp_servers.copydoc] section to ${tomlPath}`;
}

function removeCopydocSection(ctx: { projectDir: string; global: boolean; homeDir?: string }): string | null {
  const tomlPath = configTomlPath(ctx);
  const existing = readText(tomlPath);
  if (existing === null || !existing.includes(SECTION_HEADER)) return null;

  const lines = existing.split('\n');
  const result: string[] = [];
  let inSection = false;

  for (const line of lines) {
    if (line.trim() === SECTION_HEADER) {
      inSection = true;
      continue;
    }
    if (inSection && line.startsWith('[')) {
      inSection = false;
    }
    if (!inSection) result.push(line);
  }

  fs.writeFileSync(tomlPath, result.join('\n').replace(/\n{3,}/g, '\n\n'));
  return `removed [mcp_servers.copydoc] section from ${tomlPath}`;
}

function listSkills(sourceRoot: string): string[] {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Skills directory does not exist: ${sourceRoot}`);
  }

  return fs
    .readdirSync(sourceRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && fs.existsSync(path.join(sourceRoot, entry.name, 'SKILL.md')),
    )
    .map((entry) => entry.name)
    .sort();
}

function removeInstalledPath(target: string): void {
  if (!pathExists(target)) return;
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(target);
  } else if (stat.isDirectory()) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

export const codexInstaller: ToolInstaller = {
  name: 'codex',

  async install(ctx: InstallContext): Promise<InstallResult> {
    const skillNames = listSkills(ctx.skillsDir);
    if (skillNames.length === 0) {
      throw new Error(`No SKILL.md directories found in ${ctx.skillsDir}`);
    }

    const actions = [appendCopydocSection(ctx)];
    const destinationRoot = skillsRoot(ctx);
    fs.mkdirSync(destinationRoot, { recursive: true });

    const previousManifest = readInstallManifest(ctx);
    const previouslyOwned = new Set(previousManifest.skills);
    const installed: string[] = [];

    for (const skillName of skillNames) {
      const source = path.join(ctx.skillsDir, skillName);
      const destination = path.join(destinationRoot, skillName);

      if (pathExists(destination) && !previouslyOwned.has(skillName)) {
        actions.push(`${destination} already exists and was not modified`);
        continue;
      }

      if (previouslyOwned.has(skillName)) {
        removeInstalledPath(destination);
      }

      if (ctx.copy) {
        fs.cpSync(source, destination, { recursive: true });
        actions.push(`copied ${skillName} to ${destination}`);
      } else {
        fs.symlinkSync(source, destination, 'dir');
        actions.push(`linked ${destination} -> ${source}`);
      }
      installed.push(skillName);
    }

    writeInstallManifest(ctx, { version: 1, skills: installed });
    return { tool: 'codex', actions };
  },

  async uninstall(ctx: UninstallContext): Promise<void> {
    removeCopydocSection(ctx);

    const manifest = readInstallManifest(ctx);
    const destinationRoot = skillsRoot(ctx);
    for (const skillName of manifest.skills) {
      removeInstalledPath(path.join(destinationRoot, skillName));
    }

    const manifestPath = installManifestPath(ctx);
    if (pathExists(manifestPath)) fs.unlinkSync(manifestPath);

    // Clean up the path created by copydoc integrations <= 0.1.0.
    if (!ctx.global) {
      removeInstalledPath(path.join(ctx.projectDir, '.codex', 'skills', 'copydoc'));
    }
  },

  async isConfigured(projectDir: string): Promise<boolean> {
    const ctx = { projectDir, global: false };
    const config = readText(configTomlPath(ctx));
    const manifest = readInstallManifest(ctx);
    return (
      config?.includes(SECTION_HEADER) === true &&
      manifest.skills.length > 0 &&
      manifest.skills.every((name) => pathExists(path.join(skillsRoot(ctx), name, 'SKILL.md')))
    );
  },
};
