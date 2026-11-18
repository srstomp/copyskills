import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { frontMatter, jsonLines, outputs, random, readText, shuffle, writeJSON, writeText, type Run, type Task } from './parse';
import { writeUnits } from './units';

export interface LabelMap { [label: string]: { arm: string; n: number } }
export interface PairMap { [pair: string]: { '1': string; '2': string } }
export interface CalibrationPassage { id: string; group: 'nl' | 'nl-owner' | 'en' | 'en-dev'; text: string; clean_id?: string; kind: 'clean' | 'seeded' }
export const calibrationGroups = ['nl', 'en', 'en-dev'] as const;

function samples(run: Run, task: Task): string {
  if (task.samples === 'none' || !Object.values(run.config.samples).some(Boolean)) return '';
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
    writeJSON(join(run.dir, 'keys', `${task.id}.read.map.json`), map);
    rmSync(join(run.dir, 'read', `${task.id}.map.json`), { force: true });
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
      writeJSON(join(run.dir, 'keys', `${task.id}.order${order}.map.json`), map);
      rmSync(join(run.dir, 'judge', `${task.id}.order${order}.map.json`), { force: true });
    }
  }
}

export function calibrationBundles(root = process.cwd(), seed = 1): void {
  const passages: CalibrationPassage[] = [];
  for (const kind of ['clean', 'seeded'] as const) {
    const ids = new Set<string>();
    for (const line of jsonLines(join(root, `eval/calibration/${kind}.jsonl`))) {
      const raw = JSON.parse(line) as CalibrationPassage & { lang?: CalibrationPassage['group'] };
      // The calibration files name the group `lang`; accept either.
      const passage = { ...raw, group: raw.group ?? raw.lang } as CalibrationPassage;
      if (typeof passage.id !== 'string' || ids.has(passage.id) || !['nl', 'nl-owner', 'en', 'en-dev'].includes(passage.group) || typeof passage.text !== 'string' || !passage.text.trim()) throw new Error(`Invalid ${kind} calibration passage`);
      ids.add(passage.id);
      passages.push({ ...passage, kind });
    }
  }
  const next = random(seed);
  const clean = new Map(passages.filter(p => p.kind === 'clean').map(p => [p.id, p]));
  for (const p of passages.filter(p => p.kind === 'seeded')) {
    const twin = clean.get(p.clean_id ?? p.id);
    if (!twin || twin.group !== p.group) throw new Error(`Missing clean twin for ${p.id}`);
  }
  for (const group of calibrationGroups) {
    const items = passages.filter(p => (p.group === 'nl-owner' ? 'nl' : p.group) === group);
    const halves: CalibrationPassage[][] = [[], []];
    const locations = new Map<string, number>();
    shuffle(items.filter(p => p.kind === 'clean'), next).forEach((p, i) => {
      locations.set(p.id, i % 2);
      halves[i % 2].push(p);
    });
    for (const p of items.filter(p => p.kind === 'seeded')) halves[1 - locations.get(p.clean_id ?? p.id)!].push(p);
    halves.forEach((half, i) => {
      const map: Record<string, CalibrationPassage> = {};
      const text = shuffle(half, next).map((p, index) => {
        const label = `C${index + 1}`;
        map[label] = p;
        return `[${label} p] ${p.text.replace(/\s*\n\s*/g, ' ')}`;
      }).join('\n\n') + '\n';
      const bundle = `${group}-${i + 1}`;
      writeText(join(root, 'eval/calibration/read', `${bundle}.md`), text);
      writeJSON(join(root, 'eval/calibration/keys', `${bundle}.map.json`), map);
    });
    // Old combined bundles expose twins together; old maps expose the answers.
    rmSync(join(root, 'eval/calibration/read', `${group}.md`), { force: true });
    rmSync(join(root, 'eval/calibration/read', `${group}.map.json`), { force: true });
  }
}

export function factcheckBundles(run: Run, seed = 1): void {
  const all = outputs(run);
  const next = random(seed);
  for (const task of run.tasks) {
    const map: LabelMap = {};
    let text = `Locale: ${task.locale}\nAudience: ${task.audience}\nRegister: ${task.register}\n\n## Brief\n\n${task.brief}\n\n## Facts\n\n${task.facts}\n\n## Unknown\n\n${task.unknown}\n`;
    shuffle(all.filter(o => o.task === task.id), next).forEach((output, i) => {
      const label = `O${i + 1}`; // not F<n>: those are fact ids
      map[label] = { arm: output.arm, n: output.n };
      text += `\n## ${label}\n\n` + task.deliverables.map(d => `### ${d.name}\n\n${output.sections[d.name] ?? ''}`).join('\n\n') + '\n';
    });
    writeText(join(run.dir, 'factcheck', `${task.id}.md`), text);
    writeJSON(join(run.dir, 'keys', `${task.id}.factcheck.map.json`), map);
  }
}
