status: pending-owner-approval (shipped copy; the owner has not yet approved it as a voice sample)

# Reggy voice samples for the generator

## Voice rules (reggy-launch/PRODUCT.md)

- "Precise, technical, trustworthy. The voice is an engineer talking to engineers: exact, unhyped, quietly confident." (PRODUCT.md:28-29)
- "Tone is calm and declarative, never salesy or breathless." (PRODUCT.md:30-31)
- "**Every word load-bearing.** Copy is terse and concrete. No restated headings, no filler intros. If a sentence doesn't add information, cut it." (PRODUCT.md:51-52)
- "**Engineering credibility over persuasion.**" and "**Show the mechanism.**" (PRODUCT.md:45,47)
- Not: crypto hype, generic SaaS template, childish or playful tone. (PRODUCT.md:34-41)
- Header of the invitation mail source: "no exclamation marks, no adjectives about the product, plain statements of fact the recipient can verify, and an explicit line about what to do if they did not expect it." (reggy-api/infra/lambda/tenant/invitation-mail.ts:16-21)

## Shipped invitation mail (reggy-api/infra/lambda/tenant/invitation-mail.ts:108-139)

Subject: You have been invited to ${workspace} on Reggy
(without a workspace name: You have been invited to a workspace on Reggy)

Heading: Join ${workspace} on Reggy
(without a workspace name: Join a workspace on Reggy)

Paragraph 1: ${inviter} invited you to ${workspaceLabel} on Reggy, the email sending platform.
(without a known inviter: You have been invited to ${workspaceLabel} on Reggy, the email sending platform.)

Paragraph 2: The invitation is bound to ${invitedEmail}. Sign in with an account whose verified email is that address; a different address cannot claim it.

Paragraph 3: The link below works once and stops working on ${expires}. After that, ask ${inviter || 'whoever invited you'} to send a new one.
(without an expiry instant: The link below works once. If it has expired, ask ${inviter || 'whoever invited you'} to send a new one.)

Paragraph 4: If you were not expecting this, no action is needed and nothing has been created in your name. Ignoring this message lets the invitation expire.

Action: Accept the invitation

Reply line added by the template (reggy-api/infra/lambda/shared/platform-mail-template.ts:104): This address does not accept replies.
