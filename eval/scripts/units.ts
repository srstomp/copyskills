import { join } from 'node:path';
import { outputs, placeholderPattern, writeText, type Run, type Task, type Unit } from './parse';

export function splitSentences(text: string): string[] {
  // Boundaries are inspected on a same-length mask so source text stays exact.
  const placeholderMask = text.replace(placeholderPattern, value => value.replace(/[\s\S]/g, 'x'));
  const masked = placeholderMask.replace(/^[ \t]*\d+\. /gm, value => value.replace('.', 'x'))
    .replace(/^[ \t]*#{1,6}\s+.*$/gm, value => value.replace(/[.!?…]/g, 'x'))
    .replace(/(?<![\p{L}\p{N}])(?:e\.g\.|bijv\.|o\.a\.|z\.B\.|ca\.|incl\.|nr\.|St\.)/giu, value => value.replace(/\./g, 'x'));
  const boundaries = new Set<number>([0, text.length]);
  for (const match of masked.matchAll(/[.!?…]+["'”’»\)\]\}]*\s+(?=[\p{Lu}\d"'“‘«]|$)/gu)) boundaries.add(match.index! + match[0].trimEnd().length);
  for (const match of masked.matchAll(/\n[ \t]*\n+/g)) boundaries.add(match.index!);
  // A heading or list starts a block; a heading also ends at its newline.
  for (const match of placeholderMask.matchAll(/^(?:[ \t]*(?:[-*] |\d+\. )|[ \t]*#{1,6}[ \t]+).*$/gm)) {
    boundaries.add(match.index!);
    if (/^\s*#/.test(match[0])) boundaries.add(match.index! + match[0].length);
  }
  const points = [...boundaries].sort((a, b) => a - b);
  return points.slice(1).map((end, i) => text.slice(points[i], end).trim()).filter(Boolean);
}

export function outputUnits(task: Task, sections: Record<string, string>, arm: string, n: number): Unit[] {
  return task.deliverables.flatMap(d => {
    const text = (sections[d.name] ?? '').trim();
    const whole = d.min_chars !== undefined || d.max_chars !== undefined;
    return (whole ? (text ? [text] : []) : splitSentences(text)).map((text, i) => ({ arm, task: task.id, n, unit: whole ? d.name : `${d.name}#${i + 1}`, text }));
  });
}

export function writeUnits(run: Run): Unit[] {
  const tasks = new Map(run.tasks.map(t => [t.id, t]));
  const units = outputs(run).flatMap(o => outputUnits(tasks.get(o.task)!, o.sections, o.arm, o.n));
  writeText(join(run.dir, 'units.jsonl'), units.map(u => JSON.stringify(u)).join('\n') + (units.length ? '\n' : ''));
  return units;
}
