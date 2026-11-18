---
name: copy-workflow
description: "Use when writing new copy, or rewriting existing copy in another language or for another audience, for any copy type: web-shop and product copy, marketing, email, UX, editorial, brand, sales, social, or conversion. Entry point that runs the complete generation pipeline, in one or more languages. Not for critiquing existing copy (copy-critique) or changing its channel or format (copy-adapt)."
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

This step is complete when `copy-brief` returns a complete structured brief in YAML format with `type`, `goal`, and `audience.who` all present, plus a fact sheet whenever the copy will state facts about a product, company or person. When the request is a rewrite of existing copy (a live page, another language version), `copy-brief` extracts the fact sheet from it and reports conflicts; the existing text is not passed on as a draft to edit.

Do not proceed to Step 2 until the brief is complete.

### Step 2: Domain Routing

Match the brief's `type` field to a domain skill using keyword matching.

**Ad rule (checked before the table):** if the type contains "ad", "ads", or "advertisement" as a standalone word, route to `marketing-copy` immediately. Paid ads are marketing copy even when they name a platform: a LinkedIn ad routes to `marketing-copy`; a LinkedIn post routes to `social-copy`.

**Routing table (checked in row order, first match wins):**

| Keywords in `type` field | Route to |
|--------------------------|----------|
| "product description", "product page", "PDP", "category page", "collection page", "style page", "meta description", "title tag", "alt text", "about page", "shop copy", "catalogue", "catalog", "seo audit" | `commerce-copy` |
| "email", "subject line", "newsletter", "drip", "sequence", "outreach", "cold email", "cold outreach", "nurture", "campaign", "re-engagement", "transactional" | `email-copy` |
| "microcopy", "button", "button label", "error message", "error state", "onboarding", "empty state", "tooltip", "UX", "UI copy", "notification", "dialog", "confirmation", "placeholder", "helper text" | `ux-copy` |
| "LinkedIn", "Twitter", "X post", "tweet", "Instagram", "TikTok", "social", "social post", "thread", "carousel", "caption" | `social-copy` |
| "blog", "blog post", "article", "SEO", "seo content", "thought leadership", "whitepaper", "opinion piece", "long-form content" | `editorial-copy` |
| "proposal", "case study", "pitch deck", "one-pager", "battle card" | `sales-copy` |
| "brand voice", "voice profile", "tone guide", "messaging hierarchy", "style guide", "tagline", "elevator pitch", "brand guidelines" | `brand-copy` |
| "pricing", "pricing page", "signup", "sign-up", "checkout", "A/B", "variant", "trial", "conversion", "funnel" | `conversion-copy` |
| "landing page", "lander", "ad", "advertisement", "CTA", "value prop", "value proposition", "hero", "banner", "homepage", "sales page" | `marketing-copy` |

Match is case-insensitive. Row order encodes the tie-breaks: shop copy is checked first so that "meta description" or "SEO audit" for a shop page does not fall through to the generic "SEO" row of editorial copy; a named social platform beats topic keywords (a LinkedIn thought leadership post is social copy, not editorial), and marketing is checked last because its keywords are the most generic. This table mirrors `routeToDomain()` in `@copydoc/core`; keep the two in sync when editing either.

**If no match:** Ask the user which domain skill to use, or default to `marketing-copy` if in agent mode.

Note that "sales email" matches the email row and routes to `email-copy`, which handles it with PAS and the cold-outreach reference (the same treatment sales-copy would give it).

### Step 3: Framework Selection

Defer entirely to the domain skill.

Pass the complete brief to the routed domain skill. The domain skill selects the appropriate framework (or principles, in the case of `ux-copy`) based on its own internal mapping. Do not override or second-guess the domain skill's framework choice.

### Step 4: Draft, in each language

The domain skill generates the copy using its selected framework and domain patterns.

**Languages.** Load `../quality-frameworks/references/locales/<language>.md` for every locale in the brief (`en`, `nl`, `de`; the primary subtag of the locale). Write each locale in its own language, from the brief and the fact sheet. Never translate a draft from another locale, and never reuse its sentence order: translated copy keeps the source language's idiom and punctuation, and native readers notice. If two locale versions line up sentence by sentence, rewrite the second one from the facts. Every locale states the same facts; none may add one the others lack unless the fact sheet has it.

**Facts.** The draft may state only facts from the fact sheet. Contested points (`conflicts` in the brief) stay out.

Receive the draft output from the domain skill. Note the framework used and any domain-specific flags. Pass draft to Step 5.

### Step 5: De-Slop Pass

**MANDATORY. This step cannot be skipped under any circumstances.**

Load `../quality-frameworks/references/anti-slop.md` and the locale file for each language.

Run the de-slop pass that file describes on every field, in every language: mark the tells strongest first, rewrite, check that no fact was dropped, changed or added, do the native read, and search again for the tells that survive a rewrite. If the `copydoc` CLI is available, run `copydoc lint` as that file describes and fix every error.

**Do not move to Step 6 with an unfixed lint error or an unfixed tell from sections A, C, D or F of the anti-slop reference.**

### Step 6: Check

Check the de-slopped draft. Each check passes or fails; do not score.

1. **Facts.** Every factual claim maps to a fact id in the brief's fact sheet. No contested point is stated. Every locale states the same facts.
2. **Brief.** Every deliverable is present and within its budget; the goal, audience, CTA and any SEO finding in the brief are addressed.
   **Count, do not estimate.** A limit missed by one word or one character fails this check. With a shell, count each deliverable mechanically (`wc -w` for words, `wc -m` for characters); where a platform counts its own way (X counts every URL as 23 characters), apply the platform's rule. Without one, count paragraph by paragraph (for a title, subject or other short string: character by character), add the counts up, and stay at least 10% inside every limit, because a count done by reading is off by a few percent: for 400 to 600 words, land between 440 and 540; for a 140-word maximum, stop at 126; for a 60-character maximum, stop at 54. If the draft sits outside that margin, cut or extend it from the fact sheet before you return it; never pad with filler.
3. **Tells.** A careful native reader of each language could not point at a sentence and say a model wrote it.
4. **Domain checks.** Any pass/fail checks the domain skill lists (character limits for ads, the 4Us for headlines).

### Step 7: Revise

If any check in Step 6 fails, return the draft to the domain skill with the failed checks, then re-run Steps 5 and 6.

**Hard cap: maximum 2 revision cycles.** If a check still fails after 2 cycles, proceed to Step 8 with the best available draft and list each failed check in `open_issues`.

### Step 8: Return

Return structured output matching the output contract below.

Include the framework used, the domain routed to, the claims, needs and decisions, the lint result, and any open issues and flags.

## Human Checkpoints

Checkpoints are **on by default for human users** (a user can ask to skip them). They are **skipped entirely in agent mode**.

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
  - locale: "nl-NL"
    primary: "..."
    variants: []
claims:
  - text: "brouwt sinds 1872"
    facts: [F3]
needs:
  - "Which head brewer is right, or should the copy name none?"
decisions:
  - "Used je, not u: no voice samples were supplied."
metadata:
  framework_used: "PAS"
  domain: "email-copy/cold-outreach"
  lint: "0 errors, 0 warnings"
  open_issues: []
  flags: []
```

**Fields:**

- `copy`: one entry per locale. `primary` is the final copy, ready to use; `variants` are optional alternates (empty if none). A domain skill with structured deliverables (title, meta, description) returns them as named fields inside the entry.
- `claims`: every factual claim in the copy and the fact ids it rests on. Empty when the copy makes no factual claims.
- `needs`: questions only a human can answer (missing or contested facts, missing voice samples). Empty if none.
- `decisions`: judgment calls a human may want to overrule (register, which fact led, a trade name used).
- `metadata.framework_used`: the framework or approach the domain skill used ("none" for commerce and UX copy).
- `metadata.domain`: the domain skill routed to, with sub-type if applicable.
- `metadata.lint`: the lint result per locale, or "not run" when the CLI was not available.
- `metadata.open_issues`: checks from Step 6 that still fail after the revision cap.
- `metadata.flags`: brief fields that were missing or inferred.

## Hard Rules

**No domain knowledge in this skill.** Framework selection, copy patterns, audience targeting, and format specifics all belong to the domain skill. This skill sequences steps and routes -- nothing else.

**Brief must be complete before routing.** Never skip `copy-brief`. Never guess at missing fields.

**De-slop is mandatory.** Step 5 runs on every draft, every revision cycle, without exception.

**Facts come only from the fact sheet.** A missing fact is a `needs` item, never a guess. A contested fact is left out.

**Each language is written, not translated.** Every locale is drafted in its own language from the brief and the fact sheet.

**Revision cap is 2 cycles.** Never exceed two revision cycles. Return with the open issues listed.

**One domain skill per request.** Route to exactly one domain skill. Do not blend outputs from multiple domain skills.
