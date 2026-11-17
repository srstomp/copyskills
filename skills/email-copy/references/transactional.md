# Transactional Email

Order and shipping confirmations, receipts, password resets, sign-in codes, account and security alerts, reminders the reader asked for. The reader opens these to find out what happened and what to do. They get no persuasion framework: a receipt that builds desire or agitates a problem reads as an advert and costs trust.

## The job

Answer, in this order:
1. **What happened.** The event, in the subject and the first sentence: "Your order 10482 has shipped."
2. **The details the reader needs.** Only those: order number, what was ordered, amount, delivery window, the account or device involved. Take them from the brief or the placeholders; never invent a value.
3. **What happens next, or what to do.** One next step. If the reader must act (verify, reset, pay), that action is the button. If nothing is needed, say when the next thing happens.
4. **Where to get help.** One line: reply to this email, or a contact route from the brief.

Stop there. No sign-off paragraph about how much the company values the reader.

## Subject line and preheader

- The subject names the event and, where useful, the identifier, front-loaded: "Order 10482 has shipped", "Your sign-in code: {code}". Aim for 50 characters or fewer.
- The preheader adds the next fact, not a repeat: "Arrives Thursday or Friday. Track it with PostNL."
- No urgency words, no emoji, no exclamation marks.

## Placeholders

- Use every placeholder the brief gives exactly as written, including its braces: `{first_name}`, `{order_number}`, `{tracking_url}`. Never rename, translate or reformat one.
- Do not add placeholders the brief does not list, and do not write values that should come from one.
- Write sentences that still read correctly whatever the value is: "Order {order_number} has shipped", not "Your {item_count} items have shipped" when the count can be 1.
- In a language with grammatical gender or case, do not build a sentence that depends on a placeholder's value.

## No promotion

Keep cross-sells, discount codes, newsletter pitches and review requests out unless the brief asks for one, and then keep it below the transactional content and clearly separate. Promotional content can turn a transactional email into direct marketing. In the EU that generally needs prior consent, or the existing-customer exception with an opt-out; in the US, an email whose primary purpose is commercial must meet CAN-SPAM (opt-out, postal address). Rules vary by country, so if the brief asks for promotion in a transactional email, raise it as a `needs` item.

## Security and money emails

- Password reset, sign-in code, new device, changed email address: say what was requested, when the link or code expires, and what to do if the reader did not request it.
- Never ask for a password or a code in a reply.
- Payment failed, refund issued, invoice: state the amount, the date and the method exactly as the brief gives them.

## Tone

Calm and specific. A delay or a failed payment is told plainly with the fix, without apologising three times. Register follows the locale file and the brand (je or u, du or Sie); keep it identical to the brand's other emails. Legal requirements from the brief (age check at the door, cooling-off period, return window) are stated as facts, not hidden in a footer.

## Length

Most transactional emails need 40 to 120 words of body copy. A receipt's line items and totals are a table, not prose.

## Example

Brief: placeholders `{first_name}`, `{order_number}`, `{tracking_url}`. Facts: shipped with PostNL, usually 1 to 2 working days in the Netherlands, returns within 30 days, questions by reply. Locale en-GB.

Before (persuasion arc and filler):
> Great news, {first_name}! 🎉 Your exciting new running shoes are on their way to you! We know how much you've been looking forward to hitting the road. While you wait, why not check out our latest collection?

After:
> Subject: Order {order_number} has shipped
> Preheader: Arrives in 1 to 2 working days. Track it with PostNL.
>
> Hi {first_name},
>
> Your order {order_number} is on its way with PostNL. In the Netherlands it usually arrives in 1 to 2 working days.
>
> [Track your parcel]({tracking_url})
>
> You can return it within 30 days. If you have a question, reply to this email.

Every statement maps to a brief fact; the reader learns what happened, when it arrives and what to do if something is wrong.
