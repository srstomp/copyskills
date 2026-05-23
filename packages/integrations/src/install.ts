import { detectAll } from './detect';
import type { ToolName, ToolInstaller, InstallContext, InstallResult, UninstallContext } from './types';
import { codexInstaller } from './tools/codex';
import { opencodeInstaller } from './tools/opencode';

function makeStubInstaller(toolName: ToolName): ToolInstaller {
  return {
    name: toolName,
    async install(ctx: InstallContext): Promise<InstallResult> {
      return { tool: toolName, actions: [] };
    },
    async uninstall(_ctx: UninstallContext): Promise<void> {
      // stub: no-op
    },
    async isConfigured(_projectDir: string): Promise<boolean> {
      return false;
    },
  };
}

export const installerRegistry: Record<ToolName, ToolInstaller> = {
  cursor: makeStubInstaller('cursor'),
  codex: codexInstaller,
  opencode: opencodeInstaller,
  hermes: makeStubInstaller('hermes'),
  openclaw: makeStubInstaller('openclaw'),
  pi: makeStubInstaller('pi'),
};

export async function installAll(ctx: InstallContext): Promise<InstallResult[]> {
  const detectionResults = await detectAll(ctx.projectDir);
  const results: InstallResult[] = [];
  for (const detection of detectionResults) {
    if (detection.detected) {
      const installer = installerRegistry[detection.tool];
      const result = await installer.install(ctx);
      results.push(result);
    }
  }
  return results;
}

export async function installTool(name: ToolName, ctx: InstallContext): Promise<InstallResult> {
  const installer = installerRegistry[name];
  if (!installer) {
    throw new Error(`No installer registered for tool: ${name}`);
  }
  return installer.install(ctx);
}
