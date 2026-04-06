/**
 * Tests for init, write, critique, and adapt commands.
 * Mocks are set up before imports to prevent real API/file/stdin calls.
 */

import { describe, expect, test, mock, beforeEach, afterEach } from 'bun:test';
import type { SkillLoader, SkillContent } from '@copydoc/core';
import os from 'os';
import path from 'path';
import fs from 'fs';

// ---- Mock setup: readline/promises ----

let mockReadlineAnswers: string[] = [];
let mockReadlineQuestions: string[] = [];

const mockQuestion = mock(async (prompt: string): Promise<string> => {
  mockReadlineQuestions.push(prompt);
  const answer = mockReadlineAnswers.shift() ?? '';
  return answer;
});

const mockClose = mock(() => {});

const mockInterface = {
  question: mockQuestion,
  close: mockClose,
};

mock.module('readline/promises', () => ({
  createInterface: () => mockInterface,
}));

// ---- Mock setup: @copydoc/core assembler and anti-slop ----

const mockAssemble = mock((_brief: unknown) => ({
  systemPrompt: 'system prompt',
  userPrompt: 'user prompt',
}));

const mockAssembleCritique = mock((_text: unknown, _context?: unknown) => ({
  systemPrompt: 'critique system prompt',
  userPrompt: 'critique user prompt',
}));

const mockAssembleAdapt = mock((_sourceText: unknown, _targetFormat: unknown) => ({
  systemPrompt: 'adapt system prompt',
  userPrompt: 'adapt user prompt',
}));

const mockAntiSlopCheck = mock((_text: string) => ({
  score: 2,
  issues: [{ pattern: 'utilize', line: 1, suggestion: 'use' }],
}));

const mockGetBannedPatterns = mock(() => ['utilize', 'leverage']);

mock.module('@copydoc/core', () => ({
  createLoader: mock(() => makeLoader()),
  createAssembler: mock(() => ({
    assemble: mockAssemble,
    assembleCritique: mockAssembleCritique,
    assembleAdapt: mockAssembleAdapt,
  })),
  selectFramework: mock(() => ({
    framework: 'PAS',
    path: 'persuasion-frameworks/references/pas.md',
    rationale: 'Test rationale',
  })),
  createAntiSlopChecker: mock(() => ({
    check: mockAntiSlopCheck,
    getBannedPatterns: mockGetBannedPatterns,
  })),
}));

// ---- Mock setup: providers ----

const mockGenerate = mock(async (_system: string, _prompt: string): Promise<string> => {
  return 'Generated critique response';
});

const mockStream = mock(async function* (_system: string, _prompt: string) {
  yield 'Streamed ';
  yield 'copy ';
  yield 'output.';
});

mock.module('../providers/adapter', () => ({
  createProvider: mock(() => ({
    generate: mockGenerate,
    stream: mockStream,
  })),
}));

// ---- Helpers ----

const RC_FILE = path.join(os.homedir(), '.copydocrc.json');

function makeSkillContent(name: string, description: string, body: string): SkillContent {
  return { metadata: { name, description }, body };
}

function makeLoader(overrides: Partial<SkillLoader> = {}): SkillLoader {
  const skillContents: Record<string, SkillContent> = {
    'marketing-copy': makeSkillContent('marketing-copy', 'Marketing copy', '# Marketing Copy'),
    'email-copy': makeSkillContent('email-copy', 'Email copy', '# Email Copy'),
    'copy-critique': makeSkillContent('copy-critique', 'Critique', '# Critique'),
    'copy-adapt': makeSkillContent('copy-adapt', 'Adapt', '# Adapt'),
    'quality-frameworks': makeSkillContent('quality-frameworks', 'Quality', '# Quality'),
  };

  return {
    listSkills: () => Object.keys(skillContents),
    getSkill: (name: string) => {
      if (!skillContents[name]) throw new Error(`Skill not found: ${name}`);
      return skillContents[name];
    },
    getReference: () => '',
    listReferences: () => [],
    resolveReference: () => '',
    ...overrides,
  };
}

function removeRcFile() {
  try { fs.unlinkSync(RC_FILE); } catch { /* ignore */ }
}

// ---- init command tests ----

describe('initCommand() - creates ~/.copydocrc.json', () => {
  let output: string[] = [];
  let consoleLogMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    console.log = consoleLogMock as typeof console.log;
    mockReadlineAnswers = [];
    mockReadlineQuestions = [];
    mockQuestion.mockClear();
    mockClose.mockClear();
    removeRcFile();
  });

  afterEach(() => {
    removeRcFile();
  });

  test('initCommand() prints welcome message', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', '', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const combined = output.join('\n');
    expect(combined).toContain('Welcome');
  });

  test('initCommand() prompts for provider', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', '', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const questions = mockReadlineQuestions.join('\n');
    expect(questions).toContain('Provider');
  });

  test('initCommand() prompts for API key', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', '', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const questions = mockReadlineQuestions.join('\n');
    expect(questions).toContain('API key');
  });

  test('initCommand() creates ~/.copydocrc.json with provider and api_key', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', '', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    expect(fs.existsSync(RC_FILE)).toBe(true);
    const content = JSON.parse(fs.readFileSync(RC_FILE, 'utf-8'));
    expect(content.provider).toBe('anthropic');
    expect(content.api_key).toBe('sk-ant-test-key-1234');
  });

  test('initCommand() defaults provider to "anthropic" when user presses enter', async () => {
    // Empty string = user hit enter -> use default
    mockReadlineAnswers = ['', 'sk-ant-test-key-1234', '', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const content = JSON.parse(fs.readFileSync(RC_FILE, 'utf-8'));
    expect(content.provider).toBe('anthropic');
  });

  test('initCommand() saves optional base_url when provided', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', 'https://my-gateway.example.com', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const content = JSON.parse(fs.readFileSync(RC_FILE, 'utf-8'));
    expect(content.base_url).toBe('https://my-gateway.example.com');
  });

  test('initCommand() saves optional model when provided', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', '', 'claude-3-haiku-20240307'];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const content = JSON.parse(fs.readFileSync(RC_FILE, 'utf-8'));
    expect(content.model).toBe('claude-3-haiku-20240307');
  });

  test('initCommand() does not save base_url when empty', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', '', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const content = JSON.parse(fs.readFileSync(RC_FILE, 'utf-8'));
    expect(content.base_url).toBeUndefined();
  });

  test('initCommand() prints confirmation with redacted API key', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', '', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const combined = output.join('\n');
    // Should show partial key but not full key
    expect(combined).toContain('sk-ant');
    expect(combined).not.toContain('sk-ant-test-key-1234');
  });

  test('initCommand() prints path to config file in confirmation', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key-1234', '', ''];
    const { initCommand } = await import('../commands/init');
    await initCommand();
    const combined = output.join('\n');
    expect(combined).toContain('.copydocrc.json');
  });
});

// ---- write command tests ----

describe('writeCommand() - streams copy and shows quality scores', () => {
  let output: string[] = [];
  let processWriteMock: ReturnType<typeof mock>;
  let consoleLogMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    processWriteMock = mock((_s: string) => {});
    console.log = consoleLogMock as typeof console.log;
    process.stdout.write = processWriteMock as typeof process.stdout.write;
    // Provide a real API key so loadConfig() doesn't throw
    process.env.COPYDOC_API_KEY = 'test-api-key';
    mockAssemble.mockClear();
    mockAntiSlopCheck.mockClear();
    mockStream.mockReset();
    mockStream.mockImplementation(async function* () {
      yield 'Streamed ';
      yield 'copy ';
      yield 'output.';
    });
    // Clean up any output dir created during tests
    try { fs.rmSync('/tmp/copydoc-test-output', { recursive: true, force: true }); } catch { /* ok */ }
  });

  afterEach(() => {
    delete process.env.COPYDOC_API_KEY;
  });

  test('writeCommand() calls assembler.assemble() with brief containing description as type', async () => {
    mockReadlineAnswers = ['Book a demo', 'SaaS founders', ''];
    const { writeCommand } = await import('../commands/write');
    const loader = makeLoader();
    await writeCommand(loader, 'landing page hero', '/tmp/copydoc-test-output');
    expect(mockAssemble).toHaveBeenCalled();
    const briefArg = mockAssemble.mock.calls[0][0] as { type: string };
    expect(briefArg.type).toBe('landing page hero');
  });

  test('writeCommand() streams output chunks to terminal', async () => {
    mockReadlineAnswers = ['Book a demo', 'SaaS founders', ''];
    const { writeCommand } = await import('../commands/write');
    const loader = makeLoader();
    await writeCommand(loader, 'landing page hero', '/tmp/copydoc-test-output');
    const written = processWriteMock.mock.calls.map((c: unknown[]) => c[0]).join('');
    expect(written).toContain('Streamed');
    expect(written).toContain('copy');
    expect(written).toContain('output');
  });

  test('writeCommand() runs anti-slop check on streamed output', async () => {
    mockReadlineAnswers = ['Book a demo', 'SaaS founders', ''];
    const { writeCommand } = await import('../commands/write');
    const loader = makeLoader();
    await writeCommand(loader, 'landing page hero', '/tmp/copydoc-test-output');
    expect(mockAntiSlopCheck).toHaveBeenCalled();
    const checkArg = mockAntiSlopCheck.mock.calls[0][0] as string;
    expect(checkArg).toContain('Streamed copy output');
  });

  test('writeCommand() prints quality score after streaming', async () => {
    mockReadlineAnswers = ['Book a demo', 'SaaS founders', ''];
    const { writeCommand } = await import('../commands/write');
    const loader = makeLoader();
    await writeCommand(loader, 'landing page hero', '/tmp/copydoc-test-output');
    const combined = output.join('\n');
    // Should mention anti-slop score
    expect(combined).toMatch(/score|issue|quality|AI.tell/i);
  });

  test('writeCommand() saves output file to outputDir', async () => {
    mockReadlineAnswers = ['Book a demo', 'SaaS founders', ''];
    const { writeCommand } = await import('../commands/write');
    const loader = makeLoader();
    const tmpDir = '/tmp/copydoc-write-test-' + Date.now();
    await writeCommand(loader, 'landing page hero', tmpDir);
    expect(fs.existsSync(tmpDir)).toBe(true);
    const files = fs.readdirSync(tmpDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files[0]).toMatch(/landing/i);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('writeCommand() prints "Drafting..." before streaming', async () => {
    mockReadlineAnswers = ['Book a demo', 'SaaS founders', ''];
    const { writeCommand } = await import('../commands/write');
    const loader = makeLoader();
    await writeCommand(loader, 'landing page hero', '/tmp/copydoc-test-output');
    const combined = output.join('\n');
    expect(combined).toContain('Drafting');
  });

  test('writeCommand() handles missing config by suggesting copydoc init', async () => {
    // Remove env var so loadConfig throws
    delete process.env.COPYDOC_API_KEY;

    const { writeCommand: writeCommandFresh } = await import('../commands/write');
    const loader = makeLoader();

    let errorMsg = '';
    try {
      await writeCommandFresh(loader, 'test', '/tmp/copydoc-test-output');
    } catch (e) {
      errorMsg = String(e);
    }

    // Restore for subsequent tests
    process.env.COPYDOC_API_KEY = 'test-api-key';

    expect(errorMsg).toContain('copydoc init');
  });
});

// ---- critique command tests ----

describe('critiqueCommand() - accepts file or inline text', () => {
  let output: string[] = [];
  let consoleLogMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    console.log = consoleLogMock as typeof console.log;
    process.env.COPYDOC_API_KEY = 'test-api-key';
    mockGenerate.mockClear();
    mockAssembleCritique.mockClear();
    mockAntiSlopCheck.mockClear();
  });

  afterEach(() => {
    delete process.env.COPYDOC_API_KEY;
  });

  test('critiqueCommand() calls assembleCritique() with text', async () => {
    const { critiqueCommand } = await import('../commands/critique');
    await critiqueCommand(makeLoader(), 'This is inline copy text to critique.');
    expect(mockAssembleCritique).toHaveBeenCalled();
    const textArg = mockAssembleCritique.mock.calls[0][0] as string;
    expect(textArg).toBe('This is inline copy text to critique.');
  });

  test('critiqueCommand() calls provider.generate() (not stream)', async () => {
    const { critiqueCommand } = await import('../commands/critique');
    await critiqueCommand(makeLoader(), 'Some copy to review.');
    expect(mockGenerate).toHaveBeenCalled();
  });

  test('critiqueCommand() prints the AI evaluation response', async () => {
    const { critiqueCommand } = await import('../commands/critique');
    await critiqueCommand(makeLoader(), 'Some copy to review.');
    const combined = output.join('\n');
    expect(combined).toContain('Generated critique response');
  });

  test('critiqueCommand() runs anti-slop check and prints score', async () => {
    const { critiqueCommand } = await import('../commands/critique');
    await critiqueCommand(makeLoader(), 'Some copy to review.');
    expect(mockAntiSlopCheck).toHaveBeenCalled();
    const combined = output.join('\n');
    expect(combined).toMatch(/score|AI.tell|issue/i);
  });

  test('critiqueCommand() reads file when input is a file path that exists', async () => {
    // Create a temp file
    const tmpFile = path.join(os.tmpdir(), `copydoc-critique-test-${Date.now()}.md`);
    fs.writeFileSync(tmpFile, 'Copy from a file.');

    const { critiqueCommand } = await import('../commands/critique');
    await critiqueCommand(makeLoader(), tmpFile);

    const textArg = mockAssembleCritique.mock.calls[0][0] as string;
    expect(textArg).toBe('Copy from a file.');

    fs.unlinkSync(tmpFile);
  });

  test('critiqueCommand() treats non-existent path as inline text', async () => {
    const { critiqueCommand } = await import('../commands/critique');
    const nonExistentPath = '/does/not/exist/file.md';
    await critiqueCommand(makeLoader(), nonExistentPath);
    const textArg = mockAssembleCritique.mock.calls[0][0] as string;
    expect(textArg).toBe(nonExistentPath);
  });

  test('critiqueCommand() reads .txt file when input ends with .txt and file exists', async () => {
    const tmpFile = path.join(os.tmpdir(), `copydoc-critique-test-${Date.now()}.txt`);
    fs.writeFileSync(tmpFile, 'Content from txt file.');

    const { critiqueCommand } = await import('../commands/critique');
    await critiqueCommand(makeLoader(), tmpFile);

    const textArg = mockAssembleCritique.mock.calls[0][0] as string;
    expect(textArg).toBe('Content from txt file.');

    fs.unlinkSync(tmpFile);
  });
});

// ---- adapt command tests ----

describe('adaptCommand() - adapts copy to target format', () => {
  let output: string[] = [];
  let processWriteMock: ReturnType<typeof mock>;
  let consoleLogMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    processWriteMock = mock((_s: string) => {});
    console.log = consoleLogMock as typeof console.log;
    process.stdout.write = processWriteMock as typeof process.stdout.write;
    process.env.COPYDOC_API_KEY = 'test-api-key';
    mockAssembleAdapt.mockClear();
    mockAntiSlopCheck.mockClear();
    mockStream.mockReset();
    mockStream.mockImplementation(async function* () {
      yield 'Adapted ';
      yield 'content.';
    });
  });

  afterEach(() => {
    delete process.env.COPYDOC_API_KEY;
  });

  test('adaptCommand() calls assembleAdapt() with source text and target format', async () => {
    const { adaptCommand } = await import('../commands/adapt');
    await adaptCommand(makeLoader(), 'Original landing page copy', 'linkedin');
    expect(mockAssembleAdapt).toHaveBeenCalled();
    const [sourceArg, formatArg] = mockAssembleAdapt.mock.calls[0] as [string, string];
    expect(sourceArg).toBe('Original landing page copy');
    expect(formatArg).toBe('linkedin');
  });

  test('adaptCommand() streams adapted output to terminal', async () => {
    const { adaptCommand } = await import('../commands/adapt');
    await adaptCommand(makeLoader(), 'Original copy text', 'email');
    const written = processWriteMock.mock.calls.map((c: unknown[]) => c[0]).join('');
    expect(written).toContain('Adapted');
    expect(written).toContain('content');
  });

  test('adaptCommand() reads file when source is a file path that exists', async () => {
    const tmpFile = path.join(os.tmpdir(), `copydoc-adapt-test-${Date.now()}.md`);
    fs.writeFileSync(tmpFile, 'Copy from file for adaptation.');

    const { adaptCommand } = await import('../commands/adapt');
    await adaptCommand(makeLoader(), tmpFile, 'linkedin');

    const [sourceArg] = mockAssembleAdapt.mock.calls[0] as [string, string];
    expect(sourceArg).toBe('Copy from file for adaptation.');

    fs.unlinkSync(tmpFile);
  });

  test('adaptCommand() treats non-existent path as inline text', async () => {
    const { adaptCommand } = await import('../commands/adapt');
    const inlineText = 'This is my copy text to adapt.';
    await adaptCommand(makeLoader(), inlineText, 'twitter');
    const [sourceArg] = mockAssembleAdapt.mock.calls[0] as [string, string];
    expect(sourceArg).toBe(inlineText);
  });

  test('adaptCommand() runs anti-slop check on output', async () => {
    const { adaptCommand } = await import('../commands/adapt');
    await adaptCommand(makeLoader(), 'Source copy', 'linkedin');
    expect(mockAntiSlopCheck).toHaveBeenCalled();
  });

  test('adaptCommand() prints quality scores after streaming', async () => {
    const { adaptCommand } = await import('../commands/adapt');
    await adaptCommand(makeLoader(), 'Source copy', 'linkedin');
    const combined = output.join('\n');
    expect(combined).toMatch(/score|issue|quality|AI.tell/i);
  });
});

// ---- cli.ts routing: init/write/critique/adapt ----

describe('cli.ts routing - new commands wired up', () => {
  let output: string[] = [];
  let processWriteMock: ReturnType<typeof mock>;
  let consoleLogMock: ReturnType<typeof mock>;

  beforeEach(() => {
    output = [];
    consoleLogMock = mock((...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    });
    processWriteMock = mock((_s: string) => {});
    console.log = consoleLogMock as typeof console.log;
    process.stdout.write = processWriteMock as typeof process.stdout.write;
    process.env.COPYDOC_API_KEY = 'test-api-key';
    mockReadlineAnswers = [];
    mockReadlineQuestions = [];
    mockQuestion.mockClear();
    mockAssemble.mockClear();
    mockAssembleCritique.mockClear();
    mockAssembleAdapt.mockClear();
    removeRcFile();
  });

  afterEach(() => {
    removeRcFile();
    delete process.env.COPYDOC_API_KEY;
  });

  test('"init" command no longer prints "Not yet implemented"', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key', '', ''];
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'init'], makeLoader());
    const combined = output.join('\n');
    expect(combined).not.toContain('Not yet implemented');
  });

  test('"init" command creates config file', async () => {
    mockReadlineAnswers = ['anthropic', 'sk-ant-test-key', '', ''];
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'init'], makeLoader());
    expect(fs.existsSync(RC_FILE)).toBe(true);
  });

  test('"write <description>" command no longer prints "Not yet implemented"', async () => {
    mockReadlineAnswers = ['Book a demo', 'SaaS founders', ''];
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'write', 'landing page hero'], makeLoader());
    const combined = output.join('\n') + processWriteMock.mock.calls.map((c: unknown[]) => c[0]).join('');
    expect(combined).not.toContain('Not yet implemented');
  });

  test('"write <description>" command calls assembler', async () => {
    mockReadlineAnswers = ['Book a demo', 'SaaS founders', ''];
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'write', 'cold email'], makeLoader());
    expect(mockAssemble).toHaveBeenCalled();
  });

  test('"critique <input>" command no longer prints "Not yet implemented"', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'critique', 'some inline copy text'], makeLoader());
    const combined = output.join('\n');
    expect(combined).not.toContain('Not yet implemented');
  });

  test('"critique <input>" calls assembleCritique', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'critique', 'some copy to critique'], makeLoader());
    expect(mockAssembleCritique).toHaveBeenCalled();
  });

  test('"adapt <source> --to <format>" command no longer prints "Not yet implemented"', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'adapt', 'source copy', '--to', 'linkedin'], makeLoader());
    const combined = output.join('\n') + processWriteMock.mock.calls.map((c: unknown[]) => c[0]).join('');
    expect(combined).not.toContain('Not yet implemented');
  });

  test('"adapt <source> --to <format>" calls assembleAdapt with correct format', async () => {
    const { runCli } = await import('../cli');
    await runCli(['node', 'copydoc', 'adapt', 'source copy text', '--to', 'twitter'], makeLoader());
    expect(mockAssembleAdapt).toHaveBeenCalled();
    const [, formatArg] = mockAssembleAdapt.mock.calls[0] as [string, string];
    expect(formatArg).toBe('twitter');
  });
});
