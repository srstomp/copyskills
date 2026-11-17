# Open Questions

Items found during the skill review that need a decision before fixing. Not applied.

## 1. Double de-slop and scoring in the orchestrated path

copy-workflow Steps 5-6 run a full de-slop pass and pass/fail checks at the orchestrator level, but every domain skill already runs the same pass and checks as its own Steps 5-6. When copy-workflow routes to a domain skill, the draft gets de-slopped and checked twice.

Decision needed: is this deliberate defense-in-depth, or should copy-workflow delegate Steps 5-6 to the domain skill and only verify the returned checks? The current emphatic "MANDATORY, cannot be skipped" language suggests intent, so I left it, but it roughly doubles token cost per generation.

## 2. Double-hyphen em dashes inside the skills' own prose

The anti-slop reference hard-bans em dashes, and brand-copy explicitly says a document cannot contain the patterns it tells others to avoid. Yet most SKILL.md files use `--` as an em dash throughout their own prose (e.g. "runs a complete workflow -- it does not just list resources"). Instructions are not copy output, so this is not strictly a violation, but it is off-brand for a plugin whose signature feature is em dash hatred.

Decision needed: want a repo-wide pass replacing `--` constructions with commas, periods, or parentheses? It touches nearly every file, so I left it for your call.
