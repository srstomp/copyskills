---
name: editorial-copy
description: Use when writing blog posts, articles, SEO content, thought leadership, opinion pieces, whitepapers, or other long-form editorial content. Not for social posts, even long ones (social-copy).
---

# Editorial Copy

Generates editorial copy from a brief using the correct persuasion framework, domain patterns, and mandatory de-slop pass. This skill runs a complete workflow -- it does not just list resources.

## Copy Type Identification

Identify the sub-type from the brief's `type` field before selecting a framework.

| Brief type | Sub-type | Framework | Domain reference |
|------------|----------|-----------|-----------------|
| `blog-educational` | Educational blog post (how-to, explainer, guide) | QUEST | `references/blog-structures.md` |
| `blog-conversion` | Conversion-focused blog post (listicle, comparison, commercial) | AIDA | `references/blog-structures.md` |
| `thought-leadership` | Opinion piece, POV article, industry commentary | Star-Story-Solution | `references/thought-leadership.md` |
| `seo-content` | SEO-optimized page or article (search-intent driven) | Structure-first (heading hierarchy), then AIDA or QUEST per section | `references/seo-copy.md` |
| `whitepaper` | Long-form research document, industry report | ACCA | `references/blog-structures.md` |

When the brief type is ambiguous, ask for clarification before proceeding.

## Framework Reference Paths

Load these files from the shared framework skills (`persuasion-frameworks`, `quality-frameworks`) when the workflow requires them.

| Framework | File path | Use for |
|-----------|-----------|---------|
| QUEST | `../persuasion-frameworks/references/quest.md` | Educational blog posts |
| AIDA | `../persuasion-frameworks/references/aida.md` | Conversion-focused blog posts, SEO sections |
| Star-Story-Solution | `../persuasion-frameworks/references/star-story-solution.md` | Thought leadership |
| ACCA | `../persuasion-frameworks/references/acca.md` | Whitepapers |
| Anti-slop | `../quality-frameworks/references/anti-slop.md` | De-slop pass (Step 5, mandatory) |

Load only the files required for the copy type at hand. Do not preload all frameworks.

## 7-Step Workflow

### Step 1: Identify editorial sub-type

Read the brief. Find the `type` field. Map it to a row in the Copy Type Identification table above.

If the brief has no `type` field, infer from the copy goal:
- Teaching a concept or process step by step: educational blog post
- Driving readers to a product page, sign-up, or comparison decision: conversion blog post
- Staking a position or sharing a point of view: thought leadership
- Targeting specific search queries to drive organic traffic: SEO content
- Establishing credibility with data, research, or deep analysis: whitepaper

### Step 2: Load the framework reference

Using the Framework Reference Paths table, load the single most relevant framework file.

- Educational blog posts: load `../persuasion-frameworks/references/quest.md`
- Conversion-focused blog posts: load `../persuasion-frameworks/references/aida.md`
- Thought leadership: load `../persuasion-frameworks/references/star-story-solution.md`
- SEO content: load `../persuasion-frameworks/references/aida.md` (default; switch to QUEST if educational intent)
- Whitepapers: load `../persuasion-frameworks/references/acca.md`

Read the framework. Note its stages, examples, and common mistakes before drafting.

### Step 3: Load the domain reference

Load the domain-specific reference file for this copy type:

- Blog posts (all types) and whitepapers: `references/blog-structures.md`
- SEO content: `references/seo-copy.md`
- Thought leadership: `references/thought-leadership.md`

For SEO content: check search intent mapping in `references/seo-copy.md` before drafting a single heading. Writing for the wrong intent (e.g., informational content when the query is transactional) produces content that ranks poorly and converts worse.

For thought leadership: read the opinion-first structure and anti-generic-content rules in `references/thought-leadership.md` before drafting. Generic "5 tips" content is the primary failure mode.

### Step 4: Draft using framework structure and domain patterns

Apply the framework steps to the brief. Use the domain reference for structural patterns, section flows, and format rules.

- Follow the framework's stage sequence (e.g., Qualify then Understand then Educate then Stimulate then Transition for QUEST)
- Apply section patterns and examples from the domain reference
- For blog posts: follow hook patterns and CTA placement guidance in `references/blog-structures.md`
- For SEO content: build heading hierarchy first (H1, H2, H3) then fill sections; respect keyword integration rules
- For thought leadership: state the specific opinion in paragraph 1; do not save the point of view for the end
- For whitepapers: follow ACCA's credibility-building structure; data and evidence carry the argument

Do not invent structure. The framework plus domain reference define the structure. Your job is to fill it with specifics from the brief.

### Step 5: De-slop pass

Load `../quality-frameworks/references/anti-slop.md`.

Run this sequence on the draft:

1. Scan for every banned word and phrase in the Banned Words and Phrases section. Flag each hit.
2. Check for em dashes. Remove all of them. Restructure affected sentences.
3. Apply the sentence length variance test. If all sentences cluster in the same length range, rewrite to vary rhythm.
4. Apply the paragraph opening audit. If three or more consecutive paragraphs open with the same grammatical pattern, break the repetition.
5. Check for tricolon traps. If any three-item list reads like a jingle, disrupt the rhythm.
6. Apply the specificity test: could a competitor paste their name over this copy and have it still work? If yes, find the specific detail from the brief and rebuild around it.
7. For thought leadership specifically: check that the piece stakes a clear, specific position. If it reads like a balanced overview with no POV, it has failed the genre. Rebuild the argument around a single defensible claim.

Do not consider the draft done until every flag is resolved.

### Step 6: Score against quality rubric

Score the de-slopped draft across these 7 dimensions:

| Dimension | Scale | Target |
|-----------|-------|--------|
| Clarity | 1-10 | 7+ |
| Specificity | 1-10 | 7+ |
| Voice Match | 1-10 | 7+ |
| AI-Tell Score | 0-10 | 2 or lower |
| Persuasion | 1-10 | 7+ |
| Action | 1-10 | 7+ |
| Overall | 1-10 | 7+ |

If AI-Tell Score is 3 or higher, or Overall is below 7: return to Step 5. Other dimensions below 7 set the revision priorities but do not block on their own. Cap revisions at 2 passes; if the draft still fails a hard gate after that, return the best version with the failing scores flagged in the output.

For thought leadership: if Specificity is below 8, the piece is too generic. Return to Step 5.

### Step 7: Return structured output

Return the completed copy in this structure:

```
## [Copy type] for [Product/Brand/Topic]

[Copy here, formatted for its intended use. Use proper heading hierarchy (H1, H2, H3) for blog and SEO content.]

---
**Quality scores**
- Clarity: [N]/10
- Specificity: [N]/10
- Voice Match: [N]/10
- AI-Tell: [N]/10
- Persuasion: [N]/10
- Action: [N]/10
- Overall: [N]/10

**Framework used:** [Framework name]
**De-slop flags resolved:** [N] (list the specific issues fixed, or "none")
```

For SEO content, include a metadata block after the copy:

```
**SEO metadata**
- Title tag: [Title] ([character count] chars)
- Meta description: [Description] ([character count] chars)
- Primary keyword: [Keyword]
- Secondary keywords: [List]
```
