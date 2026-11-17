import fs from 'node:fs';
import path from 'node:path';
import { createLinter, type LintOptions, type LintResult, type SkillLoader } from '@copydoc/core';

export function printLintResult(result: LintResult): void {
  for (const issue of result.issues) {
    const item = issue.item === undefined ? '' : ` [item ${issue.item}]`;
    const line = issue.line === undefined ? '' : ` line ${issue.line}`;
    const suggestion = issue.suggestion ? ` ${issue.suggestion.startsWith('(') ? issue.suggestion : `(${issue.suggestion})`}` : '';
    console.log(`${issue.severity === 'error' ? 'ERROR' : 'WARN'} ${issue.rule}${item}${line}: ${issue.message}${suggestion}`);
  }
  console.log(`${result.errors} errors, ${result.warnings} warnings`);
}

function readLintFile(file: string): string {
  if (fs.statSync(file).size > 2 * 1024 * 1024) throw new Error(`File exceeds 2 MB: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

export function lintCommand(loader: SkillLoader, targets: string[], flags: Record<string, string | boolean>): number {
  try {
    const allowed = new Set(['locale', 'kind', 'min', 'max', 'facts', 'items', 'json']);
    for (const [key, value] of Object.entries(flags)) {
      if (!allowed.has(key)) throw new Error(`Unknown option --${key}`);
      if (key === 'json' ? value !== true : typeof value !== 'string') throw new Error(`Invalid value for --${key}`);
    }
    if (!targets.length) throw new Error('Provide at least one file or directory');
    if (flags.kind !== undefined && !['title', 'meta', 'body'].includes(String(flags.kind))) throw new Error('--kind must be title, meta or body');
    if (flags.items !== undefined && flags.items !== 'lines') throw new Error('--items must be lines');
    const options: LintOptions = {};
    if (flags.locale !== undefined) options.locale = String(flags.locale);
    if (flags.kind !== undefined) options.kind = flags.kind as LintOptions['kind'];
    for (const key of ['min', 'max'] as const) {
      if (flags[key] !== undefined) {
        const value = Number(flags[key]);
        if (!/^\d+$/.test(String(flags[key])) || !Number.isSafeInteger(value)) throw new Error(`--${key} must be a non-negative integer`);
        options[key] = value;
      }
    }
    const effectiveMax = options.max ?? (options.kind === 'meta' ? 160 : options.kind === 'title' ? 60 : undefined);
    if (options.min !== undefined && effectiveMax !== undefined && options.min > effectiveMax) throw new Error('--min must not exceed --max');
    if (flags.facts !== undefined) options.facts = readLintFile(String(flags.facts));
    let directory = false;
    const files = targets.flatMap(target => {
      const stat = fs.statSync(target);
      if (stat.isFile()) return [target];
      if (!stat.isDirectory()) throw new Error(`Not a regular file or directory: ${target}`);
      directory = true;
      return fs.readdirSync(target, { withFileTypes: true })
        .filter(entry => entry.isFile() && /\.(md|txt)$/i.test(entry.name))
        .map(entry => entry.name).sort().map(name => path.join(target, name));
    });
    if (!files.length) throw new Error('No .md or .txt files found');
    if (flags.items && (targets.length !== 1 || directory)) throw new Error('--items lines requires a single file');
    const texts = files.map(readLintFile);
    const linter = createLinter(loader);
    const result = flags.items === 'lines'
      ? linter.lintBatch(texts[0].split(/\r?\n/).filter(line => line.trim()), options)
      : directory || files.length > 1 ? linter.lintBatch(texts, options) : linter.lint(texts[0], options);
    if (flags.json) console.log(JSON.stringify(result));
    else printLintResult(result);
    return result.errors > 0 ? 1 : 0;
  } catch (error) {
    console.error(`lint: ${error instanceof Error ? error.message : String(error)}`);
    return 2;
  }
}
