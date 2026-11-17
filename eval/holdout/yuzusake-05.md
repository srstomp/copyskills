---
id: yuzusake-05
project: yuzusake
set: holdout
channel: shop
locale: nl-NL
audience: "Nederlandse volwassenen (18+) die via Google op een yuzusake-flessenpagina terechtkomen"
register: je
deliverables:
  - name: meta-1
    min_chars: 120
    max_chars: 155
  - name: meta-2
    min_chars: 120
    max_chars: 155
  - name: meta-3
    min_chars: 120
    max_chars: 155
  - name: meta-4
    min_chars: 120
    max_chars: 155
placeholders: []
target_query: null
replaces: null
samples: project
---

## Brief

Four meta descriptions, one per bottle page, for yuzusake. They must not share a skeleton: a reader scanning the four results should not see the same sentence frame four times. Each meta is for one bottle; meta-N matches bottle N below.

## Facts

Bottle 1, Kozaemon Yuzu (meta-1):
F1: Taste label "sharp" (NL: "Fris"). 8.5% alcohol, 500 ml, EUR 24,99 including VAT. Made on a junmai base, which gives a drier finish. (source: eval v1 holdout.md H5; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts koz word, base)
F2: Best as a highball, 1 part to 2 parts soda. (source: eval v1 holdout.md H5; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts koz serves)

Bottle 2, Heiwa Yuzu (meta-2):
F3: Taste label "juicy" (NL: "Sappig"). 7% alcohol, 720 ml, EUR 32,75. Bitter peel finish. (source: eval v1 holdout.md H5; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts heiwa word, notes)
F4: Best neat, fridge-cold. Sold elsewhere as Tsuru Ume Yuzu. (source: eval v1 holdout.md H5)

Bottle 3, Yoigokochi Yuzu (meta-3):
F5: Taste label "sweet" (NL: "Zoet"). 7% alcohol, 720 ml, EUR 32,75. (source: eval v1 holdout.md H5; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts ota word)
F6: Best as a highball, 1 part to 2 parts soda. The shop's moment: after dinner. (source: eval v1 holdout.md H5; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts ota serves, moment)

Bottle 4, Hana Awaka Yuzu (meta-4):
F7: Taste label "bubbles" (NL: "Bubbels"). 5% alcohol, 250 ml, EUR 7,38. Sparkling; Ozeki, Hyogo. (source: eval v1 holdout.md H5; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts ozeki word; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/bottles.ts ozeki entry)
F8: Best neat in a flute, no ice. The shop's moment: the toast. (source: eval v1 holdout.md H5; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/bottles.ts ozeki serves, moment)

Shop-wide:
F9: Free delivery from EUR 75 in NL, BE and DE. (source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/lib/shipping.ts FREE_FROM_COUNTRIES)
F10: 18+ only. (source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/nl/home.ts description)

## Unknown

- Brewery facts for bottles 2 and 3 beyond the prefecture (Wakayama; Shiga). Prices come from the old eval and may drift from the live listing.
- Awards, rice or yuzu origin for any bottle.

## Existing copy

None.
