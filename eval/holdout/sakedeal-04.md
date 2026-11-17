---
id: sakedeal-04
project: sakedeal
set: holdout
channel: email
locale: nl-NL
audience: "Nederlandse klanten van Sakedeal wiens bestelling net is verstuurd"
register: je
email_type: transactional
deliverables:
  - name: subject
    max_chars: 50
  - name: preheader
    max_chars: 90
  - name: body
    max_words: 120
placeholders: ["{first_name}", "{order_number}", "{tracking_url}"]
target_query: null
replaces: null
samples: none
---

## Brief

The order-shipped email for a Sakedeal customer in the Netherlands. It goes out when the parcel is handed to the courier. The reader should know the order is on its way, where to track it, that someone aged 18 or older must be at the door, and how to ask a question.

## Facts

F1: The order has been handed to PostNL. (source: eval v1 holdout.md H3)
F2: Delivery in the Netherlands usually takes 1-2 working days. (source: eval v1 holdout.md H3)
F3: The courier checks that the recipient is 18 or older at the door; no ID, no delivery. (source: eval v1 holdout.md H3)
F4: Returns: 14 days for unopened bottles. (source: eval v1 holdout.md H3)
F5: Questions: reply to this email. (source: eval v1 holdout.md H3)

## Unknown

- Order contents, delivery date or time window.
- What happens when nobody is home or nobody can show ID.
- Sender name or signature.
- Delivery times outside the Netherlands (this email is for NL).

## Existing copy

None.
