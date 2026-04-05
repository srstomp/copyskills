import { describe, expect, test } from 'bun:test';
import type {
  Brief,
  QualityScores,
  AntiSlopIssue,
  AntiSlopResult,
  FrameworkSelection,
  CopyOutput,
  AssembledPrompt,
  SkillMetadata,
  SkillContent,
} from '../types';

describe('Brief interface', () => {
  test('Brief accepts required fields type and goal', () => {
    const brief: Brief = {
      type: 'cold outreach email',
      goal: 'Book a demo call',
    };
    expect(brief.type).toBe('cold outreach email');
    expect(brief.goal).toBe('Book a demo call');
  });

  test('Brief accepts audience with who field', () => {
    const brief: Brief = {
      type: 'cold outreach email',
      goal: 'Book a demo call',
      audience: {
        who: 'US food enthusiasts, 28-45',
      },
    };
    expect(brief.audience?.who).toBe('US food enthusiasts, 28-45');
  });

  test('Brief accepts audience with optional pain and sophistication', () => {
    const brief: Brief = {
      type: 'cold outreach email',
      goal: 'Book a demo call',
      audience: {
        who: 'Restaurant owners',
        pain: 'Bored of supermarket sake',
        sophistication: 'casual',
      },
    };
    expect(brief.audience?.pain).toBe('Bored of supermarket sake');
    expect(brief.audience?.sophistication).toBe('casual');
  });

  test('Brief audience sophistication accepts all three values', () => {
    const casual: Brief['audience'] = { who: 'test', sophistication: 'casual' };
    const familiar: Brief['audience'] = { who: 'test', sophistication: 'familiar' };
    const expert: Brief['audience'] = { who: 'test', sophistication: 'expert' };
    expect(casual?.sophistication).toBe('casual');
    expect(familiar?.sophistication).toBe('familiar');
    expect(expert?.sophistication).toBe('expert');
  });

  test('Brief accepts product with optional name, description, differentiator', () => {
    const brief: Brief = {
      type: 'landing page hero',
      goal: 'Sign up',
      product: {
        name: 'SakeBox',
        description: 'Monthly sake subscription',
        differentiator: 'Direct from 40+ Japanese breweries',
      },
    };
    expect(brief.product?.name).toBe('SakeBox');
    expect(brief.product?.description).toBe('Monthly sake subscription');
    expect(brief.product?.differentiator).toBe('Direct from 40+ Japanese breweries');
  });

  test('Brief accepts brand_voice with optional tone, avoids, examples', () => {
    const brief: Brief = {
      type: 'newsletter',
      goal: 'Drive clicks',
      brand_voice: {
        tone: 'knowledgeable, casual',
        avoids: ['artisanal', 'curated'],
        examples: ['Example copy that matches desired voice'],
      },
    };
    expect(brief.brand_voice?.tone).toBe('knowledgeable, casual');
    expect(brief.brand_voice?.avoids).toEqual(['artisanal', 'curated']);
    expect(brief.brand_voice?.examples).toEqual(['Example copy that matches desired voice']);
  });

  test('Brief accepts constraints with optional length, format, cta, language', () => {
    const brief: Brief = {
      type: 'cold outreach email',
      goal: 'Book a call',
      constraints: {
        length: '150 words max',
        format: 'plain text email',
        cta: 'single CTA, link to booking page',
        language: 'en-US',
      },
    };
    expect(brief.constraints?.length).toBe('150 words max');
    expect(brief.constraints?.format).toBe('plain text email');
    expect(brief.constraints?.cta).toBe('single CTA, link to booking page');
    expect(brief.constraints?.language).toBe('en-US');
  });

  test('Brief can have all optional fields omitted', () => {
    const brief: Brief = {
      type: 'ad copy',
      goal: 'Drive trial signups',
    };
    expect(brief.audience).toBeUndefined();
    expect(brief.product).toBeUndefined();
    expect(brief.brand_voice).toBeUndefined();
    expect(brief.constraints).toBeUndefined();
  });
});

describe('QualityScores interface', () => {
  test('QualityScores has exactly 7 dimensions', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    const keys = Object.keys(scores);
    expect(keys.length).toBe(7);
  });

  test('QualityScores has clarity dimension', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    expect(typeof scores.clarity).toBe('number');
  });

  test('QualityScores has specificity dimension', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    expect(typeof scores.specificity).toBe('number');
  });

  test('QualityScores has voice_match dimension', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    expect(typeof scores.voice_match).toBe('number');
  });

  test('QualityScores has ai_tell_score dimension (lower is better)', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    expect(typeof scores.ai_tell_score).toBe('number');
    expect(scores.ai_tell_score).toBe(2);
  });

  test('QualityScores has persuasion dimension', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    expect(typeof scores.persuasion).toBe('number');
  });

  test('QualityScores has action dimension', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    expect(typeof scores.action).toBe('number');
  });

  test('QualityScores has overall dimension', () => {
    const scores: QualityScores = {
      clarity: 8,
      specificity: 7,
      voice_match: 9,
      ai_tell_score: 2,
      persuasion: 8,
      action: 7,
      overall: 8,
    };
    expect(typeof scores.overall).toBe('number');
  });
});

describe('AntiSlopIssue interface', () => {
  test('AntiSlopIssue has pattern and line fields', () => {
    const issue: AntiSlopIssue = {
      pattern: 'leverage',
      line: 3,
    };
    expect(issue.pattern).toBe('leverage');
    expect(issue.line).toBe(3);
  });

  test('AntiSlopIssue accepts optional suggestion', () => {
    const issue: AntiSlopIssue = {
      pattern: 'leverage',
      line: 3,
      suggestion: 'use "use" instead',
    };
    expect(issue.suggestion).toBe('use "use" instead');
  });
});

describe('AntiSlopResult interface', () => {
  test('AntiSlopResult has score and issues fields', () => {
    const result: AntiSlopResult = {
      score: 2,
      issues: [{ pattern: 'leverage', line: 1 }],
    };
    expect(result.score).toBe(2);
    expect(result.issues.length).toBe(1);
  });

  test('AntiSlopResult score can be 0 (no issues)', () => {
    const result: AntiSlopResult = {
      score: 0,
      issues: [],
    };
    expect(result.score).toBe(0);
    expect(result.issues).toEqual([]);
  });
});

describe('FrameworkSelection interface', () => {
  test('FrameworkSelection has framework, path, rationale fields', () => {
    const selection: FrameworkSelection = {
      framework: 'PAS',
      path: 'persuasion-frameworks/references/pas.md',
      rationale: 'Strong pain point makes PAS ideal for cold outreach',
    };
    expect(selection.framework).toBe('PAS');
    expect(selection.path).toBe('persuasion-frameworks/references/pas.md');
    expect(selection.rationale).toBe('Strong pain point makes PAS ideal for cold outreach');
  });
});

describe('CopyOutput interface', () => {
  test('CopyOutput has copy.primary and metadata fields', () => {
    const output: CopyOutput = {
      copy: {
        primary: 'Your copy here',
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
    expect(output.metadata.domain).toBe('email-copy/cold-outreach');
    expect(output.metadata.flags).toEqual([]);
  });

  test('CopyOutput accepts optional copy.variants', () => {
    const output: CopyOutput = {
      copy: {
        primary: 'Primary copy',
        variants: ['Variant A', 'Variant B'],
      },
      metadata: {
        framework_used: 'AIDA',
        domain: 'marketing-copy',
        quality_scores: {
          clarity: 9,
          specificity: 8,
          voice_match: 8,
          ai_tell_score: 1,
          persuasion: 9,
          action: 8,
          overall: 9,
        },
        flags: [],
      },
    };
    expect(output.copy.variants).toEqual(['Variant A', 'Variant B']);
  });
});

describe('AssembledPrompt interface', () => {
  test('AssembledPrompt has systemPrompt and userPrompt fields', () => {
    const prompt: AssembledPrompt = {
      systemPrompt: 'You are a copywriter...',
      userPrompt: 'Write a cold outreach email...',
    };
    expect(prompt.systemPrompt).toBe('You are a copywriter...');
    expect(prompt.userPrompt).toBe('Write a cold outreach email...');
  });
});

describe('SkillMetadata interface', () => {
  test('SkillMetadata has name and description fields', () => {
    const meta: SkillMetadata = {
      name: 'email-copy',
      description: 'Email copywriting skill',
    };
    expect(meta.name).toBe('email-copy');
    expect(meta.description).toBe('Email copywriting skill');
  });
});

describe('SkillContent interface', () => {
  test('SkillContent has metadata and body fields', () => {
    const content: SkillContent = {
      metadata: {
        name: 'email-copy',
        description: 'Email copywriting skill',
      },
      body: '# Email Copy\n\nWorkflow instructions here...',
    };
    expect(content.metadata.name).toBe('email-copy');
    expect(content.body).toContain('Email Copy');
  });
});
