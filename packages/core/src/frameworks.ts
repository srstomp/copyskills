import type { FrameworkSelection } from './types.js';

/**
 * Paid ad keywords. Checked before the routing table: ads are marketing copy
 * even when they name a social platform ("LinkedIn ad", "Meta ads").
 */
const AD_KEYWORDS = ['w:ad', 'w:ads', 'w:advertisement'];

/**
 * Domain routing table.
 * Each entry is [keyword[], domain].
 * Order matters: first match wins. The copy-workflow SKILL.md routing table mirrors this order.
 *
 * Keywords prefixed with "w:" require word-boundary matching to avoid substring collisions.
 * e.g. "ad" would match "leadership" without word boundaries.
 * Multi-word phrases always use substring matching (they are inherently specific enough).
 */
const DOMAIN_ROUTING: Array<[string[], string]> = [
  // email-copy - check before marketing-copy to catch "sales email" going to email-copy
  [
    ['w:email', 'subject line', 'newsletter', 'w:drip', 'w:sequence', 'w:outreach', 'cold email', 'cold outreach', 'w:nurture', 'w:campaign', 're-engagement', 'w:transactional'],
    'email-copy',
  ],
  // ux-copy - check before marketing-copy so "button" and "cta" don't collide
  [
    ['w:microcopy', 'w:button', 'error message', 'error state', 'w:onboarding', 'empty state', 'w:tooltip', 'w:ux', 'ui copy', 'w:notification', 'w:dialog', 'w:confirmation', 'w:placeholder', 'helper text'],
    'ux-copy',
  ],
  // social-copy - before editorial-copy so a named platform beats topic keywords
  // ("LinkedIn thought leadership post" is a social post, not an editorial piece)
  [
    ['w:linkedin', 'w:twitter', 'x post', 'w:tweet', 'w:instagram', 'w:tiktok', 'w:social', 'w:thread', 'w:carousel', 'w:caption'],
    'social-copy',
  ],
  // editorial-copy - before marketing-copy so "article" and "ad" don't collide
  [
    ['w:blog', 'w:article', 'w:seo', 'thought leadership', 'w:whitepaper', 'w:editorial', 'opinion piece', 'long-form content'],
    'editorial-copy',
  ],
  // sales-copy - before marketing-copy so "proposal"/"pitch deck" route correctly
  // "sales email" is handled by email-copy (email keyword fires first)
  [
    ['w:proposal', 'case study', 'pitch deck', 'one-pager', 'battle card'],
    'sales-copy',
  ],
  // brand-copy - before marketing-copy to isolate brand keywords
  [
    ['brand voice', 'voice profile', 'tone guide', 'w:messaging', 'style guide', 'w:tagline', 'elevator pitch', 'w:brand'],
    'brand-copy',
  ],
  // conversion-copy - before marketing-copy so "pricing"/"signup"/"funnel" route correctly
  [
    ['w:pricing', 'w:signup', 'sign up', 'sign-up', 'w:checkout', 'a/b', 'w:variant', 'w:trial', 'w:conversion', 'w:funnel'],
    'conversion-copy',
  ],
  // marketing-copy - checked last among named domains
  [
    ['landing page', 'w:lander', 'w:ad', 'w:advertisement', 'w:cta', 'value prop', 'value proposition', 'w:hero', 'w:banner', 'w:homepage', 'sales page'],
    'marketing-copy',
  ],
];

/**
 * Tests whether a keyword matches within the lowercased input.
 * Keywords prefixed with "w:" use word-boundary regex matching.
 * All other keywords use simple substring matching.
 */
function keywordMatches(keyword: string, lower: string): boolean {
  if (keyword.startsWith('w:')) {
    const word = keyword.slice(2);
    // Use word boundary regex: the keyword must not be part of a larger word
    const regex = new RegExp(`(?<![a-z])${escapeRegex(word)}(?![a-z])`, 'i');
    return regex.test(lower);
  }
  return lower.includes(keyword);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Internal version of routeToDomain that returns null when no keywords match,
 * allowing selectFramework to distinguish between a matched domain and the fallback.
 */
function routeToDomainOrNull(copyType: string): string | null {
  const lower = copyType.toLowerCase();

  // Paid ads always belong to marketing-copy, even when a platform is named:
  // "LinkedIn ad" and "Meta ads" are ad copy, not social posts.
  for (const keyword of AD_KEYWORDS) {
    if (keywordMatches(keyword, lower)) {
      return 'marketing-copy';
    }
  }

  for (const [keywords, domain] of DOMAIN_ROUTING) {
    for (const keyword of keywords) {
      if (keywordMatches(keyword, lower)) {
        return domain;
      }
    }
  }

  return null;
}

/**
 * Routes a copy type string to a domain skill name via case-insensitive keyword matching.
 * Returns 'marketing-copy' as default if no keywords match.
 */
export function routeToDomain(copyType: string): string {
  return routeToDomainOrNull(copyType) ?? 'marketing-copy';
}

/**
 * Detects email sub-type from copy type string.
 */
function detectEmailSubtype(lower: string): 'cold-outreach' | 'welcome-nurture' | 'newsletter' {
  if (lower.includes('newsletter')) {
    return 'newsletter';
  }
  if (
    lower.includes('cold') ||
    lower.includes('outreach') ||
    lower.includes('subject line')
  ) {
    return 'cold-outreach';
  }
  if (
    lower.includes('drip') ||
    lower.includes('nurture') ||
    lower.includes('welcome') ||
    lower.includes('sequence') ||
    lower.includes('campaign')
  ) {
    return 'welcome-nurture';
  }
  // Default email sub-type is cold-outreach
  return 'cold-outreach';
}

/**
 * Detects marketing-copy sub-type from copy type string.
 */
function detectMarketingSubtype(lower: string): 'short' | 'long' | 'value-prop' {
  if (lower.includes('value prop') || lower.includes('value proposition')) {
    return 'value-prop';
  }
  if (
    lower.includes('long') ||
    lower.includes('long-form') ||
    lower.includes('sales page') ||
    lower.includes('direct response')
  ) {
    return 'long';
  }
  return 'short';
}

/**
 * Detects editorial-copy sub-type from copy type string.
 */
function detectEditorialSubtype(lower: string): 'blog' | 'thought-leadership' | 'whitepaper' {
  if (lower.includes('whitepaper')) {
    return 'whitepaper';
  }
  if (lower.includes('thought leadership')) {
    return 'thought-leadership';
  }
  return 'blog';
}

/**
 * Detects sales-copy sub-type from copy type string.
 */
function detectSalesSubtype(lower: string): 'case-study' | 'proposal' | 'one-pager' {
  if (lower.includes('case study')) {
    return 'case-study';
  }
  if (
    lower.includes('proposal') ||
    lower.includes('pitch deck') ||
    lower.includes('battle card')
  ) {
    return 'proposal';
  }
  if (lower.includes('one-pager')) {
    return 'one-pager';
  }
  return 'case-study';
}

/**
 * Detects social-copy sub-type from copy type string.
 */
function detectSocialSubtype(lower: string): 'linkedin' | 'general' {
  if (lower.includes('linkedin')) {
    return 'linkedin';
  }
  return 'general';
}

/**
 * Detects conversion-copy sub-type from copy type string.
 */
function detectConversionSubtype(lower: string): 'pricing' | 'signup' {
  if (lower.includes('signup') || lower.includes('sign up')) {
    return 'signup';
  }
  // pricing, checkout, a/b, variant, trial, conversion, funnel all map to pricing/FAB
  return 'pricing';
}

/**
 * Selects the appropriate persuasion framework for a given copy type and goal.
 *
 * Uses keyword matching on copyType to determine the domain, then selects the
 * primary framework based on the persuasion-frameworks decision matrix.
 *
 * Returns a FrameworkSelection with framework name, reference file path, and rationale.
 * Falls back to AIDA/marketing-copy if no keywords match.
 */
export function selectFramework(copyType: string, goal: string): FrameworkSelection {
  const matchedDomain = routeToDomainOrNull(copyType);
  const lower = copyType.toLowerCase();

  // No keyword matched: return fallback AIDA with explicit fallback rationale
  if (matchedDomain === null) {
    return {
      framework: 'AIDA',
      path: 'persuasion-frameworks/references/aida.md',
      rationale:
        'No keyword match found for this copy type. Using AIDA as the fallback framework -- AIDA is the most broadly applicable framework and works across marketing contexts, providing a clear structure for any persuasive message.',
    };
  }

  const domain = matchedDomain;

  switch (domain) {
    case 'email-copy': {
      const subtype = detectEmailSubtype(lower);
      if (subtype === 'newsletter') {
        return {
          framework: 'AIDA',
          path: 'persuasion-frameworks/references/aida.md',
          rationale:
            'Newsletters benefit from AIDA because readers arrive with moderate interest, and the framework builds attention then channels it toward a specific action.',
        };
      }
      if (subtype === 'welcome-nurture') {
        return {
          framework: 'BAB',
          path: 'persuasion-frameworks/references/bab.md',
          rationale:
            'Welcome and nurture emails map to BAB because the reader is already opted in. Showing the before state, the better future, and the bridge builds trust through transformation rather than pain.',
        };
      }
      // cold-outreach default
      return {
        framework: 'PAS',
        path: 'persuasion-frameworks/references/pas.md',
        rationale:
          'Cold outreach maps to PAS because the audience has a clear pain point that needs to be agitated before presenting the solution.',
      };
    }

    case 'ux-copy': {
      return {
        framework: 'None',
        path: 'quality-frameworks/references/four-cs.md',
        rationale:
          'UX copy uses principles-based evaluation (Four Cs: Clear, Concise, Consistent, Conversational) rather than a persuasion framework. Micro-moments need clarity, not a persuasion arc.',
      };
    }

    case 'marketing-copy': {
      const subtype = detectMarketingSubtype(lower);
      if (subtype === 'value-prop') {
        return {
          framework: 'FAB',
          path: 'persuasion-frameworks/references/fab.md',
          rationale:
            'Value propositions map to FAB because they need to directly connect product features and advantages to the tangible benefit the reader receives.',
        };
      }
      if (subtype === 'long') {
        return {
          framework: 'PASTOR',
          path: 'persuasion-frameworks/references/pastor.md',
          rationale:
            'Long-form sales pages need PASTOR because high-consideration purchases require the full persuasion arc: problem, amplification, story, testimony, offer, and response.',
        };
      }
      return {
        framework: 'AIDA',
        path: 'persuasion-frameworks/references/aida.md',
        rationale:
          'Short-form marketing copy maps to AIDA because it captures attention quickly, builds interest, creates desire, and drives a single action within tight real estate.',
      };
    }

    case 'editorial-copy': {
      const subtype = detectEditorialSubtype(lower);
      if (subtype === 'whitepaper') {
        return {
          framework: 'ACCA',
          path: 'persuasion-frameworks/references/acca.md',
          rationale:
            'Whitepapers map to ACCA because they address a sophisticated audience that needs awareness, thorough comprehension, conviction through evidence, and a clear action.',
        };
      }
      if (subtype === 'thought-leadership') {
        return {
          framework: 'Star-Story-Solution',
          path: 'persuasion-frameworks/references/star-story-solution.md',
          rationale:
            'Thought leadership maps to Star-Story-Solution because authority is built through narrative: introduce the protagonist, tell a compelling story, and arrive at an insight.',
        };
      }
      // blog default
      return {
        framework: 'QUEST',
        path: 'persuasion-frameworks/references/quest.md',
        rationale:
          'Blog posts map to QUEST because educational content needs to qualify the reader, understand their context, educate with substance, stimulate with ideas, and transition to next steps.',
      };
    }

    case 'brand-copy': {
      return {
        framework: 'None',
        path: 'brand-copy/references/voice-dimensions.md',
        rationale:
          'Brand copy uses voice dimension analysis rather than a persuasion framework. The goal is to define and consistently express tone, not to drive a single conversion.',
      };
    }

    case 'sales-copy': {
      const subtype = detectSalesSubtype(lower);
      if (subtype === 'one-pager') {
        return {
          framework: 'FAB',
          path: 'persuasion-frameworks/references/fab.md',
          rationale:
            'One-pagers map to FAB because they need to communicate value efficiently, connecting features and advantages directly to the benefit the prospect cares about.',
        };
      }
      if (subtype === 'proposal') {
        return {
          framework: 'ACCA',
          path: 'persuasion-frameworks/references/acca.md',
          rationale:
            'Proposals map to ACCA because they need to build awareness of the problem, deepen comprehension, generate conviction through evidence, and drive action.',
        };
      }
      // case-study default
      return {
        framework: 'BAB',
        path: 'persuasion-frameworks/references/bab.md',
        rationale:
          'Case studies map to BAB because they are fundamentally transformation narratives: the before state (problem), the after state (outcome), and the bridge (your solution).',
      };
    }

    case 'social-copy': {
      const subtype = detectSocialSubtype(lower);
      if (subtype === 'linkedin') {
        return {
          framework: 'PAS',
          path: 'persuasion-frameworks/references/pas.md',
          rationale:
            'LinkedIn content maps to PAS because professional audiences respond to problem framing. Surface a pain, agitate the stakes, then present the insight or solution.',
        };
      }
      return {
        framework: 'AIDA',
        path: 'persuasion-frameworks/references/aida.md',
        rationale:
          'General social copy maps to AIDA because short-form content needs to stop the scroll (attention), hold interest, create desire, and prompt an action in seconds.',
      };
    }

    case 'conversion-copy': {
      const subtype = detectConversionSubtype(lower);
      if (subtype === 'signup') {
        return {
          framework: 'PAS',
          path: 'persuasion-frameworks/references/pas.md',
          rationale:
            'Signup pages map to PAS because the visitor has a problem they are trying to solve. Surfacing that problem, agitating the status quo, then presenting the signup as the solution drives conversions.',
        };
      }
      // pricing default (also covers checkout, a/b, trial, conversion, funnel)
      return {
        framework: 'FAB',
        path: 'persuasion-frameworks/references/fab.md',
        rationale:
          'Pricing pages map to FAB because the reader is evaluating what they get. Connecting features and advantages to concrete benefits at each tier removes purchase hesitation.',
      };
    }

    default: {
      // Fallback: unknown domain defaults to marketing-copy / AIDA
      return {
        framework: 'AIDA',
        path: 'persuasion-frameworks/references/aida.md',
        rationale:
          'No keyword match found for this copy type. Using AIDA as the fallback framework -- AIDA is the most broadly applicable framework and works across marketing contexts, providing a clear structure for any persuasive message.',
      };
    }
  }
}
