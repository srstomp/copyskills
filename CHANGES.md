# Skill Review Changes

Review of all 15 SKILL.md files against skill best practices: trigger-optimized descriptions, clear scope boundaries, consistent cross-skill contracts, no contradictions. Reference files, agents, and commands were read and verified but needed no edits (all cross-referenced files exist; the "26 fill-in templates" claim in headline-formulas matches proven-patterns.md; four-us.md scoring matches the "3 of 4 score 2+" rule cited by domain skills).

## Cross-cutting fixes

| Fix | Why | Applied to |
|-----|-----|-----------|
| Descriptions rewritten to lead with "Use when" + user-said keywords; workflow summaries removed | Descriptions that summarize process cause agents to follow the description instead of reading the skill; triggers belong up front | All 15 skills |
| "Layer 1 skills" replaced with named skills (persuasion-frameworks, quality-frameworks, headline-formulas) | "Layer 1" is defined only in the README; a skill loaded standalone had no way to resolve it | marketing, email, editorial, sales, conversion |
| Step 6 rubric column "Threshold" renamed "Target", "Must be 7+" cells simplified, and one sentence added naming the actual hard gates | Table claimed every dimension was a hard requirement while the enforcement rule only gated AI-Tell and Overall (plus per-skill extras); contradiction resolved in favor of the canonical rule in quality-frameworks | 8 domain skills |
| Revision cap of 2 passes added to Step 6 | "Do not return copy that fails the threshold" had no exit condition, contradicting copy-workflow's hard 2-cycle cap and its flags contract | 8 domain skills |

## Routing reconciliation (skills + @copydoc/core)

The SKILL.md routing tables and `routeToDomain()` in `packages/core/src/frameworks.ts` disagreed: the docs listed marketing-copy first while the code checks it last, the code sent "LinkedIn ad" to social-copy while marketing-copy owns the `ad-linkedin` sub-type, and the code sent "LinkedIn thought leadership post" to editorial-copy. Both sides now implement the same rules:

- Ad rule, checked first: "ad"/"ads"/"advertisement" as a standalone word routes to marketing-copy, even when a platform is named. LinkedIn ad is marketing copy; LinkedIn post is social copy.
- Row order: email, ux, social, editorial, sales, brand, conversion, marketing (last, most generic keywords). Social now precedes editorial in the code so a named platform beats topic keywords.
- "sales email" belongs to email-copy (the code already decided this; the doc tables now drop the unreachable sales-copy row entry and say so).
- Keyword gaps closed in the code: re-engagement, transactional (email); tweet, caption (social); opinion piece, long-form content (editorial); voice profile, tagline, elevator pitch (brand); sign-up, funnel (conversion); sales page kept in marketing.
- 15 regression tests added pinning the ad rule, platform-beats-topic ordering, and the documented keywords.

## Per-skill changes

| Skill | What changed | Why |
|-------|-------------|-----|
| copy-workflow | Description no longer summarizes the 8-step pipeline; routing table reordered to mirror routeToDomain() with the ad rule stated up front; checkpoint wording clarified ("on by default", not "optional and active") | Docs and implementation routed the same inputs to different skills (see Routing reconciliation) |
| copy-brief | Description rewritten: triggers instead of the three-mode summary | Mode summary in the description invited agents to skip the skill body |
| copy-critique | Description reordered to trigger-first; kept the "not for generating new copy" boundary | Front-load "reviewing, evaluating, scoring, critiquing" keywords |
| copy-adapt | Description trigger-first with "requires source copy" boundary; Step 4 routing table made keyword-identical to copy-workflow's and routeToDomain(), with the same ad rule (previously an abbreviated keyword list) | Same routing divergence existed in its Step 4 table, and the abbreviated list would send users to clarification for terms the code routes directly |
| quality-frameworks | Description adds boundary: reference library, use copy-critique for a full critique | Old description ("critiquing existing copy") overlapped copy-critique's trigger exactly |
| persuasion-frameworks | Description now names all 10 frameworks | Framework names (AIDA, PAS, PASTOR...) are the exact keywords users say |
| headline-formulas | Description reordered trigger-first; "26 patterns" surfaced | Count verified against proven-patterns.md |
| marketing-copy | Description adds "not for" boundaries vs conversion-copy and social-copy; Layer 1 fix; Target/cap fix | Landing pages vs pricing pages vs social ads was the fuzziest boundary in the set |
| email-copy | Description trigger-first; Layer 1 fix; Target/cap fix | No content changes; constraints section was already precise |
| ux-copy | Description trigger-first with "not for marketing" boundary; Target/cap fix | Skill already had strong scope framing internally |
| editorial-copy | Description adds "not for social posts" boundary; Layer 1 fix; Target/cap fix | Long-form LinkedIn posts were claimable by both skills |
| brand-copy | Description trigger-first, keeps "guidelines, not marketing copy" boundary; revision cap added | Its Step 6 loop also had no exit condition |
| sales-copy | Description trigger-first; Layer 1 fix; Target/cap fix | Battle-card and pitch-deck coverage verified in one-pagers.md |
| social-copy | Description enumerates platforms and adds "not for paid ads" boundary; Target/cap fix | Paid LinkedIn/Meta ads belong to marketing-copy; the old descriptions both claimed platform keywords |
| conversion-copy | Description adds "not for landing pages or ads" boundary; Layer 1 fix; Target/cap fix | Mirror of the marketing-copy boundary |

## Verification

- All 15 frontmatter blocks parse (three new descriptions containing colons were quoted).
- Full test suite passes: 647 tests (632 existing + 15 new routing regressions), 0 failures.
