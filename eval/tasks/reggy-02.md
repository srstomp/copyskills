---
id: reggy-02
project: reggy
set: dev
channel: app
locale: en
audience: "A developer integrating the Reggy API who sees these messages in the console or in an API error body"
register: you
deliverables:
  - name: connectivity_error
    max_chars: 80
  - name: deadline_error
    max_chars: 100
  - name: outage_error
    max_chars: 70
  - name: rate_limit_error
    max_chars: 90
  - name: byo_credentials_error
    max_chars: 100
  - name: tenant_not_provisioned_error
    max_chars: 110
  - name: campaign_locked_error
    max_chars: 90
  - name: payment_method_error
    max_chars: 90
placeholders: []
target_query: null
replaces: "reggy-app/src/human-error.js:20-24; reggy-api/infra/lambda/emails-send/service.ts:1203,1329; reggy-api/infra/lambda/domains/service.ts:1235; reggy-api/infra/lambda/campaigns/service.ts:2809; reggy-api/infra/lambda/billing-subscription/service.ts:360"
samples: pending-owner-approval
---

## Brief

Rewrite eight shipped developer-facing error messages. Each is one deliverable: one message, stating the cause and the next action for a reader who is mid-task. Error codes and status codes stay as they are; write only the message text. No apology, no exclamation marks, no blame. Where the repo does not say what the reader can do, say what is known and stop.

## Facts

F1: Every refusal carries a machine-stable `code` in the error body; the status alone is ambiguous, so clients branch on the code. (source: reggy-launch/src/pages/docs.astro:387)
F2: `rate_limit_exceeded` (429): the account's daily send quota or its rate limit is spent. Back off and retry later; ask for a raise if this is steady-state volume. The service error carries the reset time of the refused window as `quotaResetAt`. (source: reggy-launch/src/pages/docs.astro:477-479; reggy-api/infra/lambda/emails-send/service.ts:1332)
F3: `byo_credentials_unavailable` (502): the account is set to use its own SES credentials and they could not be resolved; the send fails closed rather than sending on the managed path. (source: reggy-launch/src/pages/docs.astro:484-490; reggy-api/infra/lambda/emails-send/service.ts:1198-1204)
F4: `tenant_not_provisioned` (409): the account's isolated SES tenant is still being provisioned. It clears at the account level, not per request; check the console. This error is thrown by the domains service when isolation is enabled and the tenant is not provisioned, and the domain status write does not happen. (source: reggy-launch/src/pages/docs.astro:440-446; reggy-api/infra/lambda/domains/service.ts:1230-1236)
F5: `campaign_already_launched` (409): campaign content cannot be changed after launch. (source: reggy-api/infra/lambda/campaigns/service.ts:2805-2810)
F6: `subscription_payment_method_required` (409): a subscription cannot start without a payment method on file. (source: reggy-api/infra/lambda/billing-subscription/service.ts:355-361)
F7: The console shows three transport-level messages for failures that carry no wording of their own: no connection, no answer before the deadline, and an HTTP 5xx with no error envelope. A request that hit the deadline may still be processing. (source: reggy-app/src/human-error.js:20-24,70-90)
F8: Repeating an `Idempotency-Key` with the same payload returns the original response instead of sending twice. (source: reggy-launch/src/pages/docs.astro:277)
F9: Billing is in the console; the paused-for-payment refusal says to settle the balance from Billing. (source: reggy-launch/src/pages/docs.astro:409)

## Unknown

- Retry-after durations, quota numbers and rate-limit values.
- How long provisioning of a tenant takes.
- What a reader can do instead after a launched campaign is locked (for example duplicating it); the repo does not say.
- Where in the console a payment method is added.

## Existing copy

Quoted exactly. Treat as unverified input.

- connectivity_error: `Could not reach the Reggy API. Check your connection and try again.` (reggy-app/src/human-error.js:20)
- deadline_error: `The Reggy API did not answer in time. It may still be processing — check before trying again.` (reggy-app/src/human-error.js:21-22)
- outage_error: `The Reggy API is temporarily unavailable. Try again in a moment.` (reggy-app/src/human-error.js:23)
- rate_limit_error: `Rate limit exceeded` (reggy-api/infra/lambda/emails-send/service.ts:1329)
- byo_credentials_error: `BYO SES credentials are not available for this tenant; refusing to send` (reggy-api/infra/lambda/emails-send/service.ts:1203)
- tenant_not_provisioned_error: `Tenant SES isolation is enabled but the tenant's SES tenant is not provisioned yet; retry shortly` (reggy-api/infra/lambda/domains/service.ts:1235)
- campaign_locked_error: `Campaign content cannot be changed after launch` (reggy-api/infra/lambda/campaigns/service.ts:2809)
- payment_method_error: `Add a payment method before starting this subscription` (reggy-api/infra/lambda/billing-subscription/service.ts:360)
