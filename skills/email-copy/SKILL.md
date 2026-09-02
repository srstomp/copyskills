---
name: email-copy
description: "Use when writing email of any kind: cold outreach, drip/nurture sequences, welcome or onboarding sequences, newsletters, transactional emails, re-engagement, or subject lines."
---

# Email Copy

Generates email copy from a brief using the correct persuasion framework, domain patterns, and mandatory de-slop pass. This skill runs a complete workflow -- it does not just list resources.

## Overview

This skill covers every major email copy format: cold outreach, welcome sequences, onboarding sequences, nurture sequences, re-engagement sequences, newsletters, transactional emails, and subject lines. Each format has a mapped persuasion framework and a domain reference file. The workflow is identical to the marketing-copy skill: identify sub-type, load the right framework, draft against patterns, de-slop, score, return.

Email copy has constraints that other copy types do not: subject line character budgets, preview text, mobile-first line length, and sequence arc logic (each email must work standalone AND advance the series). These constraints are non-negotiable and checked before output is returned.

## Email Type Identification

Identify the sub-type from the brief's `type` field before selecting a framework.

| Brief type | Sub-type | Framework | Domain reference |
|------------|----------|-----------|-----------------|
| `cold-outreach` | Cold outreach email | PAS | `references/cold-outreach.md` |
| `cold-follow-up` | Follow-up to cold outreach | PAS | `references/cold-outreach.md` |
| `welcome-sequence` | Welcome sequence (1-5 emails) | BAB | `references/sequences.md` |
| `onboarding-sequence` | Onboarding sequence (5-7 emails) | BAB | `references/sequences.md` |
| `nurture-sequence` | Nurture/drip sequence | PAS | `references/sequences.md` |
| `re-engagement` | Re-engagement sequence | PAS or BAB | `references/sequences.md` |
| `newsletter` | Newsletter (curated, original, or hybrid) | AIDA per section | `references/newsletters.md` |
| `transactional` | Transactional email (receipts, confirmations, alerts) | AIDA (lean) | `references/newsletters.md` |
| `subject-line` | Subject line only | 4Us + headline formulas | `references/subject-lines.md` |

When the brief type is ambiguous, ask for clarification before proceeding.

## Framework Mapping

Load these files from the shared framework skills (`persuasion-frameworks`, `quality-frameworks`, `headline-formulas`) when the workflow requires them.

| Framework | File path | Use for |
|-----------|-----------|---------|
| PAS (Problem-Agitate-Solution) | `../persuasion-frameworks/references/pas.md` | Cold outreach, nurture sequences, re-engagement |
| BAB (Before-After-Bridge) | `../persuasion-frameworks/references/bab.md` | Welcome sequences, onboarding sequences |
| AIDA | `../persuasion-frameworks/references/aida.md` | Newsletters (per section), transactional |
| 4Us quality check | `../quality-frameworks/references/four-us.md` | Subject lines, newsletter headlines |
| Headline patterns | `../headline-formulas/references/proven-patterns.md` | Subject lines |
| Anti-slop | `../quality-frameworks/references/anti-slop.md` | De-slop pass (Step 5, mandatory) |

Load only the files required for the copy type at hand. Do not preload all frameworks.

## 7-Step Workflow

### Step 1: Identify email sub-type

Read the brief. Find the `type` field. Map it to a row in the Email Type Identification table above.

If the brief has no `type` field, infer from the copy goal:
- First contact with a prospect who has not opted in: cold outreach
- Series triggered by signup or trial start: welcome or onboarding sequence
- Ongoing drip to a warm list: nurture sequence
- Targeting inactive subscribers: re-engagement
- Regular editorial send: newsletter
- System-triggered confirmation or alert: transactional
- Standalone subject line only: subject-line type

### Step 2: Load the framework reference

Using the Framework Mapping table, load the single most relevant framework file.

- Cold outreach and nurture: load `../persuasion-frameworks/references/pas.md`
- Welcome and onboarding: load `../persuasion-frameworks/references/bab.md`
- Newsletter sections and transactional: load `../persuasion-frameworks/references/aida.md`
- Subject lines: load `../quality-frameworks/references/four-us.md` AND `../headline-formulas/references/proven-patterns.md`

Read the framework. Note its steps, examples, and common mistakes before drafting.

### Step 3: Load the domain reference

Load the domain-specific reference file for this email type:

- Sequences (welcome, onboarding, nurture, re-engagement): `references/sequences.md`
- Cold outreach and cold follow-up: `references/cold-outreach.md`
- Subject lines: `references/subject-lines.md`
- Newsletters and transactional: `references/newsletters.md`

For sequences: check the cadence guidelines in `references/sequences.md` before drafting. Sending day 1 content on day 3 timing breaks the arc.

For cold outreach: check the first-touch structure in `references/cold-outreach.md` before drafting a single line. Cold emails longer than 150 words rarely get read.

### Step 4: Draft using framework structure and email patterns

Apply the framework steps to the brief. Use the domain reference for structural patterns, section flows, and format rules.

- Follow the framework's stage sequence
- Apply section patterns and examples from the domain reference
- Respect subject line character limits (check `references/subject-lines.md` or `references/cold-outreach.md`)
- Write preview text that complements (does not repeat) the subject line
- Write in second person, use contractions, vary sentence length
- For sequences: write each email to work standalone. A reader who missed email 2 should not be lost in email 3.

Do not invent structure. The framework plus domain reference define the structure. Your job is to fill it with specifics from the brief.

### Step 5: De-slop pass

Load `../quality-frameworks/references/anti-slop.md`.

Run this sequence on every email in the draft:

1. Scan for every banned word and phrase in the Banned Words and Phrases section. Flag each hit.
2. Check for em dashes. Remove all of them. Restructure affected sentences.
3. Apply the sentence length variance test. If all sentences cluster in the same length range, rewrite to vary rhythm.
4. Apply the paragraph opening audit. If three or more consecutive paragraphs open with the same grammatical pattern, break the repetition.
5. Check for tricolon traps. If any three-item list reads like a jingle, disrupt the rhythm.
6. Apply the specificity test: could a competitor paste their name over this copy and have it still work? If yes, find the specific detail from the brief and rebuild around it.
7. For cold outreach specifically: check the opening line. If it starts with "I", a compliment, or a question about the recipient's health or day, rewrite it. The opening line must hook on a specific observation about the recipient's world.

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

For subject lines: also score against the 4Us (from `../quality-frameworks/references/four-us.md`). Minimum: 3 out of 4 dimensions score 2 or higher.

For sequences: score each email individually. One failing email fails the whole sequence.

### Step 7: Return structured output

Return the completed copy in this structure:

```
## [Email type] for [Product/Brand]

### Email [N]: [Subject line]

**Subject:** [Subject line text] ([character count] chars)
**Preview:** [Preview text] ([character count] chars)

[Email body here]

---
```

After all emails (or after the single email), append:

```
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

For sequences, score each email individually and include an aggregate score.

## Email-Specific Constraints

These apply to all email types. Check them before marking a draft complete.

### Subject line length
- Cold outreach: 30-40 characters (shorter reads less like mass email)
- Newsletter: 40-60 characters
- Transactional: 30-50 characters, clarity over cleverness
- Re-engagement: 35-50 characters, direct

### Preview text
- Target: 80-100 characters
- Must complement the subject line, not repeat it
- Treat the preview as a second subject line with different information
- If preview text is not provided to the email client, the first line of the email body shows. Draft the opening line accordingly.

### Mobile-first line length
- Keep body lines under 70 characters where possible
- Short paragraphs: 1-3 sentences max
- One clear CTA per email. Never two.

### Plain text vs HTML
- Cold outreach: plain text only. Formatted HTML signals mass sending.
- Sequences and newsletters: HTML acceptable, but the copy must work in plain text fallback.
- Transactional: follow the platform's template; write copy first, format second.
