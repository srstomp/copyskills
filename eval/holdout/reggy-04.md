---
id: reggy-04
project: reggy
set: holdout
channel: email
locale: en
audience: "A Reggy workspace admin who has just created an API key, or whose workspace has had one created by someone else"
register: you
email_type: transactional
deliverables:
  - name: subject
    max_chars: 60
  - name: heading
    max_chars: 50
  - name: body
    min_words: 50
    max_words: 90
  - name: action_label
    max_chars: 30
placeholders: ["{workspace}", "{key_name}", "{environment}", "{scopes}"]
target_query: null
replaces: null
samples: project
---

## Brief

A security notification sent when an API key is created in a workspace. The reader should recognise the key from its details, know that the secret is not in this email, and know what to do at once if the key is not theirs. Facts that a stranger could verify only; nothing alarming in tone and nothing soft about the action. The action opens the workspace's API keys screen, where the key can be revoked; the template supplies the URL, write only the label. Platform mail has one heading, short paragraphs and a reply line the template adds; do not write the reply line.

Placeholders are defined by this task, mapped to key fields the console already shows: `{key_name}` is the key's name, `{environment}` is `live` or `test`, `{scopes}` is the comma-separated scope list, `{workspace}` is the workspace name. The secret and its preview are not placeholders: never include either.

## Facts

F1: Keys are created in the console under Settings → API keys. The secret is displayed once, at creation; Reggy stores only a preview and cannot show it again. (source: reggy-launch/src/pages/docs.astro:285-288)
F2: A key has an environment, `live` or `test`, and a set of scopes. A key can do exactly what its scopes allow. Scopes are fixed at creation. (source: reggy-launch/src/pages/docs.astro:290-295,414)
F3: The console's key records carry `name`, `key_preview`, `environment` and `scopes`. (source: reggy-app/src/routes/$ws.api-keys.tsx:48-51)
F4: `emails:send` is the only scope that can send. (source: reggy-launch/src/pages/docs.astro:35)
F5: Keys can also be created and revoked through the API with the `api_keys:write` scope, not only in the console. (source: reggy-launch/src/pages/docs.astro:49)
F6: Revoking a key takes effect immediately and cannot be undone. A revoked key is rejected with 401 `invalid_api_key`. (source: reggy-launch/src/pages/docs.astro:311,402-403)
F7: Security issues go to security@reggy.app. (source: reggy-launch/src/pages/docs.astro:542)
F8: Platform mail template: one heading, paragraphs, one https action, a reply line; subject at most 150 characters and not all capitals; plain text always produced. (source: reggy-api/infra/lambda/shared/platform-mail-template.ts:62-104)

## Unknown

- Whether this email will exist, and who receives it (creator only, or all admins).
- Who created the key, from where and when; the repo does not say these are available to the mail.
- The key preview format shown in mail.
- Whether the creator's own actions also trigger it.
- Pricing and limits.

## Existing copy

None. The nearest shipped copy is the console toast `Key created` / `The secret was not returned. Create another key to get a copyable secret.` (reggy-app/src/routes/$ws.api-keys.tsx:203-204), which is not an email and not about security.
