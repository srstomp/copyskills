---
name: quality-frameworks
description: Use when running a de-slop pass, checking for AI tells or banned words in English, Dutch or German, applying locale conventions, scoring copy quality, or applying readability, persuasion, or conversion criteria. Reference library for the rubric, anti-slop rules and locale packs; for a full structured critique of existing copy, use copy-critique.
---

# Quality Frameworks

Evaluation system for all copy produced by this plugin. Provides the scoring rubric, anti-slop enforcement, and readability/persuasion criteria used by every domain skill and workflow.

## Scoring Rubric

Score copy against these 7 dimensions. Higher is better for all except AI-Tell.

| Dimension | Scale | What it measures |
|-----------|-------|-----------------|
| Clarity | 1-10 | Reader understands the message on first read, no re-reading required |
| Specificity | 1-10 | Concrete, true details vs. vague generalities. Only sourced details count: an invented number or name scores 1 |
| Voice Match | 1-10 | Matches the brand's tone, vocabulary, and personality |
| AI-Tell Score | 0-10 | Detectable AI patterns from `references/anti-slop.md` and the locale pack (staged contrasts, closers, triads, dashes, stock words, translationese). Lower is better. |
| Persuasion | 1-10 | Applies relevant Cialdini principles; moves reader toward action |
| Action | 1-10 | CTA is clear, specific, friction-free, appropriately urgent |
| Overall | 1-10 | Holistic quality judgment across all dimensions |

### Scoring benchmarks

| Overall score | Quality level | Action |
|---------------|---------------|--------|
| 9-10 | Publish-ready | None required |
| 7-8 | Solid | Minor polish only |
| 5-6 | Needs work | Targeted revision on lowest-scoring dimensions |
| 1-4 | Rewrite | Structural problems; start from brief |

## Quality Pass Workflow

Run this sequence on every piece of copy before marking it complete:

1. **Anti-slop check** - Load `references/anti-slop.md` and `references/locales/<language>.md` for the copy's language. Run the de-slop pass it describes. Flag every hit.
2. **Score rubric** - Score all 7 dimensions. Note which scored lowest.
3. **Apply threshold rule** - If AI-Tell Score >= 3 OR Overall < 7, the copy is not done. Return to revision with specific flags.
4. **Readability check** (optional but recommended) - Verify grade level matches target audience using `references/readability.md`.
5. **Conversion check** (for action-oriented copy) - Verify CTA placement and friction reduction using `references/conversion-principles.md`.

**The threshold rule is non-negotiable when scoring existing copy.** AI-Tell >= 3 or Overall < 7 means revision required. New copy from `copy-workflow` is gated by pass/fail checks instead (facts, brief, tells, lint), because a writer scoring its own draft is not a check.

## Reference Index

Load these files when evaluating or critiquing copy:

| File | When to load |
|------|-------------|
| `references/anti-slop.md` | Every de-slop pass. The most-used file in this skill. |
| `references/locales/en.md`, `nl.md`, `de.md` | Every de-slop pass on copy in that language: register, typography, translationese, stock phrases |
| `references/cialdini.md` | When scoring Persuasion dimension or strengthening CTAs |
| `references/four-cs.md` | When scoring Clarity or overall copy quality |
| `references/four-us.md` | When evaluating headlines, subject lines, or hooks |
| `references/readability.md` | When grade level or sentence length needs evaluation |
| `references/conversion-principles.md` | When scoring Action dimension or optimizing CTAs |

## Quick Scoring Guide

When a full rubric score is not needed, use these shortcuts:

**De-slop only:** Load `references/anti-slop.md` and the locale pack. Run the de-slop pass. Rewrite flagged sections; never add a fact to make a sentence specific.

**Headline check:** Score against 4Us (four-us.md). Must hit at least 3 of 4.

**CTA check:** Load `references/conversion-principles.md`. Verify placement, friction, and urgency are sound.

**Full critique:** Load all references. Score all 7 dimensions. Write up findings with specific line-level examples.
