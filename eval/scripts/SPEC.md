# eval/scripts: specification

Deterministic parts of the eval in `eval/protocol.md`. TypeScript run with Bun: `bun eval/scripts/eval.ts <command> [args]`. Tests: `bun test eval/scripts`. Import the linter from `../../packages/core/src/index.ts`. No network, no model calls: models are dispatched by the session; these scripts prepare their inputs and score their outputs. Every command is deterministic given `--seed` (default 1).

## Files and formats

**Task file** (`eval/tasks|holdout|report-only/<id>.md`): YAML front matter as in `eval/tasks/TEMPLATE.md`, then `## Brief`, `## Facts` (lines `F<n>: claim (source: ...)`), `## Unknown`, `## Existing copy`. Parse the front matter with a small YAML subset parser or `Bun.YAML` if available; fields: id, project, set, channel, locale, audience, register, email_type?, deliverables[{name, max_chars?, min_chars?, max_words?, min_words?}], placeholders[], target_query, replaces, samples.

**Run folder** `eval/runs/<run>/`:
- `run.json`: `{ "run", "arms": ["A","B"], "n": 4, "tasks": ["<id>", ...], "samples": {"A": false, "B": true} }`.
- Generator outputs: `out/<arm>/<task>/<n>.md`, n = 1..N. Format: one `## <deliverable name>` section per deliverable, in any order, then optional `## needs`, `## decisions`, `## flags` sections (ignored for scoring). Text inside a section is the deliverable, trimmed.

## Commands

1. `units <run>` writes `units.jsonl`: `{arm, task, n, unit, text}` for every output. A deliverable with `max_chars` or `min_chars` (titles, metas, subjects, UI strings) is one unit, id `<deliverable>`. Other deliverables are split into sentences, ids `<deliverable>#1..k`. Sentence split: after `.`, `!`, `?` or `…` (optionally followed by a closing quote or bracket) when followed by whitespace and an uppercase letter, a digit, an opening quote or the end; and at blank lines and list items (`- `, `* `, `1. `). Do not split inside `{placeholders}`, decimal numbers (`7,5`, `7.5`), `e.g.`, `bijv.`, `o.a.`, `z.B.`, `ca.`, `incl.`, `nr.`, `St.`. Markdown headings in prose are their own unit.

2. `read-bundles <run>` writes, per task, `read/<task>.md` and `read/<task>.map.json`. The bundle shows the task's locale, audience and register line, the voice samples for the task's project (only when `run.json` samples for that arm... readers see samples in BOTH arms when either arm has them: include `eval/samples/<project>/judge.md` if it exists and its status is approved or the run sets `"pendingSamples": true`), then every output of that task from both arms, shuffled with the seed and labelled `X1..X(2N)`, each unit on its own line as `[X3 body#2] text`. The map file maps labels to `{arm, n}`. No arm names, file paths or counts per arm appear in the bundle.

3. `read-score <run> <readerA.jsonl> <readerB.jsonl>`: each reader file has one JSON object per flagged unit: `{"task","label","unit","quote","reason","fix"}`; unflagged units are absent. Validate: unknown task, label or unit is an error; `quote` must match the start of the unit text after normalising case, quotes (curly to straight), dashes and whitespace (compare the first 30 characters of quote, or all of it if shorter). If more than 5% of a reader's lines fail validation, exit 1 naming the reader and the failures. Output `read-score.json` and print a table: per task and arm, units, flags by reader A, by reader B, agreed (both flagged the same unit of the same output), share agreed = agreed ÷ units (per task: mean over that arm's outputs). Also the per-task difference A minus B.

4. `judge-bundles <run>`: pairs output n of arm A with output n of arm B for each task. Two bundles per task, `judge/<task>.order1.md` (A as "Copy 1" in odd pairs, "Copy 2" in even pairs, determined by the seed) and `.order2.md` (every pair's sides swapped). Each bundle shows the task's locale, audience and register line, the judge's voice samples (`eval/samples/<project>/judge.md`, same inclusion rule as read-bundles) and the brief, then pairs `P1..PN` with their two copies. Map files record which side is which arm.

5. `judge-score <run> <judgeX.order1.jsonl> <judgeX.order2.jsonl> [<judgeY...> ...]`: each line `{"task","pair","prefer":1|2|"tie","reason"}`. Per judge, pair and order: B preferred = 1, A preferred = 0, tie = 0.5; average the two orders (so an order flip becomes 0.5). Task score = mean over judges and pairs, minus 0.5. Output `judge-score.json` and a table per task.

6. `guards <run>`: per output.
   - Hard: every deliverable section present and non-empty; inside its budgets (characters counted as Unicode code points after trim; words = whitespace-separated tokens); every listed placeholder present unchanged at least once; no `{...}` token that is not in the task's placeholders; no number missing from the task's Facts section (use `createLinter(...).lint(text, { locale, facts })` from core and keep only the number rule's errors).
   - Noisy: lint errors per output (`lint(text, { locale, kind })` with kind `title` or `meta` for deliverables named title/meta, `body` otherwise), excluding the number rule.
   - Copy check (reported): the longest run of words (lowercased, punctuation stripped) shared with any text in `eval/samples/<project>/generator.md`; flag runs of 6 or more.
   Output `guards.json` and a table: per task and arm, hard failures (list), lint errors, longest shared run.

7. `report <run>`: reads read-score, judge-score and guards (whichever exist) and writes `results.md`:
   - Preference: mean task score, sd, n tasks, and the one-sided 90% lower bound `mean - t(0.90, n-1) * sd / sqrt(n)` (hard-code the t quantiles for df 1..40).
   - Defects: mean per-task difference A minus B with its one-sided 90% lower and upper bounds.
   - Hard guards: count of failing outputs per arm; any failure in B is listed.
   - Noisy guards: lint errors per output, mean per task, difference B minus A with its one-sided 90% bound.
   - Outcome per protocol section 6: keep, revert or inconclusive, with the reason in one line. Also report words ÷ budget per deliverable (mean per arm).
   Only dev tasks count; holdout and report tasks are listed separately and never change the outcome.

8. `owner-sheet <run>`: from read-score of an A/A run, picks 8 units both readers flagged and 7 units neither flagged, nl tasks only, seeded random, shuffled; writes `owner-check.md` (numbered items: the unit text and one line of context: the task's channel and audience; a line `answer: natural / off` to fill in, no reader reasons shown) and `owner-check.key.json`. `owner-score <run> <owner-check.md>` reads the filled answers and prints matches, and confirmed agreed flags out of 8.

9. `calib-bundles`: from `eval/calibration/clean.jsonl` and `seeded.jsonl`, writes one shuffled bundle per language group (nl incl. nl-owner, en, en-dev) to `eval/calibration/read/<group>.md` with labels `C1..Ck`, each passage as one unit `[C4 p] text`, plus map files. `calib-score <readerA.jsonl> <readerB.jsonl>`: same reader format (`unit` is `p`); prints per group and per reader, and for agreed flags: false-alarm rate on clean passages (flags ÷ clean passages), recall on seeded passages (flagged ÷ seeded), and the protocol's pass or fail (agreed false alarms at most 15%, agreed recall at least 0.7), plus the share of nl-owner passages flagged.

## Tests

Fixtures under `eval/scripts/__tests__/fixtures/` (two small tasks, a run with N=2, reader and judge files). Content-bearing assertions: sentence splitting on the listed cases (abbreviations, decimals, placeholders, list items); bundles contain no arm names and every unit once; quote validation and the 5% rule; agreement counts; order-flip averaging gives 0.5; t lower bound against a hand-computed value; every hard guard fires on a crafted bad output and stays silent on a good one; owner sheet has 8 + 7 items with no reasons shown; seeded determinism (same seed, same bundle).
