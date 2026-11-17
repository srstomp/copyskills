# Eval design v3: does a change to copyskills make copy read more like a skilled native human wrote it, across projects?

Status: v3. v1 BLOCKED and v2 PASS WITH FIXES by Fable 5.2; v3 applies the v2 fixes (N1–N8). Owner-approved inputs: projects sakedeal, yuzusake, plinkr, reggy (2026-11-17). Council verdict: scratchpad/council-next (cross-project eval first; voice samples are the main untested lever; linter is a guard, not the measure).

## 1. What the old eval could not do
- All 12 tasks came from two sake shops, so a gain could not show transfer.
- Decisions rested on 0–10 means from 2 samples; noise (about ±0.3) against a 0.5 threshold; "native/human" sat at 6.0 in every round.
- No task supplied voice samples, so the suite's central rule (samples override style rules) was never exercised.
- Model judges were never checked against a native reader.

## 2. Task set (23 tasks)
Every task file has: project, channel, locale, audience and register (one line), deliverables with budgets, a fact sheet (id + source per fact), voice samples where the project has approved copy, the existing copy it replaces if any, and placeholders where relevant. Facts only from sources. Sources: eval2/sources-plinkr.md, eval2/sources-reggy.md, the yuzusake deck (nl/en guide.ts, about.ts, bottles.ts, approved 2026-11-12), the sakedeal warm/cold article (EN), the old tasks.md and holdout.md.

| Project | Tasks | Channels | Locales |
|---|---|---|---|
| sakedeal | 5 | product page + title + meta (EN, NL), category intro (NL), order email (NL), product page (DE, report-only) | en-GB, nl-NL, de-DE |
| yuzusake | 4 | product description (EN, NL), app microcopy (NL), meta batch (NL) | en-GB, nl-NL |
| plinkr | 7 | resident emails (referral, self-handle), resident app microcopy (empty and error states), resident app microcopy (onboarding and confirmations), coach/portal copy, organisation email (u), Nazorg page section | nl-NL (the product has no English) |
| reggy | 6 | developer emails (domain verification, sending paused, API key created), developer error messages, onboarding empty state, Dutch unsubscribe page | en (5), nl-NL (1) |

Named contrasts: plinkr's resident referral email (je) and organisation email (u) are about the same referral; the outputs must differ in register and content, checked by the readers' register line and a side-by-side read.

Long form: one dev task is a 400–600 word article for sakedeal (EN) or yuzusake (NL), since both owner samples were articles.

**Split.**
- Dev set (15): sakedeal 3 (EN product page, NL product page, NL category intro), yuzusake 3, plinkr 6, reggy 2 (one email, the error set), and the long-form task. Dev then has four EN tasks, two of them for developers.
- Locked holdout (7): reggy 4, and one task each from sakedeal (NL order email), yuzusake and plinkr. Run on the starting suite and the final candidate only. Holdout rule: no hard guard fails, and neither preference nor any noisy guard is worse beyond its one-sided interval.
- German (1): the sakedeal DE product page is outside both sets and report-only. No keep or revert decision uses German until a German native has checked the readers.

## 3. Arms and generation
- Arm A = current best, arm B = candidate. Generator: Sonnet 5.5 following the suite.
- n = 4 generations per task per arm. Generations are paired by task and index (A1 with B1, and so on) for pairwise judging.
- 15 dev tasks × 4 × 2 arms = 120 outputs per experiment.
- Generators see the suite and the task file only, never another arm's output.

## 4. Measures (two co-primary)
**Primary 1: blind pairwise preference.**
- Question: "Which of these would a skilled native copywriter for this brand and this audience have written?" The judge also sees the task's audience and register line and, where the task has them, voice samples from a subset disjoint from the generator's (so surface imitation of the generator's samples earns nothing).
- Two judges from different families: gpt-6.1-sol (Codex) and Opus 5.5 (Agent). Both orders; a judge that flips with order scores 0.5 for that pair.
- Score per task = mean preference for B over its 4 pairs and 2 judges, minus 0.5 (so 0 means no preference). Report the mean over tasks with a one-sided 90% t-interval on the per-task scores.

**Primary 2: share of units with an agreed native defect.**
- Unit = one sentence (prose) or one UI string or subject line.
- Two readers (same models), blind to arm and source. Each gets the copy, the locale, the audience and register line, and the task's voice samples where it has them. Matching the samples is not a defect; departing from them is a voice break.
- Each reader returns, per unit, flag or no flag, with a free-text reason and a fix. A unit counts when both readers flag it.
- Per task: flagged units ÷ units; the difference is A minus B (positive means B has fewer defects); then the mean over tasks, so long pages do not swamp microcopy. Same one-sided 90% t-interval on per-task differences.
- Typography (°C spacing, quotes, dashes, Title Case) is not counted here: it belongs to lint, a guard.
- Integrity check: a reader's quoted unit must be found in the output (after normalising quotes and spaces); if more than 5% cannot be found, that reading is rerun.

**Reported, not decided on:** words ÷ budget per deliverable (shows bland or truncated copy), per-reader flag rates, and the copy check below.

**Hard guards (zero tolerance, deterministic):** every deliverable present and inside its budget, placeholders present and unchanged, no number missing from the fact sheet (`copydoc lint --facts`). Any failure in arm B fails the experiment.

**Noisy guards (fail only when B is worse beyond the one-sided 90% interval):** unsupported claims marked by one reader in a separate pass with the fact sheet (60 extra reads per arm), lint errors per locale, and the agreed-defect share (primary 2).

**Copy check (reported):** runs of 6 or more words shared with any voice sample, in both arms.

## 5. Reader calibration (before any experiment)
- **Clean human set:** 20 NL and 10 EN passages from pages archived before November 2022 (Wayback Machine: Coolblue, bol, HEMA, Zalando, NS, Rijksoverheid, Geldfit, gemeente Amsterdam; GOV.UK, Monzo, Mailchimp), plus 5 developer-English passages from pre-2022 Stripe and GitHub docs, plus 10 passages of approved owner copy from the yuzusake deck. Target: at most 15% of clean units are agreed flags (both readers).
- **Seeded set:** the same passages with one injected defect in half of them (calques, AI tells, register slips from the locale packs and today's native read). This is circular (the seeds come from defects a model already found) and only shows the readers catch known patterns. Target recall ≥ 0.7.
- **Owner check (about 10 minutes), after the A/A run:** 15 NL units from real A/A outputs, shown blind: 8 the readers agreed were defects and 7 neither flagged. The owner marks each "natural" or "off". This tests what the primary measure counts. Pass: at least 12 of 15 match the owner and at least 6 of the 8 agreed flags are confirmed "off" (a smoke test, not a precision estimate).
- **Retest:** the same A/A outputs read twice; flag agreement between the two readings is reported.
- If calibration fails, the defect measure is reported only, and decisions rest on pairwise preference plus an owner blind pick.

## 6. A/A and the decision rule
- **A/A run first:** the current suite against itself, full dev set. Check that both intervals cover zero (no effect where none exists) and use the run for the owner check and the reader retest.
- **Three outcomes per experiment.** Preference is the only keep trigger; defects and the guards are must-not-worsen checks.
  - **Keep** when the lower bound of the one-sided 90% t-interval on preference (B minus 0.5) is above zero, no hard guard fails, and no noisy guard is worse beyond its interval.
  - **Revert** when preference is below zero beyond its interval, a hard guard fails, or a noisy guard is worse beyond its interval.
  - **Inconclusive** otherwise: one more batch of 4 generations per task, pooled. If still inconclusive, the change is not adopted (the suite stays simpler) and the result is recorded as inconclusive, not as a loss.
- One change per experiment.
- An experiment with fewer than 10 usable tasks is reported as directional only and cannot keep a change.

## 7. Experiment queue
1. **Voice samples (input ablation).** Same suite in both arms; arm A's task files have no samples, arm B's have the project's samples. Readers and judges see samples in both arms (judges a disjoint subset, see §4). A win means "samples help", not "the voice-file format helps".
   - Samples are defined per project and audience, across channels, and never include the copy a task replaces:
     - yuzusake: the deck, split by item (bottles A–C as samples, bottle D the task, D's approved text held out as the parity reference and used as tie-breaker when preference is inconclusive).
     - sakedeal: the warm/cold article (EN) for EN tasks only. Sakedeal NL tasks get no samples (the NL article reads translated) and are excluded from this experiment.
     - plinkr (needs owner approval of shipped copy as voice): resident app strings as samples for resident email tasks, and the resident emails as samples for app tasks; portal strings for coach tasks.
     - reggy (needs owner approval): the shipped invitation mail, shipped UI strings and the PRODUCT.md voice rules for its email and error tasks.
   - Usable dev tasks: yuzusake 3, sakedeal EN 2 (product page, long form), plinkr up to 6, reggy 2: about 13 with both approvals, 5 without. Under 10, the result is directional only.
2. **Shared guidance without sake examples** (sake stays only in commerce-copy). Expected: neutral on sake tasks, better on plinkr and reggy.
Deferred until 1 and 2 have run: native drafting vs translate-then-edit, and the cross-family native read as a required gate (that one cannot be judged on the defect measure, because the gate removes what the same readers flag; it would be judged on preference plus an owner blind pick).
Linter changes are judged on the calibration set (precision and recall per rule), not on copy experiments.

## 8. Harness
In the repo under `eval/` so it survives the scratchpad: `eval/tasks/`, `eval/holdout/` (locked), `eval/calibration/`, `eval/prompts/` (generator, reader, judge, fact-check), `eval/protocol.md` (this design), `eval/scripts/` (bun/TypeScript: unit splitting, quote location, guards, bootstrap, results table), `eval/runs/<date>-<experiment>/` (git-ignored except `results.md`). Generation and reading are dispatched by the session: Sonnet generators and the Opus reader via the Agent tool, gpt-6.1-sol via `codex exec` in a background shell.

## 9. Cost per experiment (estimate)
120 generations (Sonnet), 240 unit-level reads (half Opus, half gpt-6.1-sol), 60 pairs × 2 judges × 2 orders = 240 pairwise judgements, 120 fact-check reads, deterministic guards. Calibration once: 40 passages and their seeded twins × 2 readers. Owner: about 10 minutes once.

## 10. Known risks
- Readers and judges share blind spots; Opus and the Sonnet generator are one family. Mitigated by gpt-6.1-sol as the second family, the agreement rule and the owner check.
- The defect measure cannot see flat, generic copy; that is why preference is co-primary and words ÷ budget is reported.
- 15 dev tasks detect large effects well and moderate ones poorly; inconclusive results are expected and are not rounded up.
- Approved owner copy may itself use patterns the locale packs call tells; it is in the clean set so readers that punish it fail calibration.
