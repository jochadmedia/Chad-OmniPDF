# Security Specification for Firestore Rules

## 1. Data Invariants
- A user public profile (`/users/{userId}`) can only be created, read, or modified by the authenticated owner (`request.auth.uid == userId`).
- A document (`/users/{userId}/documents/{documentId}`) can only be accessed or modified by its owner (`request.auth.uid == userId` and `request.auth.uid == incoming().ownerId`).
- Immutability: The `ownerId` and `id` fields of a document cannot be changed during an update.
- Timestamps: `createdAt` must match the server timestamp (`request.time`) on creation, and `updatedAt` must match `request.time` on updates.
- Format verification: All ID fields must be valid.

## 2. The "Dirty Dozen" Payloads
The following payloads are explicitly designed to attempt unauthorized write/access:

1. **Anonymous Spoofing Profile**: Creating a profile at `/users/attackerId` with `uid: "victimId"` to impersonate another user.
2. **PII Leakage Attempt**: Authenticated attacker requesting a `get` on `/users/victimId` public profile without ownership verification (if we had private PII, but here blocked by `uid == request.auth.uid`).
3. **Malicious Email Domain**: Creating a profile where the email is not verified, to bypass verified email checks.
4. **Document Hijack**: Updating a victim's document by modifying `/users/victimId/documents/docId` with a custom payload.
5. **Owner Field Poisoning**: Updating `ownerId` of a document at `/users/myUserId/documents/docId` to a different `uid` to transfer ownership/control.
6. **Immutable ID Poisoning**: Trying to change the `id` of an existing document to a different value.
7. **Client Timestamp Injection**: Setting `createdAt` of a document or profile to a client-provided past or future date instead of `request.time`.
8. **Volumetric Flood Field**: Trying to inject an extremely large string (e.g., 5MB description or title) to cause Denial of Wallet (blocked by `.size()` limit).
9. **Junk Character Path Variable**: Accessing a document using document ID containing non-alphanumeric junk characters (e.g. SQL-like injection strings).
10. **State/Status Shortcutting**: Setting a document state to "signed" without providing digital certificates.
11. **Shadow Field Infiltration**: Injecting arbitrary non-whitelisted properties like `isAdmin: true` into a user document.
12. **Self-Assigned Enterprise Privilege**: Creating a profile and claiming `tier: "enterprise"` without central admin provisioning.

## 3. Recommended Firebase Security Rules Match Blueprint
The following rules will be deployed to enforce these properties strictly.
