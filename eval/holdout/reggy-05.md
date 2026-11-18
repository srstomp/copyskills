---
id: reggy-05
project: reggy
set: holdout
channel: app
locale: en
audience: "A developer who has just created a Reggy workspace and opens the Domains screen with no sending domain yet"
register: you
deliverables:
  - name: heading
    max_chars: 40
  - name: body
    min_words: 12
    max_words: 30
  - name: button
    max_chars: 25
  - name: helper_line
    max_chars: 90
placeholders: []
target_query: null
replaces: "reggy-app/src/routes/$ws.domains.tsx:171-180 (empty state, Domains screen)"
samples: project
---

## Brief

The empty state a new workspace shows when it has no sending domain. It should tell the reader what to do first and what happens next, in the product's terse register. The helper line sits under the button and gives one concrete fact that saves them time. Reggy calls the tenant a workspace everywhere in the console, so the task says workspace, not project. Readers who cannot write to the workspace see no button; do not write copy for that case.

## Facts

F1: Before anything can be sent, three things must exist in order: a verified sending domain, a sender address on it, and an API key with `emails:send`. Sends are rejected until all three exist. (source: reggy-launch/src/pages/docs.astro:215-236)
F2: A domain is added in the console under Delivery → Domains; Reggy returns the DNS records to publish at the DNS provider. Status stays `pending` until the required records resolve, then becomes `active`. (source: reggy-launch/src/pages/docs.astro:317)
F3: Copy the record name exactly: many DNS providers append the zone automatically. (source: reggy-launch/src/pages/docs.astro:342)
F4: DNS propagation is not instant; publish everything, then re-run verification. (source: reggy-launch/src/pages/docs.astro:355)
F5: The MAIL FROM records use a subdomain, `bounce.yourdomain.com` by default; no change to a root SPF record is needed. (source: reggy-launch/src/pages/docs.astro:348)
F6: The console shows "workspace" for the tenant. (source: reggy-app/src/routes/_CONVENTIONS.md:10)
F7: Voice: terse and concrete, no restated headings, no filler intros, never cute. (source: reggy-launch/PRODUCT.md:51-54)

## Unknown

- How long verification normally takes.
- Whether the button opens a dialog or a screen; the label is the only deliverable.
- Pricing, quotas and limits.

## Existing copy

Quoted exactly. Treat as unverified input.

- Title: `No sending domains yet` (reggy-app/src/routes/$ws.domains.tsx:172)
- Body: `Add a domain, apply its DNS records, then verify to start sending.` (reggy-app/src/routes/$ws.domains.tsx:179)
- Button: `Add your first domain` (reggy-app/src/routes/$ws.domains.tsx:175)

There is no helper line today.
