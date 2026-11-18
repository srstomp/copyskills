status: approved
approval: shipped copy, owner approved it as a voice sample on 2026-11-18

# Plinkr voice samples, judge set

Disjoint from generator.md. Paths are relative to /Users/steve/Projects/plinkr. Quoted exactly; trailing spaces dropped.

## Use for the email tasks (plinkr-01, plinkr-02, plinkr-06): resident app strings

Resident-app use is inferred from the namespace (client-onboarding) and the je-form; the repo does not label these strings. None of these strings is replaced by a plinkr task. plinkr-06 is in the u register: judge the plain, direct voice, not the je-form.

1. portal/src/config/translations/nl.json:304-305 (client-onboarding)
   - start_collaboration_title: "2. De beste hulp uit de buurt"
   - start_collaboration_subtitle: "Werk samen met hulpverleners in jouw Plinkr omgeving. Bekijk of je al openstaande uitnodigingen hebt."
2. portal/src/config/translations/nl.json:961-962 (client-onboarding)
   - debts_intro_step_2_title: "Belangrijke documenten"
   - debts_intro_step_2_subtitle: "Deze kun je digitaal opslaan in deze app zodat je ze altijd bij de hand hebt."
3. portal/src/config/translations/nl.json:444-445 (client-onboarding)
   - start_intake_status_title: "Voordat je start..."
   - start_intake_status_subtitle: "Hoe staan jouw geldzaken ervoor? Beantwoord vijf vragen om een goed beeld te schetsen van jouw financiële situatie."

## Use for the app and portal tasks (plinkr-03, plinkr-04, plinkr-05): shipped Wegwijzer mails

Caveat: every resident mail the repo ships (referral, self-handle) is replaced by plinkr-01 and plinkr-02, so none can serve. These passages come from the remaining je-form Wegwijzer mails, the invitation and sign-in mails for Wegwijzer users; they are addressed to staff users, not to residents. The owner should confirm they are fit as voice samples.

4. ffc/lambdas/shared/email/templates.ts:169 and 173 (invitation mail)
   - "Je account voor {municipality} staat klaar."
   - "Klik op de knop hieronder om in te loggen en direct aan de slag te gaan."
5. ffc/lambdas/shared/email/templates.ts:307 (sign-in code mail)
   - "Heb je deze inlogpoging niet zelf gestart? Dan kun je deze e-mail negeren."
