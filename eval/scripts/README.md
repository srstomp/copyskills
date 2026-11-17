# Eval scripts

Run from the repository root with Bun. No network or model calls are made.

```sh
bun eval/scripts/eval.ts units <run>
bun eval/scripts/eval.ts read-bundles <run> --seed 1
bun eval/scripts/eval.ts read-score <run> readerA.jsonl readerB.jsonl
bun eval/scripts/eval.ts judge-bundles <run> --seed 1
bun eval/scripts/eval.ts judge-score <run> judgeX.order1.jsonl judgeX.order2.jsonl
bun eval/scripts/eval.ts guards <run>
bun eval/scripts/eval.ts report <run>
bun eval/scripts/eval.ts owner-sheet <run> --seed 1
bun eval/scripts/eval.ts owner-score <run> filled-owner-check.md
bun eval/scripts/eval.ts calib-bundles --seed 1
bun eval/scripts/eval.ts calib-score readerA.jsonl readerB.jsonl
bun run test:eval
```

`<run>` is an ID under `eval/runs/` or a path containing `/`. Supply each
judge's order1 and order2 files consecutively. Generate bundles before scoring;
read scoring uses their maps and `units.jsonl`. Regenerate and reread bundles
after changing outputs or seed. Owner sheets use the saved read-score snapshot;
the caller must supply an A/A run since run.json has no A/A marker.

Choices where SPEC.md leaves the representation or edge case open:

- Sample status is YAML front matter `status: approved` or a plain
  `Status: approved` line. Metadata is omitted from blind bundles. Pending samples
  require `pendingSamples: true`; at least one arm must enable samples.
- Calibration rows are `{ "id", "group", "text" }`; group is `nl`, `nl-owner`,
  `en`, or `en-dev`. IDs are unique within each source file. Reader `task` is the
  bundle group (`nl`, `en`, `en-dev`), label is `C<n>`, and unit is `p`.
  The nl-owner flagged share includes both clean and seeded passages.
- Seeded shuffling uses Mulberry32 and Fisher-Yates. Judge order1 alternates
  sides, with its starting side determined by the seed. Order2 swaps all sides.
- Quote prefixes use 30 Unicode code points after normalization. Invalid reader
  lines at or below 5% are discarded and recorded; duplicate flags count once.
- Fact IDs and source citations are stripped before checking numbers; only
  claim text supplies supported numbers. Optional generator notes are ignored.
- Unknown headings within a deliverable remain part of that deliverable;
  duplicate deliverable sections are rejected.
- A single task has no estimable t interval. Above df 40, the df-40 quantile
  is used conservatively. Missing primary/guard evidence prevents keep.
  Candidate B hard failures trigger revert; A failures are reported.
- Budget ratios use max_words, then min_words, then max_chars, then min_chars;
  character denominators are labelled. Missing or zero budgets produce `n/a`.
  Only dev tasks contribute to decisions; holdout/report results remain separate.

The report applies the measures represented by the three specified score files:
preference, agreed defects, hard guards and lint. SPEC.md provides no input format
for the protocol's separate unsupported-claim pass or calibration override.
