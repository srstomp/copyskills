---
name: conversion-copy
description: Use when writing pricing pages, signup or registration flows, checkout copy, trial-to-paid upgrade prompts, A/B test variants, or funnel optimization copy. Not for landing pages or ads (marketing-copy).
---

# Conversion Copy

Generates conversion copy from a brief using the correct persuasion framework, domain patterns, and mandatory de-slop pass. This skill runs a complete workflow -- it does not just list resources.

Conversion copy is the most data-driven copy domain. Every element has a measurable outcome. Decisions about tier naming, CTA text, and form field placement are not aesthetic choices -- they have documented effects on conversion rate. Apply the relevant framework and domain reference, then validate against measurable criteria.

## Copy Type Identification

Identify the sub-type from the brief's `type` field before selecting a framework.

| Brief type | Sub-type | Framework | Domain reference |
|------------|----------|-----------|-----------------|
| `pricing-page` | Pricing page tiers, feature lists, FAQs | FAB per tier + anchoring/decoy principles | `references/pricing-pages.md` |
| `ab-variant` | A/B test variant copy | Isolate one variable; use different framework or angle per variant | `references/ab-testing.md` |
| `signup-flow` | Registration, onboarding entry, trial start | Microcopy + Cialdini urgency/scarcity | `references/signup-flows.md` |
| `checkout` | Checkout page, purchase confirmation, order summary | Friction reduction + trust signals | `references/signup-flows.md` |
| `trial-to-paid` | Upgrade prompts, paywall copy, limit messages | PAS or BAB | `references/signup-flows.md` |
| `funnel-opt` | Any funnel stage copy needing optimization | Framework depends on funnel stage | See Framework Reference Paths below |

When the brief type is ambiguous, ask which conversion goal applies: sign up, purchase, upgrade, or reactivation.

## Framework Reference Paths

Load these files from the shared framework skills (`persuasion-frameworks`, `quality-frameworks`) when the workflow requires them.

| Framework | File path | When to use |
|-----------|-----------|-------------|
| FAB | `../persuasion-frameworks/references/fab.md` | Pricing pages: connect tier features to buyer outcomes |
| PAS | `../persuasion-frameworks/references/pas.md` | Trial-to-paid: name the pain of limits before offering upgrade |
| BAB | `../persuasion-frameworks/references/bab.md` | Trial-to-paid: show the before/after of upgrading |
| Cialdini | `../quality-frameworks/references/cialdini.md` | Signup flows: urgency, scarcity, social proof at key moments |
| Conversion principles | `../quality-frameworks/references/conversion-principles.md` | All conversion copy: CTA patterns, friction reduction, social proof placement |
| Anti-slop | `../quality-frameworks/references/anti-slop.md` | Step 5 of every workflow run |

Load only the files required for the copy type at hand. Do not preload all frameworks.

## Framework Mapping by Copy Type

### Pricing Pages

Primary framework: FAB applied per tier.

Apply FAB at the tier level, not the page level. Each plan tier gets its own Feature-Advantage-Benefit arc, written for the specific buyer that tier targets.

Also load `../quality-frameworks/references/conversion-principles.md` for:
- Anchoring: lead with the most expensive tier so lower tiers feel like savings, not costs
- Decoy: structure the middle tier to be the obvious choice (better value per feature than the tier below, without the complexity of the tier above)

See `references/pricing-pages.md` for tier naming rules, plan structure, FAQ patterns, and guarantee copy.

### A/B Variants

Primary framework: variable isolation.

Each variant tests one change. Load `references/ab-testing.md` before generating any variants.

For headline variants: apply a different headline formula or angle per variant (curiosity vs. benefit vs. social proof vs. urgency).
For CTA variants: change the verb or ownership frame ("Start your trial" vs. "Start my trial").
For social proof variants: change the proof type or placement.

Do not blend two changes into one variant. If you change both the headline and the CTA, you cannot attribute the result to either.

### Signup Flows

Primary framework: microcopy patterns (clarity-first) + Cialdini urgency and scarcity.

Load `../quality-frameworks/references/cialdini.md` for:
- Scarcity at trial start (real constraints only -- never fake countdown timers)
- Commitment and consistency in multi-step flows (reference the previous step in the next step's copy)

Load `references/signup-flows.md` for field microcopy, progress indicators, trial messaging patterns, and friction reduction.

### Trial-to-Paid

Primary framework: PAS or BAB.

Use PAS when the user is actively hitting a limit: name the limit (Problem), show what they are missing or risking (Agitate), offer the upgrade as the direct solution (Solve).

Use BAB when the user is engaged but not at a limit yet: paint the before state (current plan's ceiling), show the after state (what unlocks), bridge with the upgrade path.

Load `../persuasion-frameworks/references/pas.md` or `../persuasion-frameworks/references/bab.md` depending on context. Do not use both in the same piece.

## 7-Step Workflow

### Step 1: Identify conversion copy sub-type

Read the brief. Find the `type` field. Map it to a row in the Copy Type Identification table above.

If the brief has no `type` field, infer from the conversion goal:
- Showing tiers and pricing: pricing page
- Testing two versions of a copy element: A/B variant
- Getting someone to register or start a trial: signup flow
- Moving a trial user to a paid plan: trial-to-paid
- Reducing drop-off at a specific funnel stage: funnel optimization (ask which stage)

When the goal is funnel optimization without a specified stage, ask before proceeding. The right framework depends entirely on where in the funnel the drop-off occurs.

### Step 2: Load the framework reference

Using the Framework Reference Paths table, load the single most relevant framework file for the copy type identified.

- Pricing page: load `../persuasion-frameworks/references/fab.md` and `../quality-frameworks/references/conversion-principles.md`
- A/B variant: load `references/ab-testing.md` (framework selection happens within that reference based on the hypothesis)
- Signup flow: load `../quality-frameworks/references/cialdini.md` and `../quality-frameworks/references/conversion-principles.md`
- Trial-to-paid (pain-driven): load `../persuasion-frameworks/references/pas.md`
- Trial-to-paid (aspiration-driven): load `../persuasion-frameworks/references/bab.md`

Read the framework before drafting. Note its steps, examples, and common mistakes.

### Step 3: Load the domain reference

Load the domain-specific reference file for this copy type:

- Pricing pages: `references/pricing-pages.md`
- A/B testing variants: `references/ab-testing.md`
- Signup flows, checkout, trial-to-paid: `references/signup-flows.md`

Read the domain reference before drafting. It contains patterns, before/after examples, and rules specific to that conversion context.

### Step 4: Draft using framework structure and domain patterns

Apply the framework steps to the brief. Use the domain reference for structural patterns and copy rules.

- Pricing pages: write each tier using FAB; name tiers aspirationally; put the most expensive tier first or in a visually dominant position; make the middle tier the obvious choice
- A/B variants: write variant A, then write variant B with exactly one change; annotate what changed and why
- Signup flows: minimize friction in field copy; explain the value of each required field; use trial messaging patterns from the domain reference
- Trial-to-paid: follow PAS or BAB stage sequence exactly; do not skip the agitate or after stage

Do not invent structure. The framework plus domain reference define the structure. Your job is to fill it with specifics from the brief.

Write in second person ("you"), use contractions, vary sentence length. Avoid passive voice. Every CTA should be verb-first.

### Step 5: De-slop pass

Load `../quality-frameworks/references/anti-slop.md`.

Run this sequence on the draft:

1. Scan for every banned word and phrase in the Banned Words and Phrases section. Flag each hit.
2. Check for em dashes. Remove all of them. Restructure affected sentences.
3. Apply the sentence length variance test. If all sentences cluster in the same length range, rewrite to vary rhythm.
4. Apply the paragraph opening audit. If three or more consecutive paragraphs open with the same grammatical pattern, break the repetition.
5. Check for tricolon traps. If any three-item list reads like a jingle, disrupt the rhythm.
6. Apply the specificity test: could a competitor paste their name over this copy and have it still work? If yes, find the specific detail from the brief and rebuild around it.
7. Check CTAs. Any CTA using "Click here", "Learn more", or "Submit" as a primary action must be rewritten with a verb-first, benefit-completion pattern.

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

For pricing pages, also check anchoring and decoy principles from `../quality-frameworks/references/conversion-principles.md`. If the tier structure violates either principle, flag it before returning copy.

For A/B variants, annotate which quality dimension each variant scores higher on. This becomes part of the hypothesis documentation.

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

For A/B variants, add:

```
**Variant A vs. Variant B**
- Variable tested: [what changed]
- Hypothesis: If we change [element] from [A] to [B], we expect [metric] to [change] because [reason]
- Recommended primary variant: [A or B] (reason: [brief rationale])
```

For pricing pages, add a note confirming the anchoring order and which tier is the designated decoy choice.
