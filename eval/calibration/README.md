# Calibration set (protocol section 5)

Built 2026-11-17 for the native-reader calibration. Defect categories come from `defect-bank.md`.

## Files
- `clean.jsonl`: 45 human-written passages. Fields: `id`, `lang`, `source_url`, `snapshot`, `text`.
- `seeded.jsonl`: 18 twins of clean passages, each with exactly one injected defect. Fields: `id` (`<clean id>-s`), `clean_id`, `lang`, `category`, `injected` (the exact inserted or changed span), `text`.

## How they were made
- nl, en and en-dev passages come from Wayback Machine snapshots dated before 2022-11-01 (latest used: 20220217). Snapshots were located with the CDX and availability APIs, fetched raw (`id_` flag) with curl, and converted to text with a small HTML stripper. Each passage is 1-3 consecutive sentences of running copy, 15-70 words, copied exactly (whitespace collapsed). `source_url` is the Wayback URL of the exact snapshot; `snapshot` is its date.
- nl-owner passages are exact strings from `about.ts` and `home.ts` of the owner-approved yuzusake deck (`source_url` is the file path, `snapshot` is 20261112). Lines flagged as drafts in the `home.ts` header (description, pick, stopLabel, lineup, range, club heading) were excluded. `guide.ts` and `bottles.ts` were not used. Several are short UI-style lines under 15 words, as allowed.
- Seeded set: every odd-numbered nl, en and en-dev passage (01, 03, ...). One minimal edit each, no typography defects, no nl-owner seeds.

## Counts
| lang | clean | seeded |
|------|-------|--------|
| nl | 20 | 10 |
| en | 10 | 5 |
| en-dev | 5 | 3 |
| nl-owner | 10 | 0 |

en-dev has 5 passages, so "exactly half" is impossible; alternating gave 3.

## Sites per lang
- nl: coolblue 4, hema 3, bol 3, rijksoverheid 3, ns 2, geldfit 2, amsterdam 2, zalando 1.
- en: gov.uk 4, monzo 3, mailchimp style guide 3 (Mailchimp's other resources page was not needed).
- en-dev: stripe 3, github 2.

## Problems
- zalando.nl/faq: the archived FAQ answer pages were JS-rendered or error pages; only the FAQ index yielded usable prose (1 passage).
- amsterdam.nl/werk-inkomen/hulp-laag-inkomen: the exact URL had no availability result (API timeout); the sibling `hulp-bij-laag-inkomen` section was used instead (2 passages).
- coolblue.nl, bol.com and ns.nl landing pages are client-rendered; passages come from subpages. bol.com `/t/` pages redirect to 2021-2024 snapshots, so `/a/` pages were used.
- Several sources address the reader with "u" (rijksoverheid, ns, amsterdam) and others with "je"; seeded register slips are chosen against each passage's own register.
- Tooling note: the Internet Archive went briefly "Temporarily Offline" several times; requests were retried.
