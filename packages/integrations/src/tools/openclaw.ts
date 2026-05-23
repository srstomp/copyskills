import fs from 'fs';
import path from 'path';
import os from 'os';
import type { InstallContext, InstallResult, ToolInstaller, UninstallContext } from '../types';

const COPYDOC_MCP_ENTRY = {
  command: 'npx',
  args: ['@copydoc/mcp'],
};

// In production the config lives at ~/.openclaw/openclaw.json.
// In tests we resolve from projectDir so tests stay hermetic.
function configJsonPath(projectDir: string): string {
  const projectLocal = path.join(projectDir, '.openclaw', 'openclaw.json');
  if (fs.existsSync(path.dirname(projectLocal)) || projectDir !== os.homedir()) {
    return projectLocal;
  }
  return path.join(os.homedir(), '.openclaw', 'openclaw.json');
}

function readJson(jsonPath: string): Record<string, unknown> | null {
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return null;
  }
}

function writeJson(jsonPath: string, data: Record<string, unknown>): void {
  const dir = path.dirname(jsonPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
}

// Safe nested object accessor -- returns a mutable object at the given nested path,
// creating intermediate objects as needed.
function ensureNestedObject(
  root: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> {
  let current = root;
  for (const key of keys) {
    const existing = current[key];
    if (existing === null || typeof existing !== 'object' || Array.isArray(existing)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  return current;
}

function getMcpServers(config: Record<string, unknown>): Record<string, unknown> {
  return ensureNestedObject(config, ['mcp', 'servers']);
}

function hasCopydocMcp(config: Record<string, unknown>): boolean {
  const mcp = config.mcp;
  if (typeof mcp !== 'object' || mcp === null || Array.isArray(mcp)) return false;
  const servers = (mcp as Record<string, unknown>).servers;
  if (typeof servers !== 'object' || servers === null || Array.isArray(servers)) return false;
  const copydoc = (servers as Record<string, unknown>).copydoc;
  return typeof copydoc === 'object' && copydoc !== null && !Array.isArray(copydoc);
}

export const openclawInstaller: ToolInstaller = {
  name: 'openclaw',

  async install(ctx: InstallContext): Promise<InstallResult> {
    const actions: string[] = [];
    const jsonPath = configJsonPath(ctx.projectDir);
    const existing = readJson(jsonPath) ?? {};

    // --- MCP entry ---
    const mcpServers = getMcpServers(existing);
    const mcpAlreadyPresent = hasCopydocMcp(existing);

    if (mcpAlreadyPresent) {
      actions.push('mcp.servers.copydoc already present in openclaw.json (no change)');
    } else {
      mcpServers.copydoc = COPYDOC_MCP_ENTRY;
      actions.push('merged mcp.servers.copydoc entry into openclaw.json');
    }

    // --- skills.load.extraDirs ---
    const skillsObj = ensureNestedObject(existing, ['skills', 'load']);
    const rawDirs = skillsObj.extraDirs;
    const extraDirs: string[] = Array.isArray(rawDirs) ? (rawDirs as string[]) : [];

    if (extraDirs.includes(ctx.skillsDir)) {
      actions.push('skills.load.extraDirs already contains skillsDir (no change)');
    } else {
      extraDirs.push(ctx.skillsDir);
      skillsObj.extraDirs = extraDirs;
      actions.push(`added ${ctx.skillsDir} to skills.load.extraDirs in openclaw.json`);
    }

    // Track which skillsDir we installed so uninstall can remove the exact entry.
    // UninstallContext does not carry skillsDir, so we persist it in the config.
    (existing as Record<string, unknown>)._copydocSkillsDir = ctx.skillsDir;

    writeJson(jsonPath, existing);

    return { tool: 'openclaw', actions };
  },

  async uninstall(ctx: UninstallContext): Promise<void> {
    const jsonPath = configJsonPath(ctx.projectDir);
    const existing = readJson(jsonPath);
    if (existing === null) return;

    // Remove copydoc from mcp.servers
    const mcp = existing.mcp;
    if (typeof mcp === 'object' && mcp !== null && !Array.isArray(mcp)) {
      const servers = (mcp as Record<string, unknown>).servers;
      if (typeof servers === 'object' && servers !== null && !Array.isArray(servers)) {
        delete (servers as Record<string, unknown>).copydoc;
        if (Object.keys(servers).length === 0) {
          delete (mcp as Record<string, unknown>).servers;
        }
      }
      if (Object.keys(mcp as Record<string, unknown>).length === 0) {
        delete existing.mcp;
      }
    }

    // Remove our skillsDir entry from skills.load.extraDirs using the tracked path.
    const trackedDir = (existing as Record<string, unknown>)._copydocSkillsDir as
      | string
      | undefined;
    const skills = existing.skills;
    if (
      trackedDir !== undefined &&
      typeof skills === 'object' &&
      skills !== null &&
      !Array.isArray(skills)
    ) {
      const load = (skills as Record<string, unknown>).load;
      if (typeof load === 'object' && load !== null && !Array.isArray(load)) {
        const extraDirs = (load as Record<string, unknown>).extraDirs;
        if (Array.isArray(extraDirs)) {
          const filtered = (extraDirs as string[]).filter((d) => d !== trackedDir);
          if (filtered.length === 0) {
            delete (load as Record<string, unknown>).extraDirs;
          } else {
            (load as Record<string, unknown>).extraDirs = filtered;
          }
        }
        if (Object.keys(load as Record<string, unknown>).length === 0) {
          delete (skills as Record<string, unknown>).load;
        }
      }
      if (Object.keys(skills as Record<string, unknown>).length === 0) {
        delete existing.skills;
      }
    }

    // Remove tracking key
    delete (existing as Record<string, unknown>)._copydocSkillsDir;

    writeJson(jsonPath, existing);
  },

  async isConfigured(projectDir: string): Promise<boolean> {
    const jsonPath = configJsonPath(projectDir);
    const config = readJson(jsonPath);
    if (config === null) return false;
    return hasCopydocMcp(config);
  },
};
