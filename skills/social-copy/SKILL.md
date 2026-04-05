---
name: social-copy
description: "Workflow-driven generator for platform-specific social content (X/Twitter, LinkedIn, Instagram, TikTok), threads, carousels, and community engagement. Use when copy type involves social media posts, platform-specific content, or community engagement."
---

# Social Copy

Generates social media copy from a brief using platform-specific constraints, the correct persuasion framework, hook formulas, and mandatory de-slop pass. This skill runs a complete workflow -- it does not just list resources.

## Platform Identification

Identify the platform and content format from the brief before anything else. Different platforms require different voices, lengths, and structures.

| Platform | Content format | Framework | Primary reference |
|----------|---------------|-----------|------------------|
| LinkedIn | Single post (thought leadership, announcement, story) | PAS or AIDA | `social-copy/references/platform-specs.md` |
| LinkedIn | Article preview / teaser | AIDA | `social-copy/references/platform-specs.md` |
| X/Twitter | Single tweet | 4Us for hooks | `social-copy/references/platform-specs.md` |
| X/Twitter | Thread | Hook + QUEST | `social-copy/references/hooks-and-threads.md` |
| Instagram | Caption (product, lifestyle, educational) | BAB or Star-Story-Solution | `social-copy/references/platform-specs.md` |
| Instagram | Carousel | Hook slide + slide-by-slide flow | `social-copy/references/hooks-and-threads.md` |
| TikTok | Video description / caption | 4Us for hooks | `social-copy/references/platform-specs.md` |
| Any platform | Engagement reply / comment | Conversational | `social-copy/references/engagement-patterns.md` |

When the brief does not specify a platform, ask before proceeding. Platform determines everything: character budget, tone, structure, and CTA type.

## Framework Mapping

Load these files when the workflow requires them.

| Framework | File path | Use for |
|-----------|-----------|---------|
| PAS (Problem-Agitate-Solution) | `persuasion-frameworks/references/pas.md` | LinkedIn posts, problem-led hooks |
| AIDA | `persuasion-frameworks/references/aida.md` | LinkedIn posts, article teasers |
| BAB (Before-After-Bridge) | `persuasion-frameworks/references/bab.md` | Instagram captions, transformation content |
| Star-Story-Solution | `persuasion-frameworks/references/star-story-solution.md` | Instagram narrative captions, long-form posts |
| QUEST | `persuasion-frameworks/references/quest.md` | X/Twitter threads, multi-part content |
| 4Us quality check | `quality-frameworks/references/four-us.md` | Hook lines, short-form copy on any platform |
| Headline patterns | `headline-formulas/references/proven-patterns.md` | Hook formulas, opening lines |
| Anti-slop | `quality-frameworks/references/anti-slop.md` | De-slop pass (Step 5, mandatory) |

Load only the files required for the content type at hand. Do not preload all frameworks.

## 7-Step Workflow

### Step 1: Identify platform and content format

Read the brief. Find the platform and content format. Map to a row in the Platform Identification table above.

If the brief has no platform specified, infer from context clues:
- Character count mentioned under 280: X/Twitter
- "Thread" mentioned: X/Twitter thread
- "Carousel" or multiple slides mentioned: Instagram carousel
- "Post" with professional context, industry insights: LinkedIn
- "Caption" with visual description: Instagram
- "Caption" with video description or hooks mentioning watch time: TikTok

If platform is still unclear, stop and ask. Wrong platform means wrong constraints.

### Step 2: Load platform-specs.md

Load `social-copy/references/platform-specs.md` before drafting a single word.

Check:
- Character limit for this platform and content type
- Hashtag conventions (count and placement)
- Algorithm preferences (what the platform rewards)
- Image or video spec notes if the copy accompanies visual content

Character limits are non-negotiable. A LinkedIn post can run 3000 characters. An X/Twitter tweet cannot exceed 280. Draft within the limit, not up to it.

### Step 3: Load the framework reference

Using the Framework Mapping table, load the single most relevant framework file.

- LinkedIn posts: load `persuasion-frameworks/references/pas.md` or `persuasion-frameworks/references/aida.md`
- X/Twitter threads: load `persuasion-frameworks/references/quest.md` AND `social-copy/references/hooks-and-threads.md`
- Instagram captions: load `persuasion-frameworks/references/bab.md` or `persuasion-frameworks/references/star-story-solution.md`
- Short-form hooks on any platform: load `quality-frameworks/references/four-us.md` AND `headline-formulas/references/proven-patterns.md`
- Engagement content: load `social-copy/references/engagement-patterns.md`

For threads and carousels: also load `social-copy/references/hooks-and-threads.md` for structural patterns.

Read the framework. Note its stages and common mistakes before drafting.

### Step 4: Draft using platform constraints and framework structure

Apply the framework stages to the brief. The hook is the most important line in any social post. If the first line does not stop the scroll, the rest of the post is invisible.

Drafting rules by platform:

**LinkedIn**
- Open with a hook that earns the "see more" click. Not "I'm excited to announce." Not "In today's fast-paced world."
- Use white space aggressively. Each sentence or short group of 2-3 sentences gets its own line break.
- Narrative arc: hook, body (tension or proof), lesson or CTA.
- Write from first-person voice with a point of view. LinkedIn rewards opinions, not press releases.
- Hashtags at the end only (3-5 relevant tags).

**X/Twitter (single tweet)**
- First 70 characters carry 80% of the weight. Draft the hook first, fit the rest around it.
- No throat-clearing. First word must pull.
- One idea per tweet.
- 1-2 hashtags or none. Never hashtag-spam.

**X/Twitter (thread)**
- Tweet 1 is the hook and the promise. Load `social-copy/references/hooks-and-threads.md` for thread structures.
- Each tweet stands alone but builds on the previous.
- Final tweet delivers the payoff and CTA.
- Number tweets only if the thread benefits from it (tutorials yes, opinion threads usually no).

**Instagram**
- First line (before the truncation) must hook. Instagram truncates captions after roughly 125 characters.
- Hashtags go at the end or in the first comment (up to 30, but 5-10 is more effective).
- Emojis are acceptable if they match brand voice.
- CTA before hashtags.

**TikTok**
- Caption supports the video, not replaces it. Keep it short and punchy.
- Hook in first line (caption shows above the fold in feed).
- 3-5 hashtags including one niche tag.

Do not invent structure. Platform constraints plus framework define the structure. Your job is to fill it with specifics from the brief.

### Step 5: De-slop pass

Load `quality-frameworks/references/anti-slop.md`.

Social copy is the highest-slop-risk format. Generic openings are common and instantly recognizable as AI output. Run this sequence before considering the draft done:

1. Scan for every banned word and phrase in the Banned Words and Phrases section. Flag each hit.
2. Check for em dashes. Remove all of them. Restructure affected sentences.
3. Check the opening line. If it starts with any of the following, rewrite it:
   - "Excited to announce"
   - "Thrilled to share"
   - "In today's fast-paced world"
   - "I've been thinking a lot about"
   - "Hot take:" (as a label, not as a genuine opinion stated plainly)
   - "Unpopular opinion:" (same)
   - A generic question ("Have you ever noticed...?")
   These openers have been used millions of times. Find the specific tension, observation, or fact from the brief and lead with that instead.
4. Apply the sentence length variance test. Social copy tends to homogenize sentence length. Vary it.
5. Apply the specificity test: could a competitor paste their name over this post and have it still work? If yes, find the specific detail from the brief and rebuild the copy around it.
6. Check voice consistency. The post must sound like a real person with a real perspective, not a brand communications department.

Do not consider the draft done until every flag is resolved.

### Step 6: Score against quality rubric

Score the de-slopped draft across these 7 dimensions:

| Dimension | Scale | Threshold |
|-----------|-------|-----------|
| Clarity | 1-10 | Must be 7+ |
| Specificity | 1-10 | Must be 7+ |
| Voice Match | 1-10 | Must be 7+ |
| AI-Tell Score | 0-10 | Must be 2 or lower |
| Persuasion | 1-10 | Must be 7+ |
| Action | 1-10 | Must be 7+ |
| Overall | 1-10 | Must be 7+ |

If AI-Tell Score is 3 or higher, or Overall is below 7: return to Step 5. Do not return copy that fails the threshold.

For hooks and short-form posts, also score against the 4Us (from `quality-frameworks/references/four-us.md`). Minimum: 3 out of 4 dimensions score 2 or higher.

### Step 7: Return structured output

Return the completed copy in this structure:

```
## [Platform] [Content format] for [Product/Brand]

[Copy here, formatted for its intended platform]

---
**Character count:** [N] / [limit]
**Hashtags:** [list]
**Quality scores**
- Clarity: [N]/10
- Specificity: [N]/10
- Voice Match: [N]/10
- AI-Tell: [N]/10
- Persuasion: [N]/10
- Action: [N]/10
- Overall: [N]/10

**Framework used:** [Framework name]
**De-slop flags resolved:** [N] (list the specific issues fixed, or "none")
```

For threads and carousels: present each unit (tweet or slide) separately with its own label. Include character count per tweet for X/Twitter threads.

## Platform Constraints Note

Character limits and algorithm preferences are checked in Step 2 via `social-copy/references/platform-specs.md`. Do not draft without loading that file first. A post that exceeds the character limit is a broken post. A post that ignores the platform's algorithm preferences is a post that performs poorly even when the copy is good.
