# Results: 2026-11-18-aa3

Outcome: **second batch needed**; one batch cannot keep a change; run a second batch with "pool" set to this run.

## Preference

mean -0.0167, sd 0.1743, n tasks 15, one-sided 95% lower -0.0960, upper 0.0626.

## Defects (reported only)

A minus B: mean -0.0038, sd 0.0450, n tasks 15, one-sided 95% lower -0.0242, upper 0.0167.

| Dev task | Preference score | Defects A minus B |
| --- | --- | --- |
| plinkr-01 | -0.1250 | 0.0008 |
| plinkr-02 | -0.1250 | 0.0000 |
| plinkr-03 | 0.2500 | 0.0357 |
| plinkr-04 | 0.0625 | -0.0313 |
| plinkr-05 | 0.0000 | 0.0000 |
| plinkr-06 | -0.2500 | 0.0000 |
| reggy-01 | 0.0625 | -0.0167 |
| reggy-02 | -0.3125 | -0.0938 |
| sakedeal-01 | -0.1250 | -0.0192 |
| sakedeal-02 | 0.0625 | -0.0002 |
| sakedeal-03 | -0.0625 | -0.0549 |
| yuzusake-01 | -0.0625 | 0.0403 |
| yuzusake-02 | 0.2500 | 0.1039 |
| yuzusake-03 | -0.1250 | -0.0357 |
| yuzusake-04 | 0.2500 | 0.0146 |

## Hard guards

| Arm | Failing dev outputs | Total dev outputs |
| --- | --- | --- |
| A | 4 | 60 |
| B | 3 | 60 |

- yuzusake-02 B2: description: max_words 140, got 143
- yuzusake-02 B3: description: max_words 140, got 141
- yuzusake-04 B2: article: min_words 400, got 378

## Noisy guards

Lint errors per output, averaged within each task. B minus A: mean 0.0000, sd 0.0000, n tasks 15, one-sided 95% lower 0.0000, upper 0.0000.

| Dev task | A errors/output | B errors/output | B minus A |
| --- | --- | --- | --- |
| plinkr-01 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-02 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-03 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-04 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-05 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-06 | 0.0000 | 0.0000 | 0.0000 |
| reggy-01 | 0.0000 | 0.0000 | 0.0000 |
| reggy-02 | 0.0000 | 0.0000 | 0.0000 |
| sakedeal-01 | 0.0000 | 0.0000 | 0.0000 |
| sakedeal-02 | 0.0000 | 0.0000 | 0.0000 |
| sakedeal-03 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-01 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-02 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-03 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-04 | 0.0000 | 0.0000 | 0.0000 |

| Dev task | Arm | Output | Lint errors |
| --- | --- | --- | --- |
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

Unsupported claims per output, averaged within each task. B minus A: mean 0.0333, sd 0.3764, n tasks 15, one-sided 95% lower -0.1378, upper 0.2045.

| Task | A claims/output | B claims/output | B minus A |
| --- | --- | --- | --- |
| plinkr-01 | 0.2500 | 0.0000 | -0.2500 |
| plinkr-02 | 0.2500 | 0.0000 | -0.2500 |
| plinkr-03 | 2.5000 | 2.2500 | -0.2500 |
| plinkr-04 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-05 | 0.5000 | 0.2500 | -0.2500 |
| plinkr-06 | 0.2500 | 0.0000 | -0.2500 |
| reggy-01 | 0.0000 | 0.0000 | 0.0000 |
| reggy-02 | 0.7500 | 1.5000 | 0.7500 |
| sakedeal-01 | 0.0000 | 0.2500 | 0.2500 |
| sakedeal-02 | 0.5000 | 0.5000 | 0.0000 |
| sakedeal-03 | 0.2500 | 0.7500 | 0.5000 |
| yuzusake-01 | 0.0000 | 0.7500 | 0.7500 |
| yuzusake-02 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-03 | 0.2500 | 0.2500 | 0.0000 |
| yuzusake-04 | 0.7500 | 0.2500 | -0.5000 |

| Task | Arm | Output | Unsupported claims |
| --- | --- | --- | --- |
| plinkr-01 | A | 3 | 0 |
| plinkr-01 | A | 2 | 0 |
| plinkr-01 | B | 3 | 0 |
| plinkr-01 | B | 4 | 0 |
| plinkr-01 | B | 1 | 0 |
| plinkr-01 | A | 4 | 1 |
| plinkr-01 | A | 1 | 0 |
| plinkr-01 | B | 2 | 0 |
| plinkr-02 | A | 4 | 0 |
| plinkr-02 | B | 1 | 0 |
| plinkr-02 | A | 1 | 0 |
| plinkr-02 | A | 2 | 1 |
| plinkr-02 | B | 3 | 0 |
| plinkr-02 | B | 4 | 0 |
| plinkr-02 | A | 3 | 0 |
| plinkr-02 | B | 2 | 0 |
| plinkr-03 | A | 4 | 3 |
| plinkr-03 | B | 1 | 2 |
| plinkr-03 | B | 2 | 2 |
| plinkr-03 | B | 3 | 3 |
| plinkr-03 | A | 1 | 2 |
| plinkr-03 | A | 3 | 3 |
| plinkr-03 | B | 4 | 2 |
| plinkr-03 | A | 2 | 2 |
| plinkr-04 | B | 4 | 0 |
| plinkr-04 | B | 1 | 0 |
| plinkr-04 | B | 3 | 0 |
| plinkr-04 | A | 4 | 0 |
| plinkr-04 | B | 2 | 0 |
| plinkr-04 | A | 3 | 0 |
| plinkr-04 | A | 1 | 0 |
| plinkr-04 | A | 2 | 0 |
| plinkr-05 | B | 4 | 0 |
| plinkr-05 | B | 3 | 0 |
| plinkr-05 | A | 2 | 0 |
| plinkr-05 | A | 3 | 1 |
| plinkr-05 | A | 1 | 0 |
| plinkr-05 | B | 1 | 1 |
| plinkr-05 | A | 4 | 1 |
| plinkr-05 | B | 2 | 0 |
| plinkr-06 | A | 3 | 0 |
| plinkr-06 | B | 2 | 0 |
| plinkr-06 | A | 4 | 0 |
| plinkr-06 | B | 3 | 0 |
| plinkr-06 | A | 1 | 0 |
| plinkr-06 | B | 1 | 0 |
| plinkr-06 | A | 2 | 1 |
| plinkr-06 | B | 4 | 0 |
| reggy-01 | A | 3 | 0 |
| reggy-01 | B | 3 | 0 |
| reggy-01 | B | 1 | 0 |
| reggy-01 | B | 4 | 0 |
| reggy-01 | A | 1 | 0 |
| reggy-01 | A | 4 | 0 |
| reggy-01 | B | 2 | 0 |
| reggy-01 | A | 2 | 0 |
| reggy-02 | A | 3 | 0 |
| reggy-02 | B | 1 | 1 |
| reggy-02 | A | 1 | 1 |
| reggy-02 | B | 4 | 1 |
| reggy-02 | A | 4 | 2 |
| reggy-02 | B | 2 | 2 |
| reggy-02 | A | 2 | 0 |
| reggy-02 | B | 3 | 2 |
| sakedeal-01 | A | 2 | 0 |
| sakedeal-01 | A | 1 | 0 |
| sakedeal-01 | A | 3 | 0 |
| sakedeal-01 | A | 4 | 0 |
| sakedeal-01 | B | 2 | 1 |
| sakedeal-01 | B | 1 | 0 |
| sakedeal-01 | B | 3 | 0 |
| sakedeal-01 | B | 4 | 0 |
| sakedeal-02 | B | 4 | 2 |
| sakedeal-02 | B | 2 | 0 |
| sakedeal-02 | A | 4 | 0 |
| sakedeal-02 | A | 3 | 1 |
| sakedeal-02 | B | 1 | 0 |
| sakedeal-02 | A | 2 | 1 |
| sakedeal-02 | B | 3 | 0 |
| sakedeal-02 | A | 1 | 0 |
| sakedeal-03 | B | 4 | 1 |
| sakedeal-03 | A | 3 | 0 |
| sakedeal-03 | B | 3 | 1 |
| sakedeal-03 | A | 4 | 1 |
| sakedeal-03 | A | 1 | 0 |
| sakedeal-03 | B | 2 | 1 |
| sakedeal-03 | B | 1 | 0 |
| sakedeal-03 | A | 2 | 0 |
| yuzusake-01 | B | 1 | 0 |
| yuzusake-01 | B | 4 | 0 |
| yuzusake-01 | B | 2 | 2 |
| yuzusake-01 | B | 3 | 1 |
| yuzusake-01 | A | 4 | 0 |
| yuzusake-01 | A | 2 | 0 |
| yuzusake-01 | A | 3 | 0 |
| yuzusake-01 | A | 1 | 0 |
| yuzusake-02 | A | 4 | 0 |
| yuzusake-02 | B | 1 | 0 |
| yuzusake-02 | A | 3 | 0 |
| yuzusake-02 | B | 4 | 0 |
| yuzusake-02 | A | 1 | 0 |
| yuzusake-02 | A | 2 | 0 |
| yuzusake-02 | B | 2 | 0 |
| yuzusake-02 | B | 3 | 0 |
| yuzusake-03 | B | 3 | 0 |
| yuzusake-03 | A | 3 | 0 |
| yuzusake-03 | B | 2 | 0 |
| yuzusake-03 | A | 1 | 0 |
| yuzusake-03 | B | 4 | 0 |
| yuzusake-03 | A | 4 | 0 |
| yuzusake-03 | B | 1 | 1 |
| yuzusake-03 | A | 2 | 1 |
| yuzusake-04 | B | 2 | 0 |
| yuzusake-04 | B | 3 | 0 |
| yuzusake-04 | A | 2 | 1 |
| yuzusake-04 | B | 4 | 0 |
| yuzusake-04 | A | 1 | 1 |
| yuzusake-04 | A | 4 | 1 |
| yuzusake-04 | B | 1 | 1 |
| yuzusake-04 | A | 3 | 0 |

## Holdout and report tasks

Excluded from the dev estimates and outcome.

| Task | Set | Preference | Defects A minus B | Lint B minus A | Claims B minus A | B hard failures |
| --- | --- | --- | --- | --- | --- | --- |

## Words / budget

Mean of words divided by max_words (or min_words if no maximum). Character-only budgets are labelled chars; these ratios are descriptive, not a word-budget check.

| Task | Set | Deliverable | Budget | A words/budget | B words/budget |
| --- | --- | --- | --- | --- | --- |
| plinkr-01 | dev | subject | 60 chars | 0.0750 | 0.0833 |
| plinkr-01 | dev | preheader | 80 chars | 0.1531 | 0.1375 |
| plinkr-01 | dev | body | 150 words | 0.8250 | 0.8050 |
| plinkr-02 | dev | subject | 60 chars | 0.1333 | 0.1375 |
| plinkr-02 | dev | preheader | 80 chars | 0.1313 | 0.1219 |
| plinkr-02 | dev | body | 110 words | 0.9591 | 0.8955 |
| plinkr-03 | dev | empty_invitations | 90 chars | 0.1333 | 0.1306 |
| plinkr-03 | dev | empty_documents | 110 chars | 0.1409 | 0.1432 |
| plinkr-03 | dev | error_generic | 90 chars | 0.1167 | 0.1083 |
| plinkr-03 | dev | error_connection | 90 chars | 0.0972 | 0.1139 |
| plinkr-03 | dev | error_email_change | 90 chars | 0.1278 | 0.1278 |
| plinkr-03 | dev | error_file_open | 90 chars | 0.1361 | 0.1250 |
| plinkr-03 | dev | error_number_only | 60 chars | 0.1042 | 0.1000 |
| plinkr-04 | dev | welcome_morning | 40 chars | 0.0500 | 0.0500 |
| plinkr-04 | dev | start_title | 40 chars | 0.1500 | 0.1500 |
| plinkr-04 | dev | start_description | 80 chars | 0.1125 | 0.1125 |
| plinkr-04 | dev | start_intake_subtitle | 110 chars | 0.1205 | 0.1432 |
| plinkr-04 | dev | start_collaboration_explainer | 260 chars | 0.1471 | 0.1462 |
| plinkr-04 | dev | start_button | 15 chars | 0.0667 | 0.0667 |
| plinkr-04 | dev | success_password_changed | 50 chars | 0.0800 | 0.0850 |
| plinkr-04 | dev | success_email_change | 100 chars | 0.1225 | 0.1100 |
| plinkr-05 | dev | empty_invitations | 70 chars | 0.1036 | 0.0857 |
| plinkr-05 | dev | empty_documents | 160 chars | 0.1375 | 0.1578 |
| plinkr-05 | dev | toast_resident_invited | 40 chars | 0.0563 | 0.0500 |
| plinkr-05 | dev | delete_note_body | 110 chars | 0.1000 | 0.1000 |
| plinkr-05 | dev | delete_note_confirm_button | 30 chars | 0.0667 | 0.0750 |
| plinkr-05 | dev | timeline_onboarding_text | 180 chars | 0.1194 | 0.1125 |
| plinkr-06 | dev | subject | 60 chars | 0.0500 | 0.0500 |
| plinkr-06 | dev | subject_crisis | 70 chars | 0.0571 | 0.0571 |
| plinkr-06 | dev | preheader | 80 chars | 0.1312 | 0.1469 |
| plinkr-06 | dev | body | 100 words | 0.6975 | 0.6875 |
| plinkr-06 | dev | crisis_banner | 60 chars | 0.0833 | 0.0833 |
| reggy-01 | dev | subject_pending | 60 chars | 0.0792 | 0.0833 |
| reggy-01 | dev | heading_pending | 50 chars | 0.1200 | 0.1050 |
| reggy-01 | dev | body_pending | 90 words | 0.7694 | 0.8194 |
| reggy-01 | dev | action_label_pending | 30 chars | 0.0750 | 0.0833 |
| reggy-01 | dev | subject_verified | 60 chars | 0.0750 | 0.0917 |
| reggy-01 | dev | heading_verified | 50 chars | 0.0750 | 0.0600 |
| reggy-01 | dev | body_verified | 60 words | 0.8542 | 0.7917 |
| reggy-01 | dev | action_label_verified | 30 chars | 0.1333 | 0.1250 |
| reggy-02 | dev | connectivity_error | 80 chars | 0.1469 | 0.1438 |
| reggy-02 | dev | deadline_error | 100 chars | 0.1550 | 0.1450 |
| reggy-02 | dev | outage_error | 70 chars | 0.1679 | 0.1714 |
| reggy-02 | dev | rate_limit_error | 90 chars | 0.1611 | 0.1583 |
| reggy-02 | dev | byo_credentials_error | 100 chars | 0.1575 | 0.1475 |
| reggy-02 | dev | tenant_not_provisioned_error | 110 chars | 0.1409 | 0.1409 |
| reggy-02 | dev | campaign_locked_error | 90 chars | 0.1306 | 0.1306 |
| reggy-02 | dev | payment_method_error | 90 chars | 0.1528 | 0.1556 |
| sakedeal-01 | dev | title | 60 chars | 0.1375 | 0.1333 |
| sakedeal-01 | dev | meta | 155 chars | 0.1484 | 0.1597 |
| sakedeal-01 | dev | description | 160 words | 0.9250 | 0.8984 |
| sakedeal-02 | dev | title | 60 chars | 0.0833 | 0.1000 |
| sakedeal-02 | dev | meta | 155 chars | 0.1565 | 0.1565 |
| sakedeal-02 | dev | description | 160 words | 0.8594 | 0.8656 |
| sakedeal-03 | dev | h1 | none | n/a | n/a |
| sakedeal-03 | dev | intro | 180 words | 0.7181 | 0.7306 |
| sakedeal-03 | dev | title | 60 chars | 0.0667 | 0.0667 |
| sakedeal-03 | dev | meta | 155 chars | 0.1645 | 0.1645 |
| yuzusake-01 | dev | description | 170 words | 0.9191 | 0.8971 |
| yuzusake-01 | dev | serve_tip | 120 chars | 0.0667 | 0.0646 |
| yuzusake-02 | dev | description | 140 words | 0.9839 | 0.9964 |
| yuzusake-02 | dev | meta | 155 chars | 0.1597 | 0.1726 |
| yuzusake-03 | dev | empty_heading | 40 chars | 0.1125 | 0.1000 |
| yuzusake-03 | dev | empty_body | 100 chars | 0.1150 | 0.1050 |
| yuzusake-03 | dev | empty_button | 24 chars | 0.1250 | 0.1250 |
| yuzusake-03 | dev | age_question | 40 chars | 0.1438 | 0.1438 |
| yuzusake-03 | dev | age_yes | 24 chars | 0.1667 | 0.1667 |
| yuzusake-03 | dev | age_no | 24 chars | 0.1250 | 0.1250 |
| yuzusake-03 | dev | age_no_line | 120 chars | 0.0917 | 0.1021 |
| yuzusake-04 | dev | article | 600 words | 0.6692 | 0.7167 |
