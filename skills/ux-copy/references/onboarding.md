# Onboarding Copy Reference

Flow types, copy patterns, and examples for welcome screens, setup wizards, feature discovery, and progressive disclosure.

---

## Onboarding Flow Types

| Flow type | When to use | Primary copy challenge |
|-----------|-------------|----------------------|
| Welcome screen | First login, post-signup landing | Communicate value, not features |
| Setup wizard | Product requires configuration before use | Keep users moving forward; reduce drop-off |
| Feature discovery (coach marks) | Existing user encounters new feature | Contextual, dismissible, not interruptive |
| Progressive disclosure | Complex product with many features | Reveal complexity only when the user is ready |

---

## Welcome Screen Copy

The welcome screen is not a product tour. It is a handshake. Users just signed up -- they believe in the product enough to give you their email. Do not spend this moment on features. Spend it on what they are about to be able to do.

### Headline

The headline communicates a benefit, not a feature.

- Benefit: "Your projects, in one place" (what they get)
- Feature: "A new way to manage tasks" (what the product does)

Keep it under 10 words. It will be the first thing they read and likely the only thing if you lose them here.

### Subhead

One sentence. Tells the user what they can do right now.

- "Add your first project and invite your team to get started."
- "Connect your calendar and we will show you what is overdue."

Do not use the subhead to restate the headline in different words.

### CTA

The CTA on a welcome screen is the first action you want the user to take. Make it specific and low-friction.

- "Create your first project" beats "Get started"
- "Connect your calendar" beats "Set up your account"
- "Invite your team" beats "Continue"

If the user needs to complete setup before using the product, name the setup step -- do not say "Let's go."

### Before/after: welcome screen

**Before:**
- Headline: "Welcome to Acme!"
- Subhead: "We're glad you're here. Let's get started."
- CTA: "Get started"

**After:**
- Headline: "Your team's work, all in one place"
- Subhead: "Create a project and invite your first team member to see how it comes together."
- CTA: "Create your first project"

The "after" version grounds the welcome in the user's world and tells them exactly what to do next.

---

## Setup Wizard

Setup wizards exist because the product cannot deliver value without some configuration. Every step must justify its presence. If removing it would not break the product, remove it.

### Step titles

Step titles state the outcome of completing the step, not the action itself.

- "Connect your tools" not "Step 2: Integrations"
- "Add your team" not "Invite members"
- "Set your notifications" not "Preferences"

### Step descriptions

One to two sentences. State what completing this step enables. Do not explain the UI -- the UI should explain itself.

- "Connect Slack to get notified when your teammates comment or complete tasks."
- "Add up to 5 team members now. You can always add more later."

The phrase "You can always add more later" is high-value for reducing wizard drop-off. It removes the pressure to get everything right on the first attempt.

### Progress indicators

Show users where they are in the flow. "Step 2 of 4" is better than a progress bar with no numbers. Both are better than nothing.

Keep wizards to 5 steps or fewer. If the flow requires more, look for steps to skip, combine, or defer until after first value.

### Skip and back options

Always offer a skip option for optional steps. Label it "Skip for now" not just "Skip" -- the qualifier "for now" signals that skipping is acceptable and recoverable.

Offer a back option on every step except the first. Users who feel trapped drop out.

---

## Feature Discovery

### Tooltip tours (coach marks)

Coach marks are overlays or highlighted tooltips that draw attention to specific UI elements. They are appropriate when:
- A new feature has shipped that existing users may not notice
- A critical feature is consistently overlooked (use analytics to confirm before adding a coach mark)
- The feature's icon or label alone does not communicate its value

They are not appropriate as a default product tour for new users -- most users dismiss unsolicited tours without reading them.

### Coach mark copy

Each coach mark has three elements:

**Pointer/highlight:** Points to the specific element. No copy.

**Headline:** Names what the element does. 3-6 words.
- "Filter by team member"
- "Save this view for later"
- "Track time on any task"

**Description:** One sentence. Benefit-oriented.
- "See only the tasks assigned to a specific person."
- "Bookmark this filter so you can return to it without re-setting it."

**Action:** "Got it" to dismiss. Optionally a link: "Try it now" or "Learn more."

Do not write "Did you know...?" as a coach mark opener. It reads as a trivia question and sets the wrong register for a product moment.

### Contextual prompts

Contextual prompts appear at the moment a user could benefit from a feature, triggered by behavior. They are less interruptive than coach marks because they appear only when the user is already doing the relevant thing.

Example: a user is creating their third task manually. The prompt appears: "You create a lot of tasks. Import a task list to add them all at once."

Copy pattern: "[Observation about what they are doing]. [Feature that makes it easier]. [One-word CTA]."

---

## Progressive Disclosure

### Revealing complexity gradually

Start with the simplest version of any feature. Introduce advanced options only after the user has used the basic version.

This applies to:
- Settings panels: show 4-5 core settings; put advanced settings behind an "Advanced" toggle
- Form fields: show required fields first; add optional fields in a "More options" expansion
- Feature sets: activate basic features by default; explain advanced features through contextual moments

### Celebrating completions

Brief celebration moments reinforce progress without interrupting flow. They work best at natural stopping points: completing a setup step, finishing onboarding, reaching a milestone.

Keep them short:
- "You are all set up." + confetti (one screen)
- "First project created." + prompt to invite a teammate

Do not hold users on a celebration screen for more than 3 seconds. Auto-advance or provide a clear "continue" CTA.

### Example onboarding flow

**Product:** Project management tool  
**Goal:** Get the user to create a project and invite one teammate

**Screen 1: Welcome**
- Headline: "Your team's work, finally organized"
- Subhead: "Create a project to get started. It takes about 2 minutes."
- CTA: "Create your first project"
- Skip: not applicable (skip takes them to an empty home state)

**Screen 2: Create project**
- Step title: "Name your project"
- Description: "Keep it simple -- you can rename it anytime."
- Field label: "Project name"
- Placeholder: "e.g., Website redesign, Q3 launch"
- CTA: "Create project"

**Screen 3: Invite team**
- Step title: "Add your team"
- Description: "Projects work best with at least one other person. Add up to 5 teammates now."
- Field label: "Email addresses"
- Placeholder: "colleague@company.com"
- CTA: "Send invitations"
- Skip: "Skip for now"

**Screen 4: Completion**
- Headline: "Your project is ready."
- Subhead: "Your teammates will get an invitation email."
- CTA: "Go to your project"
