---
id: sakedeal-02
project: sakedeal
set: dev
channel: shop
locale: nl-NL
audience: "Nederlandse kopers die op de naam van deze fles zoeken en willen weten of hij bij ze past"
register: je
deliverables:
  - name: title
    max_chars: 60
  - name: meta
    min_chars: 120
    max_chars: 155
  - name: description
    min_words: 120
    max_words: 160
placeholders: []
target_query: "kaiun honjozo kopen"
replaces: "sakedeal.com/nl/shop/kaiun-honjozo (live NL title, meta description and product description)"
samples: none
---

## Brief

The same product page as sakedeal-01, written natively in Dutch for the Dutch shop (not a translation of an English text). The current title repeats a style template and has no buying intent; the meta description is a template with a typo. The reader searches "kaiun honjozo kopen" and should leave knowing what the sake tastes like, how to serve it and what delivery costs.

## Facts

F1: Kaiun Honjozo. Type: honjozo. 720 ml, 16% ABV. (source: eval v1 tasks.md T1, T2)
F2: Price EUR 22,13 including VAT and excise. (source: eval v1 tasks.md T1)
F3: Brewery: Doi Shuzojo Co., Ltd., brand Kaiun (開運, "to welcome good fortune"), Kakegawa City, Shizuoka. (source: eval v1 tasks.md T1)
F4: Founded 1872. The Doi family has been in Kakegawa for over 500 years. (source: eval v1 tasks.md T1)
F5: Known for clean, soft-water sake made with local rice and Shizuoka aromatic yeasts. (source: eval v1 tasks.md T1)
F6: Second label: Enshunada, sold only in Shizuoka. (source: eval v1 tasks.md T1)
F7: House tasting notes: melon blossom, fresh green apple, steamed rice. Light to medium body. Bone-dry, snappy finish with no lingering sweetness. (source: eval v1 tasks.md T1)
F8: Serving: 15 °C, 20 °C, or warmed to about 40 °C (nurukan). Warm brings out savoury grain notes. (source: eval v1 tasks.md T1)
F9: Food: grilled fish, shio yakitori, prawn tempura, sashimi, edamame, gyoza. (source: eval v1 tasks.md T1)
F10: Shipping: NL and BE EUR 6,95, DE EUR 9,95, free from EUR 75 in NL and BE. 14 days to change your mind. (source: eval v1 tasks.md T1)

## Unknown

- Who the head brewer (toji) is. The live Dutch and English pages name two different people; neither is confirmed. Do not name a toji.
- Rice variety and polishing ratio.
- Whether free shipping applies to Germany (F10 says NL and BE only).

## Existing copy

Live Dutch page, to be treated as unverified input:

Title: Kaiun Honjozo · Honjozo | Sakedeal

Meta: Meloen, witte bloesem en gestoomde rijst, geeft de sake eem strakke, levendige en kurkdroge afdronk.

Description: Meloen, witte bloesem en gestoomde rijst, geeft de sake eem strakke, levendige en kurkdroge afdronk.
