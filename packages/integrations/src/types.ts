export type ToolName = 'cursor' | 'codex' | 'opencode' | 'hermes' | 'openclaw' | 'pi';

export interface InstallContext {
  projectDir: string;
  skillsDir: string;
  global: boolean;
  copy: boolean;
  /** Test and embedding override for the user's home directory. */
  homeDir?: string;
}

export interface InstallResult {
  tool: ToolName;
  actions: string[];
}

export interface UninstallContext {
  projectDir: string;
  global: boolean;
  /** Test and embedding override for the user's home directory. */
  homeDir?: string;
}

export interface ToolInstaller {
  name: ToolName;
  install(ctx: InstallContext): Promise<InstallResult>;
  uninstall(ctx: UninstallContext): Promise<void>;
  isConfigured(projectDir: string): Promise<boolean>;
}
