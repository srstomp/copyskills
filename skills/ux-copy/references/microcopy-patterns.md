# Microcopy Patterns Reference

Structural patterns, length rules, and before/after examples for buttons, form fields, tooltips, notifications, and confirmation dialogs.

---

## Button Labels

### Pattern: verb + noun

The most reliable button pattern is a verb paired with an object that names what will happen.

- "Save changes"
- "Add team member"
- "Download report"
- "Send invitation"

Keep it to 2-4 words. Longer labels indicate the button is trying to do too much, or the copy is explaining instead of labeling.

### Destructive actions

Destructive buttons must name the thing being destroyed. Vague labels create doubt and abandoned flows -- but they also create accidental deletions when users click without reading.

- "Delete account" not "Delete"
- "Remove member" not "Remove"
- "Cancel subscription" not "Cancel"
- "Discard changes" not "Discard"

The word "Cancel" as a button label almost always means "close this dialog" -- not "cancel the subscription". Use it only for closing dialogs. Use "Cancel subscription" when that is the actual action.

### Common mistakes

| Weak | Strong | Why |
|------|--------|-----|
| Submit | Save changes | "Submit" tells users nothing about what happens next |
| OK | Got it / Done | "OK" is filler; name the acknowledgment |
| Continue | Next: Choose a plan | "Continue" skips telling users where they are going |
| Click here | Download invoice | Describes the mechanism, not the outcome |

### Before/after: button labels

**Before:** A checkout flow with buttons labeled "Back", "Continue", and "Submit"

**After:**
- "Back to cart"
- "Review order"
- "Place order"

Each label now tells the user what will happen, not just that something will happen.

---

## Form Fields

### Label patterns

Labels sit above the field (never inside it). They are brief nouns or noun phrases -- not questions, not instructions.

- "Email address" not "What is your email address?"
- "Company name" not "Enter your company name"
- "Phone number" not "Your phone"

Exception: when "Your" helps distinguish personal from company data ("Your name" vs "Company name"), use it.

### Placeholder text

Placeholder text is an example, not an instruction. It disappears when the user types. If the user needs to see the instruction while typing, it belongs in helper text, not the placeholder.

- "jane@example.com" not "Enter your email address"
- "Acme Corp" not "Type your company name here"
- "e.g., Marketing, Sales" not "Enter comma-separated values"

Placeholders should be lighter in color than input text. Do not rely on them for required information.

### Helper text

Helper text appears below the field and persists during input. Use it when the user needs context that is not obvious from the label.

- Character or format requirements: "Password must be at least 8 characters"
- Why the field exists: "We use this to calculate shipping, not for marketing"
- Acceptable values: "Enter a date in MM/DD/YYYY format"

Keep helper text to one sentence. Two sentences means the field design has a problem.

### Required field indicators

Use an asterisk (*) for required fields with a legend at the top of the form ("* Required"). Do not use "Optional" on every optional field -- it creates noise. Instead, mark only the few optional fields in a mostly-required form, or mark only required fields in a mostly-optional form. Match the annotation to the minority.

---

## Tooltips

### When to use

Tooltips explain unfamiliar UI controls or provide additional context for ambiguous labels. They are triggered by hover or focus and should not be required for core task completion.

Use tooltips for:
- Icon-only buttons without visible labels ("What does this icon do?")
- Technical terms that cannot be simplified in the label itself
- Non-obvious consequences of an action

Do not use tooltips for:
- Information the user needs before they can complete the task (put that in helper text or in the form itself)
- Mobile-first flows (hover does not exist on touch screens)
- Error explanations (errors need persistent messages, not hover-only hints)

### Length and format

Keep tooltips under 150 characters. They should be readable in a glance.

- One sentence only
- No markdown, no bullet lists
- No links (users cannot click inside a tooltip reliably)
- End with a period only if the sentence is a complete statement; skip it for fragments

### Trigger conventions

Tooltips should appear on hover after a short delay (200-400ms) to avoid triggering on accidental passes. They should dismiss when the user moves away. Keyboard focus should also trigger tooltips for accessibility.

---

## Notifications

### Types: toast vs banner vs inline

**Toast notifications** are temporary, auto-dismissing messages for low-urgency feedback. They appear at the edge of the screen and do not block the interface.
- Use for: success confirmations, non-critical alerts
- Dismiss: auto-dismiss after 4-6 seconds; provide manual dismiss
- Length: one sentence, under 80 characters

**Banner notifications** are persistent messages for ongoing states or important alerts. They appear at the top of the page and require explicit dismissal.
- Use for: account warnings, expiration notices, system status
- Dismiss: manual dismiss or when the underlying issue is resolved
- Length: one to two sentences; include a link or CTA if action is needed

**Inline notifications** appear adjacent to the affected content -- inside a form, within a list item, or near a specific UI element.
- Use for: field-level errors, item-level warnings, contextual status
- Dismiss: resolves when the user addresses the issue

### Urgency mapping

| Urgency | Type | Color | Auto-dismiss? |
|---------|------|-------|--------------|
| Confirmation (success) | Toast | Green | Yes (5s) |
| Info / FYI | Toast or banner | Blue | Toast: yes; Banner: no |
| Warning (action needed) | Banner | Yellow | No |
| Error (something failed) | Inline or banner | Red | No |
| Critical (data loss, security) | Banner | Red | No |

### Copy patterns for toasts

Success toasts confirm the action the user just took:
- "Changes saved"
- "File uploaded"
- "Team member removed"

Name the action. Do not write "Success!" or "Done!" -- they are filler.

---

## Confirmation Dialogs

### When to use

Confirmation dialogs are for actions that are difficult or impossible to undo. They interrupt the user's flow, which means they must be worth interrupting for.

Do not add confirmation dialogs to reversible actions. If deleting a file sends it to Trash and the user can recover it, a confirmation dialog is friction without protection. Reserve them for permanent deletions, billing changes, and account-level actions.

### Dialog structure

**Title:** State what is about to happen, not what the dialog is for.
- "Delete this project?" not "Confirm deletion"
- "Remove Sarah Chen from your team?" not "Remove team member"
- "Cancel your Pro subscription?" not "Are you sure?"

**Body:** State the consequence. One to two sentences. Be specific about what will be lost or changed.
- "This will permanently delete all 47 files in the project. You cannot undo this."
- "Sarah will lose access immediately and cannot be re-invited until you add her back manually."
- "You will lose your Pro features on April 15. Your data will be retained for 30 days."

**Action buttons:** Use specific verbs. Never "OK/Cancel".
- Primary (destructive): "Delete project" / "Remove Sarah" / "Cancel subscription"
- Secondary (dismiss): "Keep project" / "Never mind" / "Keep Pro plan"

The secondary action should undo the intent of the dialog title, not just say "Cancel."

### Before/after: confirmation dialog

**Before:**
- Title: "Are you sure?"
- Body: "This action cannot be undone."
- Buttons: "OK" / "Cancel"

**After:**
- Title: "Delete this project?"
- Body: "All 47 files and their revision history will be permanently deleted."
- Buttons: "Delete project" / "Keep project"

The "after" version tells users exactly what they are confirming, what they will lose, and what each button does.
