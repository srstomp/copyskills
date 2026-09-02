import fs from 'fs';
import path from 'path';
import type { InstallContext, InstallResult, ToolInstaller, UninstallContext } from '../types';
import { convertAllSkills } from '../converters/mdc';

const COPYDOC_ENTRY = {
  command: 'npx',
  args: ['--yes', '@copydoc/mcp@0.1.1'],
};

function mcpJsonPath(projectDir: string): string {
  return path.join(projectDir, '.cursor', 'mcp.json');
}

function rulesDir(projectDir: string): string {
  return path.join(projectDir, '.cursor', 'rules');
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

export const cursorInstaller: ToolInstaller = {
  name: 'cursor',

  async install(ctx: InstallContext): Promise<InstallResult> {
    const actions: string[] = [];

    // Step 1: Merge MCP entry into .cursor/mcp.json
    const cursorDir = path.join(ctx.projectDir, '.cursor');
    if (!fs.existsSync(cursorDir)) {
      fs.mkdirSync(cursorDir, { recursive: true });
    }

    const jsonPath = mcpJsonPath(ctx.projectDir);
    const existing = readJson(jsonPath);

    if (existing === null) {
      // File does not exist -- create with copydoc entry
      const config: Record<string, unknown> = {
        mcpServers: {
          copydoc: COPYDOC_ENTRY,
        },
      };
      writeJson(jsonPath, config);
      actions.push('created .cursor/mcp.json with mcpServers.copydoc entry');
    } else {
      const mcpServers = getMcpServers(existing);
      const alreadyPresent =
        typeof mcpServers.copydoc === 'object' &&
        mcpServers.copydoc !== null &&
        !Array.isArray(mcpServers.copydoc);

      if (alreadyPresent) {
        actions.push('mcpServers.copydoc already present in .cursor/mcp.json (no change)');
      } else {
        mcpServers.copydoc = COPYDOC_ENTRY;
        existing.mcpServers = mcpServers;
        writeJson(jsonPath, existing);
        actions.push('merged copydoc into .cursor/mcp.json');
      }
    }

    // Step 2: Generate .mdc rule files in .cursor/rules/
    const outputDir = rulesDir(ctx.projectDir);
    const writtenFiles = await convertAllSkills(ctx.skillsDir, outputDir);
    actions.push(`Generated ${writtenFiles.length} .mdc rules in .cursor/rules/`);

    return { tool: 'cursor', actions };
  },

  async uninstall(ctx: UninstallContext): Promise<void> {
    // Step 1: Remove copydoc from .cursor/mcp.json
    const jsonPath = mcpJsonPath(ctx.projectDir);
    const existing = readJson(jsonPath);

    if (existing !== null) {
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
    }

    // Step 2: Delete copydoc-*.mdc files from .cursor/rules/
    const rulesDirPath = rulesDir(ctx.projectDir);
    if (fs.existsSync(rulesDirPath)) {
      const files = fs.readdirSync(rulesDirPath);
      for (const file of files) {
        if (file.startsWith('copydoc-') && file.endsWith('.mdc')) {
          fs.unlinkSync(path.join(rulesDirPath, file));
        }
      }

      // Remove .cursor/rules/ if now empty
      const remaining = fs.readdirSync(rulesDirPath);
      if (remaining.length === 0) {
        fs.rmdirSync(rulesDirPath);
      }
    }
  },

  async isConfigured(projectDir: string): Promise<boolean> {
    const jsonPath = mcpJsonPath(projectDir);
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
