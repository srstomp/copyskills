---
name: copy-workflow
description: "Full end-to-end copy generation orchestration. Sequences briefing, domain routing, framework selection, drafting, de-slop, critique, revision, and output. Use when generating copy from scratch through the complete workflow."
---

# Copy Workflow

Orchestrates the full copy generation pipeline. Contains NO domain knowledge. Only knows the sequence of steps and how to route between skills.

## Overview

This skill is the central orchestrator for copy generation. It chains together the briefing, domain routing, drafting, quality enforcement, and revision steps in a fixed sequence. It does not write copy itself, does not know copy frameworks, and does not make domain-specific decisions. Those are delegated to the appropriate skills at each step.

Every copy generation request starts here and ends here.

## The 8-Step Workflow

### Step 1: Brief

Invoke the `copy-brief` skill.

Pass any input the user or calling agent provided. `copy-brief` handles validation and gap-filling through its three modes (interview, agent handshake, fast path).

This step is complete when `copy-brief` returns a complete structured brief in YAML format with `type`, `goal`, and `audience.who` all present.

Do not proceed to Step 2 until the brief is complete.

### Step 2: Domain Routing

Match the brief's `type` field to a domain skill using keyword matching.

**Routing table:**

| Keywords in `type` field | Route to |
|--------------------------|----------|
| "landing page", "lander", "ad", "advertisement", "CTA", "value prop", "value proposition", "hero", "banner", "homepage", "sales page" | `marketing-copy` |
| "email", "subject line", "newsletter", "drip", "sequence", "outreach", "cold email", "cold outreach", "nurture", "campaign" | `email-copy` |
| "microcopy", "button", "button label", "error message", "error state", "onboarding", "empty state", "tooltip", "UX", "UI copy", "notification", "dialog", "confirmation", "placeholder", "helper text" | `ux-copy` |

Match is case-insensitive. A match on any keyword routes to that skill.

**If no match:** Ask the user which domain skill to use, or default to `marketing-copy` if in agent mode.

**If multiple matches:** Route to the first match in table order.

### Step 3: Framework Selection

Defer entirely to the domain skill.

Pass the complete brief to the routed domain skill. The domain skill selects the appropriate framework (or principles, in the case of `ux-copy`) based on its own internal mapping. Do not override or second-guess the domain skill's framework choice.

### Step 4: Draft

The domain skill generates the copy using its selected framework and domain patterns.

Receive the draft output from the domain skill. Note the framework used and any domain-specific flags. Pass draft to Step 5.

### Step 5: De-Slop Pass

**MANDATORY. This step cannot be skipped under any circumstances.**

Load `quality-frameworks/references/anti-slop.md`.

Apply the full de-slop pass to the draft:
- Scan for every banned word and phrase
- Flag em dash usage
- Flag tricolon patterns that read like jingles
- Flag AI tell-tale phrasing (hedging language, hollow transitions, vague superlatives)
- Apply humanization techniques from the anti-slop reference
- Rewrite every flagged section before proceeding

**Do not move to Step 6 with any unfixed anti-slop violations. The de-slop pass is non-negotiable.**

### Step 6: Critique

Score the de-slopped draft against the 7-dimension quality rubric in `quality-frameworks` SKILL.md.

| Dimension | Scale |
|-----------|-------|
| Clarity | 1-10 |
| Specificity | 1-10 |
| Voice Match | 1-10 |
| AI-Tell Score | 0-10 (lower is better) |
| Persuasion | 1-10 |
| Action | 1-10 |
| Overall | 1-10 |

Record all 7 scores. Pass scores and draft to Step 7.

### Step 7: Revise

**Revision threshold:** If AI-Tell Score >= 3 OR Overall score < 7, revision is required.

**If revision is required:**
1. Return the draft to the domain skill with the critique scores and specific flags.
2. Domain skill revises based on the flagged dimensions.
3. Re-run Steps 5 and 6 on the revised draft.
4. Evaluate against the threshold again.

**Hard cap: maximum 2 revision cycles.** If the draft still fails the threshold after 2 cycles, proceed to Step 8 with the best available draft. Set `flags` in the output to note the unresolved quality issues and which threshold was not met.

**If no revision is required (AI-Tell < 3 AND Overall >= 7):** Proceed directly to Step 8.

### Step 8: Return

Return structured output matching the output contract below.

Include the framework used, domain routed to, all 7 quality scores, and any flags from the revision process.

## Human Checkpoints

Checkpoints are **optional and active by default for human users**. They are **skipped entirely in agent mode**.

**Checkpoint A (after Step 1):**
> "Here's what I understand: [brief summary of type, goal, audience]. Correct?"

Wait for confirmation before proceeding to Step 2.

**Checkpoint B (after Step 3):**
> "I'm going with [framework name] for this. Sound right?"

Wait for confirmation before proceeding to Step 4.

**Checkpoint C (after Step 4):**
> "Here's the draft. Want me to revise it, or should I run it through the quality check?"

Wait for direction before proceeding to Step 5. If the user asks for manual revisions, apply them and re-present. Once the user confirms, proceed.

## Agent Mode

When invoked by an orchestrator, pipeline, or another agent:

- All three checkpoints are skipped.
- Execution is end-to-end without interruption.
- Domain routing defaults to `marketing-copy` if no keyword match is found.
- Revision cycles run automatically up to the 2-cycle cap.
- Return the structured output contract when complete.

## Output Contract

```yaml
copy:
  primary: "..."
  variants: ["...", "..."]
metadata:
  framework_used: "PAS"
  domain: "email-copy/cold-outreach"
  quality_scores:
    clarity: 8
    specificity: 7
    voice_match: 9
    ai_tell_score: 2
    overall: 8
  flags: []
```

**Fields:**

- `copy.primary`: The final copy, ready to use.
- `copy.variants`: Optional alternate versions. Empty array if none were produced.
- `metadata.framework_used`: The framework or approach the domain skill used (e.g., "PAS", "AIDA", "4Us").
- `metadata.domain`: The domain skill routed to, with sub-type if applicable.
- `metadata.quality_scores`: All 7 scores from the final critique in Step 6.
- `metadata.flags`: Empty array on clean pass. Populated if revision cap was hit or recommended brief fields were absent.

**Example flags:**

```yaml
flags:
  - "AI-tell threshold not met after 2 revision cycles: ai_tell_score 3"
  - "brand_voice not provided: voice_match scored at 5"
```

## Hard Rules

**No domain knowledge in this skill.** Framework selection, copy patterns, audience targeting, and format specifics all belong to the domain skill. This skill sequences steps and routes -- nothing else.

**Brief must be complete before routing.** Never skip `copy-brief`. Never guess at missing fields.

**De-slop is mandatory.** Step 5 runs on every draft, every revision cycle, without exception.

**Revision cap is 2 cycles.** Never exceed two revision cycles regardless of quality scores. Return with flags.

**One domain skill per request.** Route to exactly one domain skill. Do not blend outputs from multiple domain skills.
