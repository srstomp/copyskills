#!/usr/bin/env bun

import { installAll, installTool } from './install';
import { uninstallAll, uninstallTool } from './uninstall';
import { getStatusForDir, formatStatus } from './status';
import type { ToolName } from './types';

export interface ParsedArgs {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const userArgs = argv.slice(2);
  const command = userArgs[0] ?? '';
  const rest = userArgs.slice(1);
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  let i = 0;
  while (i < rest.length) {
    const token = rest[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = rest[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next;
        i += 2;
      } else {
        flags[key] = true;
        i += 1;
      }
    } else {
      args.push(token);
      i += 1;
    }
  }

  return { command, args, flags };
}

function printHelp(): void {
  console.log('');
  console.log('  copydoc-integrations - Install copydoc skills into AI coding tools');
  console.log('');
  console.log('  Usage:');
  console.log('    copydoc-integrations <command> [--flags]');
  console.log('');
  console.log('  Commands:');
  console.log('    install     Detect tools and install copyskills integrations');
  console.log('    uninstall   Remove copyskills integrations');
  console.log('    status      Show detection and configuration status for all tools');
  console.log('    help        Show this help text');
  console.log('');
  console.log('  Flags:');
  console.log('    --tool <name>   Target a specific tool (cursor, codex, opencode, hermes, openclaw, pi)');
  console.log('    --global        Install globally (home directory) instead of project-local');
  console.log('    --copy          Copy skills files instead of linking');
  console.log('');
}

export async function runCli(argv: string[], skillsDir: string): Promise<void> {
  const parsed = parseArgs(argv);
  const { command } = parsed;
  const toolFlag = parsed.flags['tool'] as string | undefined;
  const isGlobal = parsed.flags['global'] === true;
  const isCopy = parsed.flags['copy'] === true;
  const projectDir = process.cwd();

  switch (command) {
    case 'install': {
      const ctx = { projectDir, skillsDir, global: isGlobal, copy: isCopy };
      if (toolFlag) {
        const result = await installTool(toolFlag as ToolName, ctx);
        if (result.actions.length > 0) {
          for (const action of result.actions) {
            console.log(`  ${action}`);
          }
        } else {
          console.log(`  ${result.tool}: no actions taken (stub installer)`);
        }
      } else {
        const results = await installAll(ctx);
        if (results.length === 0) {
          console.log('  No supported tools detected in this project.');
        } else {
          for (const result of results) {
            if (result.actions.length > 0) {
              for (const action of result.actions) {
                console.log(`  ${action}`);
              }
            } else {
              console.log(`  ${result.tool}: no actions taken (stub installer)`);
            }
          }
        }
      }
      break;
    }

    case 'uninstall': {
      const ctx = { projectDir, global: isGlobal };
      if (toolFlag) {
        await uninstallTool(toolFlag as ToolName, ctx);
        console.log(`  Uninstalled ${toolFlag}`);
      } else {
        await uninstallAll(ctx);
        console.log('  Uninstalled all configured integrations');
      }
      break;
    }

    case 'status': {
      const results = await getStatusForDir(projectDir);
      console.log(formatStatus(results));
      break;
    }

    case '':
    case 'help':
      printHelp();
      break;

    default:
      console.log(`Unknown command: ${command}`);
      printHelp();
      break;
  }
}

if (import.meta.main) {
  import('path').then(({ default: path }) => {
    const skillsDir = path.resolve(import.meta.dir, '../../../../skills');
    runCli(process.argv, skillsDir).catch((err) => {
      console.error(String(err));
      process.exit(1);
    });
  });
}
