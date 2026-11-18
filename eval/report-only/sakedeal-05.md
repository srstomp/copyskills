---
id: sakedeal-05
project: sakedeal
set: report
channel: shop
locale: de-DE
audience: "Deutsche Käufer, die nach dem Namen dieser Flasche suchen"
register: Sie
deliverables:
  - name: title
    max_chars: 60
  - name: meta
    min_chars: 120
    max_chars: 155
  - name: description
    min_words: 100
    max_words: 140
placeholders: []
target_query: "Dassai 23 kaufen"
replaces: null
samples: none
---

## Brief

A German product page for Dassai 23 on Sakedeal. The shop ships to Germany but has no German pages and no German voice samples. The reader searches "Dassai 23 kaufen" and should leave knowing what the bottle is, how to serve it and what delivery to Germany costs. Report-only: no keep or revert decision uses German until a German native has checked the readers.

## Facts

F1: Dassai 23 Junmai Daiginjo, 300 ml, 16% ABV. (source: eval v1 holdout.md H2)
F2: Rice: Yamadanishiki, polished to 23% of the grain. (source: eval v1 holdout.md H2)
F3: Serve at about 10 °C. (source: eval v1 holdout.md H2)
F4: Brewery: Asahi Shuzo (renamed DASSAI Inc. in 2025), Iwakuni, Yamaguchi. (source: eval v1 holdout.md H2)
F5: The Dassai brand launched in 1990. The brewery makes only junmai daiginjo, from highly polished Yamadanishiki. (source: eval v1 holdout.md H2)
F6: A second brewery, "Dassai Blue", is in New York's Hudson Valley. (source: eval v1 holdout.md H2)
F7: Shipping to Germany EUR 9,95. (source: eval v1 holdout.md H2)

## Unknown

- Price.
- The German free-shipping threshold.
- Taste notes: none given.
- Whether the German site would address readers as Sie or du (the Sie in this file is an eval setting, not a sourced fact).

## Existing copy

None. (No German page exists.)
