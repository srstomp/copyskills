---
id: plinkr-03
project: plinkr
set: dev
channel: app
locale: nl-NL
audience: "Residents with money worries using the Plinkr app, possibly with low digital skill; plain language matters (the repo sets no language-level rule)"
register: je
deliverables:
  - name: empty_invitations
    max_chars: 90
  - name: empty_documents
    max_chars: 110
  - name: error_generic
    max_chars: 90
  - name: error_connection
    max_chars: 90
  - name: error_email_change
    max_chars: 90
  - name: error_file_open
    max_chars: 90
  - name: error_number_only
    max_chars: 60
placeholders: []
target_query: null
replaces: "plinkr/portal/src/config/translations/nl.json (keys error_generic_long, error_fetch_network_generic, error_email_update, error_file_generic, error_number_generic)"
samples: pending-owner-approval
---

## Brief

Microcopy for the resident side of the Plinkr app: two empty states and five error messages. An empty state tells the resident what belongs on the screen and what they can do. An error says what happened and what to do next, without blaming the resident and without jargon. Each string is one self-contained line. The strings must use "je" consistently and one term for the professional ("hulpverlener").

## Facts

F1: In the Plinkr environment a resident can digitally collaborate with hulpverleners, after giving a hulpverlener permission first; the resident can stop a collaboration again. (source: plinkr/portal/src/config/translations/nl.json:447)
F2: The resident can see whether they already have open invitations under "uitnodigingen". (source: plinkr/portal/src/config/translations/nl.json:305, 447)
F3: A resident can store documents and important letters digitally in the app, so they always have them at hand. (source: plinkr/portal/src/config/translations/nl.json:962)
F4: The word for the professional in resident-facing strings is "hulpverlener". (source: plinkr/portal/src/config/translations/nl.json:305, 447, 964)
F5: Some app fields accept only a number; the current message asks the resident to enter only the number. (source: plinkr/portal/src/config/translations/nl.json:1201)
F6: Changing the e-mail address is something a resident can do, and the app sends a mail to confirm the new address in the new mailbox. (source: plinkr/portal/src/config/translations/nl.json:1185, 1197)
F7: The Dutch app uses je/jij toward residents. (source: plinkr/portal/src/config/translations/nl.json:271, 291, 308)

## Unknown

- Where in the app the empty-document and empty-invitation states appear, and their titles.
- Whether a retry button exists on error screens.
- A helpdesk path inside the app (the website names https://help.plinkr.nl/ and info@plinkr.nl, but no app screen is sourced).
- Technical causes of the errors; the writer must not name any.

## Existing copy

Quoted exactly from plinkr/portal/src/config/translations/nl.json, namespace "default" (resident use is inferred, not stated in the file):

- `error_generic_long` (line 1199): "Er is iets mis gegaan. Laad de pagina opnieuw en probeer het nog eens."
- `error_fetch_network_generic` (line 1255): "De verbinding is verloren. Probeer het later opnieuw."
- `error_email_update` (line 1197): "Er is iets mis gegaan met het wijzigen van je e-mailadres. Probeer het later opnieuw."
- `error_file_generic` (line 1200): "Er is iets mis gegaan bij het openen van dit bestand. Probeer het later opnieuw"
- `error_number_generic` (line 1201): "Vul hier alleen het getal in."

No existing copy for the two empty states (the repo's documents empty state, `empty_documents_body`, is written for a professional and is rewritten in plinkr-05).
