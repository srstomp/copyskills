---
name: marketing-copy
description: Use when writing landing pages, ad copy (Google, Meta, LinkedIn ads), calls-to-action, value propositions, hero sections, or homepage copy. Not for pricing pages, signup flows, or A/B variants (conversion-copy), and not for organic social posts (social-copy).
---

# Marketing Copy

Generates marketing copy from a brief using the correct persuasion framework, domain patterns, and mandatory de-slop pass. This skill runs a complete workflow -- it does not just list resources.

## Copy Type Identification

Identify the sub-type from the brief's `type` field before selecting a framework.

| Brief type | Sub-type | Framework | Domain reference |
|------------|----------|-----------|-----------------|
| `landing-page-hero` | Landing page hero section | AIDA or 4Ps | `marketing-copy/references/landing-pages.md` |
| `landing-page-full` (short) | Full landing page, short-form | AIDA | `marketing-copy/references/landing-pages.md` |
| `landing-page-full` (long) | Full landing page, long-form | PASTOR | `marketing-copy/references/landing-pages.md` |
| `ad-google` | Google Search ad | 4Us + headline formulas | `marketing-copy/references/ad-copy.md` |
| `ad-meta` | Meta/Facebook ad | 4Us + headline formulas | `marketing-copy/references/ad-copy.md` |
| `ad-linkedin` | LinkedIn ad | 4Us + headline formulas | `marketing-copy/references/ad-copy.md` |
| `value-proposition` | Value proposition | FAB | `marketing-copy/references/value-propositions.md` |
| `cta` | Call-to-action copy | AIDA (Action step only) | `marketing-copy/references/landing-pages.md` |
| `hero-section` | Hero section (standalone) | AIDA or 4Ps | `marketing-copy/references/landing-pages.md` |

When the brief type is ambiguous, ask for clarification before proceeding.

## Framework Reference Paths

Load these files from the shared framework skills (`persuasion-frameworks`, `quality-frameworks`, `headline-formulas`) when the workflow requires them.

| Framework | File path |
|-----------|-----------|
| AIDA | `persuasion-frameworks/references/aida.md` |
| 4Ps (Promise-Picture-Proof-Push) | `persuasion-frameworks/references/four-ps.md` |
| FAB | `persuasion-frameworks/references/fab.md` |
| PASTOR | `persuasion-frameworks/references/pastor.md` |
| 4Us quality check | `quality-frameworks/references/four-us.md` |
| Headline patterns | `headline-formulas/references/proven-patterns.md` |
| Anti-slop | `quality-frameworks/references/anti-slop.md` |

Load only the files required for the copy type at hand. Do not preload all frameworks.

## 7-Step Workflow

### Step 1: Identify copy sub-type

Read the brief. Find the `type` field. Map it to a row in the Copy Type Identification table above.

If the brief has no `type` field, infer from the copy goal:
- Driving sign-ups or trials from a page: landing page
- Driving clicks from an ad platform: ad copy
- Communicating core product value: value proposition

### Step 2: Load the framework reference

Using the Framework Reference Paths table, load the single most relevant framework file.

- Landing page hero, short landing page, hero section: load `persuasion-frameworks/references/aida.md`
- Long-form landing page or sales page: load `persuasion-frameworks/references/pastor.md`
- Ad headlines: load `quality-frameworks/references/four-us.md` and `headline-formulas/references/proven-patterns.md`
- Value propositions: load `persuasion-frameworks/references/fab.md`

Read the framework. Note its steps, examples, and common mistakes before drafting.

### Step 3: Load the domain reference

Load the domain-specific reference file for this copy type:

- Landing pages, hero sections, CTAs: `marketing-copy/references/landing-pages.md`
- All ad formats (Google, Meta, LinkedIn): `marketing-copy/references/ad-copy.md`
- Value propositions: `marketing-copy/references/value-propositions.md`

For ad copy: check character limits in `ad-copy.md` before drafting a single word. Drafting without checking limits wastes the revision.

### Step 4: Draft using framework structure and domain patterns

Apply the framework steps to the brief. Use the domain reference for structural patterns, section flows, and format rules.

- Follow the framework's stage sequence (e.g., Attention then Interest then Desire then Action for AIDA)
- Apply section patterns and examples from the domain reference
- Respect character limits if writing ads
- Write in second person ("you"), use contractions, vary sentence length

Do not invent structure. The framework plus domain reference define the structure. Your job is to fill it with specifics from the brief.

### Step 5: De-slop pass

Load `quality-frameworks/references/anti-slop.md`.

Run this sequence on the draft:

1. Scan for every banned word and phrase in the Banned Words and Phrases section. Flag each hit.
2. Check for em dashes. Remove all of them. Restructure affected sentences.
3. Apply the sentence length variance test. If all sentences cluster in the same length range, rewrite to vary rhythm.
4. Apply the paragraph opening audit. If three or more consecutive paragraphs open with the same grammatical pattern, break the repetition.
5. Check for tricolon traps. If any three-item list reads like a jingle, disrupt the rhythm.
6. Apply the specificity test: could a competitor paste their name over this copy and have it still work? If yes, find the specific detail from the brief and rebuild around it.

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

For headlines and ad copy, also score against the 4Us (from `quality-frameworks/references/four-us.md`). Minimum: 3 out of 4 dimensions score 2 or higher.

### Step 7: Return structured output

Return the completed copy in this structure:

```
## [Copy type] for [Product/Brand]

[Copy here, formatted for its intended use]

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

If character limits apply (ads), include a character count note for each field that has a limit.

## Platform Constraints Note

For all ad copy (Google, Meta, LinkedIn): check `marketing-copy/references/ad-copy.md` for character limits before drafting. Character limits are non-negotiable constraints, not guidelines. A Google Search headline that runs 32 characters is a broken ad. Count before you write.
