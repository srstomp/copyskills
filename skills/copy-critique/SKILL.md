---
name: copy-critique
description: Use when reviewing, evaluating, scoring, or critiquing copy that already exists, or improving flagged sections of it. Returns 7-dimension scores and line-level fixes. Not for generating new copy.
---

# Copy Critique

Standalone evaluation skill. No generation. Receives copy, returns scores and actionable feedback.

## Overview

This skill evaluates copy that already exists. It never generates copy from scratch. Input is existing copy text. Output is a structured critique: 7-dimension scores, line-level issues with concrete fixes, and a summary assessment. Optionally rewrites flagged sections when requested or when AI-tell score is high.

## Input

**Required:**
- Existing copy text to evaluate

**Optional context (include when available for a more accurate voice match score):**
- `audience`: who the copy is for
- `goal`: what the copy should achieve
- `brand_voice`: tone, vocabulary, personality guidelines

## 5-Step Evaluation Process

### Step 1: Receive copy and context

Take the copy as submitted. Note any optional context provided. Do not modify the copy before evaluation begins.

### Step 2: Anti-slop scan

Load `quality-frameworks/references/anti-slop.md`.

Scan the copy for:
- Every banned word and phrase listed in the Banned Words and Phrases section
- Em dash usage
- Tricolon patterns that read like jingles
- AI tell-tale phrasing (hedging language, hollow transitions, vague superlatives)
- Paragraph openings with repetitive grammatical patterns

Flag each hit with the specific text and its location in the copy.

### Step 3: Score against 7-dimension rubric

Load `quality-frameworks/SKILL.md`. Score the copy against all 7 dimensions.

| Dimension | Scale | What it measures |
|-----------|-------|-----------------|
| Clarity | 1-10 | Reader understands on first read, no re-reading required |
| Specificity | 1-10 | Concrete details vs. vague generalities; numbers, names, proof |
| Voice Match | 1-10 | Matches the brand's tone, vocabulary, personality (score 5 if no brand_voice context provided) |
| AI-Tell Score | 0-10 | Detectable AI patterns. Lower is better. |
| Persuasion | 1-10 | Applies persuasion principles; moves reader toward action |
| Action | 1-10 | CTA is clear, specific, friction-free, appropriately urgent |
| Overall | 1-10 | Holistic quality judgment across all dimensions |

Score each dimension before moving to Step 4.

### Step 4: Build line-level issue list

For every issue found in Steps 2 and 3, produce an issue entry:

- Reference the specific line or phrase (quote it exactly)
- Explain why it is a problem (banned pattern, vague claim, broken rhythm, etc.)
- Suggest a concrete fix: "Replace X with Y" not "Consider improving X"
- Assign severity: high, medium, or low

**Severity classification:**

| Severity | Criteria |
|----------|---------|
| high | Banned pattern present, major AI tell, factually wrong statement |
| medium | Vague claim with no specifics, weak or missing CTA, inconsistent tone |
| low | Minor style preference, optional improvement, rhythm issue |

Do not write a vague suggestion. Every fix must name the specific replacement text or rewrite.

### Step 5: Rewrite flagged sections (conditional)

Rewrite flagged sections only if:
- The user explicitly requests a rewrite, OR
- AI-Tell Score is 5 or higher

If neither condition is met, return the issue list without rewriting. Do not rewrite copy the user did not ask to have rewritten.

## Output Format

Return evaluation results in this YAML structure:

```yaml
scores:
  clarity: X
  specificity: X
  voice_match: X
  ai_tell_score: X
  persuasion: X
  action: X
  overall: X
issues:
  - line: "the specific text quoted from the copy"
    problem: "why this is flagged"
    fix: "concrete replacement or rewrite"
    severity: high|medium|low
summary: "1-2 sentence overall assessment"
```

If a rewrite was requested or triggered (AI-Tell Score >= 5), append a `rewritten_sections` block after `summary`:

```yaml
rewritten_sections:
  - original: "the original flagged text"
    rewrite: "the replacement"
```

## Hard Rules

**Fixes must be concrete.** "Replace X with Y" is acceptable. "Consider improving X" is not. Every issue entry must contain a specific proposed replacement, not general advice.

**No generation without evaluation.** If no existing copy is provided, report that this skill requires existing copy and stop.

**Scoring without context.** If `brand_voice` is not provided, score Voice Match at 5 and note the missing context in the summary.
