import { detectAll } from './detect';
import type { DetectionResult } from './detect';
import { installerRegistry } from './install';

export { detectAll as getStatus };

export async function getStatusForDir(projectDir: string): Promise<DetectionResult[]> {
  const results = await detectAll(projectDir);
  return Promise.all(
    results.map(async (result) => {
      const configured = await installerRegistry[result.tool].isConfigured(projectDir);
      return {
        ...result,
        detected: result.detected || configured,
        configured,
      };
    }),
  );
}

const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  codex: 'Codex',
  opencode: 'OpenCode',
  hermes: 'Hermes',
  openclaw: 'OpenClaw',
  pi: 'Pi',
};

export function formatStatus(results: DetectionResult[]): string {
  const lines: string[] = [];
  lines.push('Copyskills Integration Status');
  lines.push('');
  for (const r of results) {
    const label = TOOL_LABELS[r.tool] ?? r.tool;
    const detectedLabel = r.detected ? 'detected' : 'not found';
    let configLabel: string;
    if (!r.detected) {
      configLabel = '-';
    } else if (r.configured) {
      const extra = r.details ? ` (${r.details})` : '';
      configLabel = `configured${extra}`;
    } else {
      configLabel = 'not configured';
    }
    const paddedLabel = label.padEnd(12);
    const paddedDetected = detectedLabel.padEnd(12);
    lines.push(`  ${paddedLabel} ${paddedDetected} ${configLabel}`);
  }
  return lines.join('\n');
}
