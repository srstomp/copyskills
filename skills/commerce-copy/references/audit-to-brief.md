# From SEO Audit to Copy Briefs

Use when the input is an SEO audit (a report, an action plan, a findings file such as claude-seo's `audit-data.json` or `ACTION-PLAN.md`, or a pasted list) and the task is to write or fix the copy it points at.

## Step 1: Keep only the copy findings

An audit mixes technical, data and copy work. Copy work is anything a writer changes in words on the page:
- Title tags and meta descriptions (missing, too long, templated, missing buying intent).
- Thin product, category or About pages; missing category or style pages.
- Duplicate or near-duplicate copy across pages or locales.
- Contradictions between pages or between language versions.
- Names buyers search for that the page does not use (trade names, alternative spellings).
- Missing people, credentials and trust facts on About or content pages.
- Headings that do not say what the page is.

Leave out structured data, redirects, canonicals, speed, crawler rules and pricing logic. List them in `decisions` as "not copy" if the audit put them in the same item.

## Step 2: One brief per page and locale

For each page the findings touch, write a brief with:

```yaml
page: /nl/shop/kaiun-honjozo
locale: nl-NL
findings:            # quote the audit
  - "Product titles repeat the style and carry no buying keyword"
  - "EN and NL contradict each other on the head brewer"
seo:
  query: "kaiun honjozo kopen"   # only from the audit or a human; never invented
deliverables:
  title: { max_chars: 60 }
  meta: { min_chars: 120, max_chars: 155 }
  description: { words: "120-160" }
facts: [...]          # built by copy-brief from the catalogue data and approved sources
needs: [...]          # facts the copy requires that nobody has supplied yet
```

Group pages of the same kind (all product metas, all style intros) into one batch so they can be checked side by side.

## Step 3: Separate what the writer can fix from what a human must supply

Some findings cannot be fixed by writing: a contradiction between two sources needs someone to say which is right; an About page needs real names; a "thin" page may need tasting notes nobody has written down yet. Put these in `needs` at the top of the batch, before any copy, so the human sees them first. Write the copy that the facts allow, and leave the rest out rather than filling it.

## What not to take from an audit

- **Word counts** are coverage floors, not quotas. Meet them with more true facts or not at all.
- **Keyword lists** are not a script. Use the target query where `titles-and-metas.md` puts it; never repeat it to raise density.
- **Search volumes and queries** come from the audit or a human. If the audit names no query for a locale, ask in `needs`; do not translate another locale's query.
- **Competitor copy** quoted in the audit is evidence of what buyers search for, not text to imitate.
