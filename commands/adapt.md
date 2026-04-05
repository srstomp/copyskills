---
description: "Repurpose copy for a different channel or format. Runs the copy-adapt skill."
---

Invoke the copy-adapt skill with the user's source copy and target format.

Source copy can be supplied three ways:
- **Inline text** -- paste the copy directly after `/adapt`
- **File path** -- provide a path to a file containing the copy
- **Recent output** -- reference copy generated earlier in the conversation

The copy-adapt skill handles domain routing to the target format automatically. It preserves the core message and reshapes structure, length, and format conventions to fit the destination.

## Usage

```
/adapt this landing page hero as a LinkedIn post
/adapt /path/to/blog-post.md as a 3-email nurture sequence
/adapt this case study as a one-pager
```

Include as much context as useful: audience, tone, any constraints on the target format.
