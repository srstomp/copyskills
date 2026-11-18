status: approved
approval: shipped copy, owner approved it as a voice sample on 2026-11-18

# Plinkr voice samples, generator set

Disjoint from judge.md. Paths are relative to /Users/steve/Projects/plinkr. Quoted exactly; trailing spaces dropped.

## Use for the email tasks (plinkr-01, plinkr-02, plinkr-06): resident app strings

Resident-app use is inferred from the namespace (client-onboarding) and the je-form; the repo does not label these strings. None of these strings is replaced by a plinkr task. plinkr-06 is in the u register: take the plain, direct voice from these samples, not the je-form.

1. portal/src/config/translations/nl.json:442-443 (client-onboarding)
   - start_tour_intro_title: "Welkom bij Plinkr Platform."
   - start_tour_intro_subtitle: "De digitale tool om je geldzaken op orde te krijgen."
2. portal/src/config/translations/nl.json:963-964 (client-onboarding)
   - debts_intro_step_3_title: "Tip!"
   - debts_intro_step_3_subtitle: "Vul in wat je weet en laat de rest aan jouw hulpverlener over. Jouw hulpverlener helpt je hier graag bij."
3. portal/src/config/translations/nl.json:448-449 (client-onboarding)
   - start_intake_demo2_title: "Je profiel"
   - start_intake_demo2_subtitle: "Je kunt je profiel zelf aanvullen met informatie die je wilt delen."

## Use for the app and portal tasks (plinkr-03, plinkr-04, plinkr-05): shipped Wegwijzer mails

Caveat: every resident mail the repo ships (referral, self-handle) is replaced by plinkr-01 and plinkr-02, so none can serve. These two passages come from the remaining je-form Wegwijzer mails; they are addressed to referrers and staff users, not to residents. The OTP mail is sent to Wegwijzer users, and the owner should confirm it is fit as a voice sample.

4. ffc/lambdas/send-email/index.ts:555 (referrer mail, template "referrer")
   - "Het Wegwijzer-rapport is gedeeld met {{organization_name}}, zodat zij de hulpvraag verder kunnen oppakken. Jij ontvangt het rapport ook als bijlage bij deze e-mail."
5. ffc/lambdas/shared/email/templates.ts:302 and 306 (sign-in code mail)
   - "Voer onderstaande code in op het inlogscherm."
   - "Deel je code nooit met anderen, ook niet met collega's of support."
