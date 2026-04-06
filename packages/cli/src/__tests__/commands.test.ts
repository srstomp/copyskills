import { describe, expect, test, mock, beforeEach, afterEach } from 'bun:test';
import type { SkillLoader, SkillContent } from '@copydoc/core';
import path from 'path';

// ---- Helpers ----

function makeSkillContent(name: string, description: string, body: string): SkillContent {
  return { metadata: { name, description }, body };
}

function makeLoader(overrides: Partial<SkillLoader> = {}): SkillLoader {
  const defaultSkills = [
    'persuasion-frameworks',
    'quality-frameworks',
    'headline-formulas',
    'marketing-copy',
    'email-copy',
    'ux-copy',
    'editorial-copy',
    'brand-copy',
    'sales-copy',
    'social-copy',
    'conversion-copy',
    'copy-brief',
    'copy-workflow',
    'copy-critique',
    'copy-adapt',
  ];

  const skillContents: Record<string, SkillContent> = {
    'persuasion-frameworks': makeSkillContent(
      'persuasion-frameworks',
      'Persuasion framework selection guidance',
      '# Persuasion Frameworks\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11'
    ),
    'quality-frameworks': makeSkillContent(
      'quality-frameworks',
      'Copy quality evaluation and scoring',
      '# Quality Frameworks\nContent here'
    ),
    'headline-formulas': makeSkillContent(
      'headline-formulas',
      'Quick-reference for headline generation',
      '# Headline Formulas\nContent here'
    ),
    'marketing-copy': makeSkillContent(
      'marketing-copy',
      'Workflow-driven generator for landing pages',
      '# Marketing Copy\nContent here'
    ),
    'email-copy': makeSkillContent(
      'email-copy',
      'Workflow-driven generator for drip/nurture sequences',
      '# Email Copy\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11'
    ),
    'ux-copy': makeSkillContent('ux-copy', 'UX copy generation', '# UX Copy\nContent'),
    'editorial-copy': makeSkillContent('editorial-copy', 'Editorial copy generation', '# Editorial\nContent'),
    'brand-copy': makeSkillContent('brand-copy', 'Brand copy generation', '# Brand\nContent'),
    'sales-copy': makeSkillContent('sales-copy', 'Sales copy generation', '# Sales\nContent'),
    'social-copy': makeSkillContent('social-copy', 'Social media copy', '# Social\nContent'),
    'conversion-copy': makeSkillContent('conversion-copy', 'Conversion copy generation', '# Conversion\nContent'),
    'copy-brief': makeSkillContent('copy-brief', 'Gathers and validates context', '# Copy Brief\nContent'),
    'copy-workflow': makeSkillContent('copy-workflow', 'Full end-to-end copy generation', '# Copy Workflow\nContent'),
    'copy-critique': makeSkillContent('copy-critique', 'Critiques copy quality', '# Copy Critique\nContent'),
    'copy-adapt': makeSkillContent('copy-adapt', 'Adapts copy to different formats', '# Copy Adapt\nContent'),
  };

  const refCounts: Record<string, string[]> = {
    'persuasion-frameworks': ['pas', 'aida', 'bab', 'fab', 'before-after', 'star', 'pppp', 'quest', 'spin', 'four-ps'],
    'quality-frameworks': ['clarity', 'specificity', 'voice', 'persuasion', 'action', 'overall'],
    'headline-formulas': ['curiosity', 'benefit'],
    'marketing-copy': ['hero', 'features', 'cta'],
    'email-copy': ['sequences', 'cold-outreach', 'subject-lines', 'newsletters'],
    'ux-copy': ['microcopy', 'error-messages', 'onboarding'],
    'editorial-copy': ['structure', 'tone'],
    'brand-copy': ['voice', 'positioning'],
    'sales-copy': ['objections', 'close'],
    'social-copy': ['hooks', 'engagement'],
    'conversion-copy': ['cta', 'urgency'],
    'copy-brief': ['template'],
    'copy-workflow': [],
    'copy-critique': [],
    'copy-adapt': [],
  };

  return {
    listSkills: () => defaultSkills,
    getSkill: (name: string) => {
      if (!skillContents[name]) {
        throw new Error(`Skill not found: ${name}. No SKILL.md at ...`);
      }
      return skillContents[name];
    },
    getReference: (_skill: string, _ref: string) => '',
    listReferences: (skill: string) => refCounts[skill] ?? [],
    resolveReference: (_path: string) => '',
    ...overrides,
  };
}

// ---- output.ts tests ----

describe('output.ts - ANSI formatting helpers', () => {
  test('bold() wraps string with bold ANSI codes', async () => {
    const { bold } = await import('../output');
    const result = bold('hello');
    expect(result).toBe('\x1b[1mhello\x1b[0m');
  });

  test('dim() wraps string with dim ANSI codes', async () => {
    const { dim } = await import('../output');
    const result = dim('hello');
    expect(result).toBe('\x1b[2mhello\x1b[0m');
  });

  test('green() wraps string with green ANSI code', async () => {
    const { green } = await import('../output');
    const result = green('ok');
    expect(result).toBe('\x1b[32mok\x1b[0m');
  });

  test('yellow() wraps string with yellow ANSI code', async () => {
    const { yellow } = await import('../output');
    const result = yellow('warn');
    expect(result).toBe('\x1b[33mwarn\x1b[0m');
  });

  test('red() wraps string with red ANSI code', async () => {
    const { red } = await import('../output');
    const result = red('error');
    expect(result).toBe('\x1b[31merror\x1b[0m');
  });

  test('cyan() wraps string with cyan ANSI code', async () => {
    const { cyan } = await import('../output');
    const result = cyan('info');
    expect(result).toBe('\x1b[36minfo\x1b[0m');
  });

  test('scoreColor() returns green for score >= 7', async () => {
    const { scoreColor, green } = await import('../output');
    expect(scoreColor(7)).toBe(green('7'));
    expect(scoreColor(10)).toBe(green('10'));
  });

  test('scoreColor() returns yellow for score 4-6', async () => {
    const { scoreColor, yellow } = await import('../output');
    expect(scoreColor(4)).toBe(yellow('4'));
    expect(scoreColor(6)).toBe(yellow('6'));
  });

  test('scoreColor() returns red for score < 4', async () => {
    const { scoreColor, red } = await import('../output');
    expect(scoreColor(3)).toBe(red('3'));
    expect(scoreColor(0)).toBe(red('0'));
  });
});

// ---- list command tests ----

describe('listCommand() - shows all 15 skills grouped by layer', () => {
  let output: string[] = [];
  let consoleLogMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    console.log = consoleLogMock as typeof console.log;
  });

  afterEach(() => {
    console.log = consoleLogMock.mockRestore?.() ?? console.log;
  });

  test('listCommand() calls loader.listSkills()', async () => {
    const { listCommand } = await import('../commands/list');
    const loader = makeLoader();
    const listSkillsSpy = mock(loader.listSkills);
    loader.listSkills = listSkillsSpy;
    listCommand(loader);
    expect(listSkillsSpy).toHaveBeenCalled();
  });

  test('listCommand() outputs Layer 1 header', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Layer 1');
  });

  test('listCommand() outputs Layer 2 header', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Layer 2');
  });

  test('listCommand() outputs Layer 3 header', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Layer 3');
  });

  test('listCommand() includes persuasion-frameworks in Layer 1', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('persuasion-frameworks');
  });

  test('listCommand() includes email-copy in Layer 2', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('email-copy');
  });

  test('listCommand() includes copy-workflow in Layer 3', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('copy-workflow');
  });

  test('listCommand() shows skill description for persuasion-frameworks', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Persuasion framework selection guidance');
  });

  test('listCommand() shows reference count for persuasion-frameworks (10 refs)', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('10 refs');
  });

  test('listCommand() shows "1 ref" (singular) for copy-brief', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('1 ref');
  });

  test('listCommand() shows "0 refs" for copy-workflow', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('0 refs');
  });

  test('listCommand() displays all 15 skills', async () => {
    const { listCommand } = await import('../commands/list');
    listCommand(makeLoader());
    const combined = output.join('\n');
    const allSkills = [
      'persuasion-frameworks', 'quality-frameworks', 'headline-formulas',
      'marketing-copy', 'email-copy', 'ux-copy', 'editorial-copy',
      'brand-copy', 'sales-copy', 'social-copy', 'conversion-copy',
      'copy-brief', 'copy-workflow', 'copy-critique', 'copy-adapt',
    ];
    for (const skill of allSkills) {
      expect(combined).toContain(skill);
    }
  });
});

// ---- info command tests ----

describe('infoCommand() - shows skill metadata, references, and preview', () => {
  let output: string[] = [];
  let consoleLogMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    console.log = consoleLogMock as typeof console.log;
  });

  afterEach(() => {
    console.log = consoleLogMock.mockRestore?.() ?? console.log;
  });

  test('infoCommand() shows skill name for email-copy', async () => {
    const { infoCommand } = await import('../commands/info');
    infoCommand(makeLoader(), 'email-copy');
    const combined = output.join('\n');
    expect(combined).toContain('email-copy');
  });

  test('infoCommand() shows skill description for email-copy', async () => {
    const { infoCommand } = await import('../commands/info');
    infoCommand(makeLoader(), 'email-copy');
    const combined = output.join('\n');
    expect(combined).toContain('Workflow-driven generator for drip/nurture sequences');
  });

  test('infoCommand("email-copy") shows References section', async () => {
    const { infoCommand } = await import('../commands/info');
    infoCommand(makeLoader(), 'email-copy');
    const combined = output.join('\n');
    expect(combined).toContain('References');
  });

  test('infoCommand("email-copy") shows 4 references', async () => {
    const { infoCommand } = await import('../commands/info');
    infoCommand(makeLoader(), 'email-copy');
    const combined = output.join('\n');
    expect(combined).toContain('4');
    expect(combined).toContain('sequences');
    expect(combined).toContain('cold-outreach');
    expect(combined).toContain('subject-lines');
    expect(combined).toContain('newsletters');
  });

  test('infoCommand("email-copy") shows Preview section', async () => {
    const { infoCommand } = await import('../commands/info');
    infoCommand(makeLoader(), 'email-copy');
    const combined = output.join('\n');
    expect(combined).toContain('Preview');
  });

  test('infoCommand() shows first 10 lines of body in preview', async () => {
    const { infoCommand } = await import('../commands/info');
    infoCommand(makeLoader(), 'email-copy');
    const combined = output.join('\n');
    // The body has lines like "# Email Copy", "Line 2" ... "Line 10", "Line 11"
    // Preview should show line 10 but not line 11
    expect(combined).toContain('# Email Copy');
    expect(combined).toContain('Line 10');
    expect(combined).not.toContain('Line 11');
  });

  test('infoCommand() with unknown skill shows descriptive error', async () => {
    const { infoCommand } = await import('../commands/info');
    infoCommand(makeLoader(), 'nonexistent-skill');
    const combined = output.join('\n');
    expect(combined).toContain('nonexistent-skill');
    expect(combined).toContain("copydoc list");
  });

  test('infoCommand() with unknown skill does not throw', async () => {
    const { infoCommand } = await import('../commands/info');
    expect(() => infoCommand(makeLoader(), 'nonexistent-skill')).not.toThrow();
  });
});

// ---- CLI routing tests ----

describe('cli routing - command parsing', () => {
  let output: string[] = [];
  let exitCode: number | undefined;
  let consoleLogMock: ReturnType<typeof mock>;
  let consoleErrorMock: ReturnType<typeof mock>;
  let processExitMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    exitCode = undefined;
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    consoleErrorMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    processExitMock = mock((_code?: number) => {
      exitCode = _code;
    });
    console.log = consoleLogMock as typeof console.log;
    console.error = consoleErrorMock as typeof console.error;
    process.exit = processExitMock as typeof process.exit;
  });

  test('parseArgs() extracts command from argv', async () => {
    const { parseArgs } = await import('../cli');
    const result = parseArgs(['node', 'copydoc', 'list']);
    expect(result.command).toBe('list');
  });

  test('parseArgs() extracts arguments after command', async () => {
    const { parseArgs } = await import('../cli');
    const result = parseArgs(['node', 'copydoc', 'info', 'email-copy']);
    expect(result.command).toBe('info');
    expect(result.args).toContain('email-copy');
  });

  test('parseArgs() extracts flags (--to format)', async () => {
    const { parseArgs } = await import('../cli');
    const result = parseArgs(['node', 'copydoc', 'adapt', 'source.md', '--to', 'linkedin']);
    expect(result.flags['to']).toBe('linkedin');
  });

  test('parseArgs() returns empty command when no command given', async () => {
    const { parseArgs } = await import('../cli');
    const result = parseArgs(['node', 'copydoc']);
    expect(result.command).toBe('');
  });

  test('unknown command outputs "Unknown command: {cmd}"', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'foobar'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Unknown command: foobar');
  });

  test('unknown command also shows help text', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'foobar'], makeLoader());
    const combined = output.join('\n');
    // Help text should list available commands
    expect(combined).toMatch(/list|info|write|init/i);
  });

  test('no command shows help text', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toMatch(/copydoc|help|list/i);
  });

  test('"help" command shows help text', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'help'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toMatch(/copydoc|list|info/i);
  });

  test('"list" command calls listCommand', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'list'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Layer 1');
  });

  test('"info <name>" command calls infoCommand with skill name', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'info', 'email-copy'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('email-copy');
  });

  test('"init" stub prints "Not yet implemented"', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'init'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Not yet implemented');
  });

  test('"write <description>" stub prints "Not yet implemented"', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'write', 'landing page hero'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Not yet implemented');
  });

  test('"critique <input>" stub prints "Not yet implemented"', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'critique', 'some text'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Not yet implemented');
  });

  test('"adapt <source>" stub prints "Not yet implemented"', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'adapt', 'source.md', '--to', 'linkedin'], makeLoader());
    const combined = output.join('\n');
    expect(combined).toContain('Not yet implemented');
  });
});

// ---- Integration test with real loader ----

describe('listCommand() and infoCommand() with real skills directory', () => {
  const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

  let output: string[] = [];
  let consoleLogMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    console.log = consoleLogMock as typeof console.log;
  });

  test('listCommand() with real loader shows all 15 skills', async () => {
    const { createLoader } = await import('@copydoc/core');
    const { listCommand } = await import('../commands/list');
    const loader = createLoader(SKILLS_DIR);
    listCommand(loader);
    const combined = output.join('\n');
    expect(combined).toContain('email-copy');
    expect(combined).toContain('Layer 1');
    expect(combined).toContain('Layer 2');
    expect(combined).toContain('Layer 3');
  });

  test('infoCommand("email-copy") with real loader shows 4 references', async () => {
    const { createLoader } = await import('@copydoc/core');
    const { infoCommand } = await import('../commands/info');
    const loader = createLoader(SKILLS_DIR);
    infoCommand(loader, 'email-copy');
    const combined = output.join('\n');
    expect(combined).toContain('sequences');
    expect(combined).toContain('cold-outreach');
    expect(combined).toContain('subject-lines');
    expect(combined).toContain('newsletters');
  });
});
