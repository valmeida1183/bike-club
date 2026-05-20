# Task 4.0: Refactor AuthApiService and AuthStore to consume unwrapped values

<critical>Read the prd.md and techspec.md files from this folder; if you don't read these files your task will be invalidated</critical>

## Overview

`AuthApiService` is today the only service in the codebase that declares `Observable<Result<AuthResponse>>` and the only consumer that performs manual `response.isSuccess && response.value` inspection inside its store. After the unwrap interceptor (Task 2.0) is in place, this becomes redundant and inconsistent with the rest of the codebase. Drop the `Result<>` wrapping from `AuthApiService.signIn` and `AuthApiService.signUp` so they return `Observable<AuthResponse>`, and remove the manual envelope check from `AuthStore.signIn` / `AuthStore.signUp` so they call `_handleAuthentication(response)` directly. Auto-login behaviour, expiration timer, and `localStorage` synchronization MUST remain functionally identical (PRD F5).

<skills>
### Compliance with Standard Skills

- `.claude/skills/task-review/references/code-standards.md` — camelCase methods, kebab-case files, single-action functions, no inline comments, English-only identifiers.
- `.claude/skills/task-review/SKILL.md` — post-implementation review verifies TypeScript compilation, Karma/Jasmine pass, and Prettier formatting.
</skills>

<requirements>
- `AuthApiService.signIn` and `AuthApiService.signUp` MUST declare return type `Observable<AuthResponse>` — the `Result<>` wrapping MUST be removed from the public signature (PRD FR-5.1; techspec.md §Implementation Design → "Main Interfaces").
- The `http.post` generic at the call site may stay as-is or be relaxed to `AuthResponse`; both behave identically because the interceptor reshapes the body before subscribers see it (techspec.md §System Architecture → "Modified components").
- `AuthStore.signIn` and `AuthStore.signUp` MUST consume `AuthResponse` directly in the `next` handler and call `_handleAuthentication(response)` without any `isSuccess`/`value` checks (PRD FR-5.2).
- Auto-login behaviour, expiration timer, `localStorage` key `bikeClubAuthUserData` synchronization, and router navigation effects MUST remain functionally identical — this task is a type-and-callback cleanup, not a behaviour change (PRD FR-5.3; techspec.md §System Architecture → "Modified components" → AuthStore).
- The existing `auth.api.service.spec.ts` "should be created" stub MUST continue to pass; update mock typing only if the existing spec asserts on the old `Result<>` shape (PRD FR-6.4; techspec.md §Testing Approach).
- No changes to `authInterceptor`, `authGuard`, or to the localStorage key name.
- Prettier formatting (tabs, single quotes) MUST be applied.
</requirements>

## Subtasks

- [ ] 4.1 Update `src/app/core/auth/services/auth.api.service.ts` so `signIn` and `signUp` return `Observable<AuthResponse>` (drop `Result<>`).
- [ ] 4.2 Update `src/app/core/auth/store/auth.store.ts` to remove the `response.isSuccess && response.value` guard in both `signIn` and `signUp` `next` handlers; call `_handleAuthentication(response)` directly with the typed `AuthResponse`.
- [ ] 4.3 Verify the auth flow end-to-end manually (`npm start`): sign-in succeeds, token persists to `localStorage`, auto-login on reload restores the session, expiration timer still fires, sign-out clears storage and redirects.
- [ ] 4.4 Update `src/app/core/auth/services/auth.api.service.spec.ts` only if the existing mock no longer matches the new signature. Run the spec.
- [ ] 4.5 Run `npm run build` and `npm test` to confirm no regressions.

## Implementation Details

See techspec.md §Implementation Design → "Main Interfaces" for the new `AuthApiService` signature; §System Architecture → "Modified components" for the `AuthStore` callback change; §Technical Considerations decision 7 for the rationale that the rest of `features/` requires no equivalent change (verification only — covered by Task 5.0).

## Success Criteria

- `AuthApiService.signIn` and `AuthApiService.signUp` declared as `Observable<AuthResponse>`; no `Result<>` reference remains in `core/auth/`.
- `AuthStore` no longer performs envelope inspection; subscribers receive `AuthResponse` directly.
- Sign-in flow works in the browser: token stored, navigation to `/home` occurs.
- Auto-login on app reload restores the session from `localStorage`.
- Expiration timer behaviour is unchanged (token clears at the same time it did before).
- `npm run build` succeeds; existing test suite passes.

## Task Tests

- [ ] Unit tests: existing `auth.api.service.spec.ts` continues to pass (update mock typing only if required by the signature change). No new auth-specific tests are added — the new interceptor specs from Tasks 2.0 and 3.0 cover the contract behaviour.
- [ ] E2E tests: not applicable.

<critical>ALWAYS CREATE AND EXECUTE TASK TESTS BEFORE CONSIDERING IT COMPLETED</critical>

## Relevant Files

- `src/app/core/auth/services/auth.api.service.ts` (modified)
- `src/app/core/auth/services/auth.api.service.spec.ts` (potentially modified)
- `src/app/core/auth/store/auth.store.ts` (modified)
- `src/app/core/api/models/result.ts` (read — to confirm no remaining `Result<>` import is needed in auth files after the change)
- `src/app/core/auth/interceptors/auth.interceptor.ts` (read for context — no edits)
- `src/app/models/auth/auth-response.model.ts` or equivalent (read for `AuthResponse` shape)
