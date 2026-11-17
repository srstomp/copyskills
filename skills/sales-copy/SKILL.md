---
name: sales-copy
description: "Use when writing B2B sales materials or sales enablement content: proposals, case studies, customer stories, pitch decks (text), one-pagers, sales emails, or competitive battle cards."
---

# Sales Copy

Generates sales copy from a brief using the correct persuasion framework, domain patterns, and mandatory de-slop pass. This skill runs a complete workflow -- it does not just list resources.

## Copy Type Identification

Identify the sub-type from the brief's `type` field before selecting a framework.

| Brief type | Sub-type | Framework | Domain reference |
|------------|----------|-----------|-----------------|
| `case-study` | Customer case study | BAB | `references/case-studies.md` |
| `proposal` | Sales or project proposal | ACCA | `references/proposals.md` |
| `sales-email` | Outbound or nurture sales email | PAS | `../email-copy/references/cold-outreach.md` |
| `one-pager` | Single-page sales doc | FAB | `references/one-pagers.md` |
| `pitch-deck` | Pitch deck (slide copy, text only) | AIDA per slide | `references/one-pagers.md` |
| `battle-card` | Competitive battle card | FAB | `references/one-pagers.md` |

When the brief type is ambiguous, ask for clarification before proceeding.

## Framework Reference Paths

Load these files from the shared framework skills (`persuasion-frameworks`, `quality-frameworks`) when the workflow requires them.

| Framework | File path | Use for |
|-----------|-----------|---------|
| BAB (Before-After-Bridge) | `../persuasion-frameworks/references/bab.md` | Case studies |
| ACCA (Awareness-Comprehension-Conviction-Action) | `../persuasion-frameworks/references/acca.md` | Proposals |
| PAS (Problem-Agitate-Solution) | `../persuasion-frameworks/references/pas.md` | Sales emails |
| FAB (Features-Advantages-Benefits) | `../persuasion-frameworks/references/fab.md` | One-pagers, battle cards |
| AIDA | `../persuasion-frameworks/references/aida.md` | Pitch deck slides |
| Anti-slop | `../quality-frameworks/references/anti-slop.md` | De-slop pass (Step 5, mandatory) |

Load only the files required for the copy type at hand. Do not preload all frameworks.

## 7-Step Workflow

### Step 1: Identify sales copy sub-type

Read the brief. Find the `type` field. Map it to a row in the Copy Type Identification table above.

If the brief has no `type` field, infer from the copy goal:
- Documenting a customer's transformation: case study
- Responding to an RFP or presenting a solution: proposal
- Reaching a new prospect or advancing a deal by email: sales email
- Distilling the product or offer to a single page: one-pager
- Building a slide-by-slide narrative for a pitch: pitch deck
- Equipping reps to handle competitor objections: battle card

### Step 2: Load the framework reference

Using the Framework Reference Paths table, load the single most relevant framework file.

- Case studies: load `../persuasion-frameworks/references/bab.md`
- Proposals: load `../persuasion-frameworks/references/acca.md`
- Sales emails: load `../persuasion-frameworks/references/pas.md`
- One-pagers and battle cards: load `../persuasion-frameworks/references/fab.md`
- Pitch decks: load `../persuasion-frameworks/references/aida.md`

Read the framework. Note its stages, examples, and failure modes before drafting.

### Step 3: Load the domain reference

Load the domain-specific reference file for this copy type:

- Case studies: `references/case-studies.md`
- Proposals: `references/proposals.md`
- One-pagers, pitch decks, battle cards: `references/one-pagers.md`
- Sales emails: `../email-copy/references/cold-outreach.md`

For proposals: check the executive summary guidance in `references/proposals.md` before writing a single sentence. The most common mistake -- opening with the vendor's company history instead of the client's problem -- is caught here.

For case studies: check the metrics guidance in `references/case-studies.md` before drafting. Vague outcome language ("improved efficiency", "better results") is the dominant failure mode. The reference shows how to surface and present specific numbers.

### Step 4: Draft using framework structure and domain patterns

Apply the framework stages to the brief. Use the domain reference for structural patterns, section order, and format rules.

- Follow the framework's stage sequence (e.g., Before then After then Bridge for BAB)
- Apply section patterns and examples from the domain reference
- Make the customer the hero in case studies, not the product
- Lead with the client's problem in proposals, not the vendor's bio
- Keep one-pagers to a single CTA -- never two
- Write in second person ("you") for one-pagers and proposals; past-tense narrative for case studies

Do not invent structure. The framework plus domain reference define the structure. Fill it with specifics from the brief.

### Step 5: De-slop pass

Load `../quality-frameworks/references/anti-slop.md`.

Load `../quality-frameworks/references/locales/<language>.md` for the copy's language as well (`en`, `nl` or `de`).

Run the de-slop pass described in the anti-slop reference on every part of the draft:
1. Mark every tell from sections A to F, strongest first.
2. Rewrite each flagged passage. Keep every fact; add none that is not in the brief's fact sheet. If a sentence is generic and the brief has no true detail for it, write a plainer sentence or cut it.
3. Check the rewrite against the brief: no fact dropped, changed or added.
4. Do the native read described in the anti-slop reference: one sentence at a time, as a native editor of the copy's language.
5. If the `copydoc` CLI is available, run `copydoc lint <file> --locale <locale>` and fix every error.
5. For case studies specifically: check every outcome claim. If a result is expressed without a number ("reduced time", "improved throughput", "cut costs"), use the figure only if the brief has it; otherwise flag it for the client to supply. Never estimate a number.

Do not consider the draft done until every flag is resolved.

### Step 6: Check

Check the draft. Each check passes or fails; do not score your own draft.
1. **Facts.** Every factual claim comes from the brief's fact sheet. No contested fact is stated.
2. **Brief.** Every deliverable is present and within its length or character limits; goal, audience and CTA are addressed.
3. **Tells.** A careful native reader could not point at a sentence and say a model wrote it.
4. For case studies, every outcome claim carries a figure from the brief or is flagged for the client. No vague outcomes.

If a check fails, return to the de-slop step. Cap revisions at 2 passes; if a check still fails after that, return the best version and list the failed checks under Open issues.

### Step 7: Return structured output

Return the completed copy in this structure:

```
## [Copy type] for [Company/Product]

[Copy here, formatted for its intended use]

---
**Claims:** [each factual claim and the fact id it rests on, or "none"]
**Needs:** [questions only a human can answer, or "none"]
**Lint:** [lint result per locale, or "not run"]
**Open issues:** [checks still failing after 2 passes, or "none"]

**Framework used:** [Framework name]
**De-slop flags resolved:** [N] (list the specific issues fixed, or "none")
```

For proposals: include a section-by-section note on what was written and why the structure was chosen.

For case studies: include a note on any outcome claims that need client verification before publication.
