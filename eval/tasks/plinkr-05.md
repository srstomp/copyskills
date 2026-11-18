---
id: plinkr-05
project: plinkr
set: dev
channel: portal
locale: nl-NL
audience: "Coaches and other professionals (hulpverleners) who guide residents with money worries in the Plinkr portal"
register: je
deliverables:
  - name: empty_invitations
    max_chars: 70
  - name: empty_documents
    max_chars: 160
  - name: toast_resident_invited
    max_chars: 40
  - name: delete_note_body
    max_chars: 110
  - name: delete_note_confirm_button
    max_chars: 30
  - name: timeline_onboarding_text
    max_chars: 180
placeholders: []
target_query: null
replaces: "plinkr/portal/src/config/translations/nl.json (keys empty_inactive_clients_body, empty_documents_body, success_create_invite, modal_platform_budget_delete_note_body, button_platform_budget_delete_submit, project_timeline_overview_onboarding_step1_description)"
samples: project
---

## Brief

Microcopy for the professional side of Plinkr: an empty state for invitations, an empty state for documents, one confirmation after inviting a resident, a delete confirmation for a note and a short text in the onboarding of the new timeline. The professional is addressed with "je". The person being helped is called "inwoner" in these strings, not "cliënt" or "deelnemer". The delete confirmation and its button must use the same word for the thing that is deleted, and that word must match "aantekening" or "notitie" consistently across the two strings.

## Facts

F1: The portal is a web application for Plinkr coaches, Dutch only. (source: plinkr/portal/README.md:1)
F2: Professionals send invitations to residents; the empty state for the invitation list sits under the heading "Uitgenodigd". (source: plinkr/portal/src/config/translations/nl.json:1071)
F3: In a resident's Plinkr environment a professional can store documents and important letters digitally; the existing copy contrasts "een map vol documenten" with having everything digitally at hand. (source: plinkr/portal/src/config/translations/nl.json:1078)
F4: Notes ("aantekeningen" or "notities") record agreements or remarks in a resident's budget plan or debt overview. The repo uses both words: "notitie" in namespace "default", "aantekening" in namespace "geldfit-web-coach". (source: plinkr/portal/src/config/translations/nl.json:264-267, 1473-1474)
F5: Deleting a note cannot be undone. (source: plinkr/portal/src/config/translations/nl.json:265, 1474)
F6: The new timeline gives a professional an overview of all running trajectories (trajecten), with progress per participant and per topic at a glance. (source: plinkr/portal/src/config/translations/nl.json:2517)
F7: Inviting a resident is the action behind the toast; the same screen also has an error "Er ging iets mis met het uitnodigen van de cliënt". (source: plinkr/portal/src/config/translations/nl.json:1182, 1208)
F8: Terminology found in the portal strings: "inwoner", "cliënt", "deelnemer", "hulpverlener", "traject". (source: plinkr/portal/src/config/translations/nl.json:1074-1076, 1182, 2517)

## Unknown

- Which term the product owner wants (inwoner, deelnemer or cliënt); the writer should pick "inwoner" and say so in a note.
- What the invitation does after being sent (what the resident receives).
- Which screen the timeline onboarding step appears on and its title ("Welkom in de nieuwe tijdlijn" exists).
- The exact name of the button that adds a debt or budget item.

## Existing copy

Quoted exactly from plinkr/portal/src/config/translations/nl.json:

- `empty_inactive_clients_body` (line 1072, namespace "default"): "Je hebt geen openstaande uitnodigingen"
- `empty_documents_body` (line 1078, namespace "default"): "Sla documenten en belangrijke brieven veilig op in de Plinkr-omgeving van de inwoner. Van sjouwen met een map vol documenten, naar alle informatie digitaal bij de hand."
- `success_create_invite` (line 1182, namespace "default"): "Cliënt succesvol uitgenodigd"
- `modal_platform_budget_delete_note_body` (line 265, namespace "geldfit-web-coach"): "Wil je deze aantekening verwijderen? Deze actie kan niet ongedaan worden gemaakt."
- `button_platform_budget_delete_submit` (line 267, namespace "geldfit-web-coach"): "Ja, verwijder aantekening"
- `project_timeline_overview_onboarding_step1_description` (line 2517, namespace "default"): "De tijdlijn geeft je voortaan een overzicht van al je lopende trajecten. Je ziet de voortgang per deelnemer en per onderwerp in één oogopslag."
