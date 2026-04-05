import { describe, expect, test } from 'bun:test';
import { VERSION } from '../index';
import type {
  Brief,
  QualityScores,
  CopyOutput,
  AntiSlopIssue,
  AntiSlopResult,
  FrameworkSelection,
  AssembledPrompt,
  SkillMetadata,
  SkillContent,
} from '../index';

describe('@copydoc/core smoke test', () => {
  test('VERSION is exported and truthy', () => {
    expect(VERSION).toBeTruthy();
  });

  test('VERSION is a string', () => {
    expect(typeof VERSION).toBe('string');
  });
});

describe('@copydoc/core type exports', () => {
  test('Brief type can be constructed and used at runtime', () => {
    const brief: Brief = {
      type: 'cold outreach email',
      goal: 'Book a demo call',
      audience: {
        who: 'Restaurant owners',
        pain: 'Inefficient sake ordering',
        sophistication: 'expert',
      },
      product: {
        name: 'SakeBox',
        description: 'Monthly sake subscription',
        differentiator: 'Direct from 40+ Japanese breweries',
      },
      brand_voice: {
        tone: 'knowledgeable, casual',
        avoids: ['artisanal', 'curated'],
        examples: ['Example copy that matches desired voice'],
      },
      constraints: {
        length: '150 words max',
        format: 'plain text email',
        cta: 'single CTA, link to booking page',
        language: 'en-US',
      },
    };
    expect(brief.type).toBe('cold outreach email');
    expect(brief.goal).toBe('Book a demo call');
    expect(brief.audience?.who).toBe('Restaurant owners');
    expect(brief.product?.name).toBe('SakeBox');
    expect(brief.brand_voice?.avoids).toContain('artisanal');
    expect(brief.constraints?.language).toBe('en-US');
  });

  test('QualityScores type has all 7 required dimensions', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    expect(Object.keys(scores)).toHaveLength(7);
    expect(scores.clarity).toBe(8);
    expect(scores.specificity).toBe(7);
    expect(scores.voice_match).toBe(9);
    expect(scores.ai_tell_score).toBe(2);
    expect(scores.persuasion).toBe(8);
    expect(scores.action).toBe(7);
    expect(scores.overall).toBe(8);
  });

  test('CopyOutput type can be constructed with required shape', () => {
    const output: CopyOutput = {
      copy: {
        primary: 'Your copy here',
        variants: ['Variant A'],
      },
      metadata: {
        framework_used: 'PAS',
        domain: 'email-copy/cold-outreach',
        quality_scores: {
          clarity: 8,
          specificity: 7,
          voice_match: 9,
          ai_tell_score: 2,
          persuasion: 8,
          action: 7,
          overall: 8,
        },
        flags: [],
      },
    };
    expect(output.copy.primary).toBe('Your copy here');
    expect(output.metadata.framework_used).toBe('PAS');
    expect(output.metadata.quality_scores.overall).toBe(8);
  });

  test('AntiSlopIssue type includes pattern, line, optional suggestion', () => {
    const issue: AntiSlopIssue = {
      pattern: 'leverage',
      line: 3,
      suggestion: 'use "use" instead',
    };
    expect(issue.pattern).toBe('leverage');
    expect(issue.line).toBe(3);
    expect(issue.suggestion).toBe('use "use" instead');
  });

  test('AntiSlopResult type has score and issues array', () => {
    const result: AntiSlopResult = {
      score: 2,
      issues: [{ pattern: 'leverage', line: 1 }],
    };
    expect(result.score).toBe(2);
    expect(result.issues).toHaveLength(1);
  });

  test('FrameworkSelection type has framework, path, rationale', () => {
    const selection: FrameworkSelection = {
      framework: 'PAS',
      path: 'persuasion-frameworks/references/pas.md',
      rationale: 'Strong pain point makes PAS ideal for cold outreach',
    };
    expect(selection.framework).toBe('PAS');
    expect(selection.path).toContain('pas.md');
    expect(selection.rationale).toBeTruthy();
  });

  test('AssembledPrompt type has systemPrompt and userPrompt', () => {
    const prompt: AssembledPrompt = {
      systemPrompt: 'You are a copywriter...',
      userPrompt: 'Write a cold outreach email...',
    };
    expect(prompt.systemPrompt).toBeTruthy();
    expect(prompt.userPrompt).toBeTruthy();
  });

  test('SkillMetadata type has name and description', () => {
    const meta: SkillMetadata = {
      name: 'email-copy',
      description: 'Email copywriting skill for cold outreach, newsletters, and sequences',
    };
    expect(meta.name).toBe('email-copy');
    expect(meta.description).toBeTruthy();
  });

  test('SkillContent type has metadata and body', () => {
    const content: SkillContent = {
      metadata: {
        name: 'email-copy',
        description: 'Email copywriting skill',
      },
      body: '# Email Copy\n\nWorkflow content here...',
    };
    expect(content.metadata.name).toBe('email-copy');
    expect(content.body).toContain('Email Copy');
  });
});
