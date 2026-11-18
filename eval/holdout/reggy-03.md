---
id: reggy-03
project: reggy
set: holdout
channel: email
locale: en
audience: "The owner or admin of a Reggy workspace whose sending has just been paused"
register: you
email_type: transactional
deliverables:
  - name: subject
    max_chars: 60
  - name: heading
    max_chars: 50
  - name: body
    min_words: 60
    max_words: 110
placeholders: ["{workspace}"]
target_query: null
replaces: null
samples: project
---

## Brief

Reggy sends this platform email when sending for a workspace is paused. The reader's sends are now being refused and they need to know it is the account, not their code, what retrying will not do, and who to contact. The email must not accuse the reader of anything or imply a verdict, and must not promise when or whether sending resumes. Platform mail has one heading, short paragraphs and a reply line the template adds; do not write the reply line or an action URL. `{workspace}` is the workspace name; it is defined by this task because no such email exists in the repo.

## Facts

F1: While sending is paused, send calls are refused with HTTP 409 and the code `tenant_sending_paused` or `tenant_abuse_paused`. (source: reggy-launch/src/pages/docs.astro:436)
F2: These refusals clear at the account level, not per request. For a pause, contact support; retrying will not lift it. (source: reggy-launch/src/pages/docs.astro:445-446)
F3: A pause can come from a reputation or abuse finding. (source: reggy-launch/src/pages/docs.astro:440-442)
F4: New tenants start on the Strict reputation policy, which auto-pauses on any reputation finding; a finding on one tenant pauses only that tenant. (source: reggy/PRD.md:229,231)
F5: Support: support@reggy.app. For a specific send, include the `id` from the send response (`eml_...`). (source: reggy-launch/src/pages/docs.astro:535-538)
F6: A pause for unpaid subscription is a different refusal: 402 `billing_paused`, settled from Billing in the console. This email is not about it. (source: reggy-launch/src/pages/docs.astro:407-409)
F7: Accepted means the provider took responsibility for a message, not that it reached the inbox; copy must not imply guaranteed inbox placement. (source: reggy-launch/src/pages/docs.astro:268; reggy-api/infra/docs/REVIEWER_RUBRIC.md:303-311)
F8: Platform mail template: one heading, paragraphs, optional one https action, a reply line; subject at most 150 characters and not all capitals; plain text always produced. (source: reggy-api/infra/lambda/shared/platform-mail-template.ts:62-104)

## Unknown

- Pause thresholds (the quota and ramp values are draft and unratified).
- How long a pause lasts and how sending is reinstated.
- Which finding caused the pause, and whether the email can state it.
- Whether messages already accepted before the pause are still delivered.
- Whether such an email will exist.

## Existing copy

None.
