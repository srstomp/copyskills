import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { outputs, readJSON, wordCount, writeText, type Run } from './parse';
import { interval, type Interval } from './stats';
import type { ReadScore, JudgeScore, FactcheckScore } from './score';
import type { Guards } from './guards';

export const format = (value: number | null): string => value === null ? 'n/a' : value.toFixed(4);
export function table(headers: string[], rows: unknown[][]): string {
  const cells = (row: unknown[]) => '| ' + row.map(v => String(v).replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ') + ' |';
  return [cells(headers), cells(headers.map(() => '---')), ...rows.map(cells)].join('\n');
}
const describe = (s: Interval): string => `mean ${format(s.mean)}, sd ${format(s.sd)}, n tasks ${s.n}, one-sided 95% lower ${format(s.lower)}, upper ${format(s.upper)}`;

export function report(run: Run): string {
  const optional = <T>(name: string): T | undefined => existsSync(join(run.dir, name)) ? readJSON<T>(join(run.dir, name)) : undefined;
  const read = optional<ReadScore>('read-score.json');
  const judge = optional<JudgeScore>('judge-score.json');
  const guards = optional<Guards>('guards.json');
  const factcheck = optional<FactcheckScore>('factcheck-score.json');
  const dev = run.tasks.filter(t => t.set === 'dev');
  const devIds = new Set(dev.map(t => t.id));
  const preference = interval(judge?.tasks.filter(t => devIds.has(t.task)).map(t => t.score) ?? []);
  const defects = interval(read?.tasks.filter(t => devIds.has(t.task)).map(t => t.difference) ?? []);
  // Older guards.json files kept missed limits in `hard`; deciding on them would count a missed limit as structural.
  if (guards?.outputs.some(o => !Array.isArray(o.budget))) throw new Error('guards.json has no limit data (older format); rerun `guards` for this run');
  const guardOutputs = guards?.outputs.filter(o => devIds.has(o.task)) ?? [];
  const noisy = run.tasks.flatMap(task => {
    const a = guards?.outputs.filter(o => o.task === task.id && o.arm === 'A') ?? [];
    const b = guards?.outputs.filter(o => o.task === task.id && o.arm === 'B') ?? [];
    const complete = (items: typeof a) => items.length === run.config.n && new Set(items.map(o => o.n)).size === run.config.n;
    if (!complete(a) || !complete(b)) return [];
    const meanA = a.reduce((sum, o) => sum + o.lintErrors, 0) / a.length;
    const meanB = b.reduce((sum, o) => sum + o.lintErrors, 0) / b.length;
    return [{ task: task.id, set: task.set, A: meanA, B: meanB, difference: meanB - meanA }];
  });
  const noisyInterval = interval(noisy.filter(t => devIds.has(t.task)).map(t => t.difference));
  // Share of a task's outputs that miss a character or word limit, per arm. Limits are missed by chance in about 6% of
  // outputs (A/A runs), so they revert only when B is worse beyond its interval, like the other noisy guards.
  const budgets = run.tasks.flatMap(task => {
    const shares = run.config.arms.map(arm => {
      const items = guards?.outputs.filter(o => o.task === task.id && o.arm === arm) ?? [];
      if (items.length !== run.config.n || new Set(items.map(o => o.n)).size !== run.config.n) return null;
      return items.filter(o => o.budget.length).length / items.length;
    });
    if (shares.some(v => v === null)) return [];
    const [A, B] = shares as number[];
    return [{ task: task.id, set: task.set, A, B, difference: B - A }];
  });
  const budgetInterval = interval(budgets.filter(t => devIds.has(t.task)).map(t => t.difference));
  const facts = run.tasks.flatMap(task => {
    const counts = run.config.arms.map(arm => {
      const items = factcheck?.outputs.filter(o => o.task === task.id && o.arm === arm) ?? [];
      if (items.length !== run.config.n || new Set(items.map(o => o.n)).size !== run.config.n || items.some(o => !Number.isInteger(o.n) || o.n < 1 || o.n > run.config.n || !Array.isArray(o.unsupported))) return null;
      return items.reduce((sum, o) => sum + o.unsupported.length, 0) / items.length;
    });
    if (counts.some(c => c === null)) return [];
    const [A, B] = counts as number[];
    return [{ task: task.id, set: task.set, A, B, difference: B - A }];
  });
  const factInterval = interval(facts.filter(t => devIds.has(t.task)).map(t => t.difference));
  const failingB = guardOutputs.filter(o => o.arm === 'B' && o.hard.length);
  // Structural failures (missing section, placeholder, number not in the facts): B reverts when it has more failing outputs than A.
  const failingA = guardOutputs.filter(o => o.arm === 'A' && o.hard.length);
  // Protocol section 6: one batch can revert but never keep. Keep needs a second, independent batch (run.json "pool"):
  // the pooled per-task preference must clear zero at one-sided 95% and the second batch alone must lean towards B.
  // Agreed defects are reported only: the owner check of the readers failed (2026-11-18), so they trigger nothing.
  if (run.config.pool !== undefined && (!/^[\w.-]+$/.test(run.config.pool) || join(dirname(run.dir), run.config.pool) === run.dir)) throw new Error(`run.json pool must name another run folder, got ${run.config.pool}`);
  const first = run.config.pool ? readJSON<JudgeScore>(join(dirname(run.dir), run.config.pool, 'judge-score.json')) : undefined;
  const pooled = first ? interval(dev.map(task => {
    const a = first.tasks.find(t => t.task === task.id)?.score, b = judge?.tasks.find(t => t.task === task.id)?.score;
    return a === undefined || b === undefined ? NaN : (a + b) / 2;
  }).filter(v => !Number.isNaN(v))) : undefined;
  let outcome = run.config.pool ? 'inconclusive' : 'second batch needed', reason = run.config.pool ? 'pooled preference does not establish improvement; the change is not adopted' : 'one batch cannot keep a change; run a second batch with "pool" set to this run';
  if (failingB.length > failingA.length) {
    outcome = 'revert'; reason = `candidate B has more structural failures than A (${failingB.length} vs ${failingA.length} outputs)`;
  } else if (preference.upper !== null && preference.upper < 0) {
    outcome = 'revert'; reason = 'preference is below zero beyond its interval';
  } else if (budgetInterval.lower !== null && budgetInterval.lower > 0) {
    outcome = 'revert'; reason = 'character or word limits are missed more often beyond their interval';
  } else if (noisyInterval.lower !== null && noisyInterval.lower > 0) {
    outcome = 'revert'; reason = 'lint errors are worse beyond their interval';
  } else if (factInterval.lower !== null && factInterval.lower > 0) {
    outcome = 'revert'; reason = 'unsupported claims are worse beyond their interval';
  } else {
    const usable = dev.filter(t => judge?.tasks.some(s => s.task === t.id) && noisy.some(s => s.task === t.id) && facts.some(s => s.task === t.id)).length;
    if (!judge || !guards || !factcheck || preference.n !== dev.length || noisyInterval.n !== dev.length || budgetInterval.n !== dev.length || factInterval.n !== dev.length || (pooled && pooled.n !== dev.length)) {
      outcome = 'inconclusive'; reason = 'missing scoring or guard evidence; cannot establish all checks';
    } else if (usable < 10) {
      outcome = 'inconclusive'; reason = `directional only: ${usable} usable dev tasks; at least 10 required to keep`;
    } else if (pooled && pooled.lower !== null && pooled.lower > 0 && preference.mean !== null && preference.mean > 0) {
      outcome = 'keep'; reason = 'pooled preference lower bound is above zero, the second batch leans towards B and guards do not worsen; confirm with an owner blind pick';
    }
  }
  let text = `# Results: ${run.config.run}\n\nOutcome: **${outcome}**; ${reason}.\n\n`;
  text += `## Preference\n\n${describe(preference)}.\n\n`;
  if (pooled) text += `Pooled with ${run.config.pool}: ${describe(pooled)}.\n\n`;
  text += `## Defects (reported only)\n\nA minus B: ${describe(defects)}.\n\n`;
  text += table(['Dev task', 'Preference score', 'Defects A minus B'], dev.map(task => [task.id, format(judge?.tasks.find(t => t.task === task.id)?.score ?? null), format(read?.tasks.find(t => t.task === task.id)?.difference ?? null)])) + '\n\n';
  text += '## Structural guards\n\nMissing or empty deliverables, placeholders, numbers not in the facts.\n\n';
  text += guards ? table(['Arm', 'Failing dev outputs', 'Total dev outputs'], run.config.arms.map(arm => [arm, guardOutputs.filter(o => o.arm === arm && o.hard.length).length, guardOutputs.filter(o => o.arm === arm).length])) : 'n/a: guards.json is missing.';
  text += '\n\n';
  for (const o of failingB) text += `- ${o.task} B${o.n}: ${o.hard.join('; ')}\n`;
  text += `\n## Limits\n\nShare of outputs that miss a character or word limit, per task. B minus A: ${describe(budgetInterval)}.\n\n`;
  text += table(['Dev task', 'A share', 'B share', 'B minus A'], budgets.filter(t => devIds.has(t.task)).map(t => [t.task, format(t.A), format(t.B), format(t.difference)])) + '\n\n';
  for (const o of guardOutputs.filter(o => o.budget.length)) text += `- ${o.task} ${o.arm}${o.n}: ${o.budget.join('; ')}\n`;
  text += `\n## Noisy guards\n\nLint errors per output, averaged within each task. B minus A: ${describe(noisyInterval)}.\n\n`;
  text += table(['Dev task', 'A errors/output', 'B errors/output', 'B minus A'], noisy.filter(t => devIds.has(t.task)).map(t => [t.task, format(t.A), format(t.B), format(t.difference)])) + '\n\n';
  text += table(['Dev task', 'Arm', 'Output', 'Lint errors'], guardOutputs.map(o => [o.task, o.arm, o.n, o.lintErrors])) + '\n\n';
  text += `Unsupported claims per output, averaged within each task. B minus A: ${describe(factInterval)}.\n\n`;
  text += table(['Task', 'A claims/output', 'B claims/output', 'B minus A'], facts.filter(t => devIds.has(t.task)).map(t => [t.task, format(t.A), format(t.B), format(t.difference)])) + '\n\n';
  text += table(['Task', 'Arm', 'Output', 'Unsupported claims'], factcheck?.outputs.filter(o => devIds.has(o.task)).map(o => [o.task, o.arm, o.n, o.unsupported.length]) ?? []) + '\n\n';
  text += '## Holdout and report tasks\n\nExcluded from the dev estimates and outcome.\n\n';
  text += table(['Task', 'Set', 'Preference', 'Defects A minus B', 'Lint B minus A', 'Claims B minus A', 'B structural and limit failures'], run.tasks.filter(t => t.set !== 'dev').map(task => [
    task.id, task.set, format(judge?.tasks.find(t => t.task === task.id)?.score ?? null), format(read?.tasks.find(t => t.task === task.id)?.difference ?? null), format(noisy.find(t => t.task === task.id)?.difference ?? null), format(facts.find(t => t.task === task.id)?.difference ?? null),
    guards ? guards.outputs.filter(o => o.task === task.id && o.arm === 'B' && (o.hard.length || o.budget.length)).map(o => `${o.n}: ${[...o.hard, ...o.budget].join('; ')}`).join('; ') || '0' : 'n/a',
  ])) + '\n\n';
  text += '## Words / budget\n\nMean of words divided by max_words (or min_words if no maximum). Character-only budgets are labelled chars; these ratios are descriptive, not a word-budget check.\n\n';
  const all = outputs(run);
  const rows = run.tasks.flatMap(task => task.deliverables.map(d => {
    const budget = d.max_words ?? d.min_words ?? d.max_chars ?? d.min_chars;
    const kind = d.max_words !== undefined || d.min_words !== undefined ? 'words' : 'chars';
    const means = run.config.arms.map(arm => {
      const values = all.filter(o => o.task === task.id && o.arm === arm).map(o => budget ? wordCount(o.sections[d.name] ?? '') / budget : null);
      return format(values.some(v => v === null) ? null : (values as number[]).reduce((sum, n) => sum + n, 0) / values.length);
    });
    return [task.id, task.set, d.name, budget === undefined ? 'none' : `${budget} ${kind}`, ...means];
  }));
  text += table(['Task', 'Set', 'Deliverable', 'Budget', 'A words/budget', 'B words/budget'], rows) + '\n';
  writeText(join(run.dir, 'results.md'), text);
  return text;
}
