---
description: "Evaluate existing copy. Runs the copy-reviewer agent."
---

Invoke the copy-reviewer agent on the provided copy.

Input can be supplied two ways:
- **Inline text** -- paste the copy directly after `/critique`
- **File path** -- provide a path to a file containing the copy

The agent returns scores across all quality dimensions (anti-slop, 4Cs, readability, Cialdini) plus specific, actionable fix suggestions for each issue found.

## Usage

```
/critique [pasted copy text]
/critique /path/to/copy.md
```

Optional: include audience, goal, or brand voice context after the copy to get more targeted feedback.
