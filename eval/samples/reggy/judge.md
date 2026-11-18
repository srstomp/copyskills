status: approved
approval: shipped copy, owner approved it as a voice sample on 2026-11-18

# Reggy voice samples for the judge

Shipped passages not used in generator.md and not rewritten by any reggy task.

## 1. Docs: what "accepted" means (reggy-launch/src/pages/docs.astro:268-272)

It means the sending provider took responsibility for the message — not that it reached the inbox. Delivery, bounces and complaints arrive afterwards as events on the message; the console's Messages screen shows them per message. Accepted sends are also the unit Reggy bills on, so the count on Messages and the count on Billing are the same number.

## 2. Docs: before you send (reggy-launch/src/pages/docs.astro:236-238)

Sends are rejected until all three exist. That is deliberate: an unauthenticated domain is the single largest cause of mail landing in spam, so Reggy will not send from one.

## 3. Docs: suppressions (reggy-launch/src/pages/docs.astro:379-382)

You can add an address, remove one, and export the list. Removing a bounce or complaint entry means the next send to that address goes out again — do that only when you know why the original failure happened and that it is resolved. Repeatedly sending to addresses that bounce is what gets a sending reputation destroyed.

## 4. Console: workspace required (reggy-app/src/components/WorkspaceRequired.tsx:48-59)

Title: Select a workspace to view ${resource}
Body: You are signed in. Every workspace has its own ${resource}. Choose a workspace, or create your first.
Button: Choose a workspace

## 5. Console: API key toasts (reggy-app/src/routes/$ws.api-keys.tsx:231,261-263)

Key revoked: The key can no longer send
Outcome unknown: The revoke is still in flight. Refresh this list before trying again — the key may already be revoked.
