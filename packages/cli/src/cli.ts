#!/usr/bin/env bun

import type { SkillLoader } from '@copydoc/core';
import { listCommand } from './commands/list';
import { infoCommand } from './commands/info';
import { initCommand } from './commands/init';
import { writeCommand } from './commands/write';
import { critiqueCommand } from './commands/critique';
import { adaptCommand } from './commands/adapt';

export interface ParsedArgs {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  // argv[0] = runtime (node/bun), argv[1] = script path, argv[2+] = user input
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
  console.log('  copydoc - AI-powered copywriting CLI');
  console.log('');
  console.log('  Usage:');
  console.log('    copydoc <command> [arguments] [--flags]');
  console.log('');
  console.log('  Commands:');
  console.log('    init                   Set up API key and configuration');
  console.log('    write <description>    Generate copy from a description');
  console.log('    critique <file-or-text>  Evaluate and score copy');
  console.log('    adapt <source> --to <format>  Adapt copy to a different format');
  console.log('    list                   List all available skills');
  console.log('    info <skill-name>      Show skill details and preview');
  console.log('    help                   Show this help text');
  console.log('');
}

export async function runCli(argv: string[], loader: SkillLoader): Promise<void> {
  const parsed = parseArgs(argv);
  const { command, args } = parsed;

  switch (command) {
    case 'list':
      listCommand(loader);
      break;

    case 'info': {
      const skillName = args[0] ?? '';
      infoCommand(loader, skillName);
      break;
    }

    case 'init':
      await initCommand();
      break;

    case 'write': {
      const description = args.join(' ');
      await writeCommand(loader, description);
      break;
    }

    case 'critique': {
      const input = args.join(' ');
      await critiqueCommand(loader, input);
      break;
    }

    case 'adapt': {
      const source = args.join(' ');
      const targetFormat = (parsed.flags['to'] as string) ?? '';
      await adaptCommand(loader, source, targetFormat);
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

// Only run when executed directly (not imported in tests)
if (import.meta.main) {
  import('@copydoc/core').then(({ createLoader }) => {
    import('path').then(({ default: path }) => {
      // Resolve skills dir relative to this file: packages/cli/src/cli.ts -> ../../../../skills
      const skillsDir = path.resolve(import.meta.dir, '../../../../skills');
      const loader = createLoader(skillsDir);
      runCli(process.argv, loader).catch((err) => {
        console.error(String(err));
        process.exit(1);
      });
    });
  });
}
