---
name: copy-brief
description: "Use before writing any copy, to gather and validate the brief: copy type, goal, audience, product, brand voice, and constraints. Use when the brief is missing, partial, or unvalidated. Gathers context only; writes no copy."
---

# Copy Brief

Context-gathering skill. No copy generation. Receives inputs, validates fields, returns a complete structured brief.

## Overview

This skill handles the gap between what a consuming agent or human knows and what a copy skill needs. It validates field completeness, identifies gaps, and resolves them through three distinct modes. Output is always a complete structured brief in the standard YAML format.

## Input Contract

The brief uses this YAML structure:

```yaml
type: "cold outreach email"
goal: "Book a demo call"
audience:
  who: "US food enthusiasts, 28-45"
  pain: "Bored of supermarket sake"
  sophistication: "casual"
product:
  name: "SakeBox"
  description: "Monthly sake subscription"
  differentiator: "Direct from 40+ Japanese breweries"
brand_voice:
  tone: "knowledgeable, casual"
  avoids: ["artisanal", "curated", "elevate"]
  examples: ["Example copy that matches desired voice"]
constraints:
  length: "150 words max"
  format: "plain text email"
  cta: "single CTA, link to booking page"
  language: "en-US"
```

## Field Classification

| Field | Status | If missing |
|-------|--------|-----------|
| type | Required | Cannot proceed |
| goal | Required | Cannot proceed |
| audience.who | Required | Cannot proceed |
| product.name | Recommended | Proceed, flag reduced quality |
| audience.pain | Recommended | Infer from type + audience |
| brand_voice | Recommended | Use domain defaults |
| constraints | Optional | Use domain-standard defaults |

**Required fields** (cannot proceed without all three): `type`, `goal`, `audience.who`

**Recommended fields** (proceed with a quality flag if missing): `product.name`, `audience.pain`, `brand_voice`

**Optional fields** (sensible defaults apply): `constraints`

## Mode Selection Logic

Evaluate in this order:

1. If all required fields are present in the input, proceed to **Mode 3 (fast path)**.
2. If the calling context is non-interactive (invoked by an agent or pipeline), use **Mode 2 (agent handshake)**.
3. Otherwise, use **Mode 1 (interview)**.

## Mode 1: Interview (Human User)

Use when a human is providing context conversationally.

**Rules:**
- Ask one question at a time. Never present a list of questions.
- Start with required fields. Confirm each before moving on.
- After required fields are covered, move to recommended fields.
- Load `references/brief-questions.md` for the question bank. Select the question that fits the copy type.
- Build the brief progressively as answers arrive.
- When minimum requirements are met, confirm the brief and offer to proceed.

**Sequence:**
1. Ask for `type` if not provided: use the universal question for copy type.
2. Ask for `goal` if not provided.
3. Ask for `audience.who` if not provided.
4. Ask for recommended fields one at a time, selecting from the relevant domain section in brief-questions.md.
5. When all recommended fields are covered (or the user declines), confirm and output the brief.

**Confirmation step:**
Before proceeding to copy generation, surface the brief summary:

```
Here's what I have:
- Writing: [type]
- Goal: [goal]
- Audience: [audience.who]
- [any other fields collected]

Ready to proceed, or anything to adjust?
```

## Mode 2: Agent Handshake (Multi-Agent)

Use when invoked by an orchestrator, pipeline, or another agent.

**Rules:**
- No conversational interaction. Structured request and response only.
- Receive the partial or complete brief from the calling agent.
- Check required fields first. If any required field is missing, respond with the structured missing-fields format and stop.
- If required fields are present, check recommended fields. Identify gaps and request them.
- Proceed once minimum requirements are met.

**Response format when fields are missing:**

```yaml
missing:
  required:
    - audience.who: "Who is this for? (age range, role, context)"
  recommended:
    - brand_voice: "Any tone or voice guidelines?"
    - audience.pain: "What problem does this audience have?"
```

Only list fields that are actually missing. If no required fields are missing, omit the `required` key. If no recommended fields are missing, omit the `recommended` key.

**Handshake flow:**

```
Step 1: Orchestrator sends partial brief
  { type: "drip email step 3", goal: "re-engage inactive users" }

Step 2: Copy-brief identifies gaps, responds with missing-fields YAML

Step 3: Orchestrator fills what it can, resends the updated brief

Step 4: Copy-brief confirms minimum requirements met, outputs the complete brief
```

**When to proceed with gaps:**
If required fields are all present and the calling agent cannot provide recommended fields, proceed. Include a `flags` entry in the output brief noting which recommended fields were absent.

## Mode 3: Complete Brief (Fast Path)

Use when all required fields are already present in the input.

**Rules:**
- Validate that `type`, `goal`, and `audience.who` are present and non-empty.
- Confirm minimum requirements are met.
- Proceed immediately without asking questions.
- If recommended fields are missing, add a `flags` entry to the output noting reduced context.

**Validation:**
- `type` must be a non-empty string describing the copy format.
- `goal` must describe a specific outcome, not a vague intent.
- `audience.who` must identify the audience concretely.

If any required field is empty, missing, or too vague to act on, fall back to the appropriate mode (Mode 1 for humans, Mode 2 for agents).

## Output

The output of this skill is always a complete structured brief in the standard YAML format. Include all fields that were collected or inferred. Add a `flags` array for any recommended fields that were not provided.

```yaml
type: "cold outreach email"
goal: "Book a demo call"
audience:
  who: "US food enthusiasts, 28-45"
  pain: "Bored of supermarket sake"
  sophistication: "casual"
product:
  name: "SakeBox"
  description: "Monthly sake subscription"
  differentiator: "Direct from 40+ Japanese breweries"
brand_voice:
  tone: "knowledgeable, casual"
  avoids: ["artisanal", "curated", "elevate"]
  examples: ["Example copy that matches desired voice"]
constraints:
  length: "150 words max"
  format: "plain text email"
  cta: "single CTA, link to booking page"
  language: "en-US"
flags: []
```

If recommended fields were absent, the `flags` array lists them:

```yaml
flags:
  - "brand_voice not provided: using domain defaults"
  - "audience.pain not provided: inferred from type and audience"
```

## Hard Rules

**No copy generation.** This skill gathers and validates context. It does not write copy.

**Required fields block all modes.** If `type`, `goal`, or `audience.who` cannot be determined, stop and ask. There is no fallback.

**One question at a time (Mode 1).** Never present a list of questions to a human user.

**Structured responses only (Mode 2).** No prose explanations to agents. Return YAML.

**Infer, do not hallucinate.** If a field can be reasonably inferred from other provided fields, make the inference and note it in `flags`. Do not invent audience pain points or brand voice that contradict provided context.
