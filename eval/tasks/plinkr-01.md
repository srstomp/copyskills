---
id: plinkr-01
project: plinkr
set: dev
channel: email
locale: nl-NL
audience: "Inwoners met geldzorgen die samen met een hulpverlener de Wegwijzer hebben ingevuld en zijn doorverwezen; plain language matters (the repo sets no language-level rule)"
register: je
email_type: transactional
deliverables:
  - name: subject
    max_chars: 60
  - name: preheader
    max_chars: 80
  - name: body
    min_words: 80
    max_words: 150
placeholders: ["{{resident_name}}", "{{organization_name}}", "{{check_date_label}}", "{{contact_timeframe_sentence}}", "{{contact_method_sentence}}", "{{referrer_name}}", "{{referrer_organization}}", "{{referrer_email}}"]
target_query: null
replaces: "plinkr/ffc/lambdas/send-email/index.ts (resident mail, referral case)"
samples: pending-owner-approval
---

## Brief

A hulpverlener (the referrer) has just filled in the Plinkr Wegwijzer together with a resident, and on the basis of the result the resident is referred to an organisation. The resident gets this system-triggered confirmation mail right after. They should understand that the referral is made, what happens next, that the report is attached, that an invitation for the Plinkr App may arrive separately, and whom to ask if they have questions. In this case the resident chose to start early with the Plinkr App, so the "alvast starten" part is included. Write the full body, greeting to sign-off, with the placeholders left as they are.

## Facts

F1: The Wegwijzer was filled in together with the resident, on a date available as {{check_date_label}} (example value: "Donderdag 22 apr 2026"). (source: plinkr/ffc/lambdas/send-email/index.ts:737; plinkr/ffc/lambdas/send-email/__fixtures__/no-urgency-inputs.json:24)
F2: On the basis of the Wegwijzer the resident is referred to the organisation {{organization_name}}. (source: plinkr/ffc/lambdas/send-email/index.ts:737)
F3: The sentence about when the organisation makes contact arrives ready-made as {{contact_timeframe_sentence}}, for example "Stichting Hulp neemt binnen <aantal> werkdagen contact met je op." It is built from the organisation's own response time, or reads "{organisation} neemt binnenkort contact met je op." when none is set. The mail itself must not state a number of days. (source: plinkr/ffc/lambdas/assessments/index.ts:1755-1759; plinkr/ffc/lambdas/send-email/__fixtures__/no-urgency-inputs.json:11)
F4: The preferred contact method arrives ready-made as {{contact_method_sentence}}, for example "De voorkeur contactwijze is: telefoon." or "De voorkeur voor contactwijze wordt dan bepaald." (source: plinkr/ffc/lambdas/assessments/index.ts:1760-1764)
F5: After that contact, the organisation and the resident plan a first appointment to discuss the situation, and together make a plan to tackle the money worries. (source: plinkr/ffc/lambdas/send-email/index.ts:161-162)
F6: A resident who chose to start early receives a separate invitation to the Plinkr App by e-mail; that mail can end up in the spam folder. (source: plinkr/ffc/lambdas/send-email/index.ts:750-757)
F7: A detailed Wegwijzer report is attached to the mail. (source: plinkr/ffc/lambdas/send-email/index.ts:582)
F8: For questions about the referral the resident contacts the referrer: {{referrer_name}} of {{referrer_organization}}, at {{referrer_email}}. (source: plinkr/ffc/lambdas/send-email/index.ts:740)
F9: The mail is signed "Team Plinkr". (source: plinkr/ffc/lambdas/send-email/index.ts:585)
F10: The report is shared with the organisation only after the resident has agreed to data sharing ("Na akkoord op gegevensdeling wordt het verslag gedeeld met ..."). (source: plinkr/ffc/frontend/src/lib/post-advice-copy.ts:121)
F11: Resident-facing Plinkr copy addresses the reader as je/jij, and calls the person "inwoner" in the product's own terms. (source: plinkr/portal/src/config/translations/nl.json:271)

## Unknown

- How many days an organisation takes to respond (it comes only through the placeholder).
- App store names, download links or the sender of the Plinkr App invitation mail; the repo's app links are placeholders.
- What the report contains in detail and how long the resident can access it.
- Whether the resident can reply to this mail (Reply-To is info@plinkr.nl, but no policy is stated).
- Any phone number of the organisation.

## Existing copy

Subject: `Bedankt! We gaan aan de slag - {{organization_name}}`
Preheader: `Je bent doorverwezen naar {{organization_name}}`
Title: `Bedankt! We gaan aan de slag.`

Body:

```
Beste {{resident_name}},

Op {{check_date_label}} is samen met jou de Plinkr Wegwijzer ingevuld. Op basis daarvan ben je doorverwezen naar {{organization_name}}.

Wat gebeurt er nu?
- {{contact_timeframe_sentence}}
- {{contact_method_sentence}}
- Daarna plannen jullie een eerste afspraak om je situatie te bespreken.
- Samen maken jullie een plan om je geldzorgen aan te pakken.

Alvast starten met je geldzaken
Mocht je ervoor hebben gekozen om alvast aan de slag te gaan met het in kaart brengen van je geldzaken, dan ontvang je hiervoor een aparte uitnodiging voor de Plinkr App per e-mail. Let op: deze e-mail kan in je ongewenste mail terechtkomen.

Een gedetailleerd rapport van de Wegwijzer is als bijlage toegevoegd aan deze e-mail.

Heb je vragen over je doorverwijzing? Neem dan contact op met {{referrer_name}} van {{referrer_organization}} via {{referrer_email}}.

Met vriendelijke groet,
Team Plinkr
```
