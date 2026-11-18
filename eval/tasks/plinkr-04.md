---
id: plinkr-04
project: plinkr
set: dev
channel: app
locale: nl-NL
audience: "Residents with money worries opening the Plinkr app for the first time; plain language matters (the repo sets no language-level rule)"
register: je
deliverables:
  - name: welcome_morning
    max_chars: 40
  - name: start_title
    max_chars: 40
  - name: start_description
    max_chars: 80
  - name: start_intake_subtitle
    max_chars: 110
  - name: start_collaboration_explainer
    max_chars: 260
  - name: start_button
    max_chars: 15
  - name: success_password_changed
    max_chars: 50
  - name: success_email_change
    max_chars: 100
placeholders: ["{{firstName}}"]
target_query: null
replaces: "plinkr/portal/src/config/translations/nl.json (keys welcome_morning, start_title, start_description, start_intake_subtitle, start_intake_demo1_subtitle, income_intro_button_label, success_update_password, success_update_email)"
samples: project
---

## Brief

Microcopy for the first minutes of a resident in the Plinkr app: the greeting, the start screen, the explanation of working together with a hulpverlener, the button that begins the budget plan, and two confirmations after account changes. The resident should know what the app is for, what the first steps are and that they are in control of who may help. Greeting and welcome strings stay short. "start_collaboration_explainer" is the longer explanation and may use two short paragraphs. Keep one term for the professional ("hulpverlener").

## Facts

F1: The start screen is about the resident's money matters ("geldzaken") and sorting their finances step by step. (source: plinkr/portal/src/config/translations/nl.json:271, 291)
F2: The first flow has three parts: a short tour of how the app works (1 minute), working together with hulpverleners, and a set of 5 questions to measure money worries. (source: plinkr/portal/src/config/translations/nl.json:301-309)
F3: The 5 questions give a picture of the resident's financial situation. (source: plinkr/portal/src/config/translations/nl.json:445)
F4: In the Plinkr environment the resident can digitally collaborate with hulpverleners; a hulpverlener first needs the resident's permission; the resident can stop a collaboration when no help is needed anymore. (source: plinkr/portal/src/config/translations/nl.json:447)
F5: The resident can check under "uitnodigingen" whether they already received a message. (source: plinkr/portal/src/config/translations/nl.json:447)
F6: The resident can complete their profile with information they choose to share. (source: plinkr/portal/src/config/translations/nl.json:449)
F7: The budget plan has 9 parts (income, living, mobile/TV, insurance, travel, leisure, budgets, expenses, debts); each part has an intro with a start button. (source: plinkr/portal/src/config/translations/nl.json:272-280, 870)
F8: The greeting depends on the time of day and uses the first name through the placeholder {{firstName}}; the morning variant is the one to write. (source: plinkr/portal/src/config/translations/nl.json:1008-1010)
F9: A resident can change their password and their e-mail address; after an e-mail change the new address must be confirmed through a mail in the new mailbox. (source: plinkr/portal/src/config/translations/nl.json:1183, 1185)
F10: The Dutch app uses je/jij toward residents. (source: plinkr/portal/src/config/translations/nl.json:271, 291, 308)

## Unknown

- How long the 5 questions take, and what the app does with the answers beyond "measure money worries".
- Which screen shows the greeting and whether an emoji is used in the final UI.
- What a resident sees after starting a budget part.
- Whether the password or e-mail confirmations appear as toasts or inline.

## Existing copy

Quoted exactly from plinkr/portal/src/config/translations/nl.json (namespace "client-onboarding" for the start_ and income_ keys, namespace "default" for the others; resident use is inferred, not stated in the file):

- `welcome_morning` (line 1008): "Goedemorgen {{firstName}} 👋"
- `start_title` (line 271): "Aan de slag met je geldzaken"
- `start_description` (line 291): "Zet je financiën stap voor stap op een rij."
- `start_intake_subtitle` (line 308): "Beantwoord 5 vragen om je geldzorgen te meten. Hier gaan we mee aan de slag!"
- `start_intake_demo1_subtitle` (line 447): "In je Plinkr omgeving kun je digitaal samenwerken met hulpverleners. Daarvoor geef je een hulpverlener eerst toestemming. Heb je geen hulp meer nodig? Dan kun je een samenwerking weer stopzetten.\n\nGa naar 'uitnodigingen' om te kijken of je al een bericht hebt ontvangen. "
- `income_intro_button_label` (line 870, repeated for all 9 parts): "Starten"
- `success_update_password` (line 1183): "Je wachtwoord is gewijzigd."
- `success_update_email` (line 1185): "Succes! Bevestig je nieuwe e-mailadres in je nieuwe mailbox"
