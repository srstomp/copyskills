import { detectAll } from './detect';
import { installerRegistry } from './install';
import type { ToolName, UninstallContext } from './types';

export async function uninstallAll(ctx: UninstallContext): Promise<void> {
  const detectionResults = await detectAll(ctx.projectDir);
  for (const detection of detectionResults) {
    if (detection.detected) {
      const installer = installerRegistry[detection.tool];
      await installer.uninstall(ctx);
    }
  }
}

export async function uninstallTool(name: ToolName, ctx: UninstallContext): Promise<void> {
  const installer = installerRegistry[name];
  if (!installer) {
    throw new Error(`No installer registered for tool: ${name}`);
  }
  await installer.uninstall(ctx);
}
