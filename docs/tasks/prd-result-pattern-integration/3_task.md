# Task 3.0: Extend errorHandlingInterceptor for backend Error envelope and HTTP 422 validation

<critical>Read the prd.md and techspec.md files from this folder; if you don't read these files your task will be invalidated</critical>

## Overview

Extend the existing `errorHandlingInterceptor` (`src/app/core/errors/interceptors/error-handling.interceptor.ts`) so that, on `HttpErrorResponse`, it inspects the body for the backend `Result`/`Error` envelope and uses `error.error.error.description` as the dialog message (preserving the existing `httpErrorMap`-derived title). Add a dedicated branch for HTTP 422 `ValidationResult` responses that concatenates every `errors[i].description` (newline-separated, original order) into the dialog message and uses `error.error.error.description` as the dialog title (fallback `"Validation error"`). The existing `LayoutStore.openMessageDialog` channel remains the sole UX surface; the `X-Skip-Error-Handling` opt-out continues to work unchanged; the original `HttpErrorResponse` is rethrown so downstream subscribers and forms can react (PRD F3, F4).

<skills>
### Compliance with Standard Skills

- `.claude/skills/task-review/references/code-standards.md` — camelCase, kebab-case files, single-action functions, named constants, max 50 lines per method, no inline comments, English-only identifiers.
- `.claude/skills/task-review/SKILL.md` — post-implementation review verifies TypeScript compilation, Karma/Jasmine pass, and Prettier formatting.
</skills>

<requirements>
- When `HttpErrorResponse.error` exposes the Result envelope (own properties `value`, `isSuccess`, `isFailure` — same structural predicate as Task 2.0), the interceptor MUST use `error.error.error.description` as the dialog message (PRD FR-3.1; techspec.md §System Architecture → "Modified components" → errorHandlingInterceptor).
- When no envelope is present (network errors, non-API hosts), the interceptor MUST fall back to the existing `HttpErrorHandlerService.httpErrorMap` behaviour unchanged (PRD FR-3.2).
- The `X-Skip-Error-Handling` opt-out MUST continue to work exactly as today (PRD FR-3.3).
- The interceptor MUST continue to call `LayoutStore.openMessageDialog` for all unhandled failures and MUST rethrow the original error so downstream subscribers can react (PRD FR-3.4, FR-4.4).
- For HTTP 422 responses carrying an `errors[]` array (`Array.isArray(body.errors)`), the dialog message MUST be the newline-separated concatenation of every `errors[i].description` in the order received (PRD FR-4.1, FR-4.2; techspec.md §Implementation Design → "Data Models").
- For HTTP 422, the dialog title MUST be `error.error.error.description` with a fallback of `"Validation error"` when missing or empty (PRD FR-4.3; techspec.md §System Architecture → "Modified components").
- For non-422 envelope errors, the dialog title MUST remain the existing `httpErrorMap` value (e.g., "Authentication Error", "Resource Not Found") — only the message is replaced (techspec.md §Technical Considerations decision 3).
- Inline mapping of `errors[i].code` to specific form controls MUST NOT be introduced (PRD FR-4.5; Out of Scope).
- The original `console.error('HTTP Error:', error)` call MUST be preserved verbatim (techspec.md §Monitoring and Observability).
- A new spec file MUST be created at `src/app/core/errors/interceptors/error-handling.interceptor.spec.ts` covering the eight cases listed in techspec.md §Testing Approach.
- Prettier formatting (tabs, single quotes) MUST be applied.
</requirements>

## Subtasks

- [ ] 3.1 Modify `src/app/core/errors/interceptors/error-handling.interceptor.ts` to add the envelope-detection branch and the HTTP 422 `ValidationResult` branch per techspec.md §System Architecture → "Modified components".
- [ ] 3.2 Preserve the existing fallback path, the `X-Skip-Error-Handling` lifecycle (including header stripping), the `console.error` call, and the rethrow.
- [ ] 3.3 Create `src/app/core/errors/interceptors/error-handling.interceptor.spec.ts` covering the eight `given_X_when_Y_then_Z` cases listed in techspec.md §Testing Approach.
- [ ] 3.4 Run the new spec via Karma/Jasmine and confirm all cases pass.
- [ ] 3.5 Run `npm test` to confirm the rest of the suite continues to pass and `npm run build` for compilation safety.

## Implementation Details

See techspec.md §System Architecture → "Modified components" → `errorHandlingInterceptor` for the branching shape; §Implementation Design → "Data Models" for the envelope and validation predicates; §Technical Considerations decisions 3 and 4 for title preservation and the rethrow choice; §Testing Approach for the full list of eight `given_X_when_Y_then_Z` spec cases and mocking conventions (`jasmine.createSpyObj` for `LayoutStore.openMessageDialog`, `HttpClientTestingModule` + `HttpTestingController` for HTTP traffic).

## Success Criteria

- Envelope-carrying error responses surface `Error.description` in the dialog body while keeping the existing `httpErrorMap` title.
- HTTP 422 responses produce a single dialog whose message is every `errors[].description` joined by newlines, in the original order.
- Forms posting to a 422-producing endpoint stay on screen (the error is rethrown).
- Non-envelope errors (e.g., simulated network failure) still display the existing status-code-mapped message.
- `X-Skip-Error-Handling` continues to suppress the dialog for opted-out requests.
- All eight new spec cases pass; existing suite remains green.

## Task Tests

- [ ] Unit tests: the eight `given_X_when_Y_then_Z` cases for `error-handling.interceptor.spec.ts` listed in techspec.md §Testing Approach.
- [ ] E2E tests: not applicable.

<critical>ALWAYS CREATE AND EXECUTE TASK TESTS BEFORE CONSIDERING IT COMPLETED</critical>

## Relevant Files

- `src/app/core/errors/interceptors/error-handling.interceptor.ts` (modified)
- `src/app/core/errors/interceptors/error-handling.interceptor.spec.ts` (new)
- `src/app/core/api/models/result.ts` (read — `ValidationResult<T>` from Task 1.0 is the typed variant this branch reasons about)
- `src/app/core/errors/models/error.ts` (read for `Error` shape)
- `src/app/core/errors/enums/error-type.ts` (read for `ErrorTypeEnum` values)
- `src/app/core/errors/services/http-error-handler.service.ts` (read — fallback `httpErrorMap` is preserved)
- `src/app/core/layout/store/layout.store.ts` (read — `openMessageDialog` signature)
