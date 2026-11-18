---
id: yuzusake-02
project: yuzusake
set: dev
channel: shop
locale: nl-NL
audience: "Nederlandse volwassenen (18+) die op de naam van deze fles zoeken"
register: je
deliverables:
  - name: description
    min_words: 100
    max_words: 140
  - name: meta
    min_chars: 120
    max_chars: 155
placeholders: []
target_query: "kozaemon yuzu kopen"
replaces: "the Kozaemon Yuzu bottle page's description and meta description on yuzusake (NL)"
samples: project
---

## Brief

Product description and meta description for Kozaemon Yuzu on yuzusake, a small shop that sells only yuzu drinks and writes in playful, short sentences about taste. The reader arrives from a search for "kozaemon yuzu kopen" and should know what the bottle tastes like, how to serve it, what it costs and that delivery can be free.

## Facts

F1: Kozaemon Yuzu: yuzu sake made on a junmai sake base, with fresh Japanese yuzu juice. The junmai base gives a drier, rice-forward finish. (source: eval v1 holdout.md H1; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts koz base)
F2: The shop's taste label is "sharp" (NL: "Fris"). (source: eval v1 holdout.md H1; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts koz word)
F3: Taste: the yuzu peel comes first, a little bitter, then it turns soft and round. Taste notes: yuzu (fresh juice), grapefruit (the sharp one), lactic (the soft one). (source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts koz notes)
F4: 8.5% alcohol, 500 ml, EUR 24,99 including VAT. 10 glasses of 50 ml, EUR 2,50 per glass. (source: eval v1 holdout.md H1)
F5: Best serve: highball, 1 part to 2 parts soda, lots of ice. Also good: on the rocks over one big cube (it opens up as the ice melts), or neat from the fridge at 5-10 °C in a small glass. (source: eval v1 holdout.md H1; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts koz serves)
F6: The shop's moment for it: Friday, 17:00. (source: eval v1 holdout.md H1; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts koz moment)
F7: Brewery: Nakashima Jōzō (Kozaemon), Gifu. (source: eval v1 holdout.md H1; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/bottles.ts koz entry)
F8: Serve yuzu sake at 5-10 °C. Once opened keep it in the fridge; it keeps about a month. 18+ only. (source: eval v1 holdout.md H1)
F9: Free delivery from EUR 75 in NL, BE and DE. (source: eval v1 holdout.md H1; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/lib/shipping.ts FREE_FROM_COUNTRIES)

## Unknown

- Any other brewery fact (founding year, brewing method, yuzu origin) beyond F7.
- Rice variety and polishing ratio.
- The alcohol strength is quoted from the old eval; `content/bottles.ts` shows "9%" only inside a comment example for the eyebrow. Prices and strength come from the live listing and may differ.
- Awards.

## Existing copy

None quoted: the current page text was not captured in a source file. Treat it as absent.
