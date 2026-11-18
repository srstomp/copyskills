---
id: reggy-06
project: reggy
set: holdout
channel: web
locale: nl-NL
audience: "Nederlandse ontvanger van marketingmail die via een Reggy-werkruimte is verstuurd en op de afmeldlink heeft geklikt"
register: u
deliverables:
  - name: heading
    max_chars: 20
  - name: lead
    min_words: 25
    max_words: 45
  - name: button
    max_chars: 20
  - name: footer
    max_chars: 40
  - name: list_lead
    min_words: 18
    max_words: 35
  - name: list_button
    max_chars: 25
  - name: tenant_button
    max_chars: 30
  - name: confirmed_list_heading
    max_chars: 45
  - name: confirmed_list_body
    min_words: 25
    max_words: 50
placeholders: ["{brand}", "{email}"]
target_query: null
replaces: "reggy-api/infra/lambda/unsubscribe/brand.ts:133-152 (nl catalogue, Dutch unsubscribe page and confirmation)"
samples: project
---

## Brief

The Dutch unsubscribe page a recipient lands on after clicking the unsubscribe link in a marketing email, and the confirmation after they act. The recipient is not a Reggy customer and has no context about Reggy. Rewrite the existing Dutch copy as a native Dutch writer would. The page is a compliance surface: it must say exactly what the button does and nothing more, and the stop is always sender-wide, never "this campaign". `{brand}` is the sending workspace's brand name, `{email}` is the recipient's address; both are filled in by the server and must stay unchanged. The page shows `lead` with a single button, or `list_lead` with two buttons (`list_button`, `tenant_button`), depending on whether the link came from a list; the confirmation heading and body are shown afterwards.

## Facts

F1: The page is rendered from a closed, reviewed catalogue of copy; tenants cannot author strings on it. (source: reggy-api/infra/lambda/unsubscribe/brand.ts:100-106)
F2: Every lead states that the suppression is sender-wide, because the POST writes a tenant-scoped suppression; a lead promising "you will stop receiving this campaign" would misdescribe the button. (source: reggy-api/infra/lambda/unsubscribe/brand.ts:106-109)
F3: With a list link, the recipient chooses between leaving this one list (`list_button`) and stopping all marketing email from this sender (`tenant_button`). (source: reggy-api/infra/lambda/unsubscribe/brand.ts:142-145,391-393)
F4: After unsubscribing from one list, other marketing email from the same sender may still arrive; the recipient can use the unsubscribe link in any of it to stop that too. (source: reggy-api/infra/lambda/unsubscribe/brand.ts:148-149)
F5: The catalogue has English, Dutch, German and French sets; the Dutch set addresses the reader as "u". (source: reggy-api/infra/lambda/unsubscribe/brand.ts:114,133-152,154,175)
F6: Brand voice for Reggy's user-facing copy: precise, technical, unhyped. (source: reggy/CLAUDE.md:69)

## Unknown

- Whether a Dutch native has reviewed the existing Dutch copy.
- The Dutch legal text a Dutch sender needs beyond this page.
- Pricing and limits (not relevant here).

## Existing copy

Quoted exactly. Treat as unverified input.

- heading: `Afmelden` (reggy-api/infra/lambda/unsubscribe/brand.ts:135)
- lead: `Bevestig hieronder en {brand} stopt met het versturen van marketingmail naar {email}. Dit geldt voor alle marketingmail van deze afzender, niet alleen voor het bericht waarop u hebt geklikt.` (brand.ts:136-137)
- button: `Afmelden` (brand.ts:140)
- footer: `Verzonden door {brand}` (brand.ts:141)
- list_lead: `Kies wat {email} niet meer moet ontvangen. U kunt zich afmelden voor alleen deze lijst, of voor alle marketingmail van deze afzender.` (brand.ts:142-143)
- list_button: `Stop deze lijst` (brand.ts:144)
- tenant_button: `Stop alle marketingmail` (brand.ts:145)
- confirmed_list_heading: `U bent afgemeld voor deze lijst` (brand.ts:147)
- confirmed_list_body: `U ontvangt geen e-mail meer die naar deze lijst wordt verstuurd op {email}. Andere marketingmail van deze afzender kan u nog steeds bereiken — gebruik de afmeldlink daarin om ook die te stoppen.` (brand.ts:148-149)
