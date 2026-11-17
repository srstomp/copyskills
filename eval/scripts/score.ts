import { join } from 'node:path';
import { calibrationGroups, type CalibrationPassage, type LabelMap, type PairMap } from './bundles';
import { jsonLines, random, readJSON, readText, shuffle, unitKey, writeJSON, writeText, type Run, type Unit } from './parse';

export function normalizeQuote(text: string): string {
  return text.normalize('NFC').toLowerCase().replace(/[“”„«»]/g, '"').replace(/[‘’‚]/g, "'").replace(/[\p{Pd}−]/gu, '-').replace(/\s+/gu, ' ').trim();
}

export function validateReader(lines: string[], maps: Record<string, LabelMap>, units: Unit[], reader: string): { flags: string[]; failures: string[] } {
  const texts = new Map(units.map(u => [unitKey(u), u.text]));
  const flags = new Set<string>();
  const failures: string[] = [];
  lines.forEach((line, index) => {
    try {
      const row = JSON.parse(line);
      if (!row || typeof row !== 'object') throw new Error('Expected a flag object');
      if (!Object.hasOwn(maps, row.task)) throw new Error(`Unknown task ${row.task}`);
      const map = maps[row.task];
      if (!Object.hasOwn(map, row.label)) throw new Error(`Unknown label ${row.label}`);
      const item = map[row.label];
      const key = unitKey({ task: row.task, ...item, unit: row.unit });
      const text = texts.get(key);
      if (text === undefined) throw new Error(`Unknown unit ${row.unit}`);
      if (typeof row.quote !== 'string' || !normalizeQuote(row.quote)) throw new Error('Empty or invalid quote');
      if (typeof row.reason !== 'string' || typeof row.fix !== 'string') throw new Error('Flag requires reason and fix');
      const quote = [...normalizeQuote(row.quote)].slice(0, 30).join('');
      if (!normalizeQuote(text).startsWith(quote)) throw new Error(`Quote does not match ${row.label} ${row.unit}: ${row.quote}`);
      flags.add(key);
    } catch (error) {
      failures.push(`line ${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  if (failures.length / lines.length > 0.05) throw new Error(`${reader}: ${failures.length}/${lines.length} invalid flags (>5%)\n${failures.join('\n')}`);
  return { flags: [...flags], failures };
}

export interface ArmRead {
  units: number; flagsA: number; flagsB: number; agreed: number; shareAgreed: number;
  outputs: { n: number; units: number; flagsA: number; flagsB: number; agreed: number; shareAgreed: number }[];
}
export interface ReadScore {
  units: Unit[];
  flagsA: string[]; flagsB: string[];
  failures: { readerA: string[]; readerB: string[] };
  tasks: { task: string; arms: { A: ArmRead; B: ArmRead }; difference: number }[];
}

export function readScore(run: Run, readerA: string, readerB: string): ReadScore {
  const units = jsonLines(join(run.dir, 'units.jsonl')).map(line => JSON.parse(line) as Unit);
  const maps = Object.fromEntries(run.tasks.map(t => [t.id, readJSON<LabelMap>(join(run.dir, 'read', `${t.id}.map.json`))]));
  const a = validateReader(jsonLines(readerA), maps, units, readerA);
  const b = validateReader(jsonLines(readerB), maps, units, readerB);
  const flagsA = new Set(a.flags), flagsB = new Set(b.flags);
  const tasks = run.tasks.map(task => {
    const arms = Object.fromEntries(run.config.arms.map(arm => {
      const out = Array.from({ length: run.config.n }, (_, index) => {
        const n = index + 1;
        const keys = units.filter(u => u.task === task.id && u.arm === arm && u.n === n).map(unitKey);
        if (!keys.length) throw new Error(`No units for ${task.id} ${arm}${n}`);
        const agreed = keys.filter(key => flagsA.has(key) && flagsB.has(key)).length;
        return { n, units: keys.length, flagsA: keys.filter(key => flagsA.has(key)).length, flagsB: keys.filter(key => flagsB.has(key)).length, agreed, shareAgreed: agreed / keys.length };
      });
      return [arm, {
        units: out.reduce((sum, o) => sum + o.units, 0),
        flagsA: out.reduce((sum, o) => sum + o.flagsA, 0),
        flagsB: out.reduce((sum, o) => sum + o.flagsB, 0),
        agreed: out.reduce((sum, o) => sum + o.agreed, 0),
        shareAgreed: out.reduce((sum, o) => sum + o.shareAgreed, 0) / out.length,
        outputs: out,
      }];
    })) as unknown as ReadScore['tasks'][number]['arms'];
    return { task: task.id, arms, difference: arms.A.shareAgreed - arms.B.shareAgreed };
  });
  const result: ReadScore = { units, flagsA: a.flags, flagsB: b.flags, failures: { readerA: a.failures, readerB: b.failures }, tasks };
  writeJSON(join(run.dir, 'read-score.json'), result);
  return result;
}

export interface JudgeScore {
  tasks: { task: string; preference: number; score: number; pairs: { judge: number; pair: string; orders: number[]; preference: number }[] }[];
}
export function judgeScore(run: Run, files: string[]): JudgeScore {
  if (files.length < 2 || files.length % 2) throw new Error('Each judge needs order1 and order2 files');
  const tasks: JudgeScore['tasks'] = run.tasks.map(t => ({ task: t.id, preference: 0, score: 0, pairs: [] }));
  for (let judge = 0; judge < files.length / 2; judge++) {
    const orders = [1, 2].map(order => {
      const file = files[judge * 2 + order - 1];
      const values = new Map<string, number>();
      const maps = Object.fromEntries(run.tasks.map(t => [t.id, readJSON<PairMap>(join(run.dir, 'judge', `${t.id}.order${order}.map.json`))]));
      for (const [index, line] of jsonLines(file).entries()) {
        const row = JSON.parse(line);
        const pair = maps[row.task]?.[row.pair];
        if (!pair || ![1, 2, 'tie'].includes(row.prefer) || typeof row.reason !== 'string') throw new Error(`${file} line ${index + 1}: invalid task, pair or preference`);
        const key = JSON.stringify([row.task, row.pair]);
        if (values.has(key)) throw new Error(`${file}: duplicate ${key}`);
        values.set(key, row.prefer === 'tie' ? 0.5 : pair[String(row.prefer) as '1' | '2'] === 'B' ? 1 : 0);
      }
      for (const task of run.tasks) for (let n = 1; n <= run.config.n; n++) {
        const key = JSON.stringify([task.id, `P${n}`]);
        if (!values.has(key)) throw new Error(`${file}: missing judgement ${key}`);
      }
      return values;
    });
    for (const task of tasks) for (let n = 1; n <= run.config.n; n++) {
      const pair = `P${n}`, key = JSON.stringify([task.task, pair]);
      const values = orders.map(o => o.get(key)!);
      task.pairs.push({ judge: judge + 1, pair, orders: values, preference: (values[0] + values[1]) / 2 });
    }
  }
  for (const task of tasks) {
    task.preference = task.pairs.reduce((sum, pair) => sum + pair.preference, 0) / task.pairs.length;
    task.score = task.preference - 0.5;
  }
  const result = { tasks };
  writeJSON(join(run.dir, 'judge-score.json'), result);
  return result;
}

interface OwnerItem extends Unit { item: number; expected: 'off' | 'natural' }
export function ownerSheet(run: Run, seed = 1): void {
  const score = readJSON<ReadScore>(join(run.dir, 'read-score.json'));
  const a = new Set(score.flagsA), b = new Set(score.flagsB);
  const nl = new Set(run.tasks.filter(t => /^nl(?:-|$)/i.test(t.locale)).map(t => t.id));
  const units = score.units.filter(u => nl.has(u.task));
  const next = random(seed);
  const agreed = shuffle(units.filter(u => a.has(unitKey(u)) && b.has(unitKey(u))), next).slice(0, 8);
  const neither = shuffle(units.filter(u => !a.has(unitKey(u)) && !b.has(unitKey(u))), next).slice(0, 7);
  if (agreed.length !== 8 || neither.length !== 7) throw new Error(`Owner sheet requires 8 agreed and 7 neither NL units; found ${agreed.length} and ${neither.length}`);
  const items: OwnerItem[] = shuffle([...agreed.map(u => ({ ...u, expected: 'off' as const })), ...neither.map(u => ({ ...u, expected: 'natural' as const }))], next).map((u, i) => ({ item: i + 1, ...u }));
  const sheet = items.map(item => {
    const task = run.tasks.find(t => t.id === item.task)!;
    return `${item.item}. ${item.text.replace(/\s*\n\s*/g, ' ')}\n\nContext: ${task.channel}; ${task.audience}\n\nanswer: natural / off`;
  }).join('\n\n');
  writeText(join(run.dir, 'owner-check.md'), '# Owner check\n\n' + sheet + '\n');
  writeJSON(join(run.dir, 'owner-check.key.json'), { items });
}
export function ownerScore(run: Run, file: string): { matches: number; total: number; confirmed: number; agreed: number; pass: boolean } {
  const { items } = readJSON<{ items: OwnerItem[] }>(join(run.dir, 'owner-check.key.json'));
  const answers = new Map<number, string>();
  const blocks = readText(file).split(/^(?=\d+\. )/m).slice(1);
  for (const block of blocks) {
    const item = Number(block.match(/^(\d+)\./)?.[1]);
    const matches = [...block.matchAll(/^answer:\s*(natural|off)\s*$/gm)];
    if (matches.length !== 1 || answers.has(item) || !items.some(i => i.item === item)) throw new Error(`Invalid answer for item ${item}`);
    answers.set(item, matches[0][1]);
  }
  if (answers.size !== items.length) throw new Error(`Expected ${items.length} filled answers, found ${answers.size}`);
  const matches = items.filter(i => answers.get(i.item) === i.expected).length;
  const confirmed = items.filter(i => i.expected === 'off' && answers.get(i.item) === 'off').length;
  return { matches, total: items.length, confirmed, agreed: 8, pass: matches >= 12 && confirmed >= 6 };
}

interface CalibrationRates { falseAlarm: number | null; recall: number | null }
export function calibrationScore(root: string, readerA: string, readerB: string): {
  groups: { group: string; readerA: CalibrationRates; readerB: CalibrationRates; agreed: CalibrationRates; pass: boolean }[];
  owner: { readerA: number | null; readerB: number | null; agreed: number | null };
} {
  const maps: Record<string, LabelMap> = {};
  const units: Unit[] = [];
  const passages: (CalibrationPassage & { key: string; bundleGroup: string })[] = [];
  for (const group of calibrationGroups) {
    const map = readJSON<Record<string, CalibrationPassage>>(join(root, 'eval/calibration/read', `${group}.map.json`));
    maps[group] = {};
    Object.entries(map).forEach(([label, p], index) => {
      const unit = { task: group, arm: 'calibration', n: index + 1, unit: 'p', text: p.text };
      maps[group][label] = { arm: unit.arm, n: unit.n };
      units.push(unit);
      passages.push({ ...p, key: unitKey(unit), bundleGroup: group });
    });
  }
  const a = new Set(validateReader(jsonLines(readerA), maps, units, readerA).flags);
  const b = new Set(validateReader(jsonLines(readerB), maps, units, readerB).flags);
  const rate = (items: typeof passages, flagged: (key: string) => boolean): number | null => items.length ? items.filter(p => flagged(p.key)).length / items.length : null;
  const rates = (group: string, flagged: (key: string) => boolean): CalibrationRates => ({
    falseAlarm: rate(passages.filter(p => p.bundleGroup === group && p.kind === 'clean'), flagged),
    recall: rate(passages.filter(p => p.bundleGroup === group && p.kind === 'seeded'), flagged),
  });
  const groups = calibrationGroups.map(group => {
    const agreed = rates(group, key => a.has(key) && b.has(key));
    return { group, readerA: rates(group, key => a.has(key)), readerB: rates(group, key => b.has(key)), agreed, pass: agreed.falseAlarm !== null && agreed.recall !== null && agreed.falseAlarm <= 0.15 && agreed.recall >= 0.7 };
  });
  const owner = passages.filter(p => p.group === 'nl-owner');
  return { groups, owner: { readerA: rate(owner, key => a.has(key)), readerB: rate(owner, key => b.has(key)), agreed: rate(owner, key => a.has(key) && b.has(key)) } };
}
