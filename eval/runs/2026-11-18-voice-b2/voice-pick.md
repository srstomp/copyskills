# Voice blind pick

Twelve pairs. Each pair is the same task written twice. For each pair, pick the version that sounds more like the brand: the copy you shipped for that product.

- Judge the voice only: word choice, how the reader is addressed, sentence length, how it opens and ends. Ignore length differences and facts you would correct.
- After `pick:` write `1`, `2`, or `=` when you hear no difference.
- Which version came from which skills is hidden and differs per pair.

## 1. yuzusake, shop (en-GB)

For: English-reading adults 18+ in NL, BE and DE who want a yuzu sake and are choosing between bottles

### Version 1

**description**

Heiwa Yuzu starts with yuzu, turns juicy in the middle and finishes on the bitter peel. Juicy is our taste label for it.

Pour it neat, fridge-cold, in a small glass. That is the best serve. It also works as a highball, one part to two parts soda, which is our house serve, or over one big cube of ice. We'd pick it for a long dinner.

Heiwa Shuzō made it in Kainan City, Wakayama. The brewery was founded in 1928 and is known internationally for its KID brand, launched in 2008. It was named IWC Sake Brewer of the Year in 2019 and 2020. You may find this bottle elsewhere as Tsuru Ume Yuzu, from the brewery's Tsuruume line.

It's 7% alcohol, and the 720 ml bottle pours 14 glasses of 50 ml, €2.34 a glass. Once opened, keep it in the fridge, where it lasts about a month. 18+ only.

**serve_tip**

Pour it neat, fridge-cold, in a small glass.

### Version 2

**description**

Yuzu first. Then a juicy middle, and a bitter peel at the finish.

Heiwa Yuzu is a 7% yuzu sake, best drunk neat and fridge-cold from a small glass. It also makes a good highball, one part sake to two parts soda, which is our house serve. Or pour it over one big cube of ice. Whichever you choose, it suits a long dinner.

It comes from Heiwa Shuzō, a brewery founded in 1928 in Kainan City, Wakayama. Outside Japan, Heiwa is known for its KID brand, launched in 2008. The brewery was named IWC Sake Brewer of the Year in 2019 and 2020. You may also see this bottle sold as Tsuru Ume Yuzu, after the brewery's Tsuruume line. Same sake.

A 720 ml bottle pours 14 glasses of 50 ml, which works out at €2.34 a glass. Once it is open, keep it in the fridge, where it lasts about a month. 18+ only.

**serve_tip**

Neat, fridge-cold, in a small glass. Best with a long dinner.

pick: 

## 2. yuzusake, app (nl-NL)

For: Nederlandse bezoekers van de yuzusake-webwinkel, volwassenen en mogelijk minderjarigen die de leeftijdscheck zien

5 of 7 texts were word-for-word the same in both versions and are left out.

### Version 1

**empty_body**

Zet een fles in je glas. Vanaf € 75 bezorgen we gratis.

**age_no_line**

Deze winkel is voor mensen van 18 jaar en ouder, want we verkopen alcohol.

### Version 2

**empty_body**

Er zit nog niets in. Kies een fles en zet hem in je glas.

**age_no_line**

Deze winkel is alleen voor mensen van 18 jaar en ouder. We verkopen alcohol.

pick: 

## 3. reggy, app (en)

For: A developer integrating the Reggy API who sees these messages in the console or in an API error body

### Version 1

**connectivity_error**

No connection to the Reggy API. Check your network and try again.

**deadline_error**

No answer before the deadline. It may still be processing. Check before you retry.

**outage_error**

The API returned a 5xx with no error body. Try again shortly.

**rate_limit_error**

Daily send quota or rate limit spent. Retry after quotaResetAt.

**byo_credentials_error**

Your own SES credentials could not be resolved, so the send was refused.

**tenant_not_provisioned_error**

The account's SES tenant is still provisioning. Check the console; it clears per account.

**campaign_locked_error**

This campaign has launched. Its content can no longer be changed.

**payment_method_error**

A subscription cannot start without a payment method on file. Add one first.

### Version 2

**connectivity_error**

Could not reach the Reggy API. Check your connection, then retry.

**deadline_error**

Timed out waiting for the API. The request may still be processing; check before retrying.

**outage_error**

The API returned a server error with no details. Retry shortly.

**rate_limit_error**

Daily send quota or rate limit reached. Wait until quotaResetAt, then retry.

**byo_credentials_error**

This account uses its own SES credentials, which could not be resolved. Nothing was sent.

**tenant_not_provisioned_error**

The account's SES tenant is still being provisioned. Domain status not changed. Check the console.

**campaign_locked_error**

This campaign was already launched, so its content cannot be changed.

**payment_method_error**

A subscription cannot start without a payment method on file. Add one and retry.

pick: 

## 4. reggy, email (en)

For: A developer or infrastructure engineer who has added a sending domain to a Reggy workspace and is waiting for its DNS records to verify

4 of 8 texts were word-for-word the same in both versions and are left out.

### Version 1

**subject_pending**

{domain} is still pending

**heading_pending**

{domain} is waiting on DNS records

**body_pending**

{domain} in {workspace} stays pending until its required DNS records resolve. Three record groups are required: domain verification, DKIM and MAIL FROM. DMARC is recommended, not required.

If verification will not complete, check the record names first. Many DNS providers append the zone automatically, so a fully-qualified name ends up as `name.yourdomain.com.yourdomain.com`.

DNS propagation is not instant. Publish every record, then re-run verification; Reggy re-checks on demand.

**body_verified**

The required DNS records for {domain} have resolved. Sends are rejected until a sender address exists on the domain (marked transactional, marketing or both) and an API key with the `emails:send` scope exists.

If you have not published DMARC yet, starting at `p=none` gives you reports without affecting delivery.

### Version 2

**subject_pending**

{domain} is still pending in {workspace}

**heading_pending**

{domain} is waiting on its DNS records

**body_pending**

The status of {domain} stays pending until the required DNS records resolve. Three of the four record groups are required: domain verification, DKIM and MAIL FROM. DMARC is recommended, not required.

If verification will not complete, check the record names first. Many DNS providers append the zone automatically, so a fully-qualified name becomes name.{domain}.{domain}.

DNS propagation is not instant. Publish every record, then re-run verification. Reggy re-checks on demand.

**body_verified**

The DNS records for {domain} resolved, and its status is now active.

Sending still needs two more things: a sender address on {domain} and an API key with the emails:send scope. Sends are rejected until all three exist.

pick: 

## 5. sakedeal, shop (en-GB)

For: English-reading buyers in Europe who searched for this bottle by name and want to know if it suits them

1 of 3 texts were word-for-word the same in both versions and are left out.

### Version 1

**meta**

Kaiun Honjozo is a dry sake with melon blossom and green apple notes. 720 ml, 16%, €22.13 incl. VAT. Delivery to NL, BE and DE from €6.95.

**description**

Melon blossom and fresh green apple, with steamed rice underneath. Kaiun Honjozo has a light to medium body and a bone-dry, snappy finish with no lingering sweetness. Serve it at 15 °C or 20 °C, or warm it to about 40 °C (nurukan), which brings out savoury grain notes. At the table it goes with grilled fish, shio yakitori, prawn tempura, sashimi, edamame and gyoza.

Kaiun (開運) means "to welcome good fortune". The brand belongs to Doi Shuzojo Co., Ltd., founded in 1872 in Kakegawa City, Shizuoka, where the Doi family has been for over 500 years. The brewery is known for clean, soft-water sake made with local rice and Shizuoka aromatic yeasts.

Delivery costs €6.95 to the Netherlands and Belgium, and is free from €75 there. To Germany it costs €9.95. You can return your order within 14 days.

### Version 2

**meta**

Kaiun Honjozo: a dry honjozo from Doi Shuzojo in Shizuoka, with melon blossom and green apple. 720 ml, €22.13. Delivery from €6.95 to NL and BE.

**description**

Melon blossom, fresh green apple and steamed rice. Kaiun Honjozo has a light to medium body and a bone-dry, snappy finish with no lingering sweetness.

Serve it at 15 °C or 20 °C, or warm it to about 40 °C (nurukan), which brings out savoury grain notes. It goes with grilled fish, shio yakitori, prawn tempura, sashimi, edamame and gyoza.

Doi Shuzojo brews it in Kakegawa, Shizuoka, under the Kaiun brand (開運, "to welcome good fortune"). The brewery was founded in 1872, and the Doi family has been in Kakegawa for over 500 years. It is known for clean, soft-water sake made with local rice and aromatic Shizuoka yeasts. Its second label, Enshunada, is sold only in Shizuoka.

Delivery is €6.95 to the Netherlands and Belgium (free from €75) and €9.95 to Germany. You can return it within 14 days.

pick: 

## 6. plinkr, portal (nl-NL)

For: Coaches and other professionals (hulpverleners) who guide residents with money worries in the Plinkr portal

1 of 6 texts were word-for-word the same in both versions and are left out.

### Version 1

**empty_invitations**

Je hebt nog geen inwoners uitgenodigd.

**empty_documents**

Sla documenten en belangrijke brieven digitaal op in de Plinkr-omgeving van de inwoner, zodat je ze bij de hand hebt.

**delete_note_body**

Wil je deze aantekening verwijderen? Je kunt dit niet ongedaan maken.

**delete_note_confirm_button**

Ja, verwijder aantekening

**timeline_onboarding_text**

Op de tijdlijn zie je al je lopende trajecten, met de voortgang per inwoner en per onderwerp in één oogopslag.

### Version 2

**empty_invitations**

Je hebt geen openstaande uitnodigingen aan inwoners.

**empty_documents**

Bewaar documenten en belangrijke brieven digitaal in de Plinkr-omgeving van de inwoner. Zo heb je alles bij de hand, zonder map vol documenten.

**delete_note_body**

Wil je deze aantekening verwijderen? Dit kun je niet ongedaan maken.

**delete_note_confirm_button**

Verwijder aantekening

**timeline_onboarding_text**

In de tijdlijn zie je al je lopende trajecten. De voortgang per inwoner en per onderwerp zie je in één oogopslag.

pick: 

## 7. plinkr, email (nl-NL)

For: Medewerkers van de organisatie waarnaar een inwoner is doorverwezen; zij nemen contact op met de inwoner en lezen formeel, zakelijk en snel

3 of 5 texts were word-for-word the same in both versions and are left out.

### Version 1

**preheader**

Contactgegevens inwoner en toeleider, rapport als bijlage

**body**

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

Het gedetailleerde Wegwijzer-rapport zit als bijlage bij deze e-mail. De inwoner heeft toestemming gegeven om gegevens met u te delen. In een aparte e-mail hebben wij de inwoner laten weten dat uw organisatie contact opneemt.

Met vriendelijke groet,
Plinkr

### Version 2

**preheader**

Contactgegevens van inwoner en toeleider, rapport in de bijlage

**body**

Beste {{organization_name}},

Op {{check_date_label}} is de Wegwijzer ingevuld. Op basis van de uitkomst is {{resident_name}} naar uw organisatie doorverwezen. U kunt contact opnemen via onderstaande gegevens.

Gegevens inwoner
Naam: {{resident_name}}
Telefoon: {{resident_contact_phone}}
E-mail: {{resident_contact_email}}

Gegevens toeleider
Naam: {{referrer_name}}
Organisatie: {{referrer_organization}}
E-mail: {{referrer_contact_email}}

Het gedetailleerde Wegwijzer-rapport zit als bijlage bij deze e-mail. De inwoner heeft toestemming gegeven om het met u te delen.

Met vriendelijke groet,
Plinkr

pick: 

## 8. plinkr, app (nl-NL)

For: Residents with money worries opening the Plinkr app for the first time; plain language matters (the repo sets no language-level rule)

4 of 8 texts were word-for-word the same in both versions and are left out.

### Version 1

**start_description**

Zet je financiën stap voor stap op een rij.

**start_intake_subtitle**

Een rondleiding van 1 minuut, samenwerken met hulpverleners en 5 vragen over je geldzorgen.

**start_collaboration_explainer**

In je Plinkr-omgeving kun je digitaal samenwerken met hulpverleners. Daarvoor geef je een hulpverlener eerst toestemming. Heb je geen hulp meer nodig, dan stop je de samenwerking.

Kijk bij 'uitnodigingen' of je al een bericht hebt.

**success_email_change**

Bevestig je nieuwe e-mailadres met de mail in je nieuwe mailbox.

### Version 2

**start_description**

Je zet je financiën stap voor stap op een rij.

**start_intake_subtitle**

Beantwoord 5 vragen om je geldzorgen te meten. Ze geven een beeld van je financiële situatie.

**start_collaboration_explainer**

In Plinkr kun je digitaal samenwerken met hulpverleners. Een hulpverlener heeft eerst jouw toestemming nodig. Heb je geen hulp meer nodig, dan stop je de samenwerking.

Onder 'uitnodigingen' zie je of je al een bericht hebt.

**success_email_change**

Bevestig je nieuwe e-mailadres via de mail in je nieuwe mailbox.

pick: 

## 9. plinkr, email (nl-NL)

For: Inwoners met geldzorgen wier hulpvraag de hulpverlener die de Wegwijzer met hen invulde zelf verder oppakt; plain language matters (the repo sets no language-level rule)

### Version 1

**subject**

Je Wegwijzer is ingevuld

**preheader**

Zo gaat het verder met je hulpvraag. Het rapport zit in de bijlage.

**body**

Beste {{resident_name}},

Op {{check_date_label}} is de Plinkr Wegwijzer samen met jou ingevuld. Je hulpvraag pakt {{self_handler_name}} zelf met je op. Samen maken jullie een plan om je geldzorgen aan te pakken.

In de bijlage vind je een gedetailleerd rapport van de Wegwijzer.

Je hebt gekozen om alvast te starten met de Plinkr App. Daarvoor krijg je een aparte e-mail met een uitnodiging. Zie je die e-mail niet? Kijk dan ook in je ongewenste mail.

Heb je vragen? Neem dan contact op met {{referrer_name}} van {{referrer_organization}} via {{referrer_email}}.

Met vriendelijke groet,
Team Plinkr

### Version 2

**subject**

Je Plinkr Wegwijzer is ingevuld

**preheader**

Het rapport zit als bijlage in deze e-mail.

**body**

Beste {{resident_name}},

Op {{check_date_label}} is de Plinkr Wegwijzer samen met jou ingevuld. Je hulpvraag pakt {{self_handler_name}} zelf met je op. Jullie maken samen een plan om je geldzorgen aan te pakken.

Heb je ervoor gekozen om alvast te starten met de Plinkr App? Dan krijg je daarvoor een aparte uitnodiging per e-mail. Kijk ook in je ongewenste mail, want daar kan die terechtkomen.

Het gedetailleerde rapport van de Wegwijzer zit als bijlage in deze e-mail.

Heb je vragen? Mail {{referrer_name}} van {{referrer_organization}} via {{referrer_email}}.

Met vriendelijke groet,
Team Plinkr

pick: 

## 10. yuzusake, shop (nl-NL)

For: Nederlandse volwassenen (18+) die op de naam van deze fles zoeken

### Version 1

**description**

Kozaemon Yuzu is yuzusake op een basis van junmai-sake, met vers Japans yuzusap. Eerst komt de yuzuschil, een tikje bitter, daarna wordt het zacht en rond. Je proeft yuzu, grapefruit (de scherpe) en melkzuur (de zachte). De junmai-basis geeft een drogere afdronk waarin de rijst voorop staat.

Schenk hem als highball: één deel op twee delen bruiswater, met veel ijs. Over één groot blokje ijs kan ook, dan opent hij zich naarmate het smelt. Of puur uit de koelkast, bij 5 tot 10 °C, in een klein glas.

Een fles van 500 ml (8,5%) kost € 24,99 en geeft tien glazen van 50 ml: € 2,50 per glas. Eenmaal open bewaar je hem in de koelkast, daar blijft hij ongeveer een maand goed. Vanaf € 75 bezorgen we gratis in NL, BE en DE. Alleen voor 18+.

**meta**

Kozaemon Yuzu kopen: yuzusake met vers yuzusap, fris met een bittere schil. 500 ml voor € 24,99. Gratis bezorgd vanaf € 75 in NL, BE en DE.

### Version 2

**description**

Kozaemon Yuzu is yuzusake op een basis van junmai-sake, met vers Japans yuzusap. Eerst komt de yuzuschil, een tikje bitter, daarna wordt hij zacht en rond. Je proeft yuzu, grapefruit (de scherpe) en melkzuur (de zachte). De junmai-basis geeft een drogere afdronk met rijst voorop. In onze smaakwijzer: Fris.

Het lekkerst als highball: één deel op twee delen bruiswater, veel ijs. Ook goed op één groot ijsblok, dan komt hij los terwijl het smelt. Of puur uit de koelkast, 5 tot 10 °C, in een klein glas. Zijn moment: vrijdag, 17.00 uur.

De fles (500 ml, 8,5%) kost € 24,99 inclusief btw. Dat zijn 10 glazen van 50 ml, € 2,50 per glas. Gratis bezorging vanaf € 75 in Nederland, België en Duitsland. Alleen 18+.

**meta**

Kozaemon Yuzu kopen: fris yuzusake op junmai-basis met vers yuzusap. 500 ml voor € 24,99, gratis bezorging vanaf € 75 in NL, BE en DE.

pick: 

## 11. plinkr, app (nl-NL)

For: Residents with money worries using the Plinkr app, possibly with low digital skill; plain language matters (the repo sets no language-level rule)

1 of 7 texts were word-for-word the same in both versions and are left out.

### Version 1

**empty_invitations**

Je hebt geen openstaande uitnodigingen. Zodra je er een hebt, zie je die hier.

**empty_documents**

Je hebt nog geen documenten. Bewaar hier je belangrijke brieven, dan heb je ze altijd bij de hand.

**error_generic**

Er ging iets mis. Probeer het zo nog een keer.

**error_connection**

De verbinding is weggevallen. Probeer het later nog een keer.

**error_email_change**

Je e-mailadres wijzigen is niet gelukt. Probeer het later nog een keer.

**error_file_open**

We kunnen dit bestand nu niet openen. Probeer het later nog een keer.

### Version 2

**empty_invitations**

Hier zie je je openstaande uitnodigingen. Je hebt er nu geen.

**empty_documents**

Hier bewaar je documenten en belangrijke brieven, zodat je ze altijd bij de hand hebt.

**error_generic**

Er ging iets mis. Probeer het nog eens.

**error_connection**

Er is geen verbinding. Probeer het later nog eens.

**error_email_change**

Je e-mailadres is niet gewijzigd. Probeer het later nog eens.

**error_file_open**

We kunnen dit bestand niet openen. Probeer het later nog eens.

pick: 

## 12. plinkr, email (nl-NL)

For: Inwoners met geldzorgen die samen met een hulpverlener de Wegwijzer hebben ingevuld en zijn doorverwezen; plain language matters (the repo sets no language-level rule)

1 of 3 texts were word-for-word the same in both versions and are left out.

### Version 1

**preheader**

Wat er nu gebeurt en bij wie je terechtkunt met vragen

**body**

Beste {{resident_name}},

Op {{check_date_label}} is de Plinkr Wegwijzer samen met jou ingevuld. Op basis daarvan ben je doorverwezen naar {{organization_name}}.

Wat gebeurt er nu?
- {{contact_timeframe_sentence}}
- {{contact_method_sentence}}
- Daarna plan je samen met {{organization_name}} een eerste afspraak om je situatie te bespreken.
- Samen maak je een plan om je geldzorgen aan te pakken.

Je hebt gekozen om alvast te starten. Daarom krijg je een aparte e-mail met een uitnodiging voor de Plinkr App. Zie je die e-mail niet? Kijk dan ook in je spammap.

Het Wegwijzer-rapport vind je als bijlage bij deze e-mail.

Heb je vragen over je doorverwijzing? Neem dan contact op met {{referrer_name}} van {{referrer_organization}} via {{referrer_email}}.

Met vriendelijke groet,
Team Plinkr

### Version 2

**preheader**

Dit gebeurt er nu. Je Wegwijzer-rapport zit in de bijlage.

**body**

Beste {{resident_name}},

Op {{check_date_label}} heb je samen met je hulpverlener de Plinkr Wegwijzer ingevuld. Op basis daarvan ben je doorverwezen naar {{organization_name}}.

Wat gebeurt er nu?
- {{contact_timeframe_sentence}}
- {{contact_method_sentence}}
- Daarna plannen jullie een eerste afspraak om je situatie te bespreken.
- Samen maken jullie een plan om je geldzorgen aan te pakken.

Je hebt gekozen om alvast te starten met de Plinkr App. Daarvoor krijg je een aparte uitnodiging per e-mail. Die kan in je ongewenste mail terechtkomen, kijk daar dus ook.

Een uitgebreid rapport van de Wegwijzer zit als bijlage bij deze e-mail. {{organization_name}} krijgt het pas als je akkoord hebt gegeven op gegevensdeling.

Heb je vragen over je doorverwijzing? Neem dan contact op met {{referrer_name}} van {{referrer_organization}}, via {{referrer_email}}.

Met vriendelijke groet,
Team Plinkr

pick: 
