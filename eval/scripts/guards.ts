import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createBundledLoader, createLinter, type LintIssue } from '../../packages/core/src/index.ts';
import { outputs, placeholderTokens, readText, wordCount, writeJSON, type Run, type Task } from './parse';

const linter = createLinter(createBundledLoader());
const words = (text: string): string[] => text.toLowerCase().replace(/[\p{P}\p{S}]/gu, '').split(/\s+/u).filter(Boolean);

/** Longest common contiguous word sequence, using one DP row. */
export function longestSharedRun(text: string, sample: string): number {
  const a = words(text), b = words(sample);
  const row = new Uint32Array(b.length + 1);
  let longest = 0;
  for (const word of a) for (let j = b.length; j >= 1; j--) {
    row[j] = word === b[j - 1] ? row[j - 1] + 1 : 0;
    longest = Math.max(longest, row[j]);
  }
  return longest;
}
/** hard: structural failures (missing or empty deliverable, placeholders, numbers not in the facts). budget: character and word limits. */
export interface GuardCheck { hard: string[]; budget: string[]; lint: LintIssue[]; lintErrors: number; longestSharedRun: number; copyFlag: boolean }
export interface Guards { outputs: (GuardCheck & { task: string; arm: string; n: number })[] }

export function checkOutput(task: Task, sections: Record<string, string>, generatorSample: string): GuardCheck {
  const hard: string[] = [], budget: string[] = [], lint: LintIssue[] = [];
  for (const d of task.deliverables) {
    if (!Object.hasOwn(sections, d.name)) hard.push(`${d.name}: missing deliverable`);
    const text = (sections[d.name] ?? '').trim();
    if (Object.hasOwn(sections, d.name) && !text) hard.push(`${d.name}: empty deliverable`);
    const chars = [...text].length, words = wordCount(text);
    for (const [key, count] of [['min_chars', chars], ['max_chars', chars], ['min_words', words], ['max_words', words]] as const) {
      const limit = d[key];
      // A missing or empty deliverable is a structural failure; it is not also counted against its minimum.
      if (text && limit !== undefined && (key.startsWith('min') ? count < limit : count > limit)) budget.push(`${d.name}: ${key} ${limit}, got ${count}`);
    }
    const kind = d.name === 'title' || d.name === 'meta' ? d.name : 'body';
    lint.push(...linter.lint(text, { locale: task.locale, kind }).issues.filter(i => i.rule !== 'number' && i.severity === 'error').map(i => ({ ...i, message: `${d.name}: ${i.message}` })));
  }
  const text = task.deliverables.map(d => sections[d.name] ?? '').join('\n\n');
  const tokens = new Set(placeholderTokens(text));
  for (const placeholder of task.placeholders) if (!tokens.has(placeholder)) hard.push(`Missing placeholder ${placeholder}`);
  for (const token of tokens) if (!task.placeholders.includes(token)) hard.push(`Unknown placeholder ${token}`);
  hard.push(...linter.lint(text, { locale: task.locale, facts: task.facts }).issues.filter(i => i.rule === 'number' && i.severity === 'error').map(i => i.message));
  const shared = longestSharedRun(text, generatorSample);
  return { hard, budget, lint, lintErrors: lint.length, longestSharedRun: shared, copyFlag: shared >= 6 };
}
export function runGuards(run: Run): Guards {
  const result: Guards = { outputs: outputs(run).map(o => {
    const task = run.tasks.find(t => t.id === o.task)!;
    const file = join(run.root, 'eval/samples', task.project, 'generator.md');
    return { task: o.task, arm: o.arm, n: o.n, ...checkOutput(task, o.sections, existsSync(file) ? readText(file) : '') };
  }) };
  writeJSON(join(run.dir, 'guards.json'), result);
  return result;
}
