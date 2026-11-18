---
id: yuzusake-01
project: yuzusake
set: dev
channel: shop
locale: en-GB
audience: "English-reading adults 18+ in NL, BE and DE who want a yuzu sake and are choosing between bottles"
register: you
deliverables:
  - name: description
    min_words: 130
    max_words: 170
  - name: serve_tip
    max_chars: 120
placeholders: []
target_query: null
replaces: "the Heiwa Yuzu bottle page's own text on yuzusake (about 40 unique words) and its serve line"
samples: project
---

## Brief

Product description for Heiwa Yuzu on yuzusake, a small shop that sells only yuzu drinks and writes in playful, short sentences about taste. The bottle page is thin. The market also sells this bottle as "Tsuru Ume Yuzu", a name that appears nowhere on the site, so the description should mention it naturally. The one-line serve tip must agree with the best serve (neat, fridge-cold), not push soda.

## Facts

F1: Heiwa Yuzu, sold elsewhere as Tsuru Ume Yuzu (Heiwa Shuzō's Tsuruume line). Yuzu sake. (source: eval v1 tasks.md T3)
F2: 7% alcohol, 720 ml, EUR 32,75 including VAT; EUR 2,34 per 50 ml glass, 14 glasses per bottle. (source: eval v1 tasks.md T3; 50 ml pour: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/bottles.ts heiwa entry)
F3: Brewery: Heiwa Shuzō, Kainan City, Wakayama. Founded 1928. (source: eval v1 tasks.md T3; prefecture also in /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/bottles.ts heiwa entry)
F4: Heiwa Shuzō is known internationally for its KID brand, launched 2008, and was named IWC Sake Brewer of the Year in 2019 and 2020. (source: eval v1 tasks.md T3)
F5: The shop's taste label for it is "juicy". Taste: yuzu up front, a juicy middle, a bitter peel finish. (source: eval v1 tasks.md T3; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/en/bottles.ts heiwa notes)
F6: Best serve: neat, fridge-cold, in a small glass. Also good: a highball (1 part to 2 parts soda; the shop's house serve) and on the rocks over one big cube. (source: eval v1 tasks.md T3; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/en/bottles.ts heiwa serves)
F7: The shop's moment for it is a long dinner. (source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/en/bottles.ts heiwa moment)
F8: Once opened, keep it in the fridge; it keeps about a month. 18+ only. (source: eval v1 tasks.md T3)
F9: The shop's other bottles include Kozaemon (sharp), Yoigokochi (sweet) and Hana Awaka (bubbles). (source: eval v1 tasks.md T3; /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/content/bottles.ts lists more bottles than these four)
F10: Free delivery from EUR 75 in NL, BE and DE. (source: /Users/steve/Projects/sakebase/platform/apps/yuzusake/src/lib/shipping.ts FREE_FROM_COUNTRIES)

## Unknown

- Heiwa Shuzō's other products, and how the yuzu is processed.
- Rice variety or polishing ratio of the sake base.
- The number of bottles on the live shelf (counted at runtime; v1 said four, the deck now designs eleven).
- The suggested food pairing for this bottle.

## Existing copy

None quoted: the current bottle page text is thin (about 40 unique words of its own) and was not captured in a source file. Treat it as absent.
