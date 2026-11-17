# Copyskills

Professional copywriting skills for AI agents and humans. 16 skills covering 9 domains, including web-shop copy driven by SEO audits, native writing in English, Dutch and German, a fact sheet that keeps agents from inventing claims, and an anti-slop system with a linter that catches AI writing patterns before they ship.

Works as a ChatGPT and Codex plugin, a Claude Code plugin, an MCP server, a CLI tool, or a TypeScript library.

**New here?** Read [USAGE.md](./USAGE.md) for a walkthrough with concrete recipes for each interface. The rest of this README is reference material.

The Codex and Claude plugins have no runtime prerequisite. The CLI, MCP server, library, and integration installer require Node.js 20 or newer.

## Quick Start

### ChatGPT and Codex Plugin

Add the repository marketplace and install the plugin:

```bash
codex plugin marketplace add srstomp/copyskills
codex plugin add copyskills@copyskills
```

Start a new Codex task after installation, then ask naturally:

```text
Write a cold outreach email for SakeBox targeting restaurant owners.
Critique the copy in ./landing-page-copy.md.
Adapt this case study into a LinkedIn post.
```

The plugin bundles all 16 skills directly, so it does not require the MCP server or an API key.

### Claude Code Plugin

Install from the marketplace:

```bash
claude plugin marketplace add srstomp/copyskills
claude plugin install copyskills@copyskills
```

Or from inside a Claude Code session:

```
/plugin marketplace add srstomp/copyskills
/plugin install copyskills@copyskills
```

Then use slash commands:

```
/write cold outreach email for SakeBox targeting restaurant owners
/critique ./landing-page-copy.md
/adapt this case study as a LinkedIn post
```

### MCP Server

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

The server exposes copywriting knowledge as MCP resources, tools, and prompts. Your agent reads what it needs.

### CLI

```bash
npm install -g @copydoc/cli
copydoc init
copydoc write "pricing page for a developer tools SaaS"
```

### TypeScript Library

```bash
npm install @copydoc/core
```

```typescript
import {
  createBundledLoader,
  createAssembler,
  selectFramework,
  createLinter,
} from '@copydoc/core';

const loader = createBundledLoader();
const assembler = createAssembler(loader, selectFramework);

const { systemPrompt, userPrompt } = assembler.assemble({
  type: 'cold outreach email',
  goal: 'Book a demo call',
  audience: { who: 'Restaurant owners', pain: 'Bad sake selection' },
  product: { name: 'SakeBox', differentiator: 'Direct from 40+ Japanese breweries' },
});

// Send to any LLM
const copy = await yourLLM.generate(systemPrompt, userPrompt);

// Lint copy
const linter = createLinter(loader);
const { errors, warnings, issues } = linter.lint(copy, { locale: 'en' });
```

## Integrations

Copyskills works with any tool that supports MCP or the SKILL.md standard.

### One-Command Setup

```bash
npx --yes @copydoc/integrations@0.1.1 install
```

Auto-detects and configures: **Cursor**, **Codex**, **OpenCode**, **Hermes**, **OpenClaw**, **Pi**.

Each tool gets the integration that fits it best:

| Tool | What it gets |
|------|-------------|
| Cursor | MCP server config + `.mdc` rule files for each domain skill |
| Codex | MCP server config + individual skills in `.agents/skills/` |
| OpenCode | MCP server config in `.opencode.json` |
| Hermes | MCP server config in `~/.hermes/config.yaml` + skills symlink |
| OpenClaw | MCP server + skills directory in `~/.openclaw/openclaw.json` |
| Pi | Skills symlink + TypeScript extension stub wrapping `@copydoc/core` |

### Manual MCP Setup (any MCP client)

Add to your tool's MCP config:

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

### Other Commands

```bash
npx --yes @copydoc/integrations@0.1.1 status
npx --yes @copydoc/integrations@0.1.1 uninstall
npx --yes @copydoc/integrations@0.1.1 install --tool cursor
npx --yes @copydoc/integrations@0.1.1 install --tool codex --global
```

## What's Inside

### 16 Skills Across 3 Layers

**Layer 1: Framework References** (the methodology)

| Skill | What it provides |
|-------|-----------------|
| persuasion-frameworks | 10 frameworks (AIDA, PAS, BAB, FAB, ACCA, PASTOR, QUEST, 4Ps, PPPP, Star-Story-Solution) with decision matrix for when to use each |
| quality-frameworks | Anti-slop method and lint lists, locale packs for English, Dutch and German (register, typography, translationese), scoring rubric for existing copy, Cialdini principles, readability targets |
| headline-formulas | 26 proven headline templates, power words categorized by emotion |

**Layer 2: Domain Skills** (the patterns)

| Skill | Covers |
|-------|--------|
| commerce-copy | Product pages, category and style pages, title tags and meta descriptions (single or catalogue batch), About pages, alt text; turns SEO audit findings into page briefs |
| marketing-copy | Landing pages, ads (Google/Meta/LinkedIn with char limits), CTAs, value propositions |
| email-copy | Drip sequences, cold outreach, newsletters, subject lines |
| ux-copy | Microcopy, error messages, onboarding flows, empty states |
| editorial-copy | Blog posts, SEO content, thought leadership, whitepapers |
| brand-copy | Voice profiles, messaging hierarchies, style guides |
| sales-copy | Case studies, proposals, pitch decks, one-pagers |
| social-copy | Platform-specific content (X, LinkedIn, Instagram, TikTok), threads, carousels |
| conversion-copy | A/B test variants, pricing pages, signup flows, checkout copy |

**Layer 3: Workflow Skills** (the orchestration)

| Skill | Purpose |
|-------|---------|
| copy-brief | Gathers context before writing, including locale and a fact sheet with sources; conflicting facts become questions for a human. Three modes: human interview, agent handshake, fast-path |
| copy-workflow | Full pipeline: brief, domain routing, framework selection, native draft per language, de-slop, pass/fail checks, revise |
| copy-critique | Evaluates existing copy. Scores, diagnoses, suggests concrete fixes |
| copy-adapt | Repurposes copy across channels while preserving the core message |

### Facts, languages and the human in the loop

Copy states only facts from the brief's fact sheet. Each fact has an id and a source; copy being rewritten counts as unverified, and points on which two sources or language versions disagree are left out and returned as questions. Each language is written from the fact sheet in that language, never translated from another draft, and then read by a fresh reader who has not seen the source. Every run returns, next to the copy, the claims it made (with fact ids), the questions only a human can answer, the judgment calls a human may want to overrule, and the lint result.

### Copy Linter

The linter reports errors and warnings without an LLM or API key:

- Locale-specific phrases from markdown sections marked `{lint: error}` or `{lint: warn}`; brand phrases can be added with `avoid`.
- Title and meta character budgets, repeated sentences, and numbers absent from a supplied fact sheet.
- Repeated four-word sequences and three-word openers across batches.

English uses `anti-slop.md` plus `locales/en.md` when present. Other languages use their locale file when present. Locale variants such as `nl-BE` use the primary language (`nl`).

## MCP Server Details

The MCP server exposes three types of primitives:

**Resources** (passive context your agent reads):
```
copydoc://skills                        # List all skills with descriptions
copydoc://frameworks/{name}             # Get a specific framework (pas, aida, bab, etc.)
copydoc://domains/{domain}/workflow     # Get a domain's workflow
copydoc://domains/{domain}/references   # List references for a domain
copydoc://quality/anti-slop             # Get the anti-slop rules
copydoc://quality/rubric                # Get the scoring rubric
copydoc://headlines/patterns            # Get headline templates
copydoc://headlines/power-words         # Get power words by emotion
```

**Tools** (active logic your agent calls):
```
select_framework  { copy_type, goal }       ->  recommended framework + rationale
lint_copy         { text?, items?, locale?, kind?, min?, max?, facts?, avoid? }
                  -> { issues, errors, warnings }; provide exactly one of text or items
```

**Prompts** (workflow templates for MCP clients):
```
write     { type, goal, audience?, product?, brand_voice?, constraints? }
critique  { copy_text, audience?, goal?, brand_voice? }
adapt     { source_copy, target_format, brand_voice? }
```

## CLI Commands

```
copydoc init              # Set up provider (Anthropic/OpenAI/Gemini) and API key
copydoc write <desc>      # Generate copy with interactive brief gathering
copydoc critique <input>  # Evaluate copy from file or inline text
copydoc lint <file|dir>... [--locale nl-NL] [--kind title|meta|body]
  [--min N] [--max N] [--facts facts.md] [--items lines] [--json]
copydoc adapt <src> --to <fmt>  # Repurpose copy for a different channel
copydoc list              # Show all available skills grouped by layer
copydoc info <skill>      # Show skill details and references
```

`lint` needs no API key or config. One file is checked as one text; multiple files or a directory form a batch (directory .md/.txt files are sorted). `--items lines` checks each non-empty line of a single file as an item. Exit codes: 0 for no errors, 1 for lint errors, 2 for usage errors.

Generation supports Anthropic (default), OpenAI, and Google Gemini. Set a custom base URL for Cloudflare AI Gateway.

## Input/Output Contract

All interfaces (plugin, MCP, CLI, library) use the same brief format:

```yaml
# Required
type: "cold outreach email"
goal: "Book a demo call"

# Recommended
audience:
  who: "Restaurant owners, 28-45"
  pain: "Boring sake selection losing customers"
product:
  name: "SakeBox"
  differentiator: "Direct from 40+ Japanese breweries"

# Optional
brand_voice:
  tone: "knowledgeable, casual"
  avoids: ["artisanal", "curated"]
constraints:
  length: "150 words max"
```

Output includes the copy plus quality metadata:

```yaml
copy:
  primary: "..."
  variants: ["...", "..."]
metadata:
  framework_used: "PAS"
  domain: "email-copy/cold-outreach"
  quality_scores:
    clarity: 9
    specificity: 8
    voice_match: 8
    overall: 8
```

## Architecture

```
@copydoc/cli (human interface)
  |
  +-- calls LLM via provider adapter (Anthropic/OpenAI/Gemini)
  +-- uses @copydoc/core

@copydoc/mcp (agent interface)
  |
  +-- exposes resources, tools, prompts over MCP protocol
  +-- uses @copydoc/core

@copydoc/integrations (multi-tool installer)
  |
  +-- auto-detects Cursor, Codex, OpenCode, Hermes, OpenClaw, Pi
  +-- writes MCP config, symlinks skills, generates .mdc rules
  +-- uses @copydoc/core

@copydoc/core (shared library)
  |
  +-- reads 16 skill markdown files at runtime
  +-- assembles prompts from skills + brief context
  +-- provides framework selection + copy linting
```

Skills are plain markdown files. No compilation, no transformation. The core library reads them at runtime and assembles structured prompts that any LLM can consume.

## Development

```bash
bun install
bun run test          # Build core, then run all package tests
bun run validate:skills
bun run build         # Build all packages
bun run test:packages # Verify clean npm tarball installation after building
bun run dev:mcp       # Run MCP server locally
bun run dev:cli       # Run CLI locally
```

### Publishing

```bash
./scripts/publish.sh                        # Dry run
./scripts/publish.sh --bump patch --publish # Bump + publish to npm
```

## License

MIT
