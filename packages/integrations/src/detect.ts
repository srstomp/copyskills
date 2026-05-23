import fs from 'fs';
import path from 'path';
import os from 'os';
import type { ToolName } from './types';

export type { ToolName };

export interface ToolDetector {
  name: ToolName;
  detect(projectDir: string): Promise<boolean>;
}

export interface DetectionResult {
  tool: ToolName;
  detected: boolean;
  configured: boolean;
  details?: string;
}

function dirExists(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

const detectors: ToolDetector[] = [
  {
    name: 'cursor',
    async detect(projectDir: string): Promise<boolean> {
      return dirExists(path.join(projectDir, '.cursor'));
    },
  },
  {
    name: 'codex',
    async detect(projectDir: string): Promise<boolean> {
      if (dirExists(path.join(projectDir, '.codex'))) return true;
      if (dirExists(path.join(os.homedir(), '.codex'))) return true;
      return false;
    },
  },
  {
    name: 'opencode',
    async detect(projectDir: string): Promise<boolean> {
      try {
        fs.statSync(path.join(projectDir, '.opencode.json'));
        return true;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'hermes',
    async detect(_projectDir: string): Promise<boolean> {
      return false;
    },
  },
  {
    name: 'openclaw',
    async detect(_projectDir: string): Promise<boolean> {
      return false;
    },
  },
  {
    name: 'pi',
    async detect(_projectDir: string): Promise<boolean> {
      return false;
    },
  },
];

export async function detectAll(projectDir: string): Promise<DetectionResult[]> {
  const results: DetectionResult[] = [];
  for (const detector of detectors) {
    const detected = await detector.detect(projectDir);
    results.push({ tool: detector.name, detected, configured: false });
  }
  return results;
}

export async function detectTool(name: ToolName, projectDir: string): Promise<DetectionResult> {
  const detector = detectors.find((d) => d.name === name);
  if (!detector) {
    throw new Error(`Unknown tool: ${name}`);
  }
  const detected = await detector.detect(projectDir);
  return { tool: name, detected, configured: false };
}
