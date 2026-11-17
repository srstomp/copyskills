import { describe, expect, test } from 'bun:test';
import type {
  Brief,
  FrameworkSelection,
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

  test('Brief accepts constraints with optional length, format, cta', () => {
    const brief: Brief = {
      type: 'cold outreach email',
      goal: 'Book a call',
      constraints: {
        length: '150 words max',
        format: 'plain text email',
        cta: 'single CTA, link to booking page',
      },
    };
    expect(brief.constraints?.length).toBe('150 words max');
    expect(brief.constraints?.format).toBe('plain text email');
    expect(brief.constraints?.cta).toBe('single CTA, link to booking page');
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
