---
id: plinkr-06
project: plinkr
set: dev
channel: email
locale: nl-NL
audience: "Medewerkers van de organisatie waarnaar een inwoner is doorverwezen; zij nemen contact op met de inwoner en lezen formeel, zakelijk en snel"
register: u
email_type: transactional
deliverables:
  - name: subject
    max_chars: 60
  - name: subject_crisis
    max_chars: 70
  - name: preheader
    max_chars: 80
  - name: body
    min_words: 40
    max_words: 100
  - name: crisis_banner
    max_chars: 60
placeholders: ["{{organization_name}}", "{{resident_name}}", "{{check_date_label}}", "{{resident_contact_phone}}", "{{resident_contact_email}}", "{{referrer_name}}", "{{referrer_organization}}", "{{referrer_contact_email}}"]
target_query: null
replaces: "plinkr/ffc/lambdas/send-email/index.ts (organisation mail)"
samples: pending-owner-approval
---

## Brief

This is the formal counterpart of plinkr-01: the same referral, seen from the organisation. A hulpverlener filled in the Plinkr Wegwijzer together with a resident, and the resident is referred to this organisation. The organisation gets this system-triggered mail so that it can contact the resident. It should find the referral, the resident's contact details, the referrer's details and the attached report at a glance. Address the organisation with "u" and "uw", not "je". Also write the crisis variant: a subject line and a banner shown above the mail when the case is flagged as a crisis. Write the full body, greeting to sign-off, with the placeholders left as they are.

## Facts

F1: The Wegwijzer was filled in on a date available as {{check_date_label}}; on the basis of the result the resident is referred to the organisation. (source: plinkr/ffc/lambdas/send-email/index.ts:597)
F2: The greeting addresses the organisation by name: {{organization_name}}. (source: plinkr/ffc/lambdas/send-email/index.ts:596)
F3: The mail lists the resident's name, telephone number and e-mail address under a heading "Gegevens inwoner": {{resident_name}}, {{resident_contact_phone}}, {{resident_contact_email}}. (source: plinkr/ffc/lambdas/send-email/index.ts:599-600)
F4: The mail lists the referrer's name, organisation and e-mail address under a heading "Gegevens toeleider": {{referrer_name}}, {{referrer_organization}}, {{referrer_contact_email}}. (source: plinkr/ffc/lambdas/send-email/index.ts:601-602)
F5: A detailed Wegwijzer report is attached to the mail. (source: plinkr/ffc/lambdas/send-email/index.ts:603)
F6: In a crisis case the subject carries the suffix " [CRISIS]" and a banner appears above the mail; the banner reads "CRISISGEVAL - DIRECTE ACTIE VEREIST". (source: plinkr/ffc/lambdas/send-email/index.ts:654-682)
F7: The report is shared with the organisation only after the resident has agreed to data sharing. (source: plinkr/ffc/frontend/src/lib/post-advice-copy.ts:121)
F8: The mail is signed "Plinkr". (source: plinkr/ffc/lambdas/send-email/index.ts:604)
F9: Organisations are addressed with u/uw in Wegwijzer mails ("naar uw organisatie doorverwezen"). (source: plinkr/ffc/lambdas/send-email/index.ts:597)
F10: The resident receives a separate mail about the same referral, which says the organisation will contact them; the timeframe in that mail comes from the organisation's own configured response time, or reads "binnenkort" when none is set. (source: plinkr/ffc/lambdas/assessments/index.ts:1755-1759)

## Unknown

- The organisation's response time, or any deadline the organisation must meet after receiving the mail.
- What qualifies a case as a crisis, and what "direct action" means in practice for the organisation.
- The resident's preferred contact method (it appears in the resident's mail, not in this one).
- An urgency sentence from the municipality may be shown above the details; its wording is authored by the municipality and unknown.
- Any case or reference number.

## Existing copy

Subject: `Nieuwe doorverwijzing: {{resident_name}}`
Crisis subject: `Nieuwe doorverwijzing: {{resident_name}} [CRISIS]`
Preheader: `Er is een nieuwe inwoner naar uw organisatie doorverwezen`
Title: `Nieuwe doorverwijzing`
Crisis banner: `⚠️ CRISISGEVAL - DIRECTE ACTIE VEREIST`

Body:

```
Beste {{organization_name}},

Op {{check_date_label}} is de Wegwijzer ingevuld. Op basis van de uitkomst is {{resident_name}} naar uw organisatie doorverwezen.

Gegevens inwoner
Naam: {{resident_name}}
Telefoon: {{resident_contact_phone}}
E-mail: {{resident_contact_email}}

Gegevens toeleider
Naam: {{referrer_name}}
Organisatie: {{referrer_organization}}
E-mail: {{referrer_contact_email}}

Een gedetailleerd rapport van de Wegwijzer is als bijlage toegevoegd aan deze e-mail.

Met vriendelijke groet,
Plinkr
```
