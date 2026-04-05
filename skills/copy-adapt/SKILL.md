---
name: copy-adapt
description: "Repurpose existing copy for a different channel, format, or audience. Use when transforming copy from one format to another (e.g., landing page to LinkedIn post, blog post to email, long-form to short-form)."
---

# Copy Adapt

Orchestrates copy adaptation across channels and formats. Takes existing copy and a target format, preserves the core message, and reshapes everything else to fit the destination. Contains NO domain knowledge -- only the adaptation sequence and routing logic.

## Overview

This skill is the central orchestrator for copy repurposing. It does not write copy from scratch. It analyzes existing copy, identifies what must be preserved and what must change, routes to the appropriate domain skill for format-specific patterns, enforces quality, and returns the adapted copy with a full account of what changed and why.

Every adaptation request starts here and ends here.

## The 7-Step Adaptation Process

### Step 1: Receive Source Copy and Target Format

Accept the following inputs:

- **Source copy**: The existing copy to be adapted (full text)
- **Target format/channel**: Where the copy needs to go (e.g., "LinkedIn post", "cold email", "homepage hero")
- **Audience delta** (optional): If the target audience differs from the source, note the shift
- **Constraints** (optional): Character limits, platform rules, tone requirements

If source copy or target format is missing, ask before proceeding. Do not infer missing inputs.

### Step 2: Analyze Source Copy

Extract the following from the source copy:

- **Core message**: The single claim or promise the copy is built around
- **Key supporting points**: Evidence, proof points, examples that back the core message
- **Differentiator**: What makes this offer, product, or idea distinct
- **Tone and voice**: Formal/casual, direct/narrative, optimistic/urgent
- **CTA**: The action the source copy is asking the reader to take
- **Format structure**: How the source is organized (e.g., headline + body + CTA, problem/solution/benefit)

Document each element explicitly. These become the adaptation map in Step 3.

### Step 3: Identify What Transfers and What Changes

Using the analysis from Step 2, sort each element into two columns:

**Transfers (preserve exactly or nearly):**
- Core message -- this never changes
- Differentiator -- if diluted, the adaptation fails
- Key proof points -- may be condensed but not invented or dropped wholesale

**Changes (must be adapted for target format):**
- Structure -- reorganize to match target format conventions
- Length -- compress or expand based on target constraints
- Tone -- adjust register to match platform norms
- CTA format -- every channel has different CTA conventions
- Opening hook -- must match how the target audience reads that format
- Visual rhythm -- sentence length, paragraph breaks, scanability

If source is long-form and target is short-form: prioritize the single strongest benefit. Drop supporting points before touching the differentiator.

If source is short-form and target is long-form: expand using existing proof points and examples from context. Do not pad with filler. If there is not enough substance in the source, note this in the output and ask for more material rather than inventing it.

### Step 4: Load Target Domain Skill

Match the target format to a domain skill using keyword matching. Match is case-insensitive. Route to the first match found.

| Keywords in target format | Route to |
|---------------------------|----------|
| "landing page", "ad", "CTA", "value prop", "hero" | `marketing-copy` |
| "email", "subject line", "newsletter", "drip", "sequence" | `email-copy` |
| "microcopy", "button", "error message", "onboarding", "tooltip", "UX" | `ux-copy` |
| "blog", "article", "SEO", "thought leadership", "whitepaper" | `editorial-copy` |
| "brand voice", "tone guide", "messaging", "style guide" | `brand-copy` |
| "proposal", "case study", "pitch deck", "one-pager", "sales email" | `sales-copy` |
| "LinkedIn", "Twitter", "X", "Instagram", "TikTok", "social", "thread", "carousel" | `social-copy` |
| "pricing", "signup", "checkout", "A/B", "variant", "trial" | `conversion-copy` |

**If no match:** Ask the user which domain skill applies. Do not default silently.

Load the matched domain skill. Use its format-specific patterns, structural conventions, length guidance, and CTA norms to govern the adaptation in Step 5.

### Step 5: Adapt Copy to Target Format

Using the transfer/change map from Step 3 and the domain patterns from Step 4, produce the adapted copy.

Rules during adaptation:

- Never lose the core differentiator. If the target format's constraints make it impossible to include, surface this as a flag and ask for guidance.
- Always rewrite the CTA to fit the target channel's norms (e.g., a "Book a demo" CTA on a landing page becomes a softer "Thoughts?" on a LinkedIn post).
- Respect platform and format constraints. Character limits, structural requirements, and platform conventions are not optional.
- Do not invent new proof points, claims, or benefits not present in the source.
- Match the tone register appropriate for the target channel, not the source channel.

Produce a working draft. Pass to Step 6.

### Step 6: De-Slop Pass

**MANDATORY. This step cannot be skipped under any circumstances.**

Load `quality-frameworks/references/anti-slop.md`.

Apply the full de-slop pass to the adapted draft:

- Scan for every banned word and phrase
- Flag AI tell-tale phrasing (hedging language, hollow transitions, vague superlatives)
- Flag em dash usage
- Flag tricolon patterns that read like jingles
- Apply humanization techniques from the anti-slop reference
- Rewrite every flagged section before proceeding

Do not move to Step 7 with any unfixed anti-slop violations. The de-slop pass is non-negotiable.

### Step 7: Return Adapted Copy with Metadata

Return structured output that includes the adapted copy and a complete account of what changed and why. The "why" is not optional -- the user must be able to understand every significant adaptation decision.

See Output Contract below.

## Adaptation Rules

These rules apply to every adaptation regardless of format pair:

**Never lose the core differentiator.** If the target format cannot accommodate it, flag this explicitly rather than quietly dropping it.

**Always adjust the CTA for the target channel.** A direct response CTA does not belong on a LinkedIn post. A soft social CTA does not belong on a pricing page. Match the action ask to channel norms.

**Respect platform and format constraints.** Character limits, structural requirements, and platform-specific conventions are hard constraints. Work within them, do not ignore them.

**Long-to-short: prioritize the strongest single benefit.** When compressing, drop supporting points before diluting the core claim. One strong message beats three weak ones.

**Short-to-long: expand with substance, not filler.** Use existing proof points and examples. If the source does not contain enough material to expand credibly, say so and ask for more rather than padding.

**Do not invent.** Adaptation reshapes existing material. It does not add claims, proof points, or benefits that did not exist in the source.

## Output Contract

```yaml
adapted_copy:
  primary: "..."
  variants: ["...", "..."]
metadata:
  source_format: "landing page"
  target_format: "LinkedIn post"
  domain_skill_used: "social-copy"
  preserved:
    - "Core message: [summary]"
    - "Differentiator: [summary]"
    - "Proof point: [summary]"
  changed:
    - element: "CTA"
      from: "Book a demo"
      why: "LinkedIn norms favor low-friction asks; hard CTAs perform poorly in feed"
      to: "Curious what this looks like in practice?"
    - element: "Structure"
      from: "H1 + body + CTA"
      why: "LinkedIn posts have no headline; hook must be in the first line of body text"
      to: "Hook line + three short paragraphs + soft CTA"
    - element: "Length"
      from: "320 words"
      why: "LinkedIn optimal length is 150-300 words; excess was supporting detail not core message"
      to: "210 words"
  flags: []
```

**Fields:**

- `adapted_copy.primary`: The final adapted copy, ready to use.
- `adapted_copy.variants`: Optional alternate versions. Empty array if none produced.
- `metadata.source_format`: What the source copy was (inferred or stated).
- `metadata.target_format`: The target format/channel specified by the user.
- `metadata.domain_skill_used`: The domain skill loaded in Step 4.
- `metadata.preserved`: List of elements carried over unchanged or nearly unchanged from the source.
- `metadata.changed`: Each significant adaptation decision with the original, the change, and the reason.
- `metadata.flags`: Empty on clean pass. Populated if differentiator could not be preserved, source lacked sufficient material for expansion, or anti-slop violations could not be resolved.

## Hard Rules

**No domain knowledge in this skill.** Format patterns, structural conventions, length guidance, and CTA norms all come from the domain skill loaded in Step 4. This skill sequences steps and routes -- nothing else.

**Source copy is required.** Never attempt adaptation without the full source text.

**De-slop is mandatory.** Step 6 runs on every adaptation without exception.

**Do not invent.** Adaptation only reshapes material that already exists in the source.

**What changed and why is required output.** The metadata block is not optional. Every significant change needs a reason.
