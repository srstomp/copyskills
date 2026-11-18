# Results: 2026-11-18-voice-b1

Outcome: **second batch needed**; one batch cannot keep a change; run a second batch with "pool" set to this run.

## Preference

mean -0.0192, sd 0.2741, n tasks 13, one-sided 95% lower -0.1547, upper 0.1163.

## Defects (reported only)

A minus B: mean 0.0122, sd 0.0517, n tasks 13, one-sided 95% lower -0.0133, upper 0.0378.

| Dev task | Preference score | Defects A minus B |
| --- | --- | --- |
| plinkr-01 | 0.1875 | 0.0294 |
| plinkr-02 | 0.5000 | -0.0208 |
| plinkr-03 | -0.1250 | -0.0357 |
| plinkr-04 | -0.0625 | 0.0625 |
| plinkr-05 | 0.3750 | 0.0833 |
| plinkr-06 | -0.0625 | 0.0000 |
| reggy-01 | -0.3125 | 0.0134 |
| reggy-02 | -0.2500 | -0.0625 |
| sakedeal-01 | 0.0625 | -0.0173 |
| yuzusake-01 | -0.3125 | -0.0014 |
| yuzusake-02 | 0.2500 | 0.1196 |
| yuzusake-03 | -0.3125 | -0.0357 |
| yuzusake-04 | -0.1875 | 0.0243 |

## Structural guards

Missing or empty deliverables, placeholders, numbers not in the facts.

| Arm | Failing dev outputs | Total dev outputs |
| --- | --- | --- |
| A | 0 | 52 |
| B | 0 | 52 |


## Limits

Share of outputs that miss a character or word limit, per task. B minus A: mean -0.0192, sd 0.0693, n tasks 13, one-sided 95% lower -0.0535, upper 0.0150.

| Dev task | A share | B share | B minus A |
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
| yuzusake-04 | 0.2500 | 0.0000 | -0.2500 |

- yuzusake-04 A2: article: min_words 400, got 383

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

Unsupported claims per output, averaged within each task. B minus A: mean -0.1731, sd 0.2137, n tasks 13, one-sided 95% lower -0.2787, upper -0.0674.

| Task | A claims/output | B claims/output | B minus A |
| --- | --- | --- | --- |
| plinkr-01 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-02 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-03 | 1.7500 | 1.5000 | -0.2500 |
| plinkr-04 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-05 | 0.0000 | 0.0000 | 0.0000 |
| plinkr-06 | 0.0000 | 0.0000 | 0.0000 |
| reggy-01 | 0.0000 | 0.0000 | 0.0000 |
| reggy-02 | 2.0000 | 1.5000 | -0.5000 |
| sakedeal-01 | 0.5000 | 0.0000 | -0.5000 |
| yuzusake-01 | 0.5000 | 0.2500 | -0.2500 |
| yuzusake-02 | 0.2500 | 0.0000 | -0.2500 |
| yuzusake-03 | 0.0000 | 0.0000 | 0.0000 |
| yuzusake-04 | 0.7500 | 0.2500 | -0.5000 |

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
| plinkr-03 | A | 4 | 1 |
| plinkr-03 | B | 1 | 2 |
| plinkr-03 | B | 2 | 1 |
| plinkr-03 | B | 3 | 1 |
| plinkr-03 | A | 1 | 3 |
| plinkr-03 | A | 3 | 1 |
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
| plinkr-05 | A | 3 | 0 |
| plinkr-05 | A | 1 | 0 |
| plinkr-05 | B | 1 | 0 |
| plinkr-05 | A | 4 | 0 |
| plinkr-05 | B | 2 | 0 |
| plinkr-06 | A | 3 | 0 |
| plinkr-06 | B | 2 | 0 |
| plinkr-06 | A | 4 | 0 |
| plinkr-06 | B | 3 | 0 |
| plinkr-06 | A | 1 | 0 |
| plinkr-06 | B | 1 | 0 |
| plinkr-06 | A | 2 | 0 |
| plinkr-06 | B | 4 | 0 |
| reggy-01 | A | 3 | 0 |
| reggy-01 | B | 3 | 0 |
| reggy-01 | B | 1 | 0 |
| reggy-01 | B | 4 | 0 |
| reggy-01 | A | 1 | 0 |
| reggy-01 | A | 4 | 0 |
| reggy-01 | B | 2 | 0 |
| reggy-01 | A | 2 | 0 |
| reggy-02 | A | 3 | 2 |
| reggy-02 | B | 1 | 1 |
| reggy-02 | A | 1 | 2 |
| reggy-02 | B | 4 | 2 |
| reggy-02 | A | 4 | 2 |
| reggy-02 | B | 2 | 2 |
| reggy-02 | A | 2 | 2 |
| reggy-02 | B | 3 | 1 |
| sakedeal-01 | A | 2 | 1 |
| sakedeal-01 | A | 1 | 0 |
| sakedeal-01 | A | 3 | 1 |
| sakedeal-01 | A | 4 | 0 |
| sakedeal-01 | B | 2 | 0 |
| sakedeal-01 | B | 1 | 0 |
| sakedeal-01 | B | 3 | 0 |
| sakedeal-01 | B | 4 | 0 |
| yuzusake-01 | B | 4 | 0 |
| yuzusake-01 | B | 2 | 0 |
| yuzusake-01 | A | 4 | 0 |
| yuzusake-01 | A | 3 | 1 |
| yuzusake-01 | B | 1 | 0 |
| yuzusake-01 | A | 2 | 0 |
| yuzusake-01 | B | 3 | 1 |
| yuzusake-01 | A | 1 | 1 |
| yuzusake-02 | B | 4 | 0 |
| yuzusake-02 | A | 3 | 0 |
| yuzusake-02 | B | 3 | 0 |
| yuzusake-02 | A | 4 | 0 |
| yuzusake-02 | A | 1 | 0 |
| yuzusake-02 | B | 2 | 0 |
| yuzusake-02 | B | 1 | 0 |
| yuzusake-02 | A | 2 | 1 |
| yuzusake-03 | B | 1 | 0 |
| yuzusake-03 | B | 4 | 0 |
| yuzusake-03 | B | 2 | 0 |
| yuzusake-03 | B | 3 | 0 |
| yuzusake-03 | A | 4 | 0 |
| yuzusake-03 | A | 2 | 0 |
| yuzusake-03 | A | 3 | 0 |
| yuzusake-03 | A | 1 | 0 |
| yuzusake-04 | A | 4 | 0 |
| yuzusake-04 | B | 1 | 0 |
| yuzusake-04 | A | 3 | 1 |
| yuzusake-04 | B | 4 | 0 |
| yuzusake-04 | A | 1 | 1 |
| yuzusake-04 | A | 2 | 1 |
| yuzusake-04 | B | 2 | 1 |
| yuzusake-04 | B | 3 | 0 |

## Holdout and report tasks

Excluded from the dev estimates and outcome.

| Task | Set | Preference | Defects A minus B | Lint B minus A | Claims B minus A | B structural and limit failures |
| --- | --- | --- | --- | --- | --- | --- |

## Words / budget

Mean of words divided by max_words (or min_words if no maximum). Character-only budgets are labelled chars; these ratios are descriptive, not a word-budget check.

| Task | Set | Deliverable | Budget | A words/budget | B words/budget |
| --- | --- | --- | --- | --- | --- |
| plinkr-01 | dev | subject | 60 chars | 0.0833 | 0.0833 |
| plinkr-01 | dev | preheader | 80 chars | 0.1406 | 0.1469 |
| plinkr-01 | dev | body | 150 words | 0.7950 | 0.8067 |
| plinkr-02 | dev | subject | 60 chars | 0.1208 | 0.1167 |
| plinkr-02 | dev | preheader | 80 chars | 0.1031 | 0.1094 |
| plinkr-02 | dev | body | 110 words | 0.7909 | 0.8182 |
| plinkr-03 | dev | empty_invitations | 90 chars | 0.1417 | 0.1389 |
| plinkr-03 | dev | empty_documents | 110 chars | 0.1455 | 0.1477 |
| plinkr-03 | dev | error_generic | 90 chars | 0.1139 | 0.1167 |
| plinkr-03 | dev | error_connection | 90 chars | 0.1028 | 0.0944 |
| plinkr-03 | dev | error_email_change | 90 chars | 0.1139 | 0.1083 |
| plinkr-03 | dev | error_file_open | 90 chars | 0.1222 | 0.1250 |
| plinkr-03 | dev | error_number_only | 60 chars | 0.1042 | 0.1000 |
| plinkr-04 | dev | welcome_morning | 40 chars | 0.0500 | 0.0500 |
| plinkr-04 | dev | start_title | 40 chars | 0.1500 | 0.1500 |
| plinkr-04 | dev | start_description | 80 chars | 0.1094 | 0.1156 |
| plinkr-04 | dev | start_intake_subtitle | 110 chars | 0.1273 | 0.1432 |
| plinkr-04 | dev | start_collaboration_explainer | 260 chars | 0.1394 | 0.1413 |
| plinkr-04 | dev | start_button | 15 chars | 0.0667 | 0.0667 |
| plinkr-04 | dev | success_password_changed | 50 chars | 0.0800 | 0.0800 |
| plinkr-04 | dev | success_email_change | 100 chars | 0.1125 | 0.1125 |
| plinkr-05 | dev | empty_invitations | 70 chars | 0.0786 | 0.0929 |
| plinkr-05 | dev | empty_documents | 160 chars | 0.1375 | 0.1219 |
| plinkr-05 | dev | toast_resident_invited | 40 chars | 0.0500 | 0.0500 |
| plinkr-05 | dev | delete_note_body | 110 chars | 0.1023 | 0.1000 |
| plinkr-05 | dev | delete_note_confirm_button | 30 chars | 0.0917 | 0.0750 |
| plinkr-05 | dev | timeline_onboarding_text | 180 chars | 0.1250 | 0.1250 |
| plinkr-06 | dev | subject | 60 chars | 0.0500 | 0.0500 |
| plinkr-06 | dev | subject_crisis | 70 chars | 0.0571 | 0.0571 |
| plinkr-06 | dev | preheader | 80 chars | 0.1063 | 0.1125 |
| plinkr-06 | dev | body | 100 words | 0.6200 | 0.6525 |
| plinkr-06 | dev | crisis_banner | 60 chars | 0.0833 | 0.0833 |
| reggy-01 | dev | subject_pending | 60 chars | 0.0958 | 0.0917 |
| reggy-01 | dev | heading_pending | 50 chars | 0.1100 | 0.0900 |
| reggy-01 | dev | body_pending | 90 words | 0.7306 | 0.7528 |
| reggy-01 | dev | action_label_pending | 30 chars | 0.0667 | 0.1000 |
| reggy-01 | dev | subject_verified | 60 chars | 0.0833 | 0.0833 |
| reggy-01 | dev | heading_verified | 50 chars | 0.0600 | 0.0600 |
| reggy-01 | dev | body_verified | 60 words | 0.6833 | 0.6875 |
| reggy-01 | dev | action_label_verified | 30 chars | 0.1167 | 0.1083 |
| reggy-02 | dev | connectivity_error | 80 chars | 0.1469 | 0.1406 |
| reggy-02 | dev | deadline_error | 100 chars | 0.1250 | 0.1325 |
| reggy-02 | dev | outage_error | 70 chars | 0.1607 | 0.1536 |
| reggy-02 | dev | rate_limit_error | 90 chars | 0.1417 | 0.1472 |
| reggy-02 | dev | byo_credentials_error | 100 chars | 0.1375 | 0.1300 |
| reggy-02 | dev | tenant_not_provisioned_error | 110 chars | 0.1386 | 0.1318 |
| reggy-02 | dev | campaign_locked_error | 90 chars | 0.1333 | 0.1139 |
| reggy-02 | dev | payment_method_error | 90 chars | 0.1389 | 0.1306 |
| sakedeal-01 | dev | title | 60 chars | 0.1333 | 0.1458 |
| sakedeal-01 | dev | meta | 155 chars | 0.1597 | 0.1500 |
| sakedeal-01 | dev | description | 160 words | 0.8797 | 0.8938 |
| yuzusake-01 | dev | description | 170 words | 0.9074 | 0.8956 |
| yuzusake-01 | dev | serve_tip | 120 chars | 0.0958 | 0.0750 |
| yuzusake-02 | dev | description | 140 words | 0.9232 | 0.9161 |
| yuzusake-02 | dev | meta | 155 chars | 0.1694 | 0.1581 |
| yuzusake-03 | dev | empty_heading | 40 chars | 0.1187 | 0.1000 |
| yuzusake-03 | dev | empty_body | 100 chars | 0.1050 | 0.1125 |
| yuzusake-03 | dev | empty_button | 24 chars | 0.1250 | 0.1250 |
| yuzusake-03 | dev | age_question | 40 chars | 0.1250 | 0.1375 |
| yuzusake-03 | dev | age_yes | 24 chars | 0.1667 | 0.1667 |
| yuzusake-03 | dev | age_no | 24 chars | 0.1042 | 0.1250 |
| yuzusake-03 | dev | age_no_line | 120 chars | 0.1042 | 0.1146 |
| yuzusake-04 | dev | article | 600 words | 0.7308 | 0.7267 |
