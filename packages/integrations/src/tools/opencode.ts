import fs from 'fs';
import path from 'path';
import type { InstallContext, InstallResult, ToolInstaller, UninstallContext } from '../types';

const COPYDOC_ENTRY = {
  command: 'npx',
  args: ['--yes', '@copydoc/mcp@0.1.1'],
};

function configJsonPath(projectDir: string): string {
  return path.join(projectDir, '.opencode.json');
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
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
}

function getMcpServers(config: Record<string, unknown>): Record<string, unknown> {
  const existing = config.mcpServers;
  if (existing !== null && typeof existing === 'object' && !Array.isArray(existing)) {
    return existing as Record<string, unknown>;
  }
  return {};
}

function hasOtherContent(config: Record<string, unknown>): boolean {
  const keys = Object.keys(config);
  if (keys.length === 0) return false;
  if (keys.length === 1 && keys[0] === 'mcpServers') {
    const servers = getMcpServers(config);
    return Object.keys(servers).length > 0;
  }
  return true;
}

export const opencodeInstaller: ToolInstaller = {
  name: 'opencode',

  async install(ctx: InstallContext): Promise<InstallResult> {
    const actions: string[] = [];
    const jsonPath = configJsonPath(ctx.projectDir);
    const existing = readJson(jsonPath);

    if (existing === null) {
      // File does not exist -- create it with just the copydoc entry
      const config: Record<string, unknown> = {
        mcpServers: {
          copydoc: COPYDOC_ENTRY,
        },
      };
      writeJson(jsonPath, config);
      actions.push('created .opencode.json with mcpServers.copydoc entry');
    } else {
      const mcpServers = getMcpServers(existing);
      const alreadyPresent =
        typeof mcpServers.copydoc === 'object' &&
        mcpServers.copydoc !== null &&
        !Array.isArray(mcpServers.copydoc);

      if (alreadyPresent) {
        actions.push('mcpServers.copydoc already present in .opencode.json (no change)');
      } else {
        mcpServers.copydoc = COPYDOC_ENTRY;
        existing.mcpServers = mcpServers;
        writeJson(jsonPath, existing);
        actions.push('merged mcpServers.copydoc entry into .opencode.json');
      }
    }

    return { tool: 'opencode', actions };
  },

  async uninstall(ctx: UninstallContext): Promise<void> {
    const jsonPath = configJsonPath(ctx.projectDir);
    const existing = readJson(jsonPath);
    if (existing === null) {
      return;
    }

    const mcpServers = getMcpServers(existing);
    delete mcpServers.copydoc;

    if (Object.keys(mcpServers).length === 0) {
      delete existing.mcpServers;
    } else {
      existing.mcpServers = mcpServers;
    }

    if (Object.keys(existing).length === 0) {
      fs.unlinkSync(jsonPath);
    } else {
      writeJson(jsonPath, existing);
    }
  },

  async isConfigured(projectDir: string): Promise<boolean> {
    const jsonPath = configJsonPath(projectDir);
    const config = readJson(jsonPath);
    if (config === null) return false;
    const mcpServers = getMcpServers(config);
    return (
      typeof mcpServers.copydoc === 'object' &&
      mcpServers.copydoc !== null &&
      !Array.isArray(mcpServers.copydoc)
    );
  },
};
