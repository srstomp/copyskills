---
title: A/B Testing Copy
---

# A/B Testing Copy

A/B testing for copy is not random variation. It is hypothesis-driven experimentation. Every variant you write should answer a specific question about why readers are or are not converting.

---

## The Core Discipline: One Variable Per Test

The most common A/B testing mistake is changing multiple things between variants. If you rewrite the headline AND change the CTA AND swap the social proof, you have no idea which change drove the result.

**Rule:** Change exactly one copy element per test. Name that element explicitly before writing the variants.

| What you can test in one variant | What you cannot combine in one variant |
|----------------------------------|---------------------------------------|
| Headline only | Headline + CTA |
| CTA text only | CTA text + button color |
| Social proof type or placement | Social proof + headline |
| Objection-handling copy only | Objection copy + pricing display |
| Subheadline only | Subheadline + body copy |

If the brief asks for multiple changes, break them into separate test sequences, each with its own hypothesis.

---

## Hypothesis Format

Every A/B test needs a written hypothesis before any copy is drafted. The hypothesis format:

```
If we change [element] from [current] to [proposed],
we expect [metric] to [direction] because [reason].
```

The "because" is the most important part. Without a reason grounded in user behavior or copy theory, you are guessing. With a reason, you are testing an assumption that can be validated or disproved.

**Example hypotheses:**

Headline test:
> If we change the homepage headline from "Project management for remote teams" to "Stop losing track of who owns what", we expect free trial signups to increase because the current headline describes the product category and the proposed variant names the specific pain that drives intent.

CTA test:
> If we change the CTA from "Start your free trial" to "Start my free trial", we expect CTA click-through rate to increase because first-person ownership language has outperformed second-person in multiple documented tests for comparable SaaS products.

Social proof test:
> If we change the social proof below the hero from a logo strip to a single named customer quote with a specific metric, we expect demo request conversion to increase because the logo strip signals familiarity but not credibility, while a specific result quote answers the unstated objection "but does it actually work?"

---

## What to Test

Not all copy elements have the same leverage. Prioritize tests in order of funnel impact.

### High-leverage tests

**Headlines**
The headline is the highest-leverage single element on any page. A headline shift can move conversion 10-40% in either direction. Test:
- Benefit-led vs. problem-led
- Specific outcome vs. category statement
- Question format vs. statement format
- Who-it's-for frame vs. what-it-does frame

**CTAs**
CTA copy is low-word, high-impact. Test:
- Verb choice ("Start" vs. "Get" vs. "Try")
- Specificity ("Start your free trial" vs. "Start my 14-day trial")
- Ownership frame (second-person "your" vs. first-person "my")
- Friction reducers as subtext ("No credit card required" present vs. absent)

**Social proof type and placement**
What proof you use and where you place it both affect conversion independently. Test:
- Named quote with metric vs. logo strip
- Proof placed below hero vs. proof placed adjacent to CTA
- Aggregate number ("4,200 teams") vs. named customer story

### Medium-leverage tests

**Subheadlines**
Subheadlines clarify the headline and handle the "for me?" question. Test:
- Audience-specific ("Built for ops teams at Series B companies") vs. generic ("For teams of all sizes")
- How-it-works framing vs. who-it's-for framing

**Objection-handling copy**
The copy near the CTA that preempts hesitation. Test:
- Which objection to address (price, commitment, complexity)
- How to frame the answer (remove risk vs. add value)

**Form field labels and microcopy**
On registration pages, field label wording and placeholder copy affect completion rate. Test:
- "Work email" vs. "Email address"
- "Your name" vs. "First name"
- Explaining why you need a field vs. not explaining

---

## Example Test Designs

### Test 1: SaaS trial page headline

**Context:** 14-day trial signup page. Current headline is "Powerful analytics for growing teams." Conversion rate is below benchmark for the traffic source.

**Hypothesis:** If we change the headline from "Powerful analytics for growing teams" to "Know which campaigns are actually driving revenue", we expect trial signups to increase because "powerful analytics" is a category claim that every competitor makes, while the proposed variant names the specific decision the buyer is trying to make better.

**Variant A (control):**
Headline: Powerful analytics for growing teams

**Variant B (challenger):**
Headline: Know which campaigns are actually driving revenue

**Variable tested:** Headline only. CTA, subheadline, and page structure unchanged.

**Success metric:** Trial signup conversion rate on the landing page.

**Minimum detectable effect:** 10% relative change (set based on current traffic volume and statistical power requirements).

---

### Test 2: Upgrade prompt CTA

**Context:** In-app upgrade prompt shown when a free-tier user hits the project limit. Current CTA is "Upgrade your plan". Click-through to pricing page is low.

**Hypothesis:** If we change the upgrade CTA from "Upgrade your plan" to "Unlock unlimited projects", we expect click-through to increase because "upgrade your plan" is process-focused (a thing the user has to do) while "unlock unlimited projects" is outcome-focused (the thing the user gets).

**Variant A (control):**
CTA: Upgrade your plan

**Variant B (challenger):**
CTA: Unlock unlimited projects

**Variable tested:** CTA button label only. Surrounding copy, modal design, and pricing page unchanged.

**Success metric:** Click-through rate from prompt to pricing page.

---

### Test 3: Homepage social proof placement

**Context:** SaaS homepage. Current design shows a customer logo strip immediately below the hero. Hypothesis is that the logo strip is decorative rather than persuasive at this position.

**Hypothesis:** If we replace the logo strip below the hero with a single named customer quote including a specific result metric, we expect demo requests to increase because a named quote with a specific outcome ("cut reporting time by 60%") addresses the conversion-blocking question "does this actually work?" more directly than logos the reader may not recognize.

**Variant A (control):**
Below hero: logo strip of 8 customer logos

**Variant B (challenger):**
Below hero: "We cut our reporting time by 60% in the first month. Now my team spends Mondays on analysis, not data wrangling." -- Jamie Okafor, Head of Analytics, Meridian

**Variable tested:** Social proof element type and content. Logo strip replaced by named quote. No other changes.

**Success metric:** Demo request conversion rate (primary). Scroll depth past the hero section (secondary, to check if the quote is read).

---

## What Makes a Good Copy Hypothesis

A hypothesis is testable when it is:

- **Specific:** Names the exact element changing, not "the page copy"
- **Directional:** States which direction the metric should move (increase, not "change")
- **Reasoned:** Gives a behavioral or copy-theory reason why the change should work
- **Falsifiable:** Would a negative result tell you something useful?

A hypothesis is not testable when it says: "We think the new copy will perform better." That is a preference, not a hypothesis.

---

## After the Test

Record results in hypothesis format to build institutional knowledge:

```
Hypothesis: [original hypothesis text]
Result: [Variant B won / Variant A won / no statistically significant difference]
Effect size: [X% relative change in metric]
Confidence: [statistical confidence level]
Learning: [what this tells us about our audience's behavior or motivations]
Next test: [what this result suggests testing next]
```

Inconclusive results are not failures. An inconclusive result means the variable you tested does not have strong leverage at this position, or your sample size was too small to detect the effect. Both are useful to know.
