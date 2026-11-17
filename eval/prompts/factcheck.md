You check copy against its fact sheet. Read-only: do not edit any file.

Bundle: __OUTPUTS__ (read only this file). It starts with the task's brief, Facts (ids F1, F2, ...) and Unknown sections, then the outputs to check, labelled O1, O2, ...

For each output, list every claim a reader could check (names, numbers, places, methods, tastes, awards, causes, promises about delivery, security or money) that is not supported by the Facts section, or that contradicts it, or that states something listed under Unknown.

Write one JSON object per output, one per line, to __OUT__ and nothing else:
{"task":"<task id>","label":"<the output's label, e.g. O3>","unsupported":["<claim quoted from the copy>", ...]}
When done, reply with one line: done.
