import { describe, expect, test } from 'bun:test';
import path from 'path';
import { createLoader } from '../loader';
import { selectFramework, routeToDomain } from '../frameworks';
import { createAssembler } from '../assembler';
import { createLinter } from '../lint';
import type { Brief } from '../types';

const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');

// Full pipeline integration test:
// createLoader -> createAssembler + selectFramework -> assemble a brief -> createLinter -> check assembled prompt
describe('Full pipeline integration', () => {
  test('createLoader produces a working loader that reads real skills', () => {
    const loader = createLoader(SKILLS_DIR);
    const skills = loader.listSkills();
    expect(skills.length).toBeGreaterThanOrEqual(15);
  });

  test('createAssembler composes with createLoader and selectFramework', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);
    expect(typeof assembler.assemble).toBe('function');
    expect(typeof assembler.assembleCritique).toBe('function');
    expect(typeof assembler.assembleAdapt).toBe('function');
  });

  test('assemble a cold email brief returns a valid AssembledPrompt', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);
    const brief: Brief = {
      type: 'cold email',
      goal: 'book a demo',
      audience: { who: 'B2B SaaS founders', pain: 'slow onboarding' },
      product: { name: 'Onboard Pro', description: 'Automated onboarding tool' },
    };
    const result = assembler.assemble(brief);
    expect(typeof result.systemPrompt).toBe('string');
    expect(typeof result.userPrompt).toBe('string');
    expect(result.systemPrompt.length).toBeGreaterThan(100);
    expect(result.userPrompt.length).toBeGreaterThan(10);
  });

  test('createLinter composes with createLoader from the same loader', () => {
    const loader = createLoader(SKILLS_DIR);
    const linter = createLinter(loader);
    expect(linter.lint('Unique content.', { locale: 'fr' })).toEqual({ issues: [], errors: 0, warnings: 0 });
  });

  test('assembled prompt can be passed through copy linter without error', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);
    const linter = createLinter(loader);

    const brief: Brief = {
      type: 'cold email',
      goal: 'book a demo',
    };

    const { systemPrompt, userPrompt } = assembler.assemble(brief);

    expect(linter.lint(systemPrompt, { avoid: ['Role'] }).issues.map(({ rule, severity, message }) => ({ rule, severity, message }))).toContainEqual({
      rule: 'phrase', severity: 'error', message: 'Banned pattern: Role',
    });
    expect(linter.lint(userPrompt, { avoid: ['book a demo'] }).issues.map(({ rule, severity, message }) => ({ rule, severity, message }))).toContainEqual({
      rule: 'phrase', severity: 'error', message: 'Banned pattern: book a demo',
    });
  });

  test('copy linter returns a structured result for assembled systemPrompt', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);
    const linter = createLinter(loader);

    const brief: Brief = { type: 'cold email', goal: 'book a demo' };
    const { systemPrompt } = assembler.assemble(brief);

    const result = linter.lint(systemPrompt, { avoid: ['Role'] });
    expect(result.issues.map(({ rule, severity, message }) => ({ rule, severity, message }))).toContainEqual({ rule: 'phrase', severity: 'error', message: 'Banned pattern: Role' });
    expect(result.errors).toBeGreaterThanOrEqual(1);
  });

  test('full pipeline: routeToDomain selects email-copy, assembler loads that domain skill', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);

    const brief: Brief = { type: 'cold outreach email', goal: 'schedule a call' };
    const domain = routeToDomain(brief.type);
    expect(domain).toBe('email-copy');

    const { systemPrompt } = assembler.assemble(brief);
    // The domain skill content should be present in the assembled prompt
    expect(systemPrompt).toContain('Email');
  });

  test('full pipeline: selectFramework selects PAS for cold email, assembler includes PAS content', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);

    const frameworkResult = selectFramework('cold email', 'book a demo');
    expect(frameworkResult.framework).toBe('PAS');

    const brief: Brief = { type: 'cold email', goal: 'book a demo' };
    const { systemPrompt } = assembler.assemble(brief);
    expect(systemPrompt).toContain('PAS');
  });

  test('full pipeline: assembleAdapt routes to target domain and includes anti-slop', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);
    const linter = createLinter(loader);

    const { systemPrompt } = assembler.assembleAdapt(
      'Our product helps you save time.',
      'LinkedIn post',
    );

    expect(systemPrompt).toMatch(/Social Copy|LinkedIn|social/i);
    expect(systemPrompt).toMatch(/Anti-Slop|Banned Words|slop/i);

    const result = linter.lint(systemPrompt, { avoid: ['Role'] });
    expect(result.errors).toBeGreaterThanOrEqual(1);
  });

  test('full pipeline: assembleCritique includes scoring rubric and anti-slop', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);
    const linter = createLinter(loader);

    const copyText = 'Buy now and save big. Limited time offer.';
    const { systemPrompt, userPrompt } = assembler.assembleCritique(copyText);

    expect(systemPrompt).toMatch(/Scoring Rubric|Quality Frameworks/);
    expect(systemPrompt).toMatch(/Anti-Slop|Banned Words|slop/i);
    expect(userPrompt).toContain(copyText);

    const result = linter.lint(systemPrompt, { avoid: ['Role'] });
    expect(result.issues.map(({ rule, severity, message }) => ({ rule, severity, message }))).toContainEqual({ rule: 'phrase', severity: 'error', message: 'Banned pattern: Role' });
  });

  test('full pipeline: brand_voice.avoids words appear in assembled prompt and are detected by linter', () => {
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);
    const linter = createLinter(loader);

    const brief: Brief = {
      type: 'cold email',
      goal: 'book a demo',
      brand_voice: {
        avoids: ['leverage', 'seamless'],
      },
    };

    const { systemPrompt } = assembler.assemble(brief);
    // The banned words from brand_voice.avoids appear in the system prompt
    expect(systemPrompt).toContain('leverage');
    expect(systemPrompt).toContain('seamless');

    // The copy linter independently flags these words if present in text
    const testText = 'We leverage seamless workflows.';
    const result = linter.lint(testText, { avoid: brief.brand_voice!.avoids });
    const phrases = result.issues.map(({ rule, severity, message }) => ({ rule, severity, message }));
    expect(phrases).toContainEqual({ rule: 'phrase', severity: 'error', message: 'Banned pattern: leverage' });
    expect(phrases).toContainEqual({ rule: 'phrase', severity: 'error', message: 'Banned pattern: seamless' });
  });

  test('full pipeline: all three assembler methods work with single shared loader', () => {
    // Ensures no state pollution between assemble/assembleCritique/assembleAdapt
    const loader = createLoader(SKILLS_DIR);
    const assembler = createAssembler(loader, selectFramework);

    const assembleResult = assembler.assemble({ type: 'cold email', goal: 'book a demo' });
    const critiqueResult = assembler.assembleCritique('Some copy to evaluate.');
    const adaptResult = assembler.assembleAdapt('Source copy.', 'blog post');

    expect(assembleResult.systemPrompt).toContain('# Role');
    expect(critiqueResult.systemPrompt).toContain('# Role');
    expect(adaptResult.systemPrompt).toContain('# Role');

    // Each produces different system prompts (domain-specific content differs)
    expect(assembleResult.systemPrompt).not.toBe(critiqueResult.systemPrompt);
    expect(assembleResult.systemPrompt).not.toBe(adaptResult.systemPrompt);
    expect(critiqueResult.systemPrompt).not.toBe(adaptResult.systemPrompt);
  });
});
