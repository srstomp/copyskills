# Results: 2026-11-18-exp1-b1

Outcome: **revert**; candidate B has more hard guard failures than A (3 vs 2).

## Preference

mean 0.0144, sd 0.1979, n tasks 13, one-sided 95% lower -0.0834, upper 0.1122.

## Defects (reported only)

A minus B: mean 0.0090, sd 0.0546, n tasks 13, one-sided 95% lower -0.0180, upper 0.0360.

| Dev task | Preference score | Defects A minus B |
| --- | --- | --- |
| plinkr-01 | 0.2500 | 0.0028 |
| plinkr-02 | 0.1875 | 0.0000 |
| plinkr-03 | -0.0625 | 0.0000 |
| plinkr-04 | 0.1875 | 0.0313 |
| plinkr-05 | 0.2500 | 0.0833 |
| plinkr-06 | 0.1875 | 0.0030 |
| reggy-01 | 0.0000 | 0.0000 |
| reggy-02 | -0.3125 | -0.0938 |
| sakedeal-01 | -0.1875 | 0.1058 |
| yuzusake-01 | 0.0625 | -0.0420 |
| yuzusake-02 | -0.2500 | -0.0455 |
| yuzusake-03 | -0.1875 | 0.0714 |
| yuzusake-04 | 0.0625 | 0.0010 |

## Hard guards

| Arm | Failing dev outputs | Total dev outputs |
| --- | --- | --- |
| A | 2 | 52 |
| B | 3 | 52 |

- plinkr-06 B3: crisis_banner: missing deliverable
- yuzusake-04 B1: article: min_words 400, got 386
- yuzusake-04 B3: article: min_words 400, got 391

## Noisy guards

Lint errors per output, averaged within each task. B minus A: mean 0.0000, sd 0.0000, n tasks 13, one-sided 95% lower 0.0000, upper 0.0000.

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

Unsupported claims per output, averaged within each task. B minus A: mean 0.0000, sd 0.2282, n tasks 13, one-sided 95% lower -0.1128, upper 0.1128.

| Task | A claims/output | B claims/output | B minus A |
| --- | --- | --- | --- |
| plinkr-01 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-02 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-03 | 3.2500 | 3.0000 | -0.2500 |
| plinkr-04 | 0.0000 | 0.2500 | 0.2500 |
| plinkr-05 | 0.2500 | 0.0000 | -0.2500 |
| plinkr-06 | 0.0000 | 0.2500 | 0.2500 |
| reggy-01 | 0.5000 | 0.0000 | -0.5000 |
| reggy-02 | 0.7500 | 1.0000 | 0.2500 |
| sakedeal-01 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-01 | 0.7500 | 0.7500 | 0.0000 |
| yuzusake-02 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-03 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-04 | 0.5000 | 0.7500 | 0.2500 |

| Task | Arm | Output | Unsupported claims |
| --- | --- | --- | --- |
| plinkr-01 | A | 3 | 0 |
| plinkr-01 | A | 2 | 0 |
| plinkr-01 | B | 3 | 0 |
| plinkr-01 | B | 4 | 0 |
| plinkr-01 | B | 1 | 0 |
| plinkr-01 | A | 4 | 0 |
| plinkr-01 | A | 1 | 0 |
| plinkr-01 | B | 2 | 0 |
| plinkr-02 | A | 4 | 0 |
| plinkr-02 | B | 1 | 0 |
| plinkr-02 | A | 1 | 0 |
| plinkr-02 | A | 2 | 0 |
| plinkr-02 | B | 3 | 0 |
| plinkr-02 | B | 4 | 0 |
| plinkr-02 | A | 3 | 0 |
| plinkr-02 | B | 2 | 0 |
| plinkr-03 | A | 4 | 3 |
| plinkr-03 | B | 1 | 3 |
| plinkr-03 | B | 2 | 3 |
| plinkr-03 | B | 3 | 3 |
| plinkr-03 | A | 1 | 3 |
| plinkr-03 | A | 3 | 3 |
| plinkr-03 | B | 4 | 3 |
| plinkr-03 | A | 2 | 4 |
| plinkr-04 | B | 4 | 0 |
| plinkr-04 | B | 1 | 0 |
| plinkr-04 | B | 3 | 1 |
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
| plinkr-05 | B | 1 | 0 |
| plinkr-05 | A | 4 | 0 |
| plinkr-05 | B | 2 | 0 |
| plinkr-06 | A | 3 | 0 |
| plinkr-06 | B | 2 | 0 |
| plinkr-06 | A | 4 | 0 |
| plinkr-06 | B | 3 | 0 |
| plinkr-06 | A | 1 | 0 |
| plinkr-06 | B | 1 | 1 |
| plinkr-06 | A | 2 | 0 |
| plinkr-06 | B | 4 | 0 |
| reggy-01 | A | 3 | 1 |
| reggy-01 | B | 3 | 0 |
| reggy-01 | B | 1 | 0 |
| reggy-01 | B | 4 | 0 |
| reggy-01 | A | 1 | 0 |
| reggy-01 | A | 4 | 1 |
| reggy-01 | B | 2 | 0 |
| reggy-01 | A | 2 | 0 |
| reggy-02 | A | 3 | 1 |
| reggy-02 | B | 1 | 1 |
| reggy-02 | A | 1 | 1 |
| reggy-02 | B | 4 | 1 |
| reggy-02 | A | 4 | 1 |
| reggy-02 | B | 2 | 1 |
| reggy-02 | A | 2 | 0 |
| reggy-02 | B | 3 | 1 |
| sakedeal-01 | A | 2 | 0 |
| sakedeal-01 | A | 1 | 0 |
| sakedeal-01 | A | 3 | 0 |
| sakedeal-01 | A | 4 | 0 |
| sakedeal-01 | B | 2 | 0 |
| sakedeal-01 | B | 1 | 0 |
| sakedeal-01 | B | 3 | 0 |
| sakedeal-01 | B | 4 | 0 |
| yuzusake-01 | B | 4 | 2 |
| yuzusake-01 | B | 2 | 0 |
| yuzusake-01 | A | 4 | 0 |
| yuzusake-01 | A | 3 | 1 |
| yuzusake-01 | B | 1 | 0 |
| yuzusake-01 | A | 2 | 1 |
| yuzusake-01 | B | 3 | 1 |
| yuzusake-01 | A | 1 | 1 |
| yuzusake-02 | B | 4 | 0 |
| yuzusake-02 | A | 3 | 0 |
| yuzusake-02 | B | 3 | 0 |
| yuzusake-02 | A | 4 | 0 |
| yuzusake-02 | A | 1 | 0 |
| yuzusake-02 | B | 2 | 0 |
| yuzusake-02 | B | 1 | 0 |
| yuzusake-02 | A | 2 | 0 |
| yuzusake-03 | B | 1 | 0 |
| yuzusake-03 | B | 4 | 0 |
| yuzusake-03 | B | 2 | 0 |
| yuzusake-03 | B | 3 | 0 |
| yuzusake-03 | A | 4 | 0 |
| yuzusake-03 | A | 2 | 0 |
| yuzusake-03 | A | 3 | 0 |
| yuzusake-03 | A | 1 | 0 |
| yuzusake-04 | A | 4 | 0 |
| yuzusake-04 | B | 1 | 2 |
| yuzusake-04 | A | 3 | 1 |
| yuzusake-04 | B | 4 | 1 |
| yuzusake-04 | A | 1 | 1 |
| yuzusake-04 | A | 2 | 0 |
| yuzusake-04 | B | 2 | 0 |
| yuzusake-04 | B | 3 | 0 |

## Holdout and report tasks

Excluded from the dev estimates and outcome.

| Task | Set | Preference | Defects A minus B | Lint B minus A | Claims B minus A | B hard failures |
| --- | --- | --- | --- | --- | --- | --- |

## Words / budget

Mean of words divided by max_words (or min_words if no maximum). Character-only budgets are labelled chars; these ratios are descriptive, not a word-budget check.

| Task | Set | Deliverable | Budget | A words/budget | B words/budget |
| --- | --- | --- | --- | --- | --- |
| plinkr-01 | dev | subject | 60 chars | 0.0792 | 0.0833 |
| plinkr-01 | dev | preheader | 80 chars | 0.1531 | 0.1437 |
| plinkr-01 | dev | body | 150 words | 0.8400 | 0.8617 |
| plinkr-02 | dev | subject | 60 chars | 0.1375 | 0.1083 |
| plinkr-02 | dev | preheader | 80 chars | 0.1469 | 0.1500 |
| plinkr-02 | dev | body | 110 words | 0.8386 | 0.8250 |
| plinkr-03 | dev | empty_invitations | 90 chars | 0.1444 | 0.1444 |
| plinkr-03 | dev | empty_documents | 110 chars | 0.1545 | 0.1455 |
| plinkr-03 | dev | error_generic | 90 chars | 0.1306 | 0.1194 |
| plinkr-03 | dev | error_connection | 90 chars | 0.1083 | 0.1028 |
| plinkr-03 | dev | error_email_change | 90 chars | 0.1167 | 0.1278 |
| plinkr-03 | dev | error_file_open | 90 chars | 0.1167 | 0.1278 |
| plinkr-03 | dev | error_number_only | 60 chars | 0.1000 | 0.1000 |
| plinkr-04 | dev | welcome_morning | 40 chars | 0.0500 | 0.0500 |
| plinkr-04 | dev | start_title | 40 chars | 0.1500 | 0.1500 |
| plinkr-04 | dev | start_description | 80 chars | 0.1125 | 0.1313 |
| plinkr-04 | dev | start_intake_subtitle | 110 chars | 0.1409 | 0.1386 |
| plinkr-04 | dev | start_collaboration_explainer | 260 chars | 0.1452 | 0.1433 |
| plinkr-04 | dev | start_button | 15 chars | 0.0667 | 0.0667 |
| plinkr-04 | dev | success_password_changed | 50 chars | 0.0800 | 0.0800 |
| plinkr-04 | dev | success_email_change | 100 chars | 0.1250 | 0.1225 |
| plinkr-05 | dev | empty_invitations | 70 chars | 0.0893 | 0.0929 |
| plinkr-05 | dev | empty_documents | 160 chars | 0.1531 | 0.1359 |
| plinkr-05 | dev | toast_resident_invited | 40 chars | 0.0500 | 0.0500 |
| plinkr-05 | dev | delete_note_body | 110 chars | 0.1023 | 0.1000 |
| plinkr-05 | dev | delete_note_confirm_button | 30 chars | 0.0917 | 0.0917 |
| plinkr-05 | dev | timeline_onboarding_text | 180 chars | 0.1153 | 0.1139 |
| plinkr-06 | dev | subject | 60 chars | 0.0500 | 0.0500 |
| plinkr-06 | dev | subject_crisis | 70 chars | 0.0571 | 0.0571 |
| plinkr-06 | dev | preheader | 80 chars | 0.1313 | 0.1219 |
| plinkr-06 | dev | body | 100 words | 0.7175 | 0.7225 |
| plinkr-06 | dev | crisis_banner | 60 chars | 0.0792 | 0.0583 |
| reggy-01 | dev | subject_pending | 60 chars | 0.0875 | 0.1000 |
| reggy-01 | dev | heading_pending | 50 chars | 0.1000 | 0.0950 |
| reggy-01 | dev | body_pending | 90 words | 0.7917 | 0.7944 |
| reggy-01 | dev | action_label_pending | 30 chars | 0.0667 | 0.0750 |
| reggy-01 | dev | subject_verified | 60 chars | 0.0875 | 0.0833 |
| reggy-01 | dev | heading_verified | 50 chars | 0.0600 | 0.0600 |
| reggy-01 | dev | body_verified | 60 words | 0.8667 | 0.8833 |
| reggy-01 | dev | action_label_verified | 30 chars | 0.1333 | 0.1167 |
| reggy-02 | dev | connectivity_error | 80 chars | 0.1469 | 0.1469 |
| reggy-02 | dev | deadline_error | 100 chars | 0.1575 | 0.1575 |
| reggy-02 | dev | outage_error | 70 chars | 0.1821 | 0.1821 |
| reggy-02 | dev | rate_limit_error | 90 chars | 0.1639 | 0.1833 |
| reggy-02 | dev | byo_credentials_error | 100 chars | 0.1450 | 0.1700 |
| reggy-02 | dev | tenant_not_provisioned_error | 110 chars | 0.1477 | 0.1500 |
| reggy-02 | dev | campaign_locked_error | 90 chars | 0.1306 | 0.1389 |
| reggy-02 | dev | payment_method_error | 90 chars | 0.1472 | 0.1500 |
| sakedeal-01 | dev | title | 60 chars | 0.1375 | 0.1417 |
| sakedeal-01 | dev | meta | 155 chars | 0.1548 | 0.1581 |
| sakedeal-01 | dev | description | 160 words | 0.9281 | 0.9203 |
| yuzusake-01 | dev | description | 170 words | 0.9015 | 0.8912 |
| yuzusake-01 | dev | serve_tip | 120 chars | 0.0646 | 0.0708 |
| yuzusake-02 | dev | description | 140 words | 1.0018 | 0.9714 |
| yuzusake-02 | dev | meta | 155 chars | 0.1661 | 0.1629 |
| yuzusake-03 | dev | empty_heading | 40 chars | 0.1063 | 0.1000 |
| yuzusake-03 | dev | empty_body | 100 chars | 0.1025 | 0.1025 |
| yuzusake-03 | dev | empty_button | 24 chars | 0.1250 | 0.1250 |
| yuzusake-03 | dev | age_question | 40 chars | 0.1250 | 0.1250 |
| yuzusake-03 | dev | age_yes | 24 chars | 0.1667 | 0.1667 |
| yuzusake-03 | dev | age_no | 24 chars | 0.1354 | 0.0833 |
| yuzusake-03 | dev | age_no_line | 120 chars | 0.1125 | 0.1250 |
| yuzusake-04 | dev | article | 600 words | 0.7267 | 0.6700 |

## Note (2026-11-18, Opus 5.5)

The revert comes from the hard-guard count alone, 3 vs 2:
- B: two articles short of 400 words (386, 391) and one misnamed section (`## banner` for `crisis_banner`; the text was there).
- A: two outputs over budget by 1 and 3 words.

A/A run 3 had A 4, B 3, so this difference is within chance. Preference (+0.014, 95% interval −0.083 to 0.112) shows no effect of voice samples in this batch. Per project, plinkr leans to samples (5 of 6 tasks positive) and yuzusake, sakedeal and reggy lean against; that is a post-hoc split over 13 tasks and decides nothing. Batch 2 was not run because batch 1 reverted.
