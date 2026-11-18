You are judging pairs of copy versions written for the same brief. Read-only: do not edit any file. Read only the bundle file below; do not open any other file.

Bundle: __BUNDLE__

The bundle starts with the task's brief, locale, audience and register, and, if present, approved voice samples from the brand. Then it lists pairs P1, P2, ..., each with Copy 1 and Copy 2.

For each pair, answer one question: which of these would a skilled native copywriter for this brand and this audience have written? Consider how natural it reads in its language, whether it fits the audience and the brand's voice, and whether it does the brief's job. Ignore length differences unless one version fails the brief. If you genuinely cannot choose, answer tie.

Write one JSON object per pair, one per line, to __OUT__ and nothing else:
{"task":"<task id>","pair":"P1","prefer":1,"reason":"<one line>"}
prefer is 1, 2 or "tie". When done, reply with one line: done.
