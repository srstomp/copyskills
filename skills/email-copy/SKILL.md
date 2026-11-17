---
name: email-copy
description: "Use when writing email of any kind: cold outreach, drip/nurture sequences, welcome or onboarding sequences, newsletters, transactional emails, re-engagement, or subject lines."
---

# Email Copy

Generates email copy from a brief using the correct persuasion framework, domain patterns, and mandatory de-slop pass. This skill runs a complete workflow -- it does not just list resources.

## Overview

This skill covers every major email copy format: cold outreach, welcome sequences, onboarding sequences, nurture sequences, re-engagement sequences, newsletters, transactional emails, and subject lines. Each format has a domain reference file and, except transactional email, a mapped persuasion framework. The workflow is identical to the marketing-copy skill: identify sub-type, load the right framework, draft against patterns, de-slop, check, return.

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
| `transactional` | Transactional email (order, shipping, receipts, password resets, sign-in codes, alerts) | None: no persuasion arc | `references/transactional.md` |
| `subject-line` | Subject line only | 4Us + headline formulas | `references/subject-lines.md` |

When the brief type is ambiguous, ask for clarification before proceeding.

## Framework Mapping

Load these files from the shared framework skills (`persuasion-frameworks`, `quality-frameworks`, `headline-formulas`) when the workflow requires them.

| Framework | File path | Use for |
|-----------|-----------|---------|
| PAS (Problem-Agitate-Solution) | `../persuasion-frameworks/references/pas.md` | Cold outreach, nurture sequences, re-engagement |
| BAB (Before-After-Bridge) | `../persuasion-frameworks/references/bab.md` | Welcome sequences, onboarding sequences |
| AIDA | `../persuasion-frameworks/references/aida.md` | Newsletters (per section) |
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
- Newsletter sections: load `../persuasion-frameworks/references/aida.md`
- Transactional: no framework; skip to Step 3
- Subject lines: load `../quality-frameworks/references/four-us.md` AND `../headline-formulas/references/proven-patterns.md`

Read the framework. Note its steps, examples, and common mistakes before drafting.

### Step 3: Load the domain reference

Load the domain-specific reference file for this email type:

- Sequences (welcome, onboarding, nurture, re-engagement): `references/sequences.md`
- Cold outreach and cold follow-up: `references/cold-outreach.md`
- Subject lines: `references/subject-lines.md`
- Newsletters: `references/newsletters.md`
- Transactional: `references/transactional.md`

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

Load `../quality-frameworks/references/locales/<language>.md` for the copy's language as well (`en`, `nl` or `de`).

Run the de-slop pass described in the anti-slop reference on every part of the draft:
1. Mark every tell from sections A to F, strongest first.
2. Rewrite each flagged passage. Keep every fact; add none that is not in the brief's fact sheet. If a sentence is generic and the brief has no true detail for it, write a plainer sentence or cut it.
3. Check the rewrite against the brief: no fact dropped, changed or added.
4. Do the native read described in the anti-slop reference: one sentence at a time, as a native editor of the copy's language.
5. If the `copydoc` CLI is available, run `copydoc lint <file> --locale <locale>` and fix every error.
5. For cold outreach specifically: check the opening line. If it starts with "I", a compliment, or a question about the recipient's health or day, rewrite it. The opening line must hook on a specific observation about the recipient's world.

Do not consider the draft done until every flag is resolved.

### Step 6: Check

Check the draft. Each check passes or fails; do not score your own draft.
1. **Facts.** Every factual claim comes from the brief's fact sheet. No contested fact is stated.
2. **Brief.** Every deliverable is present and within its length or character limits; goal, audience and CTA are addressed.
3. **Tells.** A careful native reader could not point at a sentence and say a model wrote it.
4. For subject lines, at least 3 of the 4Us (from `../quality-frameworks/references/four-us.md`) are met.
5. For sequences, every email passes every check. One failing email fails the whole sequence.

If a check fails, return to the de-slop step. Cap revisions at 2 passes; if a check still fails after that, return the best version and list the failed checks under Open issues.

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
**Claims:** [each factual claim and the fact id it rests on, or "none"]
**Needs:** [questions only a human can answer, or "none"]
**Lint:** [lint result per locale, or "not run"]
**Open issues:** [checks still failing after 2 passes, or "none"]

**Framework used:** [Framework name]
**De-slop flags resolved:** [N] (list the specific issues fixed, or "none")
```

For sequences, report Claims, Needs, Lint and Open issues once for the whole sequence, naming the email number wherever a check failed.

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
