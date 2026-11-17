import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { frontMatter, jsonLines, outputs, random, readText, shuffle, writeJSON, writeText, type Run, type Task } from './parse';
import { writeUnits } from './units';

export interface LabelMap { [label: string]: { arm: string; n: number } }
export interface PairMap { [pair: string]: { '1': string; '2': string } }
export interface CalibrationPassage { id: string; group: 'nl' | 'nl-owner' | 'en' | 'en-dev'; text: string; kind: 'clean' | 'seeded' }
export const calibrationGroups = ['nl', 'en', 'en-dev'] as const;

function samples(run: Run, task: Task): string {
  if (!Object.values(run.config.samples).some(Boolean)) return '';
  const file = join(run.root, 'eval/samples', task.project, 'judge.md');
  if (!existsSync(file)) return '';
  let body = readText(file);
  let approved: boolean;
  if (body.startsWith('---\n')) {
    const parsed = frontMatter(body);
    approved = parsed.metadata.status === 'approved';
    body = parsed.body;
  } else {
    approved = /^status:\s*approved\s*$/im.test(body);
    body = body.replace(/^status:.*\n?/im, '');
  }
  return approved || run.config.pendingSamples ? `\n## Voice samples\n\n${body.trim()}\n` : '';
}
function context(run: Run, task: Task): string {
  return `Locale: ${task.locale}\nAudience: ${task.audience}\nRegister: ${task.register}\n${samples(run, task)}`;
}

export function readBundles(run: Run, seed = 1): void {
  const units = writeUnits(run);
  const next = random(seed);
  for (const task of run.tasks) {
    const items = shuffle(run.config.arms.flatMap(arm => Array.from({ length: run.config.n }, (_, i) => ({ arm, n: i + 1 }))), next);
    const map: LabelMap = {};
    let text = context(run, task);
    items.forEach((item, i) => {
      const label = `X${i + 1}`;
      map[label] = item;
      text += `\n## ${label}\n\n` + units.filter(u => u.task === task.id && u.arm === item.arm && u.n === item.n).map(u => `[${label} ${u.unit}] ${u.text.replace(/\s*\n\s*/g, ' ')}`).join('\n') + '\n';
    });
    writeText(join(run.dir, 'read', `${task.id}.md`), text);
    writeJSON(join(run.dir, 'read', `${task.id}.map.json`), map);
  }
}

export function judgeBundles(run: Run, seed = 1): void {
  const all = outputs(run);
  const next = random(seed);
  for (const task of run.tasks) {
    const firstA = next() < 0.5;
    for (const order of [1, 2]) {
      const map: PairMap = {};
      let text = context(run, task) + `\n## Brief\n\n${task.brief}\n`;
      for (let n = 1; n <= run.config.n; n++) {
        const aFirst = (n % 2 === 1) === firstA;
        const sides = aFirst !== (order === 2) ? ['A', 'B'] : ['B', 'A'];
        const pair = `P${n}`;
        map[pair] = { '1': sides[0], '2': sides[1] };
        text += `\n## ${pair}\n`;
        sides.forEach((arm, i) => {
          const output = all.find(o => o.task === task.id && o.n === n && o.arm === arm)!;
          text += `\n### Copy ${i + 1}\n\n` + task.deliverables.map(d => `#### ${d.name}\n\n${output.sections[d.name] ?? ''}`).join('\n\n') + '\n';
        });
      }
      writeText(join(run.dir, 'judge', `${task.id}.order${order}.md`), text);
      writeJSON(join(run.dir, 'judge', `${task.id}.order${order}.map.json`), map);
    }
  }
}

export function calibrationBundles(root = process.cwd(), seed = 1): void {
  const passages: CalibrationPassage[] = [];
  for (const kind of ['clean', 'seeded'] as const) {
    const ids = new Set<string>();
    for (const line of jsonLines(join(root, `eval/calibration/${kind}.jsonl`))) {
      const passage = JSON.parse(line) as CalibrationPassage;
      if (typeof passage.id !== 'string' || ids.has(passage.id) || !['nl', 'nl-owner', 'en', 'en-dev'].includes(passage.group) || typeof passage.text !== 'string' || !passage.text.trim()) throw new Error(`Invalid ${kind} calibration passage`);
      ids.add(passage.id);
      passages.push({ ...passage, kind });
    }
  }
  const next = random(seed);
  for (const group of calibrationGroups) {
    const items = shuffle(passages.filter(p => (p.group === 'nl-owner' ? 'nl' : p.group) === group), next);
    const map: Record<string, CalibrationPassage> = {};
    const text = items.map((p, i) => {
      const label = `C${i + 1}`;
      map[label] = p;
      return `[${label} p] ${p.text.replace(/\s*\n\s*/g, ' ')}`;
    }).join('\n\n') + '\n';
    writeText(join(root, 'eval/calibration/read', `${group}.md`), text);
    writeJSON(join(root, 'eval/calibration/read', `${group}.map.json`), map);
  }
}
