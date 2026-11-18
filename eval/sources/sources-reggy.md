# Reggy eval sources
Root R = /Users/steve/Projects/reggy. Public site: reggy.app (not fetched; launch page source used).

## 1. What Reggy is
- Open-source (AGPL planned) email infrastructure, transactional + marketing in one. Send path `your app → reggy → AWS SES → inbox`. Managed cloud monetizes shared reputation + deliverability ops; self-host (BYO-SES) free. [R/CLAUDE.md]
- Users: developers/infra engineers, technical founders; "arrive skeptical, burned by deliverability black boxes". [R/reggy-launch/PRODUCT.md]. Tenants = "workspaces"; end recipients get tenant mail + branded unsubscribe page. [R/reggy-api/infra/lambda/unsubscribe/brand.ts]
- Status: pre-launch waitlist; docs say "Private early access ... not open for public signup yet". [R/reggy-launch/src/pages/docs.astro]
- Languages: English everywhere. Dutch only in the unsubscribe page catalogue (`nl` locale, formal "u"). [brand.ts]. Company: The Benjamins B.V. [docs.astro footer]
- Tone: "Precise, technical, trustworthy... engineer talking to engineers: exact, unhyped, quietly confident... calm and declarative, never salesy or breathless." [PRODUCT.md]

## 2a. Email templates (only ONE platform email exists; the rest are unsubscribe pages)
SHIPPED (live call site): invitation mail, R/reggy-api/infra/lambda/tenant/invitation-mail.ts
- Subject: `You have been invited to ${workspace} on Reggy` (fallback `You have been invited to a workspace on Reggy`)
- Heading: `Join ${workspace} on Reggy`
- P1: `${inviter} invited you to ${workspaceLabel} on Reggy, the email sending platform.`
- P2: `The invitation is bound to ${invitedEmail}. Sign in with an account whose verified email is that address; a different address cannot claim it.`
- P3: `The link below works once and stops working on ${expires}. After that, ask ${inviter || 'whoever invited you'} to send a new one.`
- P4: `If you were not expecting this, no action is needed and nothing has been created in your name. Ignoring this message lets the invitation expire.`
- Action: "Accept the invitation"; reply line: `This address does not accept replies.` (template: R/.../shared/platform-mail-template.ts). From `Reggy <notifications@send.reggy.app>` [R/reggy-api/infra/docs/PLATFORM-MAILER.md].
Template constraints (platform-mail-template.ts): heading + paragraphs + one https action + reply line; subject max 150 chars, no ALL-CAPS subject; plain text always produced.
Doc example subject (not shipped): `You have been invited to a Reggy workspace` [PLATFORM-MAILER.md].
SHIPPED (web page, not email): unsubscribe copy, EN/NL, R/reggy-api/infra/lambda/unsubscribe/brand.ts
- EN: `Confirm below and {brand} will stop sending marketing email to {email}. This covers all marketing email from this sender, not only the message you clicked.` / `You are unsubscribed from this list` / `Stop all marketing email`
- NL: `Bevestig hieronder en {brand} stopt met het versturen van marketingmail naar {email}. Dit geldt voor alle marketingmail van deze afzender, niet alleen voor het bericht waarop u hebt geklikt.` / `U bent afgemeld voor deze lijst` / `Stop alle marketingmail`
- Error page EN: `This unsubscribe link is not valid` / `The link may have been shortened, altered or truncated on its way to you. Open the original message and follow the unsubscribe link again, or reply to the sender and ask to be removed.`
NOT FOUND in repo: verify-domain email, API-key-created email, sending-paused alert email, welcome email, billing emails, tenant starter templates. Treat as new tasks with no existing copy. Only docs example body: subject "Welcome", text "Thanks for signing up." (docs.astro curl sample, illustrative).

## 2b. UI / error strings (shipped unless noted)
R/reggy-app/src/human-error.js:
1. `Could not reach the Reggy API. Check your connection and try again.`
2. `The Reggy API did not answer in time. It may still be processing — check before trying again.`
3. `The Reggy API is temporarily unavailable. Try again in a moment.`
4. `Something went wrong. Try again.`
R/reggy-app/src/routes/$ws.api-keys.tsx:
5. Empty state title `No API keys yet`; body `Create a key above to start sending through the Reggy API.` (non-manager: `No API keys have been created in this workspace yet.`)
6. Toast `Key created` / `The secret was not returned. Create another key to get a copyable secret.`
7. Toast `Key revoked` / `The key can no longer send`
8. Toast `Outcome unknown` / `The revoke is still in flight. Refresh this list before trying again — the key may already be revoked.`
R/reggy-app/src/components/WorkspaceRequired.tsx:
9. `Select a workspace to view ${resource}` / `You are signed in. Every workspace has its own ${resource}. Choose a workspace, or create your first.` / button `Choose a workspace`
R/reggy-app/src/components/SetupChecklist.tsx (onboarding):
10. `Add the domain you send from and publish the DNS records Reggy gives you.`
11. `This workspace has no verified sending domain, so new sends are refused. The figures below are from earlier sends.`
12. `Opens when a domain is verified and a sender is active`; steps `Create a workspace` / `Get your API key` / `Connect this browser`
API errors (R/reggy-api/infra/lambda/**): `Rate limit exceeded`; `Tenant SES isolation is enabled but the tenant's SES tenant is not provisioned yet; retry shortly`; `BYO SES credentials are not available for this tenant; refusing to send`; `Signup invitation is invalid or expired`; `Campaign content cannot be changed after launch`; `Add a payment method before starting this subscription`. Codes + meanings table: docs.astro §06 (below).
Launch page errors (R/reggy-launch/src/pages/index.astro): `Please enter a valid email address.` / `Too many attempts. Please wait a minute and try again.` / `Verification failed. Please try again.` / `Network error. Please try again.` / `Something went wrong. Please try again.`

## 2c. Docs / landing (shipped, pre-launch)
- H1: `Email infrastructure for everyone who sends.` Sub (variant inspectable-code): `No deliverability black box: the code that queues, signs, and hands every message to AWS SES is licensed AGPL-3.0 — the repositories are not public yet. Self-hosting covers the API on your own SES account; the console is a managed service. reggy.app is almost here.` Other variants: one-bill, agent-native. CTA `Request early access`; note `No spam. One email when the beta opens.`; success `You're on the list.` / `We'll email you when the beta opens.`; chips: `optimized for agents`, `AGPL-3.0 core`, `managed platform`, `transactional + marketing`, `5-minute setup`, `for devs & non-devs`; footer `a calmer alternative to the email APIs you already know`. Meta description: `reggy.app: email infrastructure for everyone who sends. Transactional and marketing mail, an AGPL-3.0 core and a managed platform. Request early access.` [index.astro]
- Docs lede: `What you need to get an email out of Reggy and into an inbox: keys, a verified sending domain, the send call, and the suppression list that keeps the first three working.` Plus "What 'accepted' means", §06 refusal table [R/reggy-launch/src/pages/docs.astro]
- reggy-api/README.md intro: "Core multi-tenant mail API for Reggy..." (operator-flavoured, dev-facing).

## 3. Style guidance
- R/CLAUDE.md: `Brand voice (user-facing copy): precise, technical, unhyped — see reggy-launch/PRODUCT.md.`
- PRODUCT.md: `Every word load-bearing. Copy is terse and concrete. No restated headings, no filler intros. If a sentence doesn't add information, cut it.` / `Engineering credibility over persuasion` / `Show the mechanism.` / Anti: crypto hype, generic SaaS template, childish/playful. Accessibility: WCAG 2.2 AA, labels/error messaging.
- invitation-mail.ts header: `no exclamation marks, no adjectives about the product, plain statements of fact the recipient can verify, and an explicit line about what to do if they did not expect it ... nothing is guessed`; "an email platform whose invitation mail reads like marketing is arguing against itself."
- human-error.js: rewrite only failures with no human wording; keep API envelope messages.
- Compliance: reggy-launch/src/test/public-claims.test.ts bans certain publication claims (repos not public; don't claim open-source published). REVIEWER_RUBRIC.md: no copy implying guaranteed inbox placement; `warmed` copy must be mechanism-descriptive, no "trusted sender"/"premium reputation" [R/reggy-api/infra/docs/REVIEWER_RUBRIC.md].
- PRD guardrail: no per-contact pricing, no forced tracking, no "via reggy" header branding (REQ-36) [R/PRD.md].

## 4. Facts
- Send endpoint `POST https://api.reggy.app/emails/send`, Bearer key; required from/to/subject + html/text; returns 202 `{id:"eml_...", status:"accepted"}`; accepted = provider took responsibility, not inbox; accepted sends are the billing unit; Idempotency-Key header scoped to workspace. [docs.astro §02]
- Prereqs: verified domain (pending→active, failed), sender on it (transactional/marketing/both), key with `emails:send`; sends refused otherwise. [docs.astro §01]
- Keys: created in console Settings → API keys, secret shown once, only a preview stored, lost = revoke + recreate; env live/test; scopes fixed at creation. [§03]
- Domains: console Delivery → Domains; MAIL FROM subdomain `bounce.yourdomain.com` default; no root SPF edit needed; DMARC optional, start `p=none`; copy record names exactly. [§04]
- Refusal codes (docs.astro §06): 401 invalid_api_key; 402 billing_paused; 403 insufficient_scope / sender_not_verified / sender_purpose_mismatch / sender_domain_not_verified; 409 tenant_not_provisioned / tenant_sending_paused / tenant_abuse_paused / byo_sending_unavailable ("clear at the account level... for a pause, contact support — retrying will not lift it"); 409 idempotency_in_progress / idempotency_key_reuse; 422 recipient_suppressed / marketing_compliance_required; 429 rate_limit_exceeded; 502 provider_rejected / byo_credentials_unavailable.
- Support: support@, abuse@, security@, privacy@reggy.app. [docs.astro §08]
- Sending domain for Reggy's own mail: send.reggy.app, From `Reggy <notifications@send.reggy.app>`, replies not accepted unless configured. [PLATFORM-MAILER.md]
- Abuse: new tenants on SES Strict policy (auto-pause on any reputation finding); per-tenant SES tenants; conservative starter quota that auto-ramps [R/PRD.md REQ-12/13]. Exact quota values: unknown for copy (DRAFT / PENDING RATIFICATION in R/reggy-api/infra/docs/REQ-13-PRECOMMIT.md).
- Pricing: PRD target only: $20/50k entry, overage $0.50/1k, no free tier at MVP [R/PRD.md REQ-26 line ~313]. Not public; treat as unknown for public copy.
- Not published: Node SDK, CLI, MCP server; self-host guide (SELF_HOSTING.md) shared on request; self-host stops at `accepted` until the SES event feed is set up. [docs.astro §07]
- MCP tools (reggy_send_email, reggy_onboard_sending_domain, reggy_list_messages, reggy_get_message_events, reggy_add_suppression, reggy_create_webhook) [index.astro agentcard].

## 5. Proposed eval tasks
T1 Domain-verification-stuck email (platform mail, EN). New copy. Audience: developer who added a domain, status still pending/failed. Register: calm, factual, as invitation-mail.ts. Deliverables: subject <=60 chars (hard cap 150), heading, <=3 paragraphs <=90 words total, one https action label, no exclamation marks, plain text only. Facts: pending/active/failed meanings, copy record names exactly, propagation not instant, bounce.yourdomain.com [docs §04]. Unknown: auto-retry cadence, actual console URL. Replaces: nothing.
T2 Sending-paused alert email (EN). Audience: workspace owner whose tenant is paused. Deliverables: subject <=60 chars, body <=120 words, one action, reply line. Facts: pause is account-level, retrying will not lift it, contact support@reggy.app, sends return 409 tenant_sending_paused / tenant_abuse_paused [docs §06]; Strict policy auto-pause on reputation finding [PRD REQ-12]. Unknown: pause thresholds (REQ-13 DRAFT), how long, how reinstated, exact cause shown. Must not imply a guilt verdict or guaranteed inbox. Replaces: nothing.
T3 API-key-created security email (EN). Audience: workspace admin. Deliverables: subject, <=70 words, one action (revoke/review). Facts: secret shown once and never emailed, only preview stored, scopes fixed at creation, live/test environment [docs §03]. Unknown: whether such an email will exist, key preview format in mail, revoke URL. Must not include the secret. Replaces: nothing (toast `Key created` is the nearest).
T4 Developer-facing error rewrite (EN). Rewrite 6 API/UI messages: `Rate limit exceeded`; `BYO SES credentials are not available for this tenant; refusing to send`; `Tenant SES isolation is enabled but the tenant's SES tenant is not provisioned yet; retry shortly`; human-error.js strings 1-3. Deliverables per message: <=20 words, states cause + next action, keeps code unchanged. Facts: §06 table. Unknown: retry-after values, quota numbers. Replaces the quoted strings.
T5 Onboarding empty state (EN) for API keys / Get started. Replaces `No API keys yet` + `Create a key above to start sending through the Reggy API.` and the SetupChecklist `Add the domain you send from...`. Deliverables: title <=6 words, body <=25 words, one button label <=3 words, plus the no-domain variant. Facts: three prereqs in order, sends refused until all exist, key shown once [docs §01, §03]. Register: PRODUCT.md terse, no cute tone. Optional T6 (Dutch): unsubscribe confirmation, rewrite NL strings for informal-vs-formal check; only product Dutch is brand.ts, formal "u".
Optional landing task: 40-word docs/landing intro replacing docs.astro lede or index sub; constraint: do not claim repos public, no inbox guarantee, no pricing.
