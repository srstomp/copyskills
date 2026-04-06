export const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
export const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
export const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
export const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
export const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
export const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;

export function scoreColor(score: number): string {
  if (score >= 7) return green(String(score));
  if (score >= 4) return yellow(String(score));
  return red(String(score));
}

export function printTable(headers: string[], rows: string[][]): void {
  // Compute column widths
  const colWidths = headers.map((h, i) => {
    const maxData = rows.reduce((max, row) => Math.max(max, (row[i] ?? '').length), 0);
    return Math.max(h.length, maxData);
  });

  const pad = (s: string, width: number) => s.padEnd(width);

  const headerRow = headers.map((h, i) => pad(h, colWidths[i])).join('  ');
  console.log(bold(headerRow));
  console.log(colWidths.map((w) => '-'.repeat(w)).join('  '));

  for (const row of rows) {
    const line = row.map((cell, i) => pad(cell, colWidths[i])).join('  ');
    console.log(line);
  }
}
