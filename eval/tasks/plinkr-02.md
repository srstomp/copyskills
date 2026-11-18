---
id: plinkr-02
project: plinkr
set: dev
channel: email
locale: nl-NL
audience: "Inwoners met geldzorgen wier hulpvraag de hulpverlener die de Wegwijzer met hen invulde zelf verder oppakt; plain language matters (the repo sets no language-level rule)"
register: je
email_type: transactional
deliverables:
  - name: subject
    max_chars: 60
  - name: preheader
    max_chars: 80
  - name: body
    min_words: 55
    max_words: 110
placeholders: ["{{resident_name}}", "{{check_date_label}}", "{{self_handler_name}}", "{{referrer_name}}", "{{referrer_organization}}", "{{referrer_email}}"]
target_query: null
replaces: "plinkr/ffc/lambdas/send-email/index.ts (resident mail, self-handle case)"
samples: project
---

## Brief

A hulpverlener (toeleider) has filled in the Plinkr Wegwijzer together with a resident and decides to handle the hulpvraag personally instead of referring the resident to an organisation. The resident gets this system-triggered confirmation mail. They should understand that the toeleider continues with them, that the report is attached, and whom to ask if they have questions. No organisation is involved, so the mail must not say that an organisation will make contact, and it must not promise any timeframe. Write the full body, greeting to sign-off, with the placeholders left as they are.

## Facts

F1: The Wegwijzer was filled in together with the resident, on a date available as {{check_date_label}}. (source: plinkr/ffc/lambdas/send-email/index.ts:722)
F2: The toeleider takes the hulpvraag further together with the resident: "pakt jouw hulpvraag verder zelf met je op". There is no referral organisation. (source: plinkr/ffc/lambdas/send-email/index.ts:171-174, 722-724)
F3: The next steps are that the toeleider continues with the resident, and that together they make a plan to tackle the money worries. (source: plinkr/ffc/lambdas/send-email/index.ts:176-180)
F4: {{self_handler_name}} is the toeleider's name; when no name is known it falls back to the phrase "de toeleider", so the value can start with a lowercase word. (source: plinkr/ffc/lambdas/assessments/index.ts:1708-1710; plinkr/ffc/lambdas/send-email/index.ts:702)
F5: The resident can ask questions at {{referrer_name}} of {{referrer_organization}}, at {{referrer_email}}. In this case the referrer is the same person as the toeleider who handles the hulpvraag. (source: plinkr/ffc/lambdas/send-email/index.ts:727; plinkr/ffc/lambdas/assessments/index.ts:1708-1710)
F6: A detailed Wegwijzer report is attached to the mail. (source: plinkr/ffc/lambdas/send-email/index.ts:582)
F7: A resident who chose to start early with the Plinkr App receives a separate invitation by e-mail, which can end up in the spam folder; this block is shown in the self-handle mail too, when the resident made that choice. In this task the resident made that choice. (source: plinkr/ffc/lambdas/send-email/index.ts:750-757)
F8: The mail is signed "Team Plinkr". (source: plinkr/ffc/lambdas/send-email/index.ts:585)
F9: The code requires this copy to stay truthful: it must never claim an organisation will make contact within a number of working days. (source: plinkr/ffc/lambdas/send-email/index.ts:697-700; plinkr/ffc/lambdas/send-email/index.ts:171-175)

## Unknown

- When the toeleider will contact the resident or how (no timeframe or contact method exists for this route).
- Which organisation the toeleider works for beyond the {{referrer_organization}} value.
- App store names or links for the Plinkr App.
- Whether the resident can reply to this mail.

## Existing copy

Subject: `Bedankt! We gaan aan de slag - Wegwijzer`
Preheader: `We gaan met je hulpvraag aan de slag`
Title: `Bedankt! We gaan aan de slag.`

Body (the invitation block "Alvast starten met je geldzaken" shown; in the code the toeleider's name is interpolated where {{self_handler_name}} stands here):

```
Beste {{resident_name}},

Op {{check_date_label}} is samen met jou de Plinkr Wegwijzer ingevuld. {{self_handler_name}} pakt jouw hulpvraag verder zelf met je op.

Wat gebeurt er nu?
- {{self_handler_name}} pakt jouw hulpvraag samen met jou verder op.
- Jullie maken samen een plan om je geldzorgen aan te pakken.

Alvast starten met je geldzaken
Mocht je ervoor hebben gekozen om alvast aan de slag te gaan met het in kaart brengen van je geldzaken, dan ontvang je hiervoor een aparte uitnodiging voor de Plinkr App per e-mail. Let op: deze e-mail kan in je ongewenste mail terechtkomen.

Een gedetailleerd rapport van de Wegwijzer is als bijlage toegevoegd aan deze e-mail.

Heb je vragen? Neem dan contact op met {{referrer_name}} van {{referrer_organization}} via {{referrer_email}}.

Met vriendelijke groet,
Team Plinkr
```
