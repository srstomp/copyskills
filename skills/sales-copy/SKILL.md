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
| `case-study` | Customer case study | BAB | `sales-copy/references/case-studies.md` |
| `proposal` | Sales or project proposal | ACCA | `sales-copy/references/proposals.md` |
| `sales-email` | Outbound or nurture sales email | PAS | `email-copy/references/cold-outreach.md` |
| `one-pager` | Single-page sales doc | FAB | `sales-copy/references/one-pagers.md` |
| `pitch-deck` | Pitch deck (slide copy, text only) | AIDA per slide | `sales-copy/references/one-pagers.md` |
| `battle-card` | Competitive battle card | FAB | `sales-copy/references/one-pagers.md` |

When the brief type is ambiguous, ask for clarification before proceeding.

## Framework Reference Paths

Load these files from the shared framework skills (`persuasion-frameworks`, `quality-frameworks`) when the workflow requires them.

| Framework | File path | Use for |
|-----------|-----------|---------|
| BAB (Before-After-Bridge) | `persuasion-frameworks/references/bab.md` | Case studies |
| ACCA (Awareness-Comprehension-Conviction-Action) | `persuasion-frameworks/references/acca.md` | Proposals |
| PAS (Problem-Agitate-Solution) | `persuasion-frameworks/references/pas.md` | Sales emails |
| FAB (Features-Advantages-Benefits) | `persuasion-frameworks/references/fab.md` | One-pagers, battle cards |
| AIDA | `persuasion-frameworks/references/aida.md` | Pitch deck slides |
| Anti-slop | `quality-frameworks/references/anti-slop.md` | De-slop pass (Step 5, mandatory) |

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

- Case studies: load `persuasion-frameworks/references/bab.md`
- Proposals: load `persuasion-frameworks/references/acca.md`
- Sales emails: load `persuasion-frameworks/references/pas.md`
- One-pagers and battle cards: load `persuasion-frameworks/references/fab.md`
- Pitch decks: load `persuasion-frameworks/references/aida.md`

Read the framework. Note its stages, examples, and failure modes before drafting.

### Step 3: Load the domain reference

Load the domain-specific reference file for this copy type:

- Case studies: `sales-copy/references/case-studies.md`
- Proposals: `sales-copy/references/proposals.md`
- One-pagers, pitch decks, battle cards: `sales-copy/references/one-pagers.md`
- Sales emails: `email-copy/references/cold-outreach.md`

For proposals: check the executive summary guidance in `proposals.md` before writing a single sentence. The most common mistake -- opening with the vendor's company history instead of the client's problem -- is caught here.

For case studies: check the metrics guidance in `case-studies.md` before drafting. Vague outcome language ("improved efficiency", "better results") is the dominant failure mode. The reference shows how to surface and present specific numbers.

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

Load `quality-frameworks/references/anti-slop.md`.

Run this sequence on the draft:

1. Scan for every banned word and phrase in the Banned Words and Phrases section. Flag each hit.
2. Check for em dashes. Remove all of them. Restructure affected sentences.
3. Apply the sentence length variance test. If all sentences cluster in the same length range, rewrite to vary rhythm.
4. Apply the paragraph opening audit. If three or more consecutive paragraphs open with the same grammatical pattern, break the repetition.
5. Check for tricolon traps. If any three-item list reads like a jingle, disrupt the rhythm.
6. Apply the specificity test: could a competitor paste their name over this copy and have it still work? If yes, find the specific detail from the brief and rebuild around it.
7. For case studies specifically: check every outcome claim. If a result is expressed without a number ("reduced time", "improved throughput", "cut costs"), replace it with the actual figure or flag it for the client to supply. Unquantified claims fail the specificity test automatically.

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

For case studies: Specificity must score 8 or higher. Unverified vague outcomes are a disqualifier.

### Step 7: Return structured output

Return the completed copy in this structure:

```
## [Copy type] for [Company/Product]

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

For proposals: include a section-by-section note on what was written and why the structure was chosen.

For case studies: include a note on any outcome claims that need client verification before publication.
