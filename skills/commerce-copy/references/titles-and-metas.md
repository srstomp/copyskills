# Title Tags and Meta Descriptions

## Title tags

- **Budget:** at most 60 characters including spaces and the brand. Search engines cut by pixel width, so 60 is a safe ceiling, not a target.
- **Order:** the thing the page is about first, the brand last: "Kaiun Honjozo kopen | Shopnaam".
- **Buying words per market:** for a transactional query the brief gives ("sake kopen", "Sake kaufen"), put the query in the title as searchers type it. Do not translate a query into another language's title; use the one the brief gives for that locale. Do not add "buy" in English unless the brief's query has it.
- **One idea:** no "Buy X | X Sake | X Online | Shop". Do not repeat the style or category when the name already contains it ("Kaiun Honjozo · Honjozo").
- **Unique** across the site. In a batch, the shared part is only the brand suffix.

## Meta descriptions

- **Budget:** 120 to 155 characters unless the brief says otherwise. Over 160 is cut off.
- **Content:** what the page offers this searcher, from its own facts: the product and the one or two facts that set it apart, plus a practical fact if it helps (price, size, delivery). It is not read as copy on the page, so key specs may appear here.
- **Not a question opener** ("Looking for umeshu?"), not the title repeated, not a stock call to action ("Shop now!", "Order today!") tacked on.
- **Language:** written in the locale's language from the facts, like any other field.

## Batches: avoiding the skeleton

A catalogue of metas built on one frame ("X is a [style] from [region]. Tastes [a], [b] and [c]. [size], [ABV].") is the most common SEO audit finding for shop copy. Each meta reads fine; the set reads as generated, and search engines see near-duplicates.

For a batch:
1. For each item, pick its **angle**: the single strongest fact on its own row. Different items will have different angles: a method (yamahai, unfiltered), a serve (warm, over ice), a place (snow country, a mountain spring), a rice and polishing ratio, a maker's age or story, a taste.
2. Open each meta with its angle or with the product name, and let the sentence shape follow the angle. Do not give every item the same slot order (name, origin, taste, specs, serve).
3. Do not end every item on the same slot (all on serving temperature, all on price).
4. Read the set side by side, then lint it: one meta per line, `copydoc lint metas.txt --items lines --kind meta --locale <locale>`. The `skeleton` and `opener` errors name the shared frames.

Example (three items, different angles):
> Dassai 23: Yamadanishiki rice polished down to 23%, from Asahi Shuzo in Iwakuni. 300 ml at 16%; serve at about 10 °C.
> Brewed at the foot of Mt. Hakkai in snowy Niigata, Hakkaisan Tokubetsu Junmai is light and restrained. Good cold, at room temperature or warm.
> Tengumai Yamahai is made the slow, traditional yamahai way: a junmai with medium body that you can drink at room temperature or hot.
