# Copyskills

Professional copywriting skills for AI agents and humans. 15 skills covering 8 domains, 10 persuasion frameworks, and a built-in anti-slop system that catches AI writing patterns before they ship.

Works as a Claude Code plugin, an MCP server, a CLI tool, or a TypeScript library.

**New here?** Read [USAGE.md](./USAGE.md) for a walkthrough with concrete recipes for each interface. The rest of this README is reference material.

## Quick Start

### Claude Code Plugin

```bash
claude plugin add ./path/to/copyskills
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
      "args": ["@copydoc/mcp"]
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
import { createLoader, createAssembler, selectFramework, createAntiSlopChecker } from '@copydoc/core';

const loader = createLoader('./skills');
const assembler = createAssembler(loader, selectFramework);

const { systemPrompt, userPrompt } = assembler.assemble({
  type: 'cold outreach email',
  goal: 'Book a demo call',
  audience: { who: 'Restaurant owners', pain: 'Bad sake selection' },
  product: { name: 'SakeBox', differentiator: 'Direct from 40+ Japanese breweries' },
});

// Send to any LLM
const copy = await yourLLM.generate(systemPrompt, userPrompt);

// Check for AI patterns
const checker = createAntiSlopChecker(loader);
const { score, issues } = checker.check(copy);
```

## What's Inside

### 15 Skills Across 3 Layers

**Layer 1: Framework References** (the methodology)

| Skill | What it provides |
|-------|-----------------|
| persuasion-frameworks | 10 frameworks (AIDA, PAS, BAB, FAB, ACCA, PASTOR, QUEST, 4Ps, PPPP, Star-Story-Solution) with decision matrix for when to use each |
| quality-frameworks | 7-dimension scoring rubric, anti-slop detection, Cialdini principles, readability targets |
| headline-formulas | 26 proven headline templates, power words categorized by emotion |

**Layer 2: Domain Skills** (the patterns)

| Skill | Covers |
|-------|--------|
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
| copy-brief | Gathers context before writing. Three modes: human interview, agent handshake, fast-path |
| copy-workflow | Full pipeline: brief, domain routing, framework selection, draft, de-slop, critique, revise |
| copy-critique | Evaluates existing copy. Scores, diagnoses, suggests concrete fixes |
| copy-adapt | Repurposes copy across channels while preserving the core message |

### Anti-Slop System

Every workflow includes a mandatory quality pass that catches AI writing patterns:

- **50+ banned patterns**: "leverage", "unlock", "elevate", "seamless", em dashes, "In today's [X]..."
- **Structural detection**: Uniform sentence length, repeated paragraph openings, tricolon lists
- **The specificity test**: Could a competitor paste their name over this copy? If yes, it's slop.
- **Humanization**: Varied sentence length, contractions, sentence fragments, concrete numbers over vague claims

The anti-slop check runs after every draft. Copy scoring 3+ AI tells gets revised before output.

## MCP Server Details

The MCP server exposes three types of primitives:

**Resources** (passive context your agent reads):
```
copydoc://frameworks/pas          # Get a specific framework
copydoc://domains/email-copy/workflow   # Get a domain's workflow
copydoc://quality/anti-slop       # Get the anti-slop rules
copydoc://headlines/patterns      # Get headline templates
```

**Tools** (active logic your agent calls):
```
select_framework  { copy_type, goal }  ->  which framework to use
check_anti_slop   { text }             ->  AI pattern score + issues
score_copy        { text, context }    ->  quality scores
```

**Prompts** (workflow templates for MCP clients):
```
write     { type, goal, audience?, product?, brand_voice? }
critique  { copy_text, audience?, goal? }
adapt     { source_copy, target_format }
```

## CLI Commands

```
copydoc init              # Set up provider (Anthropic/OpenAI/Gemini) and API key
copydoc write <desc>      # Generate copy with interactive brief gathering
copydoc critique <input>  # Evaluate copy from file or inline text
copydoc adapt <src> --to <fmt>  # Repurpose copy for a different channel
copydoc list              # Show all available skills grouped by layer
copydoc info <skill>      # Show skill details and references
```

Supports Anthropic (default), OpenAI, and Google Gemini. Set a custom base URL for Cloudflare AI Gateway.

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
    ai_tell_score: 1
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

@copydoc/core (shared library)
  |
  +-- reads 15 skill markdown files at runtime
  +-- assembles prompts from skills + brief context
  +-- provides framework selection + anti-slop scoring
```

Skills are plain markdown files. No compilation, no transformation. The core library reads them at runtime and assembles structured prompts that any LLM can consume.

## Development

```bash
bun install
bun test              # 415 tests across all packages
bun run build         # Build all packages
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
