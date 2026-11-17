import { describe, expect, test } from 'bun:test';
import { VERSION } from '../index';
import type {
  Brief,
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
      },
      locale: 'en-US',
    };
    expect(brief.type).toBe('cold outreach email');
    expect(brief.goal).toBe('Book a demo call');
    expect(brief.audience?.who).toBe('Restaurant owners');
    expect(brief.product?.name).toBe('SakeBox');
    expect(brief.brand_voice?.avoids).toContain('artisanal');
    expect(brief.locale).toBe('en-US');
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
