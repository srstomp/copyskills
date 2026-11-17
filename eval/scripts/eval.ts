import { loadRun } from './parse';
import { writeUnits } from './units';
import { calibrationBundles, judgeBundles, readBundles } from './bundles';
import { calibrationScore, judgeScore, ownerScore, ownerSheet, readScore } from './score';
import { runGuards } from './guards';
import { format, report, table } from './report';

const commands = ['units', 'read-bundles', 'read-score', 'judge-bundles', 'judge-score', 'guards', 'report', 'owner-sheet', 'owner-score', 'calib-bundles', 'calib-score'];
export function main(argv = process.argv.slice(2)): void {
  const args = [...argv];
  let seed = 1;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--seed' || args[i].startsWith('--seed=')) {
      const inline = args[i].startsWith('--seed=');
      const value = inline ? args[i].slice(7) : args[i + 1];
      if (!value || !/^-?\d+$/.test(value) || !Number.isSafeInteger(Number(value))) throw new Error('seed must be a safe integer');
      seed = Number(value);
      args.splice(i, inline ? 1 : 2);
      i--;
    }
  }
  const [command, ...params] = args;
  if (!commands.includes(command)) throw new Error(`Unknown command: ${command ?? '(missing)'}. Commands: ${commands.join(', ')}`);
  const counts: Record<string, number> = { units: 1, 'read-bundles': 1, 'read-score': 3, 'judge-bundles': 1, guards: 1, report: 1, 'owner-sheet': 1, 'owner-score': 2, 'calib-bundles': 0, 'calib-score': 2 };
  if (command === 'judge-score' ? params.length < 3 || params.length % 2 !== 1 : params.length !== counts[command]) throw new Error(`Invalid arguments for ${command}`);
  if (command === 'calib-bundles') { calibrationBundles(process.cwd(), seed); return; }
  if (command === 'calib-score') {
    const result = calibrationScore(process.cwd(), params[0], params[1]);
    console.log(table(['Group', 'Reader', 'False alarms', 'Recall', 'Calibration'], result.groups.flatMap(g => (['readerA', 'readerB', 'agreed'] as const).map(reader => [g.group, reader, format(g[reader].falseAlarm), format(g[reader].recall), reader === 'agreed' ? g.pass ? 'pass' : 'fail' : 'reported']))));
    console.log(table(['nl-owner', 'Share flagged'], Object.entries(result.owner).map(([reader, value]) => [reader, format(value)])));
    return;
  }
  const run = loadRun(params[0]);
  switch (command) {
    case 'units': console.log(`${writeUnits(run).length} units written`); break;
    case 'read-bundles': readBundles(run, seed); break;
    case 'judge-bundles': judgeBundles(run, seed); break;
    case 'read-score': {
      const result = readScore(run, params[1], params[2]);
      for (const [reader, failures] of Object.entries(result.failures)) if (failures.length) console.error(`${reader}: ignored validation failures\n${failures.join('\n')}`);
      console.log(table(['Task', 'Arm', 'Units', 'Reader A', 'Reader B', 'Agreed', 'Agreed share', 'A minus B'], result.tasks.flatMap(t => (['A', 'B'] as const).map(arm => [t.task, arm, t.arms[arm].units, t.arms[arm].flagsA, t.arms[arm].flagsB, t.arms[arm].agreed, format(t.arms[arm].shareAgreed), format(t.difference)]))));
      break;
    }
    case 'judge-score': {
      const result = judgeScore(run, params.slice(1));
      console.log(table(['Task', 'B preference', 'Score'], result.tasks.map(t => [t.task, format(t.preference), format(t.score)])));
      break;
    }
    case 'guards': {
      const result = runGuards(run);
      console.log(table(['Task', 'Arm', 'Hard failures', 'Lint errors', 'Longest shared run'], run.tasks.flatMap(task => run.config.arms.map(arm => {
        const items = result.outputs.filter(o => o.task === task.id && o.arm === arm);
        return [task.id, arm, items.flatMap(o => o.hard.map(f => `${o.n}: ${f}`)).join('; ') || 'none', items.reduce((sum, o) => sum + o.lintErrors, 0), Math.max(...items.map(o => o.longestSharedRun))];
      }))));
      break;
    }
    case 'report': console.log(report(run)); break;
    case 'owner-sheet': ownerSheet(run, seed); break;
    case 'owner-score': {
      const result = ownerScore(run, params[1]);
      console.log(`Matches: ${result.matches}/${result.total}; confirmed agreed flags: ${result.confirmed}/${result.agreed}; ${result.pass ? 'pass' : 'fail'}`);
      break;
    }
  }
}
if (import.meta.main) {
  try { main(); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
