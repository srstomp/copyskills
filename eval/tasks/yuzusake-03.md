---
id: yuzusake-03
project: yuzusake
set: dev
channel: app
locale: nl-NL
audience: "Nederlandse bezoekers van de yuzusake-webwinkel, volwassenen en mogelijk minderjarigen die de leeftijdscheck zien"
register: je
deliverables:
  - name: empty_heading
    max_chars: 40
  - name: empty_body
    max_chars: 100
  - name: empty_button
    max_chars: 24
  - name: age_question
    max_chars: 40
  - name: age_yes
    max_chars: 24
  - name: age_no
    max_chars: 24
  - name: age_no_line
    max_chars: 120
placeholders: []
target_query: null
replaces: "yuzusake NL deck: glass.ts (empty glass) and kit.ts ageGate (age gate)"
samples: project
---

## Brief

Two screens in the yuzusake web shop. First, the empty state of the cart, which the shop calls "je glas": heading, one line of body and a button. Second, the age gate shown on arrival: the question, the "yes" button, the "no" button and the one line shown after someone answers no. The cart is a glass, and the shop sells alcohol to adults only.

## Facts

F1: The cart is called "your glass" (NL: "je glas"). (source: eval v1 holdout.md H4; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/glass.ts)
F2: The shop sells yuzu drinks; customers must be 18 or older. (source: eval v1 holdout.md H4)
F3: Free delivery from EUR 75 in NL, BE and DE. (source: eval v1 holdout.md H4; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/lib/shipping.ts FREE_FROM_COUNTRIES)
F4: Delivery rates under that: EUR 6,95 NL and BE, EUR 9,95 DE. (source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/lib/shipping.ts SHIPPING_RATES_CENTS)
F5: The site prints no NIX18 line anywhere (owner ruling 2026-11-14). (source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/en/glass.ts comment on ageShort)
F6: The shop sells yuzu sake and, since 2026-11-12, also one alcohol-free yuzu drink (Rock'n Yuzu, 0.0%), so "bottles" is safer than "sake" for the whole shelf. (source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/bottles.ts rockn entry; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/en/about.ts h1 comment)

## Unknown

- How many bottles are on the live shelf (counted at runtime).
- What the shop wants a person under 18 to do next (a link, a "come back later" line): no source.
- Whether the gate offers a remember-me option in the same screen (the shipped gate does, but that line is not part of this task).

## Existing copy

The shipped NL strings, to be treated as unverified input.

Empty glass (/Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/glass.ts):
- title: Je glas
- h1 (one line per entry): Je / glas
- emptyBar: Je glas is leeg · zoek een fles
- meter.empty: Nog niets in je glas.
- emptyNote, several bottles: {N} flessen, van fris tot zoet. Kies er een op de smaakknop.
- find (button): Vind je yuzu

Age gate (/Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/kit.ts ageGate):
- title (one line per entry): Ben je / 18 of / ouder?
- lead: We verkopen yuzusake, daar zit alcohol in.
- yes: Ja, ik ben / 18+
- yesNote: Naar de winkel
- no: Nog / niet
- noNote: Ik ben jonger dan 18
- under (heading after no): Alleen / 18+.
- underLead: yuzusake verkoopt alcohol, dus deze site is voor mensen van 18 jaar en ouder.
