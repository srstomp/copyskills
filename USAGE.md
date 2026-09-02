# Usage Guide

A practical walkthrough of Copyskills. The README is a feature reference. This guide is task-oriented: pick the section that matches what you have and what you want.

If you only read one thing, read [Pick Your Interface](#pick-your-interface) and [The Brief is the Lever](#the-brief-is-the-lever). Everything else is recipes.

---

## Pick Your Interface

Copyskills ships four interfaces against the same knowledge base. Choose by what you already have:

| You have... | You want... | Use |
|-------------|-------------|-----|
| ChatGPT desktop or Codex CLI | Conversational copywriting workflows | **Codex plugin** |
| Claude Code installed | Copy in your editor with slash commands | **Claude plugin** (`/write`, `/critique`, `/adapt`) |
| An agent or LLM app | Copy generation as a callable capability | **MCP server** |
| A terminal and an API key | Quick one-shot copy, scriptable | **CLI** (`copydoc`) |
| A TypeScript app | Programmatic prompt assembly, your own model loop | **Library** (`@copydoc/core`) |

Same skills, same brief format, same anti-slop pass. The interface is the only thing that changes.

The Codex and Claude plugins have no runtime prerequisite. The CLI, MCP server, library, and integration installer require Node.js 20 or newer.

---

## The Brief is the Lever

Every output traces back to the brief. Vague briefs make slop. Specific briefs make copy that converts.

Three fields are required. Without them, generation stops:

- **`type`**: the copy format (`"cold outreach email"`, `"landing-page-hero"`, `"LinkedIn post"`)
- **`goal`**: the outcome you want (`"Book a 15-minute demo call"` beats `"more leads"`)
- **`audience.who`**: who is reading (`"Heads of CX at 50-200 person B2B SaaS"` beats `"businesses"`)

Three fields are recommended. Skip them and the output drops a quality grade:

- **`product.name`** and **`product.differentiator`**: what makes this offer unlike the next one
- **`audience.pain`**: the specific friction the reader feels right now
- **`brand_voice`**: tone, words to avoid, sample copy that sounds right

The output reports `flags` for any recommended field you skipped. Read them. They tell you which dimension scored lower and why.

### A bad brief vs. a good brief

```yaml
# Bad: nothing here gives the model anything specific to write about
type: "email"
goal: "more conversions"
audience:
  who: "customers"
```

```yaml
# Good: every field gives the model a concrete handle
type: "cold-outreach"
goal: "Book a 15-minute call to demo the import flow"
audience:
  who: "Heads of Ops at e-commerce brands doing $5M-$50M GMV"
  pain: "Sync between Shopify and their 3PL breaks every quarter and costs them a weekend"
  sophistication: "operational, not technical"
product:
  name: "SyncRail"
  differentiator: "Two-way Shopify <-> 3PL sync with audit log per SKU"
brand_voice:
  tone: "direct, no fluff, peer-to-peer"
  avoids: ["leverage", "seamless", "robust", "unlock"]
constraints:
  length: "120 words max"
  cta: "single link to /demo"
```

The second brief produces copy that scores 8+ across dimensions. The first scores 5 and fails the threshold.

---

## Recipe 1: First Draft of a Landing Page Hero (Plugin)

You are in Claude Code. You want a hero section.

```
/write landing page hero for SyncRail. Audience: Heads of Ops at e-commerce brands doing $5M-50M GMV. They lose a weekend every quarter to Shopify-3PL sync failures. Differentiator: two-way sync with per-SKU audit log. Tone: direct, peer-to-peer. No words like "seamless" or "robust".
```

What happens:

1. The `copywriter` agent loads the brief inline. Because all required fields are present, it skips the interview and goes straight to drafting.
2. It routes to `marketing-copy`, selects AIDA (the default for landing page heroes), drafts, runs the de-slop pass, scores against the 7-dimension rubric.
3. You get the hero plus a metadata block: framework used, all 7 scores, any de-slop flags resolved.

If something scored low, ask: `revise. Specificity scored 6. Push harder on the per-SKU audit log angle.` The agent re-enters at Step 5 (de-slop) on the revised draft.

---

## Recipe 2: Critique Existing Copy (Plugin)

You have a landing page somewhere. Paste it or point at a file.

```
/critique ./landing-pages/pricing-hero.md
```

You get:

- 7-dimension scores
- Line-level issues with concrete fixes (`"Replace 'We help businesses unlock growth' with 'We cut your 3PL reconciliation time from 6 hours to 20 minutes'"`)
- A severity tag on each issue (high, medium, low)
- A rewrite of flagged sections if AI-tell score is 5+ (or if you ask for one)

This is the single best use of Copyskills for copy you already have. Slop detection is mechanical and consistent in a way human review usually is not.

---

## Recipe 3: Repurpose a Long Asset Into a Short One (Plugin)

You wrote a 2,000-word case study. You need a LinkedIn post that points at it.

```
/adapt this case study as a LinkedIn post: [paste content]
```

The `copy-adapt` skill identifies what transfers (core message, differentiator, proof points) and what changes (structure, length, tone, CTA). It loads `social-copy` for LinkedIn-specific patterns and returns the post with a metadata block showing exactly what changed and why.

Read the `changed` block. If the agent dropped your strongest proof point because of LinkedIn's optimal length, you can override: `keep the metric about the 60% reduction. Drop something else.`

---

## Recipe 4: Cold Outreach Sequence from Scratch (CLI)

You want a 3-email cold sequence and you want it scriptable.

```bash
copydoc init                                   # one-time: pick provider, paste API key
copydoc write "3-email cold outreach sequence for SyncRail targeting Heads of Ops at $5M-50M GMV e-commerce, pain is Shopify/3PL sync failures, differentiator is two-way sync with per-SKU audit log"
```

`copydoc write` runs the same workflow as `/write`: brief gathering, domain routing, framework selection, draft, de-slop, score. It writes the output to stdout (and optionally a file with `-o`).

For a quick critique on a file:

```bash
copydoc critique ./drafts/cold-email-1.txt
```

For an adapt:

```bash
copydoc adapt ./blog-post.md --to "LinkedIn post"
```

---

## Recipe 5: Build Copy Generation Into Your Own App (Library)

You have a TypeScript app, an LLM client of your choice, and you want Copyskills to assemble the prompts.

```typescript
import {
  createBundledLoader,
  createAssembler,
  selectFramework,
  createAntiSlopChecker,
} from '@copydoc/core';

const loader = createBundledLoader();
const assembler = createAssembler(loader, selectFramework);

const brief = {
  type: 'cold outreach email',
  goal: 'Book a 15-minute demo',
  audience: {
    who: 'Heads of Ops at $5M-50M GMV e-commerce brands',
    pain: 'Shopify/3PL sync breaks every quarter',
  },
  product: {
    name: 'SyncRail',
    differentiator: 'Two-way sync with per-SKU audit log',
  },
};

const { systemPrompt, userPrompt } = assembler.assemble(brief);

// Send to any model
const copy = await yourLLM.generate({ system: systemPrompt, user: userPrompt });

// Run the same de-slop check the workflow uses
const checker = createAntiSlopChecker(loader);
const { score, issues } = checker.check(copy);

if (score >= 3) {
  // revise with the issues fed back in
}
```

`assembler.assemble(brief)` does the framework selection, loads the right references, and builds a structured prompt. You own the model loop, the cache, the retry policy. Copyskills owns the copywriting knowledge.

---

## Recipe 6: Agent Integration (MCP)

You are building an agent and want Copyskills available as a callable tool.

Add to your MCP client config:

```json
{
  "mcpServers": {
    "copydoc": {
      "command": "npx",
      "args": ["--yes", "@copydoc/mcp@0.1.1"]
    }
  }
}
```

The server exposes three categories your agent can use independently:

**Resources** (passive reads, no parameters):
- `copydoc://frameworks/pas` to read the PAS framework
- `copydoc://domains/email-copy/workflow` to read the email workflow
- `copydoc://quality/anti-slop` to read the banned-pattern list

**Tools** (active calls, return structured data):
- `select_framework({ copy_type, goal })` to get the recommended framework name
- `check_anti_slop({ text })` to score AI patterns and list issues
- `score_copy({ text, context })` to get all 7 dimension scores

**Prompts** (full workflows as templates):
- `write({ type, goal, audience?, product?, brand_voice? })`
- `critique({ copy_text, audience?, goal? })`
- `adapt({ source_copy, target_format })`

If your agent has its own LLM and just needs the methodology, call the resources. If it wants the full pipeline, invoke a prompt.

---

## Recipe 7: Cursor Integration

Install:

```bash
npx --yes @copydoc/integrations@0.1.1 install --tool cursor
```

What happens: MCP config added to `.cursor/mcp.json`, 8 `.mdc` rule files generated in `.cursor/rules/`.

Cursor's agent sees the rules automatically when relevant. Ask it to write copy and it uses the copywriting knowledge. MCP tools are available for framework selection and anti-slop scoring.

Example: In Cursor chat, type `Write a cold outreach email for SyncRail targeting Heads of Ops`. The agent picks up the rules without any extra configuration.

---

## Recipe 8: Codex Integration

The recommended installation is the native plugin:

```bash
codex plugin marketplace add srstomp/copyskills
codex plugin add copyskills@copyskills
```

Start a new task after installation. The plugin makes all 15 skills available without requiring an API key or MCP server.

For a project-local MCP configuration plus standalone skill copies instead, use:

```bash
npx --yes @copydoc/integrations@0.1.1 install --tool codex
```

That command adds the MCP server to `.codex/config.toml` and copies each skill into `.agents/skills/<skill-name>/`. Add `--global` to use `~/.codex/config.toml` and `~/.agents/skills/`. Copies are the default so an `npx` cache cleanup cannot break the installation; use `--link` only for local development.

Codex reads SKILL.md files natively. MCP server provides tools for framework selection and anti-slop checking.

Example:

```bash
codex "write a pricing page hero for SyncRail"
```

---

## Recipe 9: OpenCode Integration

Install:

```bash
npx --yes @copydoc/integrations@0.1.1 install --tool opencode
```

What happens: MCP config added to `.opencode.json` under `mcpServers`.

MCP tools and resources are available to OpenCode's agent. Note: OpenCode has been archived and succeeded by Crush. The integration still works for existing OpenCode users.

---

## Recipe 10: Hermes Integration

Install:

```bash
npx --yes @copydoc/integrations@0.1.1 install --tool hermes
```

What happens: MCP config added to `~/.hermes/config.yaml`, skills symlinked to `~/.hermes/skills/copydoc`.

Hermes reads skills natively. MCP server provides tools. Multi-channel: generate copy from Telegram, Slack, or any channel Hermes connects to.

---

## Recipe 11: OpenClaw Integration

Install:

```bash
npx --yes @copydoc/integrations@0.1.1 install --tool openclaw
```

What happens: MCP server registered in `~/.openclaw/openclaw.json`, skills directory added to `skills.load.extraDirs`.

Skills and MCP tools are available to OpenClaw agents across all channels.

---

## Recipe 12: Pi Integration

Install:

```bash
npx --yes @copydoc/integrations@0.1.1 install --tool pi
```

What happens: Skills symlinked to `.pi/skills/copydoc`, TypeScript extension generated at `.pi/extensions/copydoc.ts`.

Pi reads skills natively. The extension wraps `@copydoc/core` for prompt assembly and anti-slop checking. Install `@copydoc/core` as a dependency to use the extension:

```bash
npm install @copydoc/core
```

---

## How to Interpret the Output

Every interface returns copy plus a metadata block. The metadata is not decoration. Read it.

```yaml
copy:
  primary: "..."
  variants: ["...", "..."]
metadata:
  framework_used: "PAS"
  domain: "email-copy/cold-outreach"
  quality_scores:
    clarity: 9
    specificity: 7
    voice_match: 8
    ai_tell_score: 1
    persuasion: 8
    action: 9
    overall: 8
  flags: []
```

What to do with each field:

- **`framework_used`**: if the framework feels wrong for your situation, ask for a different one explicitly. The agent will not second-guess your override.
- **`quality_scores`**: anything below 7 (or AI-tell above 2) is a flag. Push back. `"Specificity scored 6, rewrite the second paragraph with concrete numbers."`
- **`flags`**: lists recommended fields you did not provide and explains how that affected the output. If `brand_voice not provided: voice_match scored at 5`, you know what to add for the next pass.
- **`variants`**: optional alternates the agent produced. Use them for A/B testing or pick the one that fits.

---

## Common Failure Modes

**The output sounds generic.** You skipped the differentiator or audience pain. The model has nothing specific to lean on, so it pads with safe phrases. Fix the brief, not the copy.

**Voice match is low.** You did not provide `brand_voice`. Either add it, or accept that voice will be a generic default. The system flags this so you cannot miss it.

**AI-tell score is 3+ even after revision.** The brief is probably underspecified. The model is hedging with buzzwords because it does not have enough material to be concrete. Add proof points, names, numbers.

**The agent asks too many questions.** You triggered interactive mode without enough context. Either provide more in the first message, or invoke the workflow with the full brief structure directly.

**Output uses an em dash.** Should never happen. If it does, flag it. Em dashes are a hard banned pattern.

---

## When Not to Use Copyskills

- **You need legal, medical, or financial copy.** The anti-slop pass does not check compliance. Use a domain-specific reviewer.
- **You are working in a language other than English.** All references and examples are English. The patterns generalize but the banned-word list does not translate cleanly.
- **You have a copywriter on retainer who already knows your brand cold.** Copyskills replaces generic AI output. It does not replace a senior writer with three years of context on your product.

For everything else, it is a faster path from brief to draft than a blank page.
