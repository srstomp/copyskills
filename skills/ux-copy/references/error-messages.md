# Error Messages Reference

Structure, tone, severity levels, and before/after examples for every major error type.

---

## Error Structure

Every error message follows a three-part structure. Not every error needs all three parts, but no error should skip the third.

**1. What happened** (always)
State the problem briefly. Do not editorialize.
- "We could not save your changes."
- "This email address is already in use."
- "Your session has expired."

**2. Why it happened** (include if it helps the user)
Explain the cause when it clarifies what to do next. Skip it when it is technical noise.
- Include: "Your card was declined because the billing address did not match."
- Skip: "A 503 error occurred in the upstream service."

**3. What to do next** (always)
Tell the user their next move. Make it specific. Make it actionable.
- "Check your billing address and try again."
- "Sign in again to continue."
- "Try a different email address or sign in to your existing account."

---

## Tone

Error copy is empathetic but not apologetic. There is a difference.

**Empathetic:** Acknowledges the user's situation without excessive hand-wringing.
**Apologetic:** Over-explains, uses filler phrases, or adds humor to soften a genuinely bad moment.

Empathetic:
- "We could not save your changes. Try again or download a backup."

Apologetic / wrong:
- "Oops! Something went wrong. We're really sorry about that!"
- "Uh oh! Looks like we hit a snag. Please try again later."
- "Yikes! That didn't work. Our bad!"

The word "Oops" signals that the system is not taking the error seriously. Use it never.

Do not use humor in error states. A user who lost 30 minutes of work does not want a joke. A user who cannot access their account is not in the mood for whimsy.

---

## Severity Levels

### Inline validation (gentle, immediate)

Fires as the user types or when they leave a field. Used for format errors and requirement mismatches.

- Tone: neutral, matter-of-fact
- Placement: directly below the field
- Length: one sentence, under 60 characters
- Trigger: on field blur or on submission attempt

Patterns:
- "[Field name] is required."
- "This email address is not valid."
- "Password must be at least 8 characters."
- "Passwords do not match."

Avoid:
- Firing validation while the user is still typing (unless the field is complete, like a 6-digit code)
- Red color on an empty field the user has not touched yet

### Form errors (specific, grouped)

Fires when a user attempts to submit a form with multiple issues. Summarize at the top and annotate each field.

- Summary at top: "Please fix 3 issues before continuing."
- Each field: specific inline message at the field level
- Tone: direct, not punishing
- Length: summary is one sentence; field-level messages are one sentence each

Do not write "Please complete all required fields." It tells the user nothing about which fields are incomplete.

### System errors (honest, helpful)

The application failed to do something. Not the user's fault. Not explainable without technical context.

- Tone: calm, clear
- Acknowledge: yes, something went wrong
- Explain: only if it helps the user act
- Next step: always

Pattern: "[What we were trying to do] did not work. [When to try again or what to do instead]."

Examples:
- "We could not load your projects. Refresh the page to try again."
- "Your file could not be uploaded. Check your connection and try again."

### Critical errors (calm, action-oriented)

Data loss, account issues, payment failures. These are high-stakes moments. Stay calm. Be specific. Give the user control.

- Tone: direct, serious (not alarming)
- Do not minimize the severity
- Provide a clear path forward
- If support is needed, link directly to it -- do not say "contact support" without a link

---

## Common Error Patterns

### Form validation

| Error type | Copy pattern |
|-----------|-------------|
| Required field | "[Field name] is required." |
| Invalid format | "This [field type] is not valid." |
| Too short | "[Field name] must be at least [N] characters." |
| Already taken | "This [email/username] is already in use. Sign in instead?" |
| Mismatch | "[Fields] do not match." |

### Network failures

When the user loses connection or the request times out:
- "Check your internet connection and try again."
- "This is taking longer than usual. Try refreshing the page."

Do not say "No internet connection detected" if you cannot be certain -- the user's connection may be fine and the server may be the problem.

### Permission denied

When the user tries to access something they are not allowed to:
- "You do not have permission to view this page."
- "This file is private. Ask [Name] to share it with you."

Do not reveal what exists at a restricted URL. "You do not have permission to view this page" is correct. "This page contains confidential HR files, which you cannot access" is a security issue.

### Not found (404)

When something the user is looking for does not exist:
- "We could not find that page."
- "This project may have been deleted or moved."

Always provide a path back. A 404 without a link to the homepage or search is a dead end.

### Rate limiting

When the user has made too many requests:
- "Too many attempts. Wait a few minutes and try again."
- "You have reached your daily limit for [action]. Upgrade your plan for more."

### Server errors (5xx)

When the server failed for internal reasons:
- "Something went wrong on our end. We are looking into it."
- "Our servers are having issues. Try again in a few minutes."

Do not explain the technical cause. Do link to a status page if one exists.

---

## Before/After Examples

### Example 1: Form validation

**Before:** "Error: invalid input detected. Please try again."

**After:** "This email address is not valid. Check for typos and try again."

The "before" version is useless. The "after" names the field type, names the issue, and gives a next step.

---

### Example 2: Permission error

**Before:** "403 Forbidden"

**After:** "You do not have permission to view this workspace. Ask your admin to add you."

A raw HTTP code is not a user-facing error message.

---

### Example 3: Inline validation (character limit)

**Before:** "Too long!"

**After:** "Bio must be 160 characters or fewer. You are 12 characters over."

The "after" version tells the user how far they need to cut, not just that they failed.

---

### Example 4: Network failure

**Before:** "Oops! Something went wrong. Please try again later."

**After:** "We could not save your changes. Check your connection and try again."

"Oops" and "something went wrong" add nothing. The "after" names what failed and what to do.

---

### Example 5: Server error during file upload

**Before:** "Upload failed. Please try again."

**After:** "Your file could not be uploaded. Try again, or use a file under 10 MB."

The "after" anticipates the most common cause (file size) and gives the user something to act on.

---

## What to Avoid

- **Blaming the user:** "You entered an invalid email" places fault on the user. "This email address is not valid" describes the state.
- **Technical jargon:** "A null pointer exception occurred" means nothing to most users. "Something went wrong" is better; "We could not process your request" is better still.
- **Vague messages:** "Something went wrong" is acceptable for server errors with no useful cause. It is not acceptable for field validation, payment failures, or permission issues where specificity is possible.
- **Humor in serious errors:** If the user lost work, they do not want a robot to be charming about it.
- **Passive voice:** "Your session was timed out" vs "Your session has expired." Active voice is clearer and feels less bureaucratic.
- **All-caps or exclamation marks:** "ERROR!" reads as shouting. Errors are already alarming. The copy should calm the situation, not amplify it.
