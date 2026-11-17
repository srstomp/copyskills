---
name: commerce-copy
description: "Use when writing or rewriting web-shop copy: product descriptions, category, collection or style page intros, title tags, meta descriptions, About and brand pages, or image alt text, one at a time or as a catalogue batch, in one or more languages. Also turns SEO audit findings into page briefs. Not for ads or landing pages (marketing-copy)."
---

# Commerce Copy

Writes shop copy that helps a buyer choose, from a fact sheet, in each target language, without AI tells or template sameness.

## Overview

Shop copy has one job: tell a buyer what they need to choose this product, or this category, in words that are true and specific to it. It does not use a persuasion framework (no PAS, no AIDA): a product page that "agitates a pain" reads as an advert, and a meta description built on a formula reads like the 120 others built on it. The method is facts first, then plain native writing, then checks.

Three failures this skill exists to prevent:
1. **Invented or conflicting facts.** Two language versions of one page naming different people, an award nobody can source, a tasting note the maker never gave.
2. **Template sameness.** A catalogue where every description or meta follows one skeleton.
3. **Translated copy.** A second language that keeps the first language's sentence order, idiom and punctuation.

## Copy type identification

| Copy type | Reference |
|-----------|-----------|
| Product description, product page sections, serve or pairing notes, image alt text | `references/product-pages.md` |
| Category, collection, style or region page intro and H1 | `references/category-pages.md` |
| Title tags and meta descriptions, single or batch | `references/titles-and-metas.md` |
| About, brand story, team, "who we are" pages | `references/about-pages.md` |
| Turning SEO audit findings into page briefs | `references/audit-to-brief.md` |

Always load as well: `../quality-frameworks/references/anti-slop.md` and, for each target language, `../quality-frameworks/references/locales/<language>.md` (`en`, `nl`, `de`).

## Workflow

### Step 1: Brief and fact sheet

Run `copy-brief` (agent mode when unattended). Commerce work needs these brief fields:
- `locale`: one or more BCP 47 tags (`nl-NL`, `en-GB`, `de-DE`). Each locale is written separately.
- `facts`: the fact sheet, built and checked by `copy-brief` (each fact has an id and a source; conflicts are excluded and become `needs`). Copy that is being rewritten is not a source on its own; see `copy-brief`.
- `seo`: per locale, the target query and the finding being fixed, if the work comes from an audit. Never invent a query or a search volume.
- `deliverables`: each field with its budget (title max 60 characters, meta 120 to 155, description 120 to 160 words, and so on).
- `brand_voice.examples`: approved copy from this shop, in each target language. Without it, write plain and neutral, and say so in `decisions`.

If the request is an SEO audit, first turn it into one brief per page with `references/audit-to-brief.md`.

### Step 2: Choose what this copy says

Before drafting, list from the fact sheet the two or three facts that set this product (or category) apart from its neighbours: a taste, a serve, a method, a place, a maker, a price per glass. The copy is built on those. Facts the page already shows elsewhere (spec table, price box, shipping bar) stay out of the prose unless the deliverable has no other place for them, as in a meta description.

If the fact sheet has nothing that sets the product apart, do not pad to reach a word count. Write less, and return a `needs` item naming the facts that would make the copy specific (for example "tasting notes from the importer" or "how the brewery makes this one").

### Step 3: Draft in each language

For each locale, write in that language from the fact sheet and the locale pack. Do not translate another locale's draft and do not reuse its sentence order or its images. If two locale versions line up sentence by sentence, rewrite the second from the facts. Where the brief gives a target query, use it as the locale pack and `references/titles-and-metas.md` describe.

### Step 4: De-slop pass

Run the pass in `../quality-frameworks/references/anti-slop.md`, with the locale pack, on every field, including its native read (step 4 of that pass). Section D of that file (shop copy) applies to every commerce deliverable.

### Step 5: Checks

Do each check and fix what fails. Repeat Steps 4 and 5 at most twice; after that, return the best version with the open problems listed.
1. **Facts.** Every factual claim in the copy maps to a fact id. No number, name, date, award, method or tasting note that is not on the sheet. Nothing from a fact the brief marks as conflicting. The same claim says the same thing in every locale.
2. **Brief.** Every deliverable is present and inside its budget; the target query sits where `references/titles-and-metas.md` puts it; any finding the brief names (a trade name to add, a contradiction to remove) is fixed.
3. **Batch.** For several items of one kind, read them side by side. No shared opening, no shared sentence frame, no shared closing slot.
4. **Lint.** If the `copydoc` CLI is available, run it per locale: `copydoc lint <file> --locale <locale>`; for titles or metas add `--kind title` or `--kind meta`, and for a batch put one item per line and add `--items lines`; add `--facts <fact sheet file>` to check numbers. Fix every error.

### Step 6: Return

Return the output contract below. Do not return drafts, self-scores or process notes.

## Batch work

For a catalogue batch (many products, many metas), work item by item from each item's own fact row, then check the set as a whole (Step 5.3). A batch is done when no two items could swap their sentence frames. Process large batches in groups of 10 to 20 so each group can be read side by side.

## Evidence gate

Write none of the following unless the fact sheet contains it, with its source: customer reviews, ratings, testimonials, awards, rankings, people's names, titles or credentials, health or effect claims, "best-selling" or stock claims, and comparisons with competitors. Return a `needs` item instead.

For alcohol, also: no claims that drinking improves mood, health, social or sexual success, or performance; nothing aimed at minors. Follow the local advertising code (Netherlands: Reclamecode voor Alcoholhoudende Dranken).

## Output contract

```yaml
copy:
  - locale: nl-NL
    fields:
      title: "..."
      meta: "..."
      description: "..."
claims:            # every factual claim in the copy, with the fact ids it rests on
  - text: "gebrouwen sinds 1872"
    facts: [F3]
needs:             # questions only a human can answer; empty if none
  - "The EN and NL sources name different head brewers (F9, F10). Which is right?"
decisions:         # judgment calls a human may want to overrule
  - "Used je, not u (no voice samples supplied)."
lint:              # per locale: errors and warnings left, or "not run"
  nl-NL: "0 errors, 1 warning (ontdek: kept, the page is a discovery guide)"
open_issues: []    # anything from Step 5 that is still not fixed after two passes
```

## Hard rules

- No fact without a fact id. A missing fact is a `needs` item, never a guess.
- Each locale is written in its own language from the fact sheet, never translated from another locale's draft.
- No persuasion framework, no padding to a word count.
- Batch items must not share a skeleton.
