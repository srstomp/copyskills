# Results: 2026-11-17-aa

Outcome: **revert**; candidate B has more hard guard failures than A (1 vs 0).

## Preference

mean -0.1062, sd 0.1601, n tasks 15, one-sided 90% lower -0.1619, upper -0.0506.

## Defects

A minus B: mean 0.0008, sd 0.0405, n tasks 15, one-sided 90% lower -0.0133, upper 0.0148.

| Dev task | Preference score | Defects A minus B |
| --- | --- | --- |
| sakedeal-01 | -0.2500 | 0.0005 |
| sakedeal-02 | -0.1875 | -0.0203 |
| sakedeal-03 | 0.0000 | 0.0357 |
| yuzusake-01 | 0.0625 | 0.0886 |
| yuzusake-02 | -0.1250 | -0.0476 |
| yuzusake-03 | 0.0000 | 0.0357 |
| yuzusake-04 | -0.1875 | -0.0588 |
| plinkr-01 | 0.0000 | -0.0179 |
| plinkr-02 | 0.1875 | 0.0000 |
| plinkr-03 | -0.2813 | -0.0357 |
| plinkr-04 | -0.2500 | -0.0313 |
| plinkr-05 | 0.0000 | 0.0000 |
| plinkr-06 | -0.3125 | 0.0000 |
| reggy-01 | -0.3125 | 0.0000 |
| reggy-02 | 0.0625 | 0.0625 |

## Hard guards

| Arm | Failing dev outputs | Total dev outputs |
| --- | --- | --- |
| A | 0 | 60 |
| B | 1 | 60 |

- plinkr-03 B1: empty_invitations: max_chars 90, got 93

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

Unsupported claims per output, averaged within each task. B minus A: mean 0.0000, sd 0.2988, n tasks 15, one-sided 90% lower -0.1038, upper 0.1038.

| Task | A claims/output | B claims/output | B minus A |
| --- | --- | --- | --- |
| sakedeal-01 | 0.0000 | 0.0000 | 0.0000 |
| sakedeal-02 | 0.7500 | 1.0000 | 0.2500 |
| sakedeal-03 | 0.5000 | 0.2500 | -0.2500 |
| yuzusake-01 | 1.0000 | 0.2500 | -0.7500 |
| yuzusake-02 | 0.2500 | 0.5000 | 0.2500 |
| yuzusake-03 | 0.2500 | 0.0000 | -0.2500 |
| yuzusake-04 | 0.0000 | 0.2500 | 0.2500 |
| plinkr-01 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-02 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-03 | 3.0000 | 2.7500 | -0.2500 |
| plinkr-04 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-05 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-06 | 0.0000 | 0.5000 | 0.5000 |
| reggy-01 | 0.2500 | 0.2500 | 0.0000 |
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
| plinkr-03 | B | 4 | 3 |
| plinkr-03 | B | 2 | 3 |
| plinkr-03 | A | 4 | 3 |
| plinkr-03 | A | 3 | 3 |
| plinkr-03 | B | 1 | 2 |
| plinkr-03 | A | 2 | 3 |
| plinkr-03 | B | 3 | 3 |
| plinkr-03 | A | 1 | 3 |
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
| plinkr-06 | B | 4 | 1 |
| plinkr-06 | A | 1 | 0 |
| plinkr-06 | A | 2 | 0 |
| plinkr-06 | B | 2 | 0 |
| plinkr-06 | B | 3 | 1 |
| reggy-01 | B | 3 | 0 |
| reggy-01 | A | 3 | 0 |
| reggy-01 | B | 2 | 0 |
| reggy-01 | A | 1 | 0 |
| reggy-01 | B | 4 | 0 |
| reggy-01 | A | 4 | 0 |
| reggy-01 | B | 1 | 1 |
| reggy-01 | A | 2 | 1 |
| reggy-02 | B | 2 | 2 |
| reggy-02 | B | 3 | 1 |
| reggy-02 | A | 2 | 1 |
| reggy-02 | B | 4 | 0 |
| reggy-02 | A | 1 | 1 |
| reggy-02 | A | 4 | 1 |
| reggy-02 | B | 1 | 2 |
| reggy-02 | A | 3 | 1 |
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
| sakedeal-02 | A | 1 | 2 |
| sakedeal-02 | A | 2 | 1 |
| sakedeal-02 | B | 3 | 1 |
| sakedeal-02 | B | 4 | 3 |
| sakedeal-02 | A | 3 | 0 |
| sakedeal-02 | B | 2 | 0 |
| sakedeal-03 | A | 4 | 1 |
| sakedeal-03 | B | 1 | 0 |
| sakedeal-03 | B | 2 | 0 |
| sakedeal-03 | B | 3 | 0 |
| sakedeal-03 | A | 1 | 0 |
| sakedeal-03 | A | 3 | 0 |
| sakedeal-03 | B | 4 | 1 |
| sakedeal-03 | A | 2 | 1 |
| yuzusake-01 | B | 4 | 0 |
| yuzusake-01 | B | 1 | 0 |
| yuzusake-01 | B | 3 | 1 |
| yuzusake-01 | A | 4 | 1 |
| yuzusake-01 | B | 2 | 0 |
| yuzusake-01 | A | 3 | 2 |
| yuzusake-01 | A | 1 | 1 |
| yuzusake-01 | A | 2 | 0 |
| yuzusake-02 | B | 4 | 0 |
| yuzusake-02 | B | 3 | 0 |
| yuzusake-02 | A | 2 | 0 |
| yuzusake-02 | A | 3 | 0 |
| yuzusake-02 | A | 1 | 1 |
| yuzusake-02 | B | 1 | 1 |
| yuzusake-02 | A | 4 | 0 |
| yuzusake-02 | B | 2 | 1 |
| yuzusake-03 | A | 3 | 1 |
| yuzusake-03 | B | 2 | 0 |
| yuzusake-03 | A | 4 | 0 |
| yuzusake-03 | B | 3 | 0 |
| yuzusake-03 | A | 1 | 0 |
| yuzusake-03 | B | 1 | 0 |
| yuzusake-03 | A | 2 | 0 |
| yuzusake-03 | B | 4 | 0 |
| yuzusake-04 | A | 3 | 0 |
| yuzusake-04 | B | 3 | 0 |
| yuzusake-04 | B | 1 | 0 |
| yuzusake-04 | B | 4 | 0 |
| yuzusake-04 | A | 1 | 0 |
| yuzusake-04 | A | 4 | 0 |
| yuzusake-04 | B | 2 | 1 |
| yuzusake-04 | A | 2 | 0 |

## Holdout and report tasks

Excluded from the dev estimates and outcome.

| Task | Set | Preference | Defects A minus B | Lint B minus A | Claims B minus A | B hard failures |
| --- | --- | --- | --- | --- | --- | --- |

## Words / budget

Mean of words divided by max_words (or min_words if no maximum). Character-only budgets are labelled chars; these ratios are descriptive, not a word-budget check.

| Task | Set | Deliverable | Budget | A words/budget | B words/budget |
| --- | --- | --- | --- | --- | --- |
| sakedeal-01 | dev | title | 60 chars | 0.1375 | 0.1292 |
| sakedeal-01 | dev | meta | 155 chars | 0.1597 | 0.1565 |
| sakedeal-01 | dev | description | 160 words | 0.9187 | 0.9109 |
| sakedeal-02 | dev | title | 60 chars | 0.1167 | 0.1500 |
| sakedeal-02 | dev | meta | 155 chars | 0.1581 | 0.1516 |
| sakedeal-02 | dev | description | 160 words | 0.9469 | 0.9016 |
| sakedeal-03 | dev | h1 | none | n/a | n/a |
| sakedeal-03 | dev | intro | 180 words | 0.7250 | 0.7153 |
| sakedeal-03 | dev | title | 60 chars | 0.0750 | 0.0875 |
| sakedeal-03 | dev | meta | 155 chars | 0.1774 | 0.1581 |
| yuzusake-01 | dev | description | 170 words | 0.9471 | 0.9515 |
| yuzusake-01 | dev | serve_tip | 120 chars | 0.0708 | 0.0875 |
| yuzusake-02 | dev | description | 140 words | 0.9732 | 0.9696 |
| yuzusake-02 | dev | meta | 155 chars | 0.1645 | 0.1484 |
| yuzusake-03 | dev | empty_heading | 40 chars | 0.1063 | 0.1125 |
| yuzusake-03 | dev | empty_body | 100 chars | 0.1150 | 0.1325 |
| yuzusake-03 | dev | empty_button | 24 chars | 0.1250 | 0.1250 |
| yuzusake-03 | dev | age_question | 40 chars | 0.1375 | 0.1438 |
| yuzusake-03 | dev | age_yes | 24 chars | 0.1875 | 0.2083 |
| yuzusake-03 | dev | age_no | 24 chars | 0.1562 | 0.1563 |
| yuzusake-03 | dev | age_no_line | 120 chars | 0.0979 | 0.1104 |
| yuzusake-04 | dev | article | 600 words | 0.7267 | 0.7246 |
| plinkr-01 | dev | subject | 60 chars | 0.0833 | 0.0833 |
| plinkr-01 | dev | preheader | 80 chars | 0.1594 | 0.1563 |
| plinkr-01 | dev | body | 150 words | 0.7417 | 0.7617 |
| plinkr-02 | dev | subject | 60 chars | 0.1125 | 0.0958 |
| plinkr-02 | dev | preheader | 80 chars | 0.1375 | 0.1344 |
| plinkr-02 | dev | body | 110 words | 0.8568 | 0.8409 |
| plinkr-03 | dev | empty_invitations | 90 chars | 0.1333 | 0.1361 |
| plinkr-03 | dev | empty_documents | 110 chars | 0.1545 | 0.1432 |
| plinkr-03 | dev | error_generic | 90 chars | 0.1444 | 0.1472 |
| plinkr-03 | dev | error_connection | 90 chars | 0.1083 | 0.1083 |
| plinkr-03 | dev | error_email_change | 90 chars | 0.1194 | 0.1194 |
| plinkr-03 | dev | error_file_open | 90 chars | 0.1250 | 0.1250 |
| plinkr-03 | dev | error_number_only | 60 chars | 0.1000 | 0.1042 |
| plinkr-04 | dev | welcome_morning | 40 chars | 0.0500 | 0.0500 |
| plinkr-04 | dev | start_title | 40 chars | 0.1500 | 0.1500 |
| plinkr-04 | dev | start_description | 80 chars | 0.1125 | 0.1125 |
| plinkr-04 | dev | start_intake_subtitle | 110 chars | 0.1545 | 0.1250 |
| plinkr-04 | dev | start_collaboration_explainer | 260 chars | 0.1490 | 0.1471 |
| plinkr-04 | dev | start_button | 15 chars | 0.0667 | 0.0667 |
| plinkr-04 | dev | success_password_changed | 50 chars | 0.0850 | 0.0850 |
| plinkr-04 | dev | success_email_change | 100 chars | 0.1150 | 0.1100 |
| plinkr-05 | dev | empty_invitations | 70 chars | 0.0821 | 0.0857 |
| plinkr-05 | dev | empty_documents | 160 chars | 0.1469 | 0.1313 |
| plinkr-05 | dev | toast_resident_invited | 40 chars | 0.0500 | 0.0500 |
| plinkr-05 | dev | delete_note_body | 110 chars | 0.1000 | 0.1000 |
| plinkr-05 | dev | delete_note_confirm_button | 30 chars | 0.0667 | 0.0667 |
| plinkr-05 | dev | timeline_onboarding_text | 180 chars | 0.1264 | 0.1181 |
| plinkr-06 | dev | subject | 60 chars | 0.0500 | 0.0500 |
| plinkr-06 | dev | subject_crisis | 70 chars | 0.0571 | 0.0571 |
| plinkr-06 | dev | preheader | 80 chars | 0.1406 | 0.1406 |
| plinkr-06 | dev | body | 100 words | 0.7325 | 0.6575 |
| plinkr-06 | dev | crisis_banner | 60 chars | 0.0708 | 0.0750 |
| reggy-01 | dev | subject_pending | 60 chars | 0.1083 | 0.1333 |
| reggy-01 | dev | heading_pending | 50 chars | 0.0900 | 0.1100 |
| reggy-01 | dev | body_pending | 90 words | 0.7750 | 0.8278 |
| reggy-01 | dev | action_label_pending | 30 chars | 0.0917 | 0.1000 |
| reggy-01 | dev | subject_verified | 60 chars | 0.0833 | 0.1167 |
| reggy-01 | dev | heading_verified | 50 chars | 0.0650 | 0.0600 |
| reggy-01 | dev | body_verified | 60 words | 0.7417 | 0.7042 |
| reggy-01 | dev | action_label_verified | 30 chars | 0.1000 | 0.1083 |
| reggy-02 | dev | connectivity_error | 80 chars | 0.1500 | 0.1500 |
| reggy-02 | dev | deadline_error | 100 chars | 0.1725 | 0.1775 |
| reggy-02 | dev | outage_error | 70 chars | 0.1714 | 0.1786 |
| reggy-02 | dev | rate_limit_error | 90 chars | 0.1694 | 0.1750 |
| reggy-02 | dev | byo_credentials_error | 100 chars | 0.1625 | 0.1600 |
| reggy-02 | dev | tenant_not_provisioned_error | 110 chars | 0.1591 | 0.1523 |
| reggy-02 | dev | campaign_locked_error | 90 chars | 0.1306 | 0.1361 |
| reggy-02 | dev | payment_method_error | 90 chars | 0.1500 | 0.1361 |

## Owner check (scored 2026-11-18)

Matches 10/15 (pass needs 12); agreed flags confirmed "off" 6/8 (pass needs 6). Overall: **fail**.
- Readers flagged, owner called natural: item 4 (plinkr-04, "geldzorgen meten") and item 14 (plinkr-01, "akkoord geven op gegevensdeling").
- Neither reader flagged, owner called off: item 2 (plinkr-03 empty state), item 3 (yuzusake-04 highball line), item 6 (plinkr-04 intake subtitle).

Consequence (protocol §5): the agreed-defect share is reported only and decides nothing; a keep needs an owner blind pick.
