# Open Questions

Items found during the skill review that need a decision before fixing. Not applied.

## 1. Double de-slop and scoring in the orchestrated path

copy-workflow Steps 5-6 run a full de-slop pass and rubric scoring at the orchestrator level, but every domain skill already runs the identical pass and scoring as its own Steps 5-6. When copy-workflow routes to a domain skill, the draft gets de-slopped and scored twice.

Decision needed: is this deliberate defense-in-depth, or should copy-workflow delegate Steps 5-6 to the domain skill and only verify the returned scores? The current emphatic "MANDATORY, cannot be skipped" language suggests intent, so I left it, but it roughly doubles token cost per generation.

## 2. UX copy rubric vs the workflow output contract

ux-copy swaps the Persuasion dimension for Empathy (deliberately, and well argued). But copy-workflow Step 6 scores against the canonical 7-dimension rubric from quality-frameworks, and its output contract expects `persuasion` in `quality_scores`. When the workflow routes to ux-copy, it is undefined whether the output carries a persuasion score (meaningless for UX copy) or an empathy score (violates the contract).

Decision needed: allow a domain skill to substitute a dimension in the output contract, or have ux-copy report both.

## 3. Cross-skill reference paths are relative to skills/, not to the loaded skill

Every skill references shared files as `quality-frameworks/references/anti-slop.md`, i.e. relative to the `skills/` root. That matches how the TypeScript loader resolves them, but when a single skill is loaded in a Claude Code plugin context its base directory is its own skill folder, so the correct relative path would be `../quality-frameworks/references/anti-slop.md`. Agents will usually recover by searching, but it adds friction.

Decision needed: keep the skills/-root convention (and possibly state it once per skill), or switch to `../` sibling paths. Changing it touches every SKILL.md and possibly the core loader, so I did not churn it.

## 4. Double-hyphen em dashes inside the skills' own prose

The anti-slop reference hard-bans em dashes, and brand-copy explicitly says a document cannot contain the patterns it tells others to avoid. Yet most SKILL.md files use `--` as an em dash throughout their own prose (e.g. "runs a complete workflow -- it does not just list resources"). Instructions are not copy output, so this is not strictly a violation, but it is off-brand for a plugin whose signature feature is em dash hatred.

Decision needed: want a repo-wide pass replacing `--` constructions with commas, periods, or parentheses? It touches nearly every file, so I left it for your call.

## 5. Per-dimension targets: I chose the softer reading

The domain skills' rubric tables said every dimension "Must be 7+", while the enforcement sentence and quality-frameworks' canonical threshold rule only gate AI-Tell (>= 3) and Overall (< 7), plus named per-skill extras (ux Clarity 8+, brand Specificity/Actionability 8+, case-study Specificity 8+). I resolved the contradiction toward the canonical rule: other dimensions are now "targets" that set revision priorities without blocking. If you intended every dimension as a hard gate, the fix belongs in quality-frameworks' threshold rule instead, and the Step 6 sentences I edited should be reverted.
