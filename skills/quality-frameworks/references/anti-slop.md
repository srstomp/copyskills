---
title: Anti-Slop Reference
---

# Anti-Slop Reference

The single most-referenced file in the plugin. Every piece of copy goes through this before shipping.

Slop is copy that could have been written by any AI about any product. It has no fingerprints, no specifics, no personality. The goal: make copy that only you could have written about only your product.

---

## Banned Words and Phrases

These are the fingerprints of AI-generated marketing copy. If you wrote one, rewrite it.

### Punctuation

- **Em dash (-- or -)** - Hard banned. Full stop. Use a comma, period, or restructure the sentence.

### Verbs that mean nothing

- leverage
- unlock
- elevate
- empower
- enable
- transform
- revolutionize
- disrupt
- supercharge
- streamline
- harness

### Adjectives that prove nothing

- seamless
- robust
- cutting-edge
- world-class
- best-in-class
- game-changing
- innovative
- powerful
- intuitive
- scalable
- dynamic
- comprehensive
- holistic
- next-generation
- state-of-the-art
- industry-leading

### Nouns and noun phrases

- tapestry (in any non-literal sense)
- landscape (as a metaphor: "the marketing landscape")
- ecosystem (unless you mean an actual ecosystem)
- journey (as a metaphor: "the customer journey" in hero copy)
- delve
- realm
- paradigm

### Opening patterns

- "In today's [X]..." (opens half of all AI-generated copy; delete it)
- "In a world where..." (same problem)
- "Whether you're [A] or [B]..." (fake inclusivity; pick one reader and speak to them)
- "At [Company], we believe..." (nobody cares what you believe; show it)
- "We're excited to announce..." (you're always excited; cut it)
- "Now more than ever..." (meaningless filler)
- "It goes without saying..." (then don't say it)

### Filler phrases

- "at the end of the day"
- "take your [X] to the next level"
- "best-in-class solutions"
- "our team of experts"
- "we're passionate about"
- "we're committed to"
- "driving results"
- "value-add"
- "thought leader" (about yourself)

---

## Detection Heuristics

Use these to identify AI writing patterns that survive a word-level scan.

### Sentence length variance test

Read the first 10 sentences. Measure rough word count per sentence.

- **AI pattern:** All sentences cluster between 15-20 words. Variance is low.
- **Human pattern:** Mix of short punches (4-6 words), medium sentences (12-18 words), and the occasional long one (25+). Sharp variation.
- **Diagnosis:** If the longest sentence is less than 1.5x the shortest, the writing is flat. Vary it deliberately.

### Paragraph opening audit

Look at how each paragraph begins.

- **AI pattern:** 3 or more consecutive paragraphs starting with the same part of speech ("Our [X]...", "Our [Y]...", "Our [Z]...") or the same transition word.
- **Human pattern:** Mix of subject-first, verb-first, dependent clauses, questions, and short fragments.
- **Diagnosis:** Rewrite paragraph openings to break the repetition pattern.

### Tricolon trap

Count lists of three that follow the same grammatical structure.

- **AI pattern:** "Fast, reliable, and scalable." "We design, build, and deploy." Three items all starting with the same part of speech, same rhythm.
- **Human pattern:** Occasionally two matching items with a surprise third. Or just two. Or four.
- **Diagnosis:** If a tricolon reads like a jingle, break the rhythm. Add a fourth item, remove one, or restructure so the items don't match grammatically.

### Specificity score

Pick any claim in the copy. Ask: is this verifiable or fabricated?

- **Vague (slop):** "We help businesses grow faster."
- **Specific (real):** "Our customers cut their onboarding time from 3 weeks to 4 days."

Count the ratio of specific claims (numbers, names, timeframes, percentages) to vague claims in a 200-word block.

- 0-1 specifics per 200 words: high slop risk
- 2-3 specifics: acceptable
- 4+ specifics: strong

### Cliche density

Count banned phrases per 100 words.

- 0-1: Clean
- 2-3: Needs a pass
- 4+: Rewrite

---

## Humanization Techniques

These are the moves that make copy read like a person wrote it.

### Vary sentence length dramatically

Write a long sentence that really digs into the idea with some subordinate clauses and maybe a qualification. Then stop.

Short punches work.

The contrast is the technique. Use it.

### Use contractions everywhere

"You are going to love this" sounds like a press release. "You're going to love this" sounds like a person. Use can't, don't, won't, we've, you'll, it's throughout.

Exception: formal contexts (legal, medical, government) where contractions undermine authority.

### Sentence fragments when natural

Not every sentence needs a verb.

Especially in CTAs. In hooks. In transitions.

Read it aloud. If a fragment sounds natural spoken, keep it.

### Inject opinions and point of view

Generic copy never takes a side. "Some marketers believe X, while others prefer Y." That's useless. Pick a side: "Most A/B testing advice is wrong. Here's what actually moves conversion."

An opinion creates a reader. Fence-sitting repels everyone.

### Use concrete numbers over vague claims

Replace:
- "significantly faster" with "40% faster"
- "most customers" with "8 in 10 customers"
- "we've helped many companies" with "we've helped 340 companies"
- "save time" with "save 6 hours a week"

If you don't have a real number, get one. If you can't get one, rewrite the claim as a specific behavior: "save the time you spend manually exporting CSVs" instead of "save time."

### Write like you talk, then clean it up

Draft at conversational speed. Don't self-edit while writing. Then on revision: cut filler, tighten sentences, replace weak verbs. But keep the voice from the first draft.

First draft: "The thing is, most people don't actually read the whole email, they just kind of scan it, so you need your point to be really obvious right up front."

Cleaned: "Most readers scan, not read. Make your point in the first line or lose them."

### Use the second person consistently

"You" keeps the reader in frame. "Our customers can..." distances. "You can..." includes.

Audit for passive voice and third-person constructions. Replace with direct address.

### Start sentences with conjunctions

"And that's the problem with most email copy." "But here's the thing." "So we rebuilt the whole approach."

Starting sentences with And, But, So creates rhythm and feels conversational. Formal writing avoids it. Copy should lean into it.

---

## The Specificity Test

This is the single most useful quality check in the entire plugin.

**Ask:** Could a competitor paste their name over this copy and have it still work?

If yes, it's slop. Rewrite with details only this product or brand can claim.

### Examples

**Fails the test:**
> "We help growing businesses move faster and accomplish more. Our platform is designed with you in mind, from intuitive onboarding to world-class support."

Any software company could publish this. Name means nothing here.

**Passes the test:**
> "Teams using Relay cut their weekly standup from 25 minutes to 8. The meeting people dreaded becomes the one they actually show up for."

This is about a specific product, a specific time saving, a specific behavioral outcome. Competitors cannot paste their name over it.

### How to apply it

1. Take any paragraph of copy.
2. Ask: what is specific here that only we can claim?
3. If the answer is nothing, find the specifics (metrics, customer stories, product behaviors, unique mechanics) and rebuild around them.
4. Specifics can be quantitative (numbers) or qualitative (unique product behavior). Both beat vague claims.

### When you don't have specifics

Ask for them. If writing for a client: "What's a customer result you can point to? What's something your product does that competitors literally cannot do?" If writing speculatively: flag the placeholder and note what data would make it real.
