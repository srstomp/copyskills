---
id: plinkr-01                 # <project>-<two digits>; unique across tasks/, holdout/, report-only/
project: plinkr               # sakedeal | yuzusake | plinkr | reggy
set: dev                      # dev | holdout | report
channel: email                # email | app | portal | web | shop | article
locale: nl-NL                 # BCP 47
audience: "Inwoners met geldzorgen die door een hulpverlener zijn doorverwezen"   # one line, in the task's language or English
register: je                  # je | u | du | Sie | you
email_type: transactional     # only for channel: email; ids from skills/email-copy/SKILL.md
deliverables:                 # every field the output must contain, in order, with budgets
  - name: subject
    max_chars: 50
  - name: preheader
    max_chars: 90
  - name: body
    min_words: 60
    max_words: 120
placeholders: ["{first_name}", "{link}"]   # must appear unchanged in the output; [] if none
target_query: null            # SEO query for this locale, or null
replaces: "ffc/lambdas/send-email/index.ts (referral mail)"   # existing copy this task rewrites, or null
samples: pending-owner-approval   # none | project | pending-owner-approval (voice samples live in eval/samples/<project>/, never here)
---

## Brief

What the copy is for, when the reader sees it, and what they should do or know afterwards. Two to five sentences. No facts here that are not in the fact sheet.

## Facts

F1: One fact per line, stated plainly. (source: path/to/file.ts:42 or https://url)
F2: ...

## Unknown

- Facts a writer might want but that no source gives (the writer must not invent them).

## Existing copy

The copy this task replaces, quoted exactly, or "None". Writers treat it as unverified input, never as a source of facts.
