import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export interface Deliverable {
  name: string;
  max_chars?: number;
  min_chars?: number;
  max_words?: number;
  min_words?: number;
}
export interface Task {
  id: string;
  project: string;
  set: 'dev' | 'holdout' | 'report';
  channel: string;
  locale: string;
  audience: string;
  register: string;
  email_type?: string;
  deliverables: Deliverable[];
  placeholders: string[];
  target_query?: string | null;
  replaces?: string | null;
  samples: string;
  brief: string;
  facts: string;
  unknown: string;
  existing: string;
}
export interface RunConfig {
  run: string;
  arms: ['A', 'B'];
  n: number;
  tasks: string[];
  samples: { A: boolean; B: boolean };
  pendingSamples?: boolean;
}
export interface Run { root: string; dir: string; config: RunConfig; tasks: Task[] }
export interface Output { arm: string; task: string; n: number; sections: Record<string, string> }
export interface Unit { arm: string; task: string; n: number; unit: string; text: string }

export const readText = (file: string): string => readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
export const readJSON = <T>(file: string): T => JSON.parse(readText(file));
export function writeText(file: string, text: string): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}
export const writeJSON = (file: string, value: unknown): void => writeText(file, JSON.stringify(value, null, 2) + '\n');
export const jsonLines = (file: string): string[] => readText(file).split('\n').filter(line => line.trim());
export const wordCount = (text: string): number => text.trim() ? text.trim().split(/\s+/u).length : 0;
export const unitKey = (u: Pick<Unit, 'task' | 'arm' | 'n' | 'unit'>): string => JSON.stringify([u.task, u.arm, u.n, u.unit]);

export function frontMatter(text: string): { metadata: Record<string, unknown>; body: string } {
  const match = text.match(/^\uFEFF?---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
  if (!match) throw new Error('Expected YAML front matter');
  const metadata = Bun.YAML.parse(match[1]);
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) throw new Error('Invalid YAML front matter');
  return { metadata: metadata as Record<string, unknown>, body: match[2] };
}

function sections(text: string, names?: Set<string>): Record<string, string> {
  const result: Record<string, string> = {};
  let current: string | undefined;
  for (const line of text.split('\n')) {
    const heading = line.match(/^##\s+(.+?)\s*$/)?.[1];
    if (heading && (!names || names.has(heading))) {
      if (Object.hasOwn(result, heading)) throw new Error(`Duplicate section: ${heading}`);
      current = heading;
      result[current] = '';
    } else if (current) result[current] += line + '\n';
  }
  return Object.fromEntries(Object.entries(result).map(([key, text]) => [key, text.trim()]));
}

export function parseTask(text: string): Task {
  const { metadata, body } = frontMatter(text.replace(/\r\n?/g, '\n'));
  for (const key of ['id', 'project', 'set', 'channel', 'locale', 'audience', 'register', 'samples']) {
    if (typeof metadata[key] !== 'string' || !metadata[key]) throw new Error(`Task requires ${key}`);
  }
  for (const key of ['id', 'project']) if (!/^[\w-]+$/.test(metadata[key] as string)) throw new Error(`Invalid task ${key}`);
  if (!['dev', 'holdout', 'report'].includes(metadata.set as string)) throw new Error('Invalid task set');
  if (!Array.isArray(metadata.deliverables) || !metadata.deliverables.length) throw new Error('Task requires deliverables');
  const names = new Set<string>();
  for (const d of metadata.deliverables as Deliverable[]) {
    if (!d || typeof d.name !== 'string' || !d.name.trim() || /[\n\r]/.test(d.name) || names.has(d.name) || ['needs', 'decisions', 'flags'].includes(d.name)) throw new Error('Invalid or duplicate deliverable name');
    names.add(d.name);
    for (const key of ['min_chars', 'max_chars', 'min_words', 'max_words'] as const) {
      if (d[key] !== undefined && (!Number.isInteger(d[key]) || d[key]! < 0)) throw new Error(`Invalid ${d.name} ${key}`);
    }
    for (const kind of ['chars', 'words'] as const) {
      if (d[`min_${kind}`] !== undefined && d[`max_${kind}`] !== undefined && d[`min_${kind}`]! > d[`max_${kind}`]!) throw new Error(`Invalid ${d.name} budget`);
    }
  }
  if (!Array.isArray(metadata.placeholders) || !metadata.placeholders.every(p => typeof p === 'string' && /^\{[^{}\n]+\}$/.test(p))) throw new Error('Invalid task placeholders');
  const parts = sections(body, new Set(['Brief', 'Facts', 'Unknown', 'Existing copy']));
  const facts = (parts.Facts ?? '').split('\n').flatMap(line => {
    const claim = line.match(/^F\d+:\s*(.*)$/)?.[1];
    return claim === undefined ? [] : [claim.replace(/\s*\(source:[\s\S]*\)\s*$/i, '').trim()];
  }).join('\n');
  return { ...metadata, brief: parts.Brief ?? '', facts, unknown: parts.Unknown ?? '', existing: parts['Existing copy'] ?? '' } as unknown as Task;
}

export function parseOutput(text: string, task: Task): Record<string, string> {
  const names = new Set([...task.deliverables.map(d => d.name), 'needs', 'decisions', 'flags']);
  const result = sections(text.replace(/\r\n?/g, '\n'), names);
  for (const name of ['needs', 'decisions', 'flags']) delete result[name];
  return result;
}

export function loadRun(name: string, root = process.cwd()): Run {
  const dir = resolve(root, name.includes('/') ? name : join('eval/runs', name));
  const config = readJSON<RunConfig>(join(dir, 'run.json'));
  if (JSON.stringify(config.arms) !== '["A","B"]' || !Number.isInteger(config.n) || config.n < 1 || !Array.isArray(config.tasks) || !config.tasks.length || new Set(config.tasks).size !== config.tasks.length) throw new Error('Invalid run arms, n or tasks');
  if (!config.samples || typeof config.samples.A !== 'boolean' || typeof config.samples.B !== 'boolean') throw new Error('Invalid run samples');
  const tasks = config.tasks.map(id => {
    if (typeof id !== 'string' || !/^[\w-]+$/.test(id)) throw new Error(`Invalid task id: ${id}`);
    const files = ['tasks', 'holdout', 'report-only'].map(set => join(root, 'eval', set, `${id}.md`)).filter(existsSync);
    if (files.length !== 1) throw new Error(`Expected exactly one task file for ${id}; found ${files.length}`);
    const task = parseTask(readText(files[0]));
    if (task.id !== id) throw new Error(`Task id mismatch: ${id} / ${task.id}`);
    return task;
  });
  return { root, dir, config, tasks };
}

export function outputs(run: Run): Output[] {
  return run.tasks.flatMap(task => run.config.arms.flatMap(arm => Array.from({ length: run.config.n }, (_, index) => {
    const n = index + 1;
    return { arm, task: task.id, n, sections: parseOutput(readText(join(run.dir, 'out', arm, task.id, `${n}.md`)), task) };
  })));
}

/** Mulberry32 and Fisher-Yates: no dependence on wall clock or filesystem order. */
export function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle<T>(items: readonly T[], next: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
