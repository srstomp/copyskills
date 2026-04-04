---
name: brand-copy
description: Workflow-driven generator for brand voice definition, tone guides, messaging hierarchies, and style guides. Use when the task involves defining how a brand sounds, creating voice guidelines, building messaging frameworks, or writing style guides.
---

# Brand Copy

Defines brand voice and messaging architecture from a brief. This skill is META-LEVEL: it produces the guidelines that all other copy follows. It does NOT generate marketing copy. It generates the system that governs how a brand speaks.

## What This Skill Produces

Brand copy is fundamentally different from other copy types. The outputs are not ads, landing pages, or emails. They are the source documents that make those things possible.

| Output type | What it is | Reference to load |
|-------------|-----------|------------------|
| `voice-profile` | A 1-2 page document defining how a brand sounds across all channels | `brand-copy/references/voice-dimensions.md` |
| `messaging-hierarchy` | Positioning statement, brand pillars, proof points, and tagline | `brand-copy/references/messaging-hierarchy.md` |
| `style-guide` | Do/don't pairs, word lists, grammar preferences, and formatting rules | `brand-copy/references/style-guide-template.md` |
| `tagline` | A single distilled line derived from the messaging hierarchy | `brand-copy/references/messaging-hierarchy.md` |
| `elevator-pitch` | 30-60 second spoken version of the full messaging hierarchy | `brand-copy/references/messaging-hierarchy.md` |

When the brief is ambiguous, ask which output type is needed before proceeding.

## Why This Skill Does Not Use Persuasion Frameworks

AIDA, PAS, PASTOR, and similar frameworks are for persuading an individual reader in a single piece of copy. Brand copy is not a single piece. It is the operating system for all future pieces.

The frameworks that apply here are:

- **Voice dimension mapping** -- identifying where the brand sits on tone spectrums (formal/casual, serious/playful, technical/accessible)
- **Messaging hierarchy** -- building the positioning-to-pillars-to-proof-points cascade that all copy draws from
- **This/not-that examples** -- the most effective anti-slop tool available; forces specificity about how the brand sounds versus how it does not sound

Persuasion frameworks belong in the skills that use this skill's output, not here.

## 7-Step Workflow

### Step 1: Receive the brief

A brand copy brief should include:
- Brand name and industry
- Primary audience (who they are, what they care about)
- Output type (voice profile, messaging hierarchy, style guide, tagline, elevator pitch)
- Existing voice or values, if any (past copy samples, founder interviews, value statements)
- Brands they admire or want to sound like (optional but useful)

If the brief is missing audience or output type, ask before proceeding. Everything else can be inferred.

### Step 2: Analyze existing voice (if samples provided)

If the brief includes existing copy samples, analyze them before defining anything new.

Look for:
- Sentence length patterns (short and punchy vs. long and detailed?)
- Vocabulary level (plain language vs. industry terminology?)
- Point of view (first person "we", second person "you", or third person?)
- Formality signals (contractions? incomplete sentences? jargon?)
- Personality signals (humor? directness? warmth? authority?)

If no samples are provided, identify the gap: what voice does this type of brand typically default to, and what would differentiate it? Default voices are forgettable. The brief exists to define something specific.

### Step 3: Select output type and load the reference

Map the brief's output type to the reference table above. Load the corresponding reference file before drafting.

- Voice profile: load `brand-copy/references/voice-dimensions.md`
- Messaging hierarchy, tagline, or elevator pitch: load `brand-copy/references/messaging-hierarchy.md`
- Style guide: load `brand-copy/references/style-guide-template.md`

If the brief asks for a "complete brand guide" or "brand guidelines," load all three references. Produce the outputs in this order: voice profile first, then messaging hierarchy, then style guide. The style guide depends on the voice profile. The tagline depends on the messaging hierarchy.

Read the reference before drafting. It contains the structural patterns, examples, and decision criteria for the output type.

### Step 4: Draft the brand artifact

Apply the reference patterns to the brief. Fill in the structure with specifics from the brief. Do not invent structure.

Voice profile drafting rules:
- Choose 3-5 voice attributes. Name them concretely. "Direct and unafraid of specifics" is better than "professional."
- For each attribute, write a this/not-that pair. The "not-that" is as important as the "that."
- Ground each attribute in a behavior, not an abstract quality.

Messaging hierarchy drafting rules:
- Start with the positioning statement. Every other element derives from it.
- Pillars must be provable. Each pillar needs at least one proof point.
- The tagline is the shortest version of the positioning. Derive it last.

Style guide drafting rules:
- The do/don't section is the most valuable part. Spend most effort here.
- Word lists must be specific. "Never use 'leverage'" is more useful than "avoid business jargon."
- Grammar preferences must state the default AND the exception condition.

### Step 5: De-slop pass

Load `quality-frameworks/references/anti-slop.md`.

Brand documents are especially prone to buzzword slop. A voice guide that uses "authentic," "empowering," and "customer-centric" in its own prose has failed its own standard.

Run this sequence on the draft:

1. Scan for every banned word and phrase in the anti-slop reference. Flag each hit. Brand copy cannot contain the words it tells others to avoid.
2. Apply the specificity test: does any sentence read like it could describe any brand in any industry? If yes, it is slop. Rebuild with specifics from the brief.
3. Check the this/not-that pairs. Is each "that" concrete enough to produce different copy than the "not-that"? Vague pairs are decorative, not functional.
4. Read the voice profile aloud. Does it sound like the brand it describes? A casual-voice brand document written in stiff corporate prose is broken.
5. Check for em dashes. Remove all of them. Restructure affected sentences.

Do not consider the draft done until every flag is resolved.

### Step 6: Score against quality rubric

Brand copy uses a different rubric than marketing or UX copy. The primary quality signal is actionability: can someone use this document to produce noticeably different copy?

| Dimension | Scale | Threshold |
|-----------|-------|-----------|
| Specificity | 1-10 | Must be 8+ |
| Actionability | 1-10 | Must be 8+ |
| Distinctiveness | 1-10 | Must be 7+ |
| Voice Consistency | 1-10 | Must be 8+ |
| AI-Tell Score | 0-10 | Must be 2 or lower |
| Overall | 1-10 | Must be 7+ |

**Specificity** measures whether the document contains details that could only apply to this brand.

**Actionability** measures whether a writer using this document would produce noticeably different copy than without it. If the answer is "probably not," the document is decorative.

**Distinctiveness** measures whether the voice defined here is different enough from generic brand-speak to be memorable.

**Voice Consistency** measures whether the document itself is written in the voice it defines.

If Specificity or Actionability is below 8, return to Step 5. A brand document that cannot guide copywriting has no value.

### Step 7: Return structured output

Return the completed brand artifact in the appropriate structure for its type.

For a voice profile:
```
## Voice Profile: [Brand Name]

### Voice Overview
[2-3 sentence summary of the overall brand voice]

### Voice Attributes
[3-5 attributes, each with: name, definition, this/not-that pair, example sentence]

### Tone Guidance
[How the voice adapts to different contexts: marketing vs. support vs. legal, etc.]
```

For a messaging hierarchy:
```
## Messaging Hierarchy: [Brand Name]

### Positioning Statement
[Full positioning statement using the template]

### Brand Pillars
[3-5 pillars, each with: pillar name, 1-sentence description, 2-3 proof points]

### Tagline
[Tagline derived from the pillars]

### Elevator Pitch
[30-60 second spoken version]
```

For a style guide:
```
## Style Guide: [Brand Name]

### Do/Don't
[10-15 pairs, each with a do example and a don't example]

### Word Lists
[Always use / Never use / Use sparingly sections]

### Grammar Preferences
[Specific rules with default and exception conditions]

### Formatting Conventions
[How we format dates, numbers, product names, etc.]
```

After the artifact, include a brief quality summary:
```
---
**Quality scores**
- Specificity: [N]/10
- Actionability: [N]/10
- Distinctiveness: [N]/10
- Voice Consistency: [N]/10
- AI-Tell: [N]/10
- Overall: [N]/10

**De-slop flags resolved:** [N] (list the specific issues fixed, or "none")
```
