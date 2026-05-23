import { detectAll } from './detect';
import type { DetectionResult } from './detect';

export { detectAll as getStatus };

export async function getStatusForDir(projectDir: string): Promise<DetectionResult[]> {
  return detectAll(projectDir);
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
