---
id: reggy-01
project: reggy
set: dev
channel: email
locale: en
audience: "A developer or infrastructure engineer who has added a sending domain to a Reggy workspace and is waiting for its DNS records to verify"
register: you
email_type: transactional
deliverables:
  - name: subject_pending
    max_chars: 60
  - name: heading_pending
    max_chars: 50
  - name: body_pending
    min_words: 45
    max_words: 90
  - name: action_label_pending
    max_chars: 30
  - name: subject_verified
    max_chars: 60
  - name: heading_verified
    max_chars: 50
  - name: body_verified
    min_words: 25
    max_words: 60
  - name: action_label_verified
    max_chars: 30
placeholders: ["{workspace}", "{domain}"]
target_query: null
replaces: null
samples: pending-owner-approval
---

## Brief

Write two variants of one platform email that Reggy sends about a sending domain. The pending variant goes to a developer whose domain is still `pending` and who needs to know what usually holds it up and what to check. The verified variant goes when the domain reaches `active` and says what is now possible and what is still required before a send works. Platform mail is plain text with one heading, short paragraphs, one action, and a reply line the template adds; do not write the reply line. The reader is technical and arrives skeptical.

Placeholders are defined by this task, because no domain-status email exists in the repo: `{workspace}` is the workspace name, `{domain}` is the sending domain (for example `example.com`, shown as a placeholder only). Each variant has one action whose URL the template supplies; write only its label.

## Facts

F1: A domain's status stays `pending` until the required DNS records resolve, then becomes `active`. (source: reggy-launch/src/pages/docs.astro:317)
F2: `failed` means the provider reported a terminal failure, usually a record never published or published at the wrong name. This email does not cover `failed`. (source: reggy-launch/src/pages/docs.astro:320)
F3: Domains are added in the console under Delivery → Domains; Reggy returns the DNS records to publish at the DNS provider. (source: reggy-launch/src/pages/docs.astro:317)
F4: A domain returns four record groups: domain verification (TXT), DKIM (CNAME x3), MAIL FROM (MX + TXT), DMARC (TXT). DMARC is recommended, the other three are required. (source: reggy-launch/src/pages/docs.astro:56-80)
F5: Many DNS providers append the zone automatically, so pasting a fully-qualified record name produces `name.yourdomain.com.yourdomain.com`; if verification will not complete, check this first. (source: reggy-launch/src/pages/docs.astro:342)
F6: The bounce domain is a subdomain of the customer's domain, `bounce.yourdomain.com` unless another is chosen; there is no need to add Reggy to an existing root SPF record. (source: reggy-launch/src/pages/docs.astro:348)
F7: DNS propagation is not instant: publish everything, then re-run verification. Reggy re-checks on demand. (source: reggy-launch/src/pages/docs.astro:355)
F8: Starting DMARC at `p=none` gives reports without affecting delivery. (source: reggy-launch/src/pages/docs.astro:359)
F9: Sending also needs a sender address on the verified domain (marked transactional, marketing or both) and an API key with the `emails:send` scope; sends are rejected until all three exist. (source: reggy-launch/src/pages/docs.astro:220-236)
F10: Reggy's own mail comes from `Reggy <notifications@send.reggy.app>`; the template renders a heading, paragraphs, one https action and a reply line, always with a plain-text part. Subject is capped at 150 characters and must not be all capitals. (source: reggy-api/infra/lambda/shared/platform-mail-template.ts:62-104)
F11: Support address: support@reggy.app. (source: reggy-launch/src/pages/docs.astro:535)

## Unknown

- How often Reggy re-checks a pending domain on its own, and how long verification normally takes.
- When the pending email is sent (after how long) and whether it exists at all; no such email is in the repo.
- The console URL behind the action; the template supplies it.
- Pricing, quotas and sending limits.

## Existing copy

None. No domain-verification email exists in the repo. The nearest shipped copy is the console line "Add the domain you send from and publish the DNS records Reggy gives you." (reggy-app/src/components/SetupChecklist.tsx:226), which is out of scope here.
