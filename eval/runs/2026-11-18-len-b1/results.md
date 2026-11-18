# Results: length probe (2026-11-18-len-b1 and -b2)

A probe, not a keep decision: generation and the automatic limit check only, no judges, so preference is untested.

- Tasks: the 10 dev tasks with word limits. 8 outputs per arm and task (two batches of 4), 160 in total.
- Arm A: current suite. Arm B: the same suite with one addition to copy-workflow Step 6, check 2:

> **Count, do not estimate.** A limit missed by one word or one character fails this check. With a shell, count each deliverable mechanically (`wc -w` for words, `wc -m` for characters). Without one, count paragraph by paragraph (for a title, subject or other short string: character by character), add the counts up, and stay at least 10% inside every limit, because a count done by reading is off by a few percent: for 400 to 600 words, land between 440 and 540; for a 140-word maximum, stop at 126; for a 60-character maximum, stop at 54. If the draft sits outside that margin, cut or extend it from the fact sheet before you return it; never pad with filler.

## Missed limits

A: 3 of 80 outputs (plinkr-02 subject 62 of 60 characters; reggy-01 body 61 of 60 words; yuzusake-04 article 388 of 400 words). B: 0 of 80. Structural failures: none in either arm.

Per task, share of outputs missing a limit, B minus A: mean −0.0375, sd 0.0604, n tasks 10, one-sided 95% lower −0.0725, upper −0.0025. Three misses against none is thin on its own; the word counts below show the mechanism.

## Word counts (8 outputs each)

| Task, deliverable, limits | A mean (min to max) | B mean (min to max) |
| --- | --- | --- |
| plinkr-01 body, 80 to 150 | 126 (114 to 137) | 120 (113 to 127) |
| plinkr-02 body, 55 to 110 | 92 (89 to 96) | 91 (84 to 96) |
| plinkr-06 body, 40 to 100 | 68 (57 to 78) | 67 (59 to 76) |
| reggy-01 body_pending, 45 to 90 | 73 (65 to 82) | 71 (62 to 84) |
| reggy-01 body_verified, 25 to 60 | 49 (39 to 61) | 43 (34 to 53) |
| sakedeal-01 description, 120 to 160 | 147 (140 to 160) | 143 (140 to 148) |
| sakedeal-02 description, 120 to 160 | 139 (130 to 153) | 139 (137 to 141) |
| sakedeal-03 intro, 120 to 180 | 134 (127 to 151) | 135 (125 to 145) |
| yuzusake-01 description, 130 to 170 | 153 (144 to 165) | 150 (146 to 155) |
| yuzusake-02 description, 100 to 140 | 137 (133 to 139) | 127 (123 to 132) |
| yuzusake-04 article, 400 to 600 | 433 (388 to 451) | 462 (444 to 484) |

B keeps clear of the edges where A sits on them: the yuzusake-04 article runs 444 to 484 words (A: 388 to 451), the yuzusake-02 description tops out at 132 of 140 (A: 139), sakedeal-01 at 148 of 160 (A: 160).
