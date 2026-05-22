---
name: persuasion-frameworks
description: Persuasion framework selection guidance and reference material for copywriting. Use when selecting a framework for copy generation or evaluating which methodology fits a copy type and goal.
---

# Persuasion Frameworks

Reference skill for selecting and applying persuasion frameworks. This skill guides framework selection -- it does not generate copy. Load the relevant reference file once a framework is chosen.

## Decision Matrix

Map the copy scenario to the recommended framework. When multiple frameworks fit, the first listed is the default.

| Copy scenario | Primary framework | Alternative |
|---------------|-------------------|-------------|
| Landing page (short-form, single offer) | AIDA | 4Ps |
| Landing page (long-form, high consideration) | PASTOR | AIDA |
| Cold outreach email | PAS | PASTOR |
| Nurture / drip email sequence | QUEST | PAS |
| Newsletter | AIDA | Star-Story-Solution |
| Product description | FAB | AIDA |
| Comparison page | FAB | 4Ps |
| Case study | BAB | Star-Story-Solution |
| Testimonial framing | BAB | PAS |
| Sales page (long-form direct response) | PASTOR | PPPP |
| Sales letter | PPPP | PASTOR |
| Whitepaper / considered purchase | ACCA | QUEST |
| Educational content / webinar | QUEST | ACCA |
| Ad headline / short ad copy | AIDA | 4Ps |
| Brand storytelling / about page | Star-Story-Solution | BAB |
| Founder story | Star-Story-Solution | BAB |
| Value proposition | FAB | AIDA |
| Re-engagement email | PAS | BAB |
| Social proof / review prompt | BAB | PAS |
| Technical audience / B2B feature copy | FAB | ACCA |

When uncertain, default to AIDA. It is the most broadly applicable framework.

## Framework Index

Ten frameworks are available. Each has a reference file in `references/`. Load on demand.

- **aida.md** -- Attention-Interest-Desire-Action. The general-purpose default. Works for landing pages, ads, and most marketing copy.
- **pas.md** -- Problem-Agitate-Solve. Built for cold outreach and direct response. Strong when the audience has a clear pain point.
- **bab.md** -- Before-After-Bridge. Shows transformation. Best for case studies, testimonials, and narratives built around change.
- **fab.md** -- Features-Advantages-Benefits. Connects product attributes to reader value. Best for product copy and technical audiences.
- **acca.md** -- Awareness-Comprehension-Conviction-Action. Longer persuasion arc for considered purchases and B2B sales copy.
- **pastor.md** -- Problem-Amplify-Story-Testimony-Offer-Response. Full persuasion arc for sales pages and long-form direct response.
- **quest.md** -- Qualify-Understand-Educate-Stimulate-Transition. Educational pacing for nurture sequences and webinars.
- **four-ps.md** -- Promise-Picture-Proof-Push. Structured persuasion with evidence. Pairs well with landing pages and sales pages.
- **pppp.md** -- Picture-Promise-Prove-Push. Visualization-first variant of 4Ps. Strong for sales letters and long-form ads.
- **star-story-solution.md** -- Star-Story-Solution. Narrative structure for brand storytelling and founder copy.

## Usage Note

Load reference files on demand. Do not load all framework files at once. Identify the copy type and goal, consult the decision matrix, then load the single most relevant reference file.

If the copy spans multiple formats (e.g., a landing page with a case study section), select the framework for the dominant format and note secondary frameworks for individual sections.
