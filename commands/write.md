---
description: "Quick copy generation with domain auto-detection. Runs the copywriter agent."
---

Invoke the copywriter agent with the user's input as the initial brief.

The copywriter agent will auto-detect the copy domain (email, landing page, UX, ad, etc.) from the request text. It runs in interview mode (copy-brief Mode 1), asking targeted questions to fill any gaps in the brief before generating copy.

## Usage

```
/write cold outreach email for SakeBox targeting restaurant owners
/write landing page hero for a project management tool aimed at freelancers
/write error messages for a payment form
```

Pass the full request as a single line after `/write`. The more context you include (audience, goal, product, tone), the fewer follow-up questions the agent will need to ask.
