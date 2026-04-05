import { describe, expect, test } from 'bun:test';
import path from 'path';
import { createLoader } from '../loader';
import { selectFramework } from '../frameworks';
import { createAssembler } from '../assembler';
import type { Assembler } from '../assembler';
import type { Brief } from '../types';

const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

function makeAssembler(): Assembler {
  const loader = createLoader(SKILLS_DIR);
  return createAssembler(loader, selectFramework);
}

// AC: assemble({ type: 'cold email', goal: 'book demo' }) returns systemPrompt containing PAS framework AND email-copy workflow
describe('assemble() - cold email', () => {
  test('assemble cold email returns systemPrompt containing PAS framework content', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toContain('PAS');
  });

  test('assemble cold email returns systemPrompt containing email-copy workflow instructions', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    // email-copy SKILL.md body contains "Email Copy" section
    expect(result.systemPrompt).toContain('Email');
  });

  test('assemble cold email systemPrompt contains Persuasion Framework section header', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toContain('# Persuasion Framework');
  });
});

// AC: assemble() systemPrompt always contains anti-slop instructions
describe('assemble() - anti-slop always included', () => {
  test('assemble cold email systemPrompt contains anti-slop content', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    // anti-slop.md contains "Anti-Slop" or "Banned Words"
    expect(result.systemPrompt).toMatch(/Anti-Slop|Banned Words|slop/i);
  });

  test('assemble landing page systemPrompt contains anti-slop content', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'landing page hero', goal: 'drive signups' };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toMatch(/Anti-Slop|Banned Words|slop/i);
  });

  test('assemble LinkedIn post systemPrompt contains anti-slop content', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'LinkedIn post', goal: 'grow followers' };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toMatch(/Anti-Slop|Banned Words|slop/i);
  });
});

// AC: assemble() with brand_voice.avoids includes those words as additional banned patterns in systemPrompt
describe('assemble() - brand_voice.avoids', () => {
  test('assemble with brand_voice.avoids includes those words in systemPrompt', () => {
    const assembler = makeAssembler();
    const brief: Brief = {
      type: 'cold email',
      goal: 'book demo',
      brand_voice: {
        avoids: ['synergy', 'disruptive', 'paradigm'],
      },
    };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toContain('synergy');
    expect(result.systemPrompt).toContain('disruptive');
    expect(result.systemPrompt).toContain('paradigm');
  });

  test('assemble with brand_voice.avoids includes banned words label in systemPrompt', () => {
    const assembler = makeAssembler();
    const brief: Brief = {
      type: 'cold email',
      goal: 'book demo',
      brand_voice: {
        avoids: ['synergy'],
      },
    };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toContain('banned');
  });

  test('assemble without brand_voice still works', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toBeTruthy();
  });
});

// AC: assemble() userPrompt contains the brief fields (type, goal, audience, product, constraints)
describe('assemble() - userPrompt contains brief fields', () => {
  test('assemble userPrompt contains brief.type', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    expect(result.userPrompt).toContain('cold email');
  });

  test('assemble userPrompt contains brief.goal', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    expect(result.userPrompt).toContain('book demo');
  });

  test('assemble userPrompt contains audience fields when provided', () => {
    const assembler = makeAssembler();
    const brief: Brief = {
      type: 'cold email',
      goal: 'book demo',
      audience: {
        who: 'B2B SaaS founders',
        pain: 'slow sales cycles',
        sophistication: 'expert',
      },
    };
    const result = assembler.assemble(brief);
    expect(result.userPrompt).toContain('B2B SaaS founders');
    expect(result.userPrompt).toContain('slow sales cycles');
    expect(result.userPrompt).toContain('expert');
  });

  test('assemble userPrompt contains product fields when provided', () => {
    const assembler = makeAssembler();
    const brief: Brief = {
      type: 'cold email',
      goal: 'book demo',
      product: {
        name: 'Acme CRM',
        description: 'AI-powered sales tool',
        differentiator: 'auto-updates from email',
      },
    };
    const result = assembler.assemble(brief);
    expect(result.userPrompt).toContain('Acme CRM');
    expect(result.userPrompt).toContain('AI-powered sales tool');
    expect(result.userPrompt).toContain('auto-updates from email');
  });

  test('assemble userPrompt contains constraints when provided', () => {
    const assembler = makeAssembler();
    const brief: Brief = {
      type: 'cold email',
      goal: 'book demo',
      constraints: {
        length: '150 words',
        format: 'plain text',
        cta: 'Book a call',
        language: 'English',
      },
    };
    const result = assembler.assemble(brief);
    expect(result.userPrompt).toContain('150 words');
    expect(result.userPrompt).toContain('plain text');
    expect(result.userPrompt).toContain('Book a call');
    expect(result.userPrompt).toContain('English');
  });
});

// AC: All prompts have clear section headers (# Role, # Domain Workflow, etc.)
describe('assemble() - section headers', () => {
  test('assemble systemPrompt contains # Role section', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toContain('# Role');
  });

  test('assemble systemPrompt contains # Domain Workflow section', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toContain('# Domain Workflow');
  });

  test('assemble systemPrompt contains # Quality Rules section', () => {
    const assembler = makeAssembler();
    const brief: Brief = { type: 'cold email', goal: 'book demo' };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toContain('# Quality Rules');
  });

  test('assemble systemPrompt contains # Brand Voice Constraints section when brand_voice provided', () => {
    const assembler = makeAssembler();
    const brief: Brief = {
      type: 'cold email',
      goal: 'book demo',
      brand_voice: { tone: 'direct' },
    };
    const result = assembler.assemble(brief);
    expect(result.systemPrompt).toContain('# Brand Voice Constraints');
  });
});

// AC: assembleCritique('some text') returns systemPrompt with copy-critique workflow and scoring rubric
describe('assembleCritique()', () => {
  test('assembleCritique returns systemPrompt with copy-critique workflow', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleCritique('Some copy text here.');
    // copy-critique SKILL.md body contains "Copy Critique" section
    expect(result.systemPrompt).toContain('Copy Critique');
  });

  test('assembleCritique returns systemPrompt with scoring rubric from quality-frameworks', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleCritique('Some copy text here.');
    // quality-frameworks SKILL.md body contains "Scoring Rubric" or "Quality Frameworks"
    expect(result.systemPrompt).toMatch(/Scoring Rubric|Quality Frameworks/);
  });

  test('assembleCritique returns systemPrompt with anti-slop content', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleCritique('Some copy text here.');
    expect(result.systemPrompt).toMatch(/Anti-Slop|Banned Words|slop/i);
  });

  test('assembleCritique userPrompt contains the input text', () => {
    const assembler = makeAssembler();
    const text = 'This is the copy to evaluate.';
    const result = assembler.assembleCritique(text);
    expect(result.userPrompt).toContain(text);
  });

  test('assembleCritique userPrompt contains evaluation instruction', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleCritique('Some copy.');
    expect(result.userPrompt).toContain('Evaluate');
  });

  test('assembleCritique with context includes audience and goal in userPrompt', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleCritique('Some copy.', {
      audience: { who: 'developers' },
      goal: 'drive signups',
    });
    expect(result.userPrompt).toContain('developers');
    expect(result.userPrompt).toContain('drive signups');
  });
});

// AC: assembleAdapt('source', 'LinkedIn post') loads social-copy domain skill in systemPrompt
describe('assembleAdapt()', () => {
  test('assembleAdapt for LinkedIn post loads social-copy domain skill in systemPrompt', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleAdapt('Original copy here.', 'LinkedIn post');
    // social-copy SKILL.md body contains "Social Copy" or platform-specific content
    expect(result.systemPrompt).toMatch(/Social Copy|LinkedIn|social/i);
  });

  test('assembleAdapt loads copy-adapt skill in systemPrompt', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleAdapt('Original copy here.', 'LinkedIn post');
    // copy-adapt SKILL.md body contains "Copy Adapt" or "adaptation"
    expect(result.systemPrompt).toMatch(/Copy Adapt|adapt/i);
  });

  test('assembleAdapt loads anti-slop content in systemPrompt', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleAdapt('Original copy here.', 'LinkedIn post');
    expect(result.systemPrompt).toMatch(/Anti-Slop|Banned Words|slop/i);
  });

  test('assembleAdapt userPrompt contains the source text', () => {
    const assembler = makeAssembler();
    const sourceText = 'Original copy to adapt.';
    const result = assembler.assembleAdapt(sourceText, 'LinkedIn post');
    expect(result.userPrompt).toContain(sourceText);
  });

  test('assembleAdapt userPrompt contains the target format', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleAdapt('Source copy.', 'LinkedIn post');
    expect(result.userPrompt).toContain('LinkedIn post');
  });

  test('assembleAdapt with brandVoice includes it in userPrompt', () => {
    const assembler = makeAssembler();
    const result = assembler.assembleAdapt('Source copy.', 'LinkedIn post', {
      tone: 'casual',
      avoids: ['synergy'],
    });
    expect(result.userPrompt).toContain('casual');
  });
});

// AC: createAssembler returns Assembler interface
describe('createAssembler()', () => {
  test('createAssembler returns object with assemble, assembleCritique, assembleAdapt methods', () => {
    const assembler = makeAssembler();
    expect(typeof assembler.assemble).toBe('function');
    expect(typeof assembler.assembleCritique).toBe('function');
    expect(typeof assembler.assembleAdapt).toBe('function');
  });
});
