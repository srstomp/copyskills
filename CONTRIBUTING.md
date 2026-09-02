# Contributing to Copyskills

Thanks for your interest in contributing. This guide covers what you need to get started.

## Setup

```bash
git clone git@github.com:srstomp/copyskills.git
cd copyskills
bun install
bun run test
```

Requires [Bun](https://bun.sh) v1.3+ and Node.js 20+ (the published artifacts run on Node).

## Project Structure

```
skills/               15 copywriting skills (plain markdown)
packages/
  core/               Skill loader, prompt assembler, anti-slop checker
  mcp-server/         MCP server exposing skills as resources, tools, prompts
  cli/                CLI for copy generation, critique, and adaptation
  integrations/       Multi-tool installer (Cursor, Codex, OpenCode, Hermes, OpenClaw, Pi)
agents/               Claude Code agents (copywriter, copy-reviewer)
commands/             Slash commands (write, critique, adapt)
```

## Running Tests

```bash
bun run test                      # Build core, then run all packages
bun run validate:plugin           # Validate Codex plugin and marketplace metadata
bun run validate:skills           # Validate skill frontmatter and local references
bun run test:packages             # Pack and install every npm artifact under Node
bun test packages/core/           # One package
bun test --watch packages/core/   # Watch mode
```

## Making Changes

1. Fork the repo and create a branch from `main`.
2. Write tests for new functionality.
3. Run `bun test` and confirm all tests pass.
4. Run `bun run typecheck` to verify types.
5. Open a pull request.

## Skills

Skills are plain markdown files at `skills/<name>/SKILL.md`. Each skill has YAML frontmatter (`name`, `description`) and a markdown body. Reference files go in `skills/<name>/references/`.

If you want to add or improve a skill:

- Follow the three-layer architecture: Layer 1 (frameworks), Layer 2 (domains), Layer 3 (workflows). Higher layers reference lower layers, never the reverse.
- Run the anti-slop checker against any example copy in the skill. No em dashes, no banned words.
- Keep reference files under 10KB each.

## Packages

Each package under `packages/` has its own `package.json`, `tsconfig.json`, and test suite. When adding a new feature:

- Add tests using `bun:test` (not jest or vitest).
- Export from the package's `src/index.ts` barrel.
- Follow existing patterns in the package for naming, structure, and error handling.

## Anti-Slop Rules

All copy output and skill examples must pass the anti-slop system. The banned list is at `skills/quality-frameworks/references/anti-slop.md`. Key rules:

- No em dashes.
- No banned words ("leverage", "unlock", "elevate", "seamless", "robust", "delve", etc.).
- No generic openers ("In today's...", "Whether you're A or B...").
- Vary sentence length. Use contractions. Be specific.

## Code Style

- TypeScript, ESM modules.
- Named exports only (no default exports).
- No comments unless the "why" is non-obvious.
- No external CLI frameworks for arg parsing.

## Reporting Issues

Open an issue at [github.com/srstomp/copyskills/issues](https://github.com/srstomp/copyskills/issues).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
