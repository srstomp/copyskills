---
name: ux-copy
description: "Use when writing user interface or in-product text: microcopy, button labels, error messages, tooltips, placeholders, empty states, onboarding flows, notifications, or confirmation dialogs. Not for marketing or persuasion copy."
---

# UX Copy

Generates UX copy from a brief using clarity principles, domain patterns, and a mandatory de-slop pass. This skill runs a complete workflow -- it does not just list resources.

## Overview

This skill covers every major in-product copy format: button labels, form fields, tooltips, notification messages, confirmation dialogs, error messages, onboarding flows, and empty states. Each format has a set of UX-specific principles and a domain reference file.

UX copy is not marketing copy. Its job is not to persuade. Its job is to help users accomplish a goal without friction, confusion, or frustration. The frameworks that drive landing pages and email sequences do not apply here.

**KEY PRINCIPLE: UX copy follows clarity over cleverness.** A user who is confused has failed. A user who smiled but could not figure out what to do next has also failed. Every word must earn its place by reducing uncertainty or enabling action.

## UX Copy Type Identification

Identify the sub-type from the brief before loading references.

| Copy type | Sub-type | Domain reference |
|-----------|----------|-----------------|
| Button labels, form fields, tooltips, placeholders | Microcopy | `ux-copy/references/microcopy-patterns.md` |
| Notification toasts, banners, inline alerts | Microcopy | `ux-copy/references/microcopy-patterns.md` |
| Confirmation dialogs | Microcopy | `ux-copy/references/microcopy-patterns.md` |
| Validation messages, system errors, permission errors | Error messages | `ux-copy/references/error-messages.md` |
| Welcome screens, setup wizards, coach marks | Onboarding | `ux-copy/references/onboarding.md` |
| First-use states, no-results states, error states | Empty states | `ux-copy/references/empty-states.md` |

When the brief type is ambiguous, ask for clarification before proceeding.

## UX Copy Principles

UX copy does not use persuasion frameworks. It uses these four principles instead. Read them before drafting.

### 1. Clarity over cleverness

Reference: `quality-frameworks/references/four-cs.md` -- weight the "Clear" dimension highest for all UX copy.

A clever button label that makes users pause is a broken button label. A tooltip that requires two reads failed on the first. Write to the reading level of someone who is mid-task and slightly impatient.

- Use plain language. Avoid jargon unless the audience is technical and expects it.
- One idea per sentence. One purpose per UI element.
- If the copy could be misread, it will be.

### 2. Action-oriented language

Verb-first construction is the default for interactive elements.

- Buttons: "Save changes" not "Changes will be saved"
- CTAs: "Add your first project" not "Get started"
- Destructive actions: name the action specifically -- "Delete account" not "Delete" -- so users know exactly what they are confirming

The verb anchors the user's mental model. Noun-first or passive constructions slow comprehension and increase error rates.

### 3. Empathy in error states

Errors feel bad. Good error copy acknowledges that without wallowing in it.

- Acknowledge what happened: "We could not save your changes"
- Explain why if it helps (skip it if it does not): "Your session timed out"
- Always tell the user what to do next: "Try again or contact support"

Empathetic does not mean cute. "Oops!" does not help a user whose data was lost. Humor is inappropriate when something has gone wrong.

### 4. Progressive disclosure in onboarding

Users cannot absorb everything at once. Show the minimum needed to complete the current step.

- Surface advanced features only after the user has mastered the basics
- Celebrate completions before adding complexity
- Always offer a way to skip for users who want to explore on their own

## 7-Step Workflow

### Step 1: Identify UX copy sub-type

Read the brief. Find the copy type. Map it to a row in the UX Copy Type Identification table above.

If the brief has no explicit type, infer from the UI context:
- Interactive element (button, link, menu item): microcopy
- Something went wrong in the system: error message
- User is new or seeing a feature for the first time: onboarding
- No content exists yet in a space that should have content: empty state

### Step 2: Load UX principles

No external framework file is needed for this step. The four principles above (clarity, action-oriented, empathy in errors, progressive disclosure) are the complete framework for UX copy.

Re-read the principles for the sub-type you identified:
- Microcopy: clarity and action-oriented principles apply
- Error messages: empathy principle applies; clarity principle applies
- Onboarding: progressive disclosure and clarity principles apply
- Empty states: clarity and action-oriented principles apply

### Step 3: Load the domain reference

Load the domain-specific reference file for this copy type:

- Buttons, form fields, tooltips, notifications, confirmations: `ux-copy/references/microcopy-patterns.md`
- Validation errors, system errors, permission errors, network failures: `ux-copy/references/error-messages.md`
- Welcome screens, wizards, coach marks, feature tours: `ux-copy/references/onboarding.md`
- First-use, no-results, error, cleared states: `ux-copy/references/empty-states.md`

Read the reference before drafting. It contains before/after examples, structural patterns, and common mistakes to avoid.

### Step 4: Draft using principles and domain patterns

Apply the UX principles to the brief. Use the domain reference for structural patterns, length guidelines, and examples.

- Follow the verb-first construction for all interactive elements
- Respect length constraints (buttons: 2-4 words; tooltips: under 150 chars; error messages: 1-3 sentences)
- Write in second person where appropriate; use active voice throughout
- Match the tone to the moment: errors are calm and direct, success states can be warm, onboarding is encouraging but not patronizing

Do not invent structure. The principles plus domain reference define the structure. Your job is to apply them to the specific product, user, and moment in the brief.

### Step 5: De-slop pass

Load `quality-frameworks/references/anti-slop.md`.

Run this sequence on the draft:

1. Scan for every banned word and phrase in the Banned Words and Phrases section. Flag each hit.
2. Check for em dashes. Remove all of them. Restructure affected sentences.
3. Apply the specificity test: is this copy generic enough to appear in any product? If yes, add the product-specific detail from the brief.
4. Check for filler words that pad without adding meaning: "simply", "just", "easy", "quickly". Remove them.
5. Check for passive voice. UX copy is almost never passive. Rewrite any passive constructions.
6. For error messages specifically: check that the message does not blame the user. "You entered an invalid email" blames the user. "This email address is not valid" describes the state.

Do not consider the draft done until every flag is resolved.

### Step 6: Score against quality rubric

Score the de-slopped draft across these 7 dimensions. Weight Clarity highest for UX copy -- it is the primary quality signal.

| Dimension | Scale | Target | UX copy weight |
|-----------|-------|-----------|---------------|
| Clarity | 1-10 | 8+ | Highest |
| Specificity | 1-10 | 7+ | High |
| Voice Match | 1-10 | 7+ | Medium |
| AI-Tell Score | 0-10 | 2 or lower | High |
| Empathy (errors/onboarding) | 1-10 | 7+ | Context-dependent |
| Action | 1-10 | 7+ | High |
| Overall | 1-10 | 7+ | -- |

If Clarity is below 8, or AI-Tell Score is 3 or higher, or Overall is below 7: return to Step 5. Other dimensions below their targets set the revision priorities but do not block on their own. Cap revisions at 2 passes; if the draft still fails a hard gate after that, return the best version with the failing scores flagged in the output.

### Step 7: Return structured output

Return the completed copy in this structure:

```
## [Copy type] for [Product/Feature]

[Copy here, formatted for its intended use. For multiple elements, group by type.]

---
**Quality scores**
- Clarity: [N]/10
- Specificity: [N]/10
- Voice Match: [N]/10
- AI-Tell: [N]/10
- Empathy: [N]/10 (if applicable)
- Action: [N]/10
- Overall: [N]/10

**Principles applied:** [List which of the 4 UX principles were primary]
**De-slop flags resolved:** [N] (list the specific issues fixed, or "none")
```

For error messages, include the error structure (what happened / why / what to do next) as a comment or annotation.

## Voice and Tone Note

UX copy adapts tone to the context of the moment, but voice stays consistent with the brand.

| Moment | Tone |
|--------|------|
| Error or failure | Calm, empathetic, direct |
| Success or completion | Warm, brief, celebratory (short) |
| Onboarding | Encouraging, patient, not patronizing |
| Neutral UI (labels, placeholders) | Neutral, clear, minimal |
| Destructive action confirmation | Serious, specific, no humor |

Tone adapts. Voice does not. If the brand voice is dry and professional, error messages should still be empathetic, but they will not be warm. Apply brand voice constraints from the brief before writing.
