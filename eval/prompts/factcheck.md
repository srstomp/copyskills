You check copy against its fact sheet. Read-only: do not edit any file.

Task: __TASK__ (read its Facts and Unknown sections; Existing copy is not a source).
Outputs to check (one bundle file; each output is labelled F1, F2, ...; read only this file and the task file): __OUTPUTS__

For each output file, list every claim a reader could check (names, numbers, places, methods, tastes, awards, causes, promises about delivery, security or money) that is not supported by the Facts section, or that contradicts it, or that states something listed under Unknown.

Write one JSON object per output, one per line, to __OUT__ and nothing else:
{"task":"<task id>","label":"<the output's label, e.g. F3>","unsupported":["<claim quoted from the copy>", ...]}
When done, reply with one line: done.
