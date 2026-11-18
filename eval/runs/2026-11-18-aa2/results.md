# Results: 2026-11-18-aa2

Outcome: **keep**; preference lower bound is above zero and guards do not worsen.

## Preference

mean 0.0750, sd 0.1893, n tasks 15, one-sided 90% lower 0.0093, upper 0.1407.

## Defects

A minus B: mean 0.0213, sd 0.0331, n tasks 15, one-sided 90% lower 0.0098, upper 0.0328.

| Dev task | Preference score | Defects A minus B |
| --- | --- | --- |
| sakedeal-01 | 0.2500 | -0.0201 |
| sakedeal-02 | 0.0000 | 0.0014 |
| sakedeal-03 | 0.0625 | 0.0517 |
| yuzusake-01 | 0.1250 | 0.0716 |
| yuzusake-02 | 0.0625 | 0.0417 |
| yuzusake-03 | -0.3125 | 0.0357 |
| yuzusake-04 | -0.0625 | -0.0329 |
| plinkr-01 | -0.0625 | 0.0020 |
| plinkr-02 | 0.5000 | 0.0577 |
| plinkr-03 | -0.0625 | 0.0357 |
| plinkr-04 | 0.3125 | 0.0313 |
| plinkr-05 | 0.1875 | 0.0000 |
| plinkr-06 | 0.0625 | 0.0000 |
| reggy-01 | 0.0000 | -0.0191 |
| reggy-02 | 0.0625 | 0.0625 |

## Hard guards

| Arm | Failing dev outputs | Total dev outputs |
| --- | --- | --- |
| A | 2 | 60 |
| B | 1 | 60 |

- plinkr-02 B1: subject: max_chars 60, got 62

## Noisy guards

Lint errors per output, averaged within each task. B minus A: mean 0.0000, sd 0.0000, n tasks 15, one-sided 90% lower 0.0000, upper 0.0000.

| Dev task | A errors/output | B errors/output | B minus A |
| --- | --- | --- | --- |
| sakedeal-01 | 0.0000 | 0.0000 | 0.0000 |
| sakedeal-02 | 0.0000 | 0.0000 | 0.0000 |
| sakedeal-03 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-01 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-02 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-03 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-04 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-01 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-02 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-03 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-04 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-05 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-06 | 0.0000 | 0.0000 | 0.0000 |
| reggy-01 | 0.0000 | 0.0000 | 0.0000 |
| reggy-02 | 0.0000 | 0.0000 | 0.0000 |

| Dev task | Arm | Output | Lint errors |
| --- | --- | --- | --- |
| sakedeal-01 | A | 1 | 0 |
| sakedeal-01 | A | 2 | 0 |
| sakedeal-01 | A | 3 | 0 |
| sakedeal-01 | A | 4 | 0 |
| sakedeal-01 | B | 1 | 0 |
| sakedeal-01 | B | 2 | 0 |
| sakedeal-01 | B | 3 | 0 |
| sakedeal-01 | B | 4 | 0 |
| sakedeal-02 | A | 1 | 0 |
| sakedeal-02 | A | 2 | 0 |
| sakedeal-02 | A | 3 | 0 |
| sakedeal-02 | A | 4 | 0 |
| sakedeal-02 | B | 1 | 0 |
| sakedeal-02 | B | 2 | 0 |
| sakedeal-02 | B | 3 | 0 |
| sakedeal-02 | B | 4 | 0 |
| sakedeal-03 | A | 1 | 0 |
| sakedeal-03 | A | 2 | 0 |
| sakedeal-03 | A | 3 | 0 |
| sakedeal-03 | A | 4 | 0 |
| sakedeal-03 | B | 1 | 0 |
| sakedeal-03 | B | 2 | 0 |
| sakedeal-03 | B | 3 | 0 |
| sakedeal-03 | B | 4 | 0 |
| yuzusake-01 | A | 1 | 0 |
| yuzusake-01 | A | 2 | 0 |
| yuzusake-01 | A | 3 | 0 |
| yuzusake-01 | A | 4 | 0 |
| yuzusake-01 | B | 1 | 0 |
| yuzusake-01 | B | 2 | 0 |
| yuzusake-01 | B | 3 | 0 |
| yuzusake-01 | B | 4 | 0 |
| yuzusake-02 | A | 1 | 0 |
| yuzusake-02 | A | 2 | 0 |
| yuzusake-02 | A | 3 | 0 |
| yuzusake-02 | A | 4 | 0 |
| yuzusake-02 | B | 1 | 0 |
| yuzusake-02 | B | 2 | 0 |
| yuzusake-02 | B | 3 | 0 |
| yuzusake-02 | B | 4 | 0 |
| yuzusake-03 | A | 1 | 0 |
| yuzusake-03 | A | 2 | 0 |
| yuzusake-03 | A | 3 | 0 |
| yuzusake-03 | A | 4 | 0 |
| yuzusake-03 | B | 1 | 0 |
| yuzusake-03 | B | 2 | 0 |
| yuzusake-03 | B | 3 | 0 |
| yuzusake-03 | B | 4 | 0 |
| yuzusake-04 | A | 1 | 0 |
| yuzusake-04 | A | 2 | 0 |
| yuzusake-04 | A | 3 | 0 |
| yuzusake-04 | A | 4 | 0 |
| yuzusake-04 | B | 1 | 0 |
| yuzusake-04 | B | 2 | 0 |
| yuzusake-04 | B | 3 | 0 |
| yuzusake-04 | B | 4 | 0 |
| plinkr-01 | A | 1 | 0 |
| plinkr-01 | A | 2 | 0 |
| plinkr-01 | A | 3 | 0 |
| plinkr-01 | A | 4 | 0 |
| plinkr-01 | B | 1 | 0 |
| plinkr-01 | B | 2 | 0 |
| plinkr-01 | B | 3 | 0 |
| plinkr-01 | B | 4 | 0 |
| plinkr-02 | A | 1 | 0 |
| plinkr-02 | A | 2 | 0 |
| plinkr-02 | A | 3 | 0 |
| plinkr-02 | A | 4 | 0 |
| plinkr-02 | B | 1 | 0 |
| plinkr-02 | B | 2 | 0 |
| plinkr-02 | B | 3 | 0 |
| plinkr-02 | B | 4 | 0 |
| plinkr-03 | A | 1 | 0 |
| plinkr-03 | A | 2 | 0 |
| plinkr-03 | A | 3 | 0 |
| plinkr-03 | A | 4 | 0 |
| plinkr-03 | B | 1 | 0 |
| plinkr-03 | B | 2 | 0 |
| plinkr-03 | B | 3 | 0 |
| plinkr-03 | B | 4 | 0 |
| plinkr-04 | A | 1 | 0 |
| plinkr-04 | A | 2 | 0 |
| plinkr-04 | A | 3 | 0 |
| plinkr-04 | A | 4 | 0 |
| plinkr-04 | B | 1 | 0 |
| plinkr-04 | B | 2 | 0 |
| plinkr-04 | B | 3 | 0 |
| plinkr-04 | B | 4 | 0 |
| plinkr-05 | A | 1 | 0 |
| plinkr-05 | A | 2 | 0 |
| plinkr-05 | A | 3 | 0 |
| plinkr-05 | A | 4 | 0 |
| plinkr-05 | B | 1 | 0 |
| plinkr-05 | B | 2 | 0 |
| plinkr-05 | B | 3 | 0 |
| plinkr-05 | B | 4 | 0 |
| plinkr-06 | A | 1 | 0 |
| plinkr-06 | A | 2 | 0 |
| plinkr-06 | A | 3 | 0 |
| plinkr-06 | A | 4 | 0 |
| plinkr-06 | B | 1 | 0 |
| plinkr-06 | B | 2 | 0 |
| plinkr-06 | B | 3 | 0 |
| plinkr-06 | B | 4 | 0 |
| reggy-01 | A | 1 | 0 |
| reggy-01 | A | 2 | 0 |
| reggy-01 | A | 3 | 0 |
| reggy-01 | A | 4 | 0 |
| reggy-01 | B | 1 | 0 |
| reggy-01 | B | 2 | 0 |
| reggy-01 | B | 3 | 0 |
| reggy-01 | B | 4 | 0 |
| reggy-02 | A | 1 | 0 |
| reggy-02 | A | 2 | 0 |
| reggy-02 | A | 3 | 0 |
| reggy-02 | A | 4 | 0 |
| reggy-02 | B | 1 | 0 |
| reggy-02 | B | 2 | 0 |
| reggy-02 | B | 3 | 0 |
| reggy-02 | B | 4 | 0 |

Unsupported claims per output, averaged within each task. B minus A: mean -0.0500, sd 0.3018, n tasks 15, one-sided 90% lower -0.1548, upper 0.0548.

| Task | A claims/output | B claims/output | B minus A |
| --- | --- | --- | --- |
| sakedeal-01 | 0.0000 | 0.0000 | 0.0000 |
| sakedeal-02 | 0.5000 | 0.5000 | 0.0000 |
| sakedeal-03 | 0.2500 | 0.0000 | -0.2500 |
| yuzusake-01 | 1.0000 | 0.2500 | -0.7500 |
| yuzusake-02 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-03 | 0.5000 | 0.2500 | -0.2500 |
| yuzusake-04 | 0.5000 | 0.0000 | -0.5000 |
| plinkr-01 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-02 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-03 | 0.0000 | 0.2500 | 0.2500 |
| plinkr-04 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-05 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-06 | 0.0000 | 0.5000 | 0.5000 |
| reggy-01 | 0.0000 | 0.0000 | 0.0000 |
| reggy-02 | 1.0000 | 1.2500 | 0.2500 |

| Task | Arm | Output | Unsupported claims |
| --- | --- | --- | --- |
| plinkr-01 | A | 3 | 0 |
| plinkr-01 | B | 1 | 0 |
| plinkr-01 | A | 1 | 0 |
| plinkr-01 | B | 4 | 0 |
| plinkr-01 | A | 4 | 0 |
| plinkr-01 | B | 2 | 0 |
| plinkr-01 | A | 2 | 0 |
| plinkr-01 | B | 3 | 0 |
| plinkr-02 | A | 2 | 0 |
| plinkr-02 | A | 1 | 0 |
| plinkr-02 | A | 3 | 0 |
| plinkr-02 | A | 4 | 0 |
| plinkr-02 | B | 2 | 0 |
| plinkr-02 | B | 1 | 0 |
| plinkr-02 | B | 3 | 0 |
| plinkr-02 | B | 4 | 0 |
| plinkr-03 | B | 4 | 0 |
| plinkr-03 | B | 2 | 0 |
| plinkr-03 | A | 4 | 0 |
| plinkr-03 | A | 3 | 0 |
| plinkr-03 | B | 1 | 1 |
| plinkr-03 | A | 2 | 0 |
| plinkr-03 | B | 3 | 0 |
| plinkr-03 | A | 1 | 0 |
| plinkr-04 | B | 4 | 0 |
| plinkr-04 | A | 3 | 0 |
| plinkr-04 | B | 3 | 0 |
| plinkr-04 | A | 4 | 0 |
| plinkr-04 | A | 1 | 0 |
| plinkr-04 | B | 2 | 0 |
| plinkr-04 | B | 1 | 0 |
| plinkr-04 | A | 2 | 0 |
| plinkr-05 | B | 1 | 0 |
| plinkr-05 | B | 4 | 0 |
| plinkr-05 | B | 2 | 0 |
| plinkr-05 | B | 3 | 0 |
| plinkr-05 | A | 4 | 0 |
| plinkr-05 | A | 2 | 0 |
| plinkr-05 | A | 3 | 0 |
| plinkr-05 | A | 1 | 0 |
| plinkr-06 | A | 4 | 0 |
| plinkr-06 | B | 1 | 0 |
| plinkr-06 | A | 3 | 0 |
| plinkr-06 | B | 4 | 0 |
| plinkr-06 | A | 1 | 0 |
| plinkr-06 | A | 2 | 0 |
| plinkr-06 | B | 2 | 1 |
| plinkr-06 | B | 3 | 1 |
| reggy-01 | B | 3 | 0 |
| reggy-01 | A | 3 | 0 |
| reggy-01 | B | 2 | 0 |
| reggy-01 | A | 1 | 0 |
| reggy-01 | B | 4 | 0 |
| reggy-01 | A | 4 | 0 |
| reggy-01 | B | 1 | 0 |
| reggy-01 | A | 2 | 0 |
| reggy-02 | B | 2 | 1 |
| reggy-02 | B | 3 | 1 |
| reggy-02 | A | 2 | 1 |
| reggy-02 | B | 4 | 0 |
| reggy-02 | A | 1 | 2 |
| reggy-02 | A | 4 | 1 |
| reggy-02 | B | 1 | 3 |
| reggy-02 | A | 3 | 0 |
| sakedeal-01 | A | 3 | 0 |
| sakedeal-01 | A | 2 | 0 |
| sakedeal-01 | B | 3 | 0 |
| sakedeal-01 | B | 4 | 0 |
| sakedeal-01 | B | 1 | 0 |
| sakedeal-01 | A | 4 | 0 |
| sakedeal-01 | A | 1 | 0 |
| sakedeal-01 | B | 2 | 0 |
| sakedeal-02 | A | 4 | 0 |
| sakedeal-02 | B | 1 | 0 |
| sakedeal-02 | A | 1 | 0 |
| sakedeal-02 | A | 2 | 1 |
| sakedeal-02 | B | 3 | 1 |
| sakedeal-02 | B | 4 | 1 |
| sakedeal-02 | A | 3 | 1 |
| sakedeal-02 | B | 2 | 0 |
| sakedeal-03 | A | 4 | 0 |
| sakedeal-03 | B | 1 | 0 |
| sakedeal-03 | B | 2 | 0 |
| sakedeal-03 | B | 3 | 0 |
| sakedeal-03 | A | 1 | 0 |
| sakedeal-03 | A | 3 | 1 |
| sakedeal-03 | B | 4 | 0 |
| sakedeal-03 | A | 2 | 0 |
| yuzusake-01 | B | 4 | 0 |
| yuzusake-01 | B | 1 | 0 |
| yuzusake-01 | B | 3 | 1 |
| yuzusake-01 | A | 4 | 2 |
| yuzusake-01 | B | 2 | 0 |
| yuzusake-01 | A | 3 | 1 |
| yuzusake-01 | A | 1 | 0 |
| yuzusake-01 | A | 2 | 1 |
| yuzusake-02 | B | 4 | 0 |
| yuzusake-02 | B | 3 | 0 |
| yuzusake-02 | A | 2 | 0 |
| yuzusake-02 | A | 3 | 0 |
| yuzusake-02 | A | 1 | 0 |
| yuzusake-02 | B | 1 | 0 |
| yuzusake-02 | A | 4 | 0 |
| yuzusake-02 | B | 2 | 0 |
| yuzusake-03 | A | 3 | 1 |
| yuzusake-03 | B | 2 | 0 |
| yuzusake-03 | A | 4 | 1 |
| yuzusake-03 | B | 3 | 1 |
| yuzusake-03 | A | 1 | 0 |
| yuzusake-03 | B | 1 | 0 |
| yuzusake-03 | A | 2 | 0 |
| yuzusake-03 | B | 4 | 0 |
| yuzusake-04 | A | 3 | 1 |
| yuzusake-04 | B | 3 | 0 |
| yuzusake-04 | B | 1 | 0 |
| yuzusake-04 | B | 4 | 0 |
| yuzusake-04 | A | 1 | 1 |
| yuzusake-04 | A | 4 | 0 |
| yuzusake-04 | B | 2 | 0 |
| yuzusake-04 | A | 2 | 0 |

## Holdout and report tasks

Excluded from the dev estimates and outcome.

| Task | Set | Preference | Defects A minus B | Lint B minus A | Claims B minus A | B hard failures |
| --- | --- | --- | --- | --- | --- | --- |

## Words / budget

Mean of words divided by max_words (or min_words if no maximum). Character-only budgets are labelled chars; these ratios are descriptive, not a word-budget check.

| Task | Set | Deliverable | Budget | A words/budget | B words/budget |
| --- | --- | --- | --- | --- | --- |
| sakedeal-01 | dev | title | 60 chars | 0.1375 | 0.1500 |
| sakedeal-01 | dev | meta | 155 chars | 0.1565 | 0.1548 |
| sakedeal-01 | dev | description | 160 words | 0.9141 | 0.9844 |
| sakedeal-02 | dev | title | 60 chars | 0.0833 | 0.0833 |
| sakedeal-02 | dev | meta | 155 chars | 0.1565 | 0.1597 |
| sakedeal-02 | dev | description | 160 words | 0.8563 | 0.8391 |
| sakedeal-03 | dev | h1 | none | n/a | n/a |
| sakedeal-03 | dev | intro | 180 words | 0.7417 | 0.6764 |
| sakedeal-03 | dev | title | 60 chars | 0.0667 | 0.0667 |
| sakedeal-03 | dev | meta | 155 chars | 0.1548 | 0.1565 |
| yuzusake-01 | dev | description | 170 words | 0.8882 | 0.9368 |
| yuzusake-01 | dev | serve_tip | 120 chars | 0.0875 | 0.0958 |
| yuzusake-02 | dev | description | 140 words | 0.9964 | 0.9821 |
| yuzusake-02 | dev | meta | 155 chars | 0.1548 | 0.1500 |
| yuzusake-03 | dev | empty_heading | 40 chars | 0.1000 | 0.1000 |
| yuzusake-03 | dev | empty_body | 100 chars | 0.1150 | 0.1150 |
| yuzusake-03 | dev | empty_button | 24 chars | 0.1250 | 0.1250 |
| yuzusake-03 | dev | age_question | 40 chars | 0.1313 | 0.1313 |
| yuzusake-03 | dev | age_yes | 24 chars | 0.1667 | 0.2083 |
| yuzusake-03 | dev | age_no | 24 chars | 0.1250 | 0.1354 |
| yuzusake-03 | dev | age_no_line | 120 chars | 0.1083 | 0.1125 |
| yuzusake-04 | dev | article | 600 words | 0.7017 | 0.7000 |
| plinkr-01 | dev | subject | 60 chars | 0.0833 | 0.0833 |
| plinkr-01 | dev | preheader | 80 chars | 0.1563 | 0.1500 |
| plinkr-01 | dev | body | 150 words | 0.8000 | 0.8200 |
| plinkr-02 | dev | subject | 60 chars | 0.1375 | 0.1583 |
| plinkr-02 | dev | preheader | 80 chars | 0.1375 | 0.1187 |
| plinkr-02 | dev | body | 110 words | 0.8500 | 0.8591 |
| plinkr-03 | dev | empty_invitations | 90 chars | 0.1528 | 0.1194 |
| plinkr-03 | dev | empty_documents | 110 chars | 0.1409 | 0.1386 |
| plinkr-03 | dev | error_generic | 90 chars | 0.1000 | 0.1278 |
| plinkr-03 | dev | error_connection | 90 chars | 0.1194 | 0.1056 |
| plinkr-03 | dev | error_email_change | 90 chars | 0.1139 | 0.1194 |
| plinkr-03 | dev | error_file_open | 90 chars | 0.1250 | 0.1250 |
| plinkr-03 | dev | error_number_only | 60 chars | 0.1000 | 0.1000 |
| plinkr-04 | dev | welcome_morning | 40 chars | 0.0500 | 0.0500 |
| plinkr-04 | dev | start_title | 40 chars | 0.1500 | 0.1500 |
| plinkr-04 | dev | start_description | 80 chars | 0.1125 | 0.1125 |
| plinkr-04 | dev | start_intake_subtitle | 110 chars | 0.1409 | 0.1500 |
| plinkr-04 | dev | start_collaboration_explainer | 260 chars | 0.1462 | 0.1481 |
| plinkr-04 | dev | start_button | 15 chars | 0.0667 | 0.0667 |
| plinkr-04 | dev | success_password_changed | 50 chars | 0.0800 | 0.0800 |
| plinkr-04 | dev | success_email_change | 100 chars | 0.1025 | 0.1150 |
| plinkr-05 | dev | empty_invitations | 70 chars | 0.0857 | 0.0929 |
| plinkr-05 | dev | empty_documents | 160 chars | 0.1359 | 0.1359 |
| plinkr-05 | dev | toast_resident_invited | 40 chars | 0.0500 | 0.0500 |
| plinkr-05 | dev | delete_note_body | 110 chars | 0.1023 | 0.1000 |
| plinkr-05 | dev | delete_note_confirm_button | 30 chars | 0.0667 | 0.0750 |
| plinkr-05 | dev | timeline_onboarding_text | 180 chars | 0.1153 | 0.1153 |
| plinkr-06 | dev | subject | 60 chars | 0.0500 | 0.0500 |
| plinkr-06 | dev | subject_crisis | 70 chars | 0.0571 | 0.0571 |
| plinkr-06 | dev | preheader | 80 chars | 0.1250 | 0.1375 |
| plinkr-06 | dev | body | 100 words | 0.7175 | 0.8125 |
| plinkr-06 | dev | crisis_banner | 60 chars | 0.0833 | 0.0833 |
| reggy-01 | dev | subject_pending | 60 chars | 0.0792 | 0.0917 |
| reggy-01 | dev | heading_pending | 50 chars | 0.0950 | 0.1050 |
| reggy-01 | dev | body_pending | 90 words | 0.8306 | 0.7889 |
| reggy-01 | dev | action_label_pending | 30 chars | 0.0750 | 0.0917 |
| reggy-01 | dev | subject_verified | 60 chars | 0.0792 | 0.0792 |
| reggy-01 | dev | heading_verified | 50 chars | 0.0650 | 0.0600 |
| reggy-01 | dev | body_verified | 60 words | 0.8333 | 0.7958 |
| reggy-01 | dev | action_label_verified | 30 chars | 0.1250 | 0.1167 |
| reggy-02 | dev | connectivity_error | 80 chars | 0.1531 | 0.1531 |
| reggy-02 | dev | deadline_error | 100 chars | 0.1600 | 0.1575 |
| reggy-02 | dev | outage_error | 70 chars | 0.1714 | 0.1643 |
| reggy-02 | dev | rate_limit_error | 90 chars | 0.1694 | 0.1861 |
| reggy-02 | dev | byo_credentials_error | 100 chars | 0.1450 | 0.1625 |
| reggy-02 | dev | tenant_not_provisioned_error | 110 chars | 0.1545 | 0.1455 |
| reggy-02 | dev | campaign_locked_error | 90 chars | 0.1278 | 0.1361 |
| reggy-02 | dev | payment_method_error | 90 chars | 0.1500 | 0.1583 |
