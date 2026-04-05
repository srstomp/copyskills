import type { Brief, AssembledPrompt } from './types.js';
import type { SkillLoader } from './loader.js';
import { routeToDomain } from './frameworks.js';

const ANTI_SLOP_PATH = 'quality-frameworks/references/anti-slop.md';

export interface Assembler {
  assemble(brief: Brief): AssembledPrompt;
  assembleCritique(text: string, context?: Partial<Brief>): AssembledPrompt;
  assembleAdapt(sourceText: string, targetFormat: string, brandVoice?: Brief['brand_voice']): AssembledPrompt;
}

export function createAssembler(
  loader: SkillLoader,
  frameworkSelector: (copyType: string, goal: string) => { framework: string; path: string; rationale: string },
): Assembler {
  function assemble(brief: Brief): AssembledPrompt {
    // 1. Route brief.type to domain skill
    const domain = routeToDomain(brief.type);

    // 2. Load domain skill (SKILL.md body)
    const domainSkill = loader.getSkill(domain);

    // 3. Select framework
    const framework = frameworkSelector(brief.type, brief.goal);

    // 4. Load framework reference
    const frameworkContent = loader.resolveReference(framework.path);

    // 5. Load anti-slop reference
    const antiSlopContent = loader.resolveReference(ANTI_SLOP_PATH);

    // 6. Build system prompt
    const systemParts: string[] = [];

    systemParts.push('# Role');
    systemParts.push('You are a professional copywriter. Follow the workflow below exactly.');

    systemParts.push('# Domain Workflow');
    systemParts.push(domainSkill.body);

    systemParts.push(`# Persuasion Framework: ${framework.framework}`);
    systemParts.push(frameworkContent);

    systemParts.push('# Quality Rules (MANDATORY)');
    systemParts.push(antiSlopContent);

    if (brief.brand_voice) {
      const bv = brief.brand_voice;
      const brandParts: string[] = [];

      if (bv.tone) {
        brandParts.push(`Tone: ${bv.tone}`);
      }
      if (bv.avoids && bv.avoids.length > 0) {
        brandParts.push(`Treat these as additional banned words: ${bv.avoids.join(', ')}`);
      }
      if (bv.examples && bv.examples.length > 0) {
        brandParts.push(`Examples: ${bv.examples.join(', ')}`);
      }

      systemParts.push('# Brand Voice Constraints');
      systemParts.push(brandParts.join('\n'));
    }

    const systemPrompt = systemParts.join('\n\n');

    // 7. Build user prompt
    const userParts: string[] = [];

    userParts.push(`Write a ${brief.type}.`);
    userParts.push(`Goal: ${brief.goal}`);

    if (brief.audience) {
      const a = brief.audience;
      const audienceLine = `Audience: ${a.who}${a.pain ? `. Pain: ${a.pain}` : ''}${a.sophistication ? `. Sophistication: ${a.sophistication}` : ''}`;
      userParts.push(audienceLine);
    }

    if (brief.product) {
      const p = brief.product;
      const productParts: string[] = [];
      if (p.name) productParts.push(p.name);
      if (p.description) productParts.push(p.description);
      if (p.differentiator) productParts.push(`Differentiator: ${p.differentiator}`);
      if (productParts.length > 0) {
        userParts.push(`Product: ${productParts.join('. ')}`);
      }
    }

    if (brief.constraints) {
      const c = brief.constraints;
      const constraintParts: string[] = [];
      if (c.length) constraintParts.push(`Length: ${c.length}`);
      if (c.format) constraintParts.push(`Format: ${c.format}`);
      if (c.cta) constraintParts.push(`CTA: ${c.cta}`);
      if (c.language) constraintParts.push(`Language: ${c.language}`);
      if (constraintParts.length > 0) {
        userParts.push(`Constraints: ${constraintParts.join('. ')}`);
      }
    }

    const userPrompt = userParts.join('\n');

    return { systemPrompt, userPrompt };
  }

  function assembleCritique(text: string, context?: Partial<Brief>): AssembledPrompt {
    // 1. Load copy-critique skill
    const critiqueSkill = loader.getSkill('copy-critique');

    // 2. Load quality-frameworks skill
    const qualitySkill = loader.getSkill('quality-frameworks');

    // 3. Load anti-slop reference
    const antiSlopContent = loader.resolveReference(ANTI_SLOP_PATH);

    // 4. Build system prompt
    const systemParts: string[] = [];

    systemParts.push('# Role');
    systemParts.push('You are a professional copy critic. Follow the evaluation workflow below exactly.');

    systemParts.push('# Critique Workflow');
    systemParts.push(critiqueSkill.body);

    systemParts.push('# Quality Frameworks');
    systemParts.push(qualitySkill.body);

    systemParts.push('# Quality Rules (MANDATORY)');
    systemParts.push(antiSlopContent);

    const systemPrompt = systemParts.join('\n\n');

    // 5. Build user prompt
    const userParts: string[] = [];

    userParts.push(`Evaluate the following copy:\n\n${text}`);

    if (context) {
      const contextParts: string[] = [];
      if (context.audience?.who) {
        contextParts.push(`Audience: ${context.audience.who}`);
      }
      if (context.goal) {
        contextParts.push(`Goal: ${context.goal}`);
      }
      if (context.brand_voice?.tone) {
        contextParts.push(`Brand voice: ${context.brand_voice.tone}`);
      }
      if (contextParts.length > 0) {
        userParts.push(contextParts.join('\n'));
      }
    }

    const userPrompt = userParts.join('\n\n');

    return { systemPrompt, userPrompt };
  }

  function assembleAdapt(
    sourceText: string,
    targetFormat: string,
    brandVoice?: Brief['brand_voice'],
  ): AssembledPrompt {
    // 1. Load copy-adapt skill
    const adaptSkill = loader.getSkill('copy-adapt');

    // 2. Route targetFormat to domain
    const targetDomain = routeToDomain(targetFormat);

    // 3. Load target domain skill
    const targetDomainSkill = loader.getSkill(targetDomain);

    // 4. Load anti-slop reference
    const antiSlopContent = loader.resolveReference(ANTI_SLOP_PATH);

    // 5. Build system prompt
    const systemParts: string[] = [];

    systemParts.push('# Role');
    systemParts.push('You are a professional copywriter specializing in copy adaptation. Follow the workflow below exactly.');

    systemParts.push('# Adaptation Workflow');
    systemParts.push(adaptSkill.body);

    systemParts.push('# Target Domain Workflow');
    systemParts.push(targetDomainSkill.body);

    systemParts.push('# Quality Rules (MANDATORY)');
    systemParts.push(antiSlopContent);

    const systemPrompt = systemParts.join('\n\n');

    // 6. Build user prompt
    const userParts: string[] = [];

    userParts.push(`Adapt the following copy for ${targetFormat}:\n\n${sourceText}`);

    if (brandVoice) {
      const bvParts: string[] = [];
      if (brandVoice.tone) bvParts.push(`Tone: ${brandVoice.tone}`);
      if (brandVoice.avoids && brandVoice.avoids.length > 0) {
        bvParts.push(`Avoids: ${brandVoice.avoids.join(', ')}`);
      }
      if (brandVoice.examples && brandVoice.examples.length > 0) {
        bvParts.push(`Examples: ${brandVoice.examples.join(', ')}`);
      }
      if (bvParts.length > 0) {
        userParts.push(`Brand voice: ${bvParts.join('. ')}`);
      }
    }

    const userPrompt = userParts.join('\n\n');

    return { systemPrompt, userPrompt };
  }

  return { assemble, assembleCritique, assembleAdapt };
}
