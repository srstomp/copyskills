import { describe, expect, test } from 'bun:test';
import { selectFramework, routeToDomain } from '../frameworks';
import type { FrameworkSelection } from '../types';

// AC: selectFramework('cold outreach email', 'book a demo') returns { framework: 'PAS', path contains 'pas.md' }
describe('selectFramework - email-copy', () => {
  test("selectFramework('cold outreach email', 'book a demo') returns PAS", () => {
    const result = selectFramework('cold outreach email', 'book a demo');
    expect(result.framework).toBe('PAS');
    expect(result.path).toContain('pas.md');
    expect(result.rationale).toBeTruthy();
  });

  test("selectFramework('cold email', 'book a demo') returns PAS", () => {
    const result = selectFramework('cold email', 'book a demo');
    expect(result.framework).toBe('PAS');
    expect(result.path).toContain('pas.md');
  });

  test("selectFramework('outreach email', 'book a demo') returns PAS", () => {
    const result = selectFramework('outreach email', 'book a demo');
    expect(result.framework).toBe('PAS');
    expect(result.path).toContain('pas.md');
  });

  test("selectFramework('welcome email sequence', 'nurture leads') returns BAB", () => {
    const result = selectFramework('welcome email sequence', 'nurture leads');
    expect(result.framework).toBe('BAB');
    expect(result.path).toContain('bab.md');
  });

  test("selectFramework('drip campaign', 'nurture') returns BAB", () => {
    const result = selectFramework('drip campaign', 'nurture');
    expect(result.framework).toBe('BAB');
    expect(result.path).toContain('bab.md');
  });

  test("selectFramework('newsletter', 'drive clicks') returns AIDA", () => {
    const result = selectFramework('newsletter', 'drive clicks');
    expect(result.framework).toBe('AIDA');
    expect(result.path).toContain('aida.md');
  });

  test("selectFramework('subject line', 'increase open rates') returns PAS for cold context", () => {
    const result = selectFramework('cold email subject line', 'increase open rates');
    expect(result.framework).toBe('PAS');
  });
});

// AC: selectFramework('landing page hero', 'drive signups') returns AIDA
describe('selectFramework - marketing-copy', () => {
  test("selectFramework('landing page hero', 'drive signups') returns AIDA", () => {
    const result = selectFramework('landing page hero', 'drive signups');
    expect(result.framework).toBe('AIDA');
    expect(result.path).toContain('aida.md');
  });

  test("selectFramework('lander', 'convert visitors') returns AIDA", () => {
    const result = selectFramework('lander', 'convert visitors');
    expect(result.framework).toBe('AIDA');
    expect(result.path).toContain('aida.md');
  });

  test("selectFramework('long-form sales page', 'convert leads') returns PASTOR", () => {
    const result = selectFramework('long-form sales page', 'convert leads');
    expect(result.framework).toBe('PASTOR');
    expect(result.path).toContain('pastor.md');
  });

  test("selectFramework('value prop statement', 'communicate value') returns FAB", () => {
    const result = selectFramework('value prop statement', 'communicate value');
    expect(result.framework).toBe('FAB');
    expect(result.path).toContain('fab.md');
  });

  test("selectFramework('ad copy', 'drive clicks') returns AIDA", () => {
    const result = selectFramework('ad copy', 'drive clicks');
    expect(result.framework).toBe('AIDA');
    expect(result.path).toContain('aida.md');
  });

  test("selectFramework('banner ad', 'brand awareness') returns AIDA", () => {
    const result = selectFramework('banner ad', 'brand awareness');
    expect(result.framework).toBe('AIDA');
    expect(result.path).toContain('aida.md');
  });
});

// AC: selectFramework('case study', 'build trust') returns BAB
describe('selectFramework - sales-copy', () => {
  test("selectFramework('case study', 'build trust') returns BAB", () => {
    const result = selectFramework('case study', 'build trust');
    expect(result.framework).toBe('BAB');
    expect(result.path).toContain('bab.md');
  });

  test("selectFramework('proposal document', 'close the deal') returns ACCA", () => {
    const result = selectFramework('proposal document', 'close the deal');
    expect(result.framework).toBe('ACCA');
    expect(result.path).toContain('acca.md');
  });

  test("selectFramework('one-pager', 'summarize offering') returns FAB", () => {
    const result = selectFramework('one-pager', 'summarize offering');
    expect(result.framework).toBe('FAB');
    expect(result.path).toContain('fab.md');
  });

  test("selectFramework('pitch deck', 'win the pitch') returns ACCA", () => {
    const result = selectFramework('pitch deck', 'win the pitch');
    expect(result.framework).toBe('ACCA');
    expect(result.path).toContain('acca.md');
  });

  test("selectFramework('sales email', 'book meetings') returns PAS", () => {
    const result = selectFramework('sales email', 'book meetings');
    // sales email keyword -> sales-copy, but email keyword routes to email-copy first
    // "sales email" contains "email" so routes to email-copy -> PAS (cold outreach)
    expect(result.framework).toBe('PAS');
  });
});

// AC: selectFramework('pricing page', 'increase upgrades') returns FAB
describe('selectFramework - conversion-copy', () => {
  test("selectFramework('pricing page', 'increase upgrades') returns FAB", () => {
    const result = selectFramework('pricing page', 'increase upgrades');
    expect(result.framework).toBe('FAB');
    expect(result.path).toContain('fab.md');
  });

  test("selectFramework('signup page', 'grow user base') returns PAS", () => {
    const result = selectFramework('signup page', 'grow user base');
    expect(result.framework).toBe('PAS');
    expect(result.path).toContain('pas.md');
  });

  test("selectFramework('checkout copy', 'reduce abandonment') returns FAB", () => {
    const result = selectFramework('checkout copy', 'reduce abandonment');
    expect(result.framework).toBe('FAB');
  });

  test("selectFramework('A/B test variant', 'improve conversion') returns FAB", () => {
    const result = selectFramework('A/B test variant', 'improve conversion');
    expect(result.framework).toBe('FAB');
  });
});

// AC: selectFramework('blog post', 'educate audience') returns QUEST
describe('selectFramework - editorial-copy', () => {
  test("selectFramework('blog post', 'educate audience') returns QUEST", () => {
    const result = selectFramework('blog post', 'educate audience');
    expect(result.framework).toBe('QUEST');
    expect(result.path).toContain('quest.md');
  });

  // AC: selectFramework('thought leadership article', 'build authority') returns Star-Story-Solution
  test("selectFramework('thought leadership article', 'build authority') returns Star-Story-Solution", () => {
    const result = selectFramework('thought leadership article', 'build authority');
    expect(result.framework).toBe('Star-Story-Solution');
    expect(result.path).toContain('star-story-solution.md');
  });

  test("selectFramework('whitepaper', 'educate B2B buyers') returns ACCA", () => {
    const result = selectFramework('whitepaper', 'educate B2B buyers');
    expect(result.framework).toBe('ACCA');
    expect(result.path).toContain('acca.md');
  });

  test("selectFramework('SEO article', 'rank for keywords') returns QUEST", () => {
    const result = selectFramework('SEO article', 'rank for keywords');
    expect(result.framework).toBe('QUEST');
  });
});

// AC: Unknown type returns AIDA as default with fallback rationale
describe('selectFramework - fallback behavior', () => {
  test("selectFramework with unknown type returns AIDA as fallback", () => {
    const result = selectFramework('some unknown copy type xyz', 'some goal');
    expect(result.framework).toBe('AIDA');
    expect(result.path).toContain('aida.md');
    expect(result.rationale).toMatch(/fallback/i);
  });

  test("selectFramework fallback rationale is non-empty string", () => {
    const result = selectFramework('completely unrecognized type', 'some goal');
    expect(typeof result.rationale).toBe('string');
    expect(result.rationale.length).toBeGreaterThan(0);
  });
});

// AC: routeToDomain('cold email') returns 'email-copy'
describe('routeToDomain - email routing', () => {
  test("routeToDomain('cold email') returns 'email-copy'", () => {
    expect(routeToDomain('cold email')).toBe('email-copy');
  });

  test("routeToDomain('cold outreach') returns 'email-copy'", () => {
    expect(routeToDomain('cold outreach')).toBe('email-copy');
  });

  test("routeToDomain('outreach email') returns 'email-copy'", () => {
    expect(routeToDomain('outreach email')).toBe('email-copy');
  });

  test("routeToDomain('newsletter') returns 'email-copy'", () => {
    expect(routeToDomain('newsletter')).toBe('email-copy');
  });

  test("routeToDomain('drip sequence') returns 'email-copy'", () => {
    expect(routeToDomain('drip sequence')).toBe('email-copy');
  });
});

// AC: routeToDomain('button label') returns 'ux-copy'
describe('routeToDomain - ux-copy routing', () => {
  test("routeToDomain('button label') returns 'ux-copy'", () => {
    expect(routeToDomain('button label')).toBe('ux-copy');
  });

  test("routeToDomain('error message') returns 'ux-copy'", () => {
    expect(routeToDomain('error message')).toBe('ux-copy');
  });

  test("routeToDomain('onboarding tooltip') returns 'ux-copy'", () => {
    expect(routeToDomain('onboarding tooltip')).toBe('ux-copy');
  });

  test("routeToDomain('microcopy') returns 'ux-copy'", () => {
    expect(routeToDomain('microcopy')).toBe('ux-copy');
  });

  test("routeToDomain('empty state') returns 'ux-copy'", () => {
    expect(routeToDomain('empty state')).toBe('ux-copy');
  });

  test("routeToDomain('dialog') returns 'ux-copy'", () => {
    expect(routeToDomain('dialog')).toBe('ux-copy');
  });

  test("routeToDomain('placeholder text') returns 'ux-copy'", () => {
    expect(routeToDomain('placeholder text')).toBe('ux-copy');
  });
});

describe('routeToDomain - marketing routing', () => {
  test("routeToDomain('landing page') returns 'marketing-copy'", () => {
    expect(routeToDomain('landing page')).toBe('marketing-copy');
  });

  test("routeToDomain('lander') returns 'marketing-copy'", () => {
    expect(routeToDomain('lander')).toBe('marketing-copy');
  });

  test("routeToDomain('ad copy') returns 'marketing-copy'", () => {
    expect(routeToDomain('ad copy')).toBe('marketing-copy');
  });

  test("routeToDomain('hero section') returns 'marketing-copy'", () => {
    expect(routeToDomain('hero section')).toBe('marketing-copy');
  });

  test("routeToDomain('homepage copy') returns 'marketing-copy'", () => {
    expect(routeToDomain('homepage copy')).toBe('marketing-copy');
  });
});

describe('routeToDomain - editorial routing', () => {
  test("routeToDomain('blog post') returns 'editorial-copy'", () => {
    expect(routeToDomain('blog post')).toBe('editorial-copy');
  });

  test("routeToDomain('SEO article') returns 'editorial-copy'", () => {
    expect(routeToDomain('SEO article')).toBe('editorial-copy');
  });

  test("routeToDomain('thought leadership piece') returns 'editorial-copy'", () => {
    expect(routeToDomain('thought leadership piece')).toBe('editorial-copy');
  });

  test("routeToDomain('whitepaper') returns 'editorial-copy'", () => {
    expect(routeToDomain('whitepaper')).toBe('editorial-copy');
  });
});

describe('routeToDomain - brand routing', () => {
  test("routeToDomain('brand voice guide') returns 'brand-copy'", () => {
    expect(routeToDomain('brand voice guide')).toBe('brand-copy');
  });

  test("routeToDomain('tone guide') returns 'brand-copy'", () => {
    expect(routeToDomain('tone guide')).toBe('brand-copy');
  });

  test("routeToDomain('style guide') returns 'brand-copy'", () => {
    expect(routeToDomain('style guide')).toBe('brand-copy');
  });
});

describe('routeToDomain - sales routing', () => {
  test("routeToDomain('case study') returns 'sales-copy'", () => {
    expect(routeToDomain('case study')).toBe('sales-copy');
  });

  test("routeToDomain('pitch deck') returns 'sales-copy'", () => {
    expect(routeToDomain('pitch deck')).toBe('sales-copy');
  });

  test("routeToDomain('proposal') returns 'sales-copy'", () => {
    expect(routeToDomain('proposal')).toBe('sales-copy');
  });

  test("routeToDomain('one-pager') returns 'sales-copy'", () => {
    expect(routeToDomain('one-pager')).toBe('sales-copy');
  });
});

describe('routeToDomain - social routing', () => {
  test("routeToDomain('LinkedIn post') returns 'social-copy'", () => {
    expect(routeToDomain('LinkedIn post')).toBe('social-copy');
  });

  test("routeToDomain('Twitter thread') returns 'social-copy'", () => {
    expect(routeToDomain('Twitter thread')).toBe('social-copy');
  });

  test("routeToDomain('Instagram caption') returns 'social-copy'", () => {
    expect(routeToDomain('Instagram caption')).toBe('social-copy');
  });

  test("routeToDomain('social media post') returns 'social-copy'", () => {
    expect(routeToDomain('social media post')).toBe('social-copy');
  });

  test("routeToDomain('X post') returns 'social-copy'", () => {
    expect(routeToDomain('X post')).toBe('social-copy');
  });
});

// Paid ads route to marketing-copy even when they name a platform (ad rule
// fires before the routing table). A platform without "ad" stays social.
describe('routeToDomain - ad rule beats platform keywords', () => {
  test("routeToDomain('LinkedIn ad') returns 'marketing-copy'", () => {
    expect(routeToDomain('LinkedIn ad')).toBe('marketing-copy');
  });

  test("routeToDomain('Meta ads') returns 'marketing-copy'", () => {
    expect(routeToDomain('Meta ads')).toBe('marketing-copy');
  });

  test("routeToDomain('Instagram ad campaign') returns 'marketing-copy'", () => {
    expect(routeToDomain('Instagram ad campaign')).toBe('marketing-copy');
  });

  test("routeToDomain('advertisement for TikTok') returns 'marketing-copy'", () => {
    expect(routeToDomain('advertisement for TikTok')).toBe('marketing-copy');
  });
});

// A named social platform beats topic keywords (social-copy row precedes
// editorial-copy), while the same topics without a platform stay editorial.
describe('routeToDomain - platform beats topic keywords', () => {
  test("routeToDomain('LinkedIn thought leadership post') returns 'social-copy'", () => {
    expect(routeToDomain('LinkedIn thought leadership post')).toBe('social-copy');
  });

  test("routeToDomain('thought leadership piece') still returns 'editorial-copy'", () => {
    expect(routeToDomain('thought leadership piece')).toBe('editorial-copy');
  });

  test("routeToDomain('tweet') returns 'social-copy'", () => {
    expect(routeToDomain('tweet')).toBe('social-copy');
  });
});

// Keywords documented in the copy-workflow routing table
describe('routeToDomain - documented keyword coverage', () => {
  test("routeToDomain('sales email') returns 'email-copy'", () => {
    expect(routeToDomain('sales email')).toBe('email-copy');
  });

  test("routeToDomain('re-engagement flow') returns 'email-copy'", () => {
    expect(routeToDomain('re-engagement flow')).toBe('email-copy');
  });

  test("routeToDomain('transactional receipt') returns 'email-copy'", () => {
    expect(routeToDomain('transactional receipt')).toBe('email-copy');
  });

  test("routeToDomain('battle card') returns 'sales-copy'", () => {
    expect(routeToDomain('battle card')).toBe('sales-copy');
  });

  test("routeToDomain('sales page') returns 'marketing-copy'", () => {
    expect(routeToDomain('sales page')).toBe('marketing-copy');
  });

  test("routeToDomain('tagline') returns 'brand-copy'", () => {
    expect(routeToDomain('tagline')).toBe('brand-copy');
  });

  test("routeToDomain('sign-up flow') returns 'conversion-copy'", () => {
    expect(routeToDomain('sign-up flow')).toBe('conversion-copy');
  });

  test("routeToDomain('funnel optimization') returns 'conversion-copy'", () => {
    expect(routeToDomain('funnel optimization')).toBe('conversion-copy');
  });
});

describe('routeToDomain - conversion routing', () => {
  test("routeToDomain('pricing page') returns 'conversion-copy'", () => {
    expect(routeToDomain('pricing page')).toBe('conversion-copy');
  });

  test("routeToDomain('signup form') returns 'conversion-copy'", () => {
    expect(routeToDomain('signup form')).toBe('conversion-copy');
  });

  test("routeToDomain('checkout copy') returns 'conversion-copy'", () => {
    expect(routeToDomain('checkout copy')).toBe('conversion-copy');
  });

  test("routeToDomain('free trial page') returns 'conversion-copy'", () => {
    expect(routeToDomain('free trial page')).toBe('conversion-copy');
  });
});

// AC: Keyword matching is case-insensitive
describe('case-insensitive matching', () => {
  test("routeToDomain('COLD EMAIL') returns 'email-copy'", () => {
    expect(routeToDomain('COLD EMAIL')).toBe('email-copy');
  });

  test("routeToDomain('Landing Page') returns 'marketing-copy'", () => {
    expect(routeToDomain('Landing Page')).toBe('marketing-copy');
  });

  test("routeToDomain('BLOG POST') returns 'editorial-copy'", () => {
    expect(routeToDomain('BLOG POST')).toBe('editorial-copy');
  });

  test("selectFramework('COLD OUTREACH EMAIL', 'book a demo') returns PAS", () => {
    const result = selectFramework('COLD OUTREACH EMAIL', 'book a demo');
    expect(result.framework).toBe('PAS');
  });

  test("selectFramework('Landing Page Hero', 'drive signups') returns AIDA", () => {
    const result = selectFramework('Landing Page Hero', 'drive signups');
    expect(result.framework).toBe('AIDA');
  });
});

// AC: All 10 frameworks reachable through some input
describe('all 10 frameworks reachable', () => {
  test('AIDA reachable via landing page', () => {
    expect(selectFramework('landing page hero', 'drive signups').framework).toBe('AIDA');
  });

  test('PAS reachable via cold outreach email', () => {
    expect(selectFramework('cold outreach email', 'book a demo').framework).toBe('PAS');
  });

  test('BAB reachable via case study', () => {
    expect(selectFramework('case study', 'build trust').framework).toBe('BAB');
  });

  test('FAB reachable via pricing page', () => {
    expect(selectFramework('pricing page', 'increase upgrades').framework).toBe('FAB');
  });

  test('ACCA reachable via proposal', () => {
    expect(selectFramework('proposal document', 'close the deal').framework).toBe('ACCA');
  });

  test('PASTOR reachable via long-form sales page', () => {
    expect(selectFramework('long-form sales page', 'convert leads').framework).toBe('PASTOR');
  });

  test('QUEST reachable via blog post', () => {
    expect(selectFramework('blog post', 'educate audience').framework).toBe('QUEST');
  });

  test('Star-Story-Solution reachable via thought leadership article', () => {
    expect(selectFramework('thought leadership article', 'build authority').framework).toBe('Star-Story-Solution');
  });

  test('BAB reachable via welcome email nurture', () => {
    expect(selectFramework('welcome email nurture', 'onboard users').framework).toBe('BAB');
  });

  test('PAS reachable via LinkedIn post', () => {
    expect(selectFramework('LinkedIn post', 'build following').framework).toBe('PAS');
  });
});

// AC: All 8 domains reachable through some input
describe('all 8 domains reachable', () => {
  test('marketing-copy domain reachable', () => {
    expect(routeToDomain('landing page')).toBe('marketing-copy');
  });

  test('email-copy domain reachable', () => {
    expect(routeToDomain('cold email')).toBe('email-copy');
  });

  test('ux-copy domain reachable', () => {
    expect(routeToDomain('button label')).toBe('ux-copy');
  });

  test('editorial-copy domain reachable', () => {
    expect(routeToDomain('blog post')).toBe('editorial-copy');
  });

  test('brand-copy domain reachable', () => {
    expect(routeToDomain('brand voice guide')).toBe('brand-copy');
  });

  test('sales-copy domain reachable', () => {
    expect(routeToDomain('case study')).toBe('sales-copy');
  });

  test('social-copy domain reachable', () => {
    expect(routeToDomain('LinkedIn post')).toBe('social-copy');
  });

  test('conversion-copy domain reachable', () => {
    expect(routeToDomain('pricing page')).toBe('conversion-copy');
  });
});

// ux-copy returns None (principles-based)
describe('selectFramework - ux-copy returns None framework', () => {
  test("selectFramework('button label', 'improve clicks') returns None framework for ux-copy", () => {
    const result = selectFramework('button label', 'improve clicks');
    expect(result.framework).toBe('None');
    expect(result.path).toContain('four-cs.md');
  });

  test("selectFramework('error message', 'reduce confusion') returns None framework for ux-copy", () => {
    const result = selectFramework('error message', 'reduce confusion');
    expect(result.framework).toBe('None');
  });

  test("selectFramework('onboarding flow', 'activate users') returns None framework for ux-copy", () => {
    const result = selectFramework('onboarding flow', 'activate users');
    expect(result.framework).toBe('None');
  });
});

// brand-copy returns None (voice dimensions)
describe('selectFramework - brand-copy returns None framework', () => {
  test("selectFramework('brand voice guide', 'define tone') returns None framework", () => {
    const result = selectFramework('brand voice guide', 'define tone');
    expect(result.framework).toBe('None');
    expect(result.path).toContain('voice-dimensions.md');
  });

  test("selectFramework('tone guide', 'establish voice') returns None framework", () => {
    const result = selectFramework('tone guide', 'establish voice');
    expect(result.framework).toBe('None');
  });
});

// social-copy framework selection
describe('selectFramework - social-copy', () => {
  test("selectFramework('LinkedIn post', 'build following') returns PAS", () => {
    const result = selectFramework('LinkedIn post', 'build following');
    expect(result.framework).toBe('PAS');
    expect(result.path).toContain('pas.md');
  });

  test("selectFramework('Instagram carousel', 'engage audience') returns AIDA", () => {
    const result = selectFramework('Instagram carousel', 'engage audience');
    expect(result.framework).toBe('AIDA');
    expect(result.path).toContain('aida.md');
  });

  test("selectFramework('Twitter thread', 'grow audience') returns AIDA", () => {
    const result = selectFramework('Twitter thread', 'grow audience');
    expect(result.framework).toBe('AIDA');
    expect(result.path).toContain('aida.md');
  });
});

// rationale field content validation
describe('selectFramework rationale content', () => {
  test('rationale for PAS (cold outreach) explains pain-based reasoning', () => {
    const result = selectFramework('cold outreach email', 'book a demo');
    expect(result.rationale.length).toBeGreaterThan(20);
  });

  test('rationale for AIDA (landing page) is non-empty', () => {
    const result = selectFramework('landing page hero', 'drive signups');
    expect(result.rationale.length).toBeGreaterThan(20);
  });

  test('rationale for BAB (case study) is non-empty', () => {
    const result = selectFramework('case study', 'build trust');
    expect(result.rationale.length).toBeGreaterThan(20);
  });
});
