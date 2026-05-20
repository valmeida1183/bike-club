# Task 2.0: Create Result Unwrap Interceptor with opt-out header

<critical>Read the prd.md and techspec.md files from this folder; if you don't read these files your task will be invalidated</critical>

## Overview

Introduce a response-path-only `HttpInterceptorFn` that detects the backend `Result<T>` envelope on success responses and replaces the emitted body with `body.value`, leaving error responses and non-envelope bodies untouched. Add an `X-Skip-Result-Unwrap` opt-out header (constant exported alongside the interceptor) that callers can set to bypass unwrapping for a specific request, mirroring the existing `X-Skip-Error-Handling` precedent. Register the new interceptor as the last entry of the `withInterceptors([...])` chain in `app.config.ts` so it observes the raw backend body first on the way out and lets `errorHandlingInterceptor` continue to see raw error bodies. After this task lands, every feature service that already declares `Observable<T>` becomes functional end-to-end against the new backend contract (PRD F1, F2; techspec.md §Development Sequencing step 2).

<skills>
### Compliance with Standard Skills

- `.claude/skills/task-review/references/code-standards.md` — camelCase function names, PascalCase types, kebab-case file names, named constants (the `SkipResultUnwrapHeader` constant), single-action functions, max 50 lines per method, no inline comments.
- `.claude/skills/task-review/SKILL.md` — post-implementation review verifies TypeScript compilation, Karma/Jasmine pass, and Prettier formatting.
</skills>

<requirements>
- The interceptor file MUST be created at `src/app/core/api/interceptors/result-unwrap.interceptor.ts`.
- The file MUST export both `resultUnwrapInterceptor: HttpInterceptorFn` and the `SkipResultUnwrapHeader` string constant (PRD FR-2.1, FR-2.2; techspec.md §Implementation Design → "Main Interfaces").
- The interceptor MUST detect the envelope by structural predicate: the response body has own properties `value`, `isSuccess`, and `isFailure` AND `isSuccess === true` (PRD FR-1.1; techspec.md §Implementation Design → "Data Models").
- Responses without that exact shape MUST be passed through unchanged (PRD FR-1.2 — no false positives on third-party calls or static assets such as `assets/jsons/locality.json`).
- The interceptor MUST act only on success-class `HttpResponse` events; error responses MUST flow through untouched (PRD FR-1.3).
- The interceptor MUST be registered LAST in the `withInterceptors([...])` array in `src/app/app.config.ts`, after `errorHandlingInterceptor` (PRD FR-1.4; techspec.md §System Architecture → "Modified components"). Final chain: `requestParamsInterceptor → authInterceptor → loadingInterceptor → errorHandlingInterceptor → resultUnwrapInterceptor`.
- When a request carries the `X-Skip-Result-Unwrap` header, the interceptor MUST pass the response through unchanged (PRD FR-2.1) AND MUST strip the header from the outgoing request before it leaves the client (PRD FR-2.2).
- Body replacement MUST be done via `event.clone({ body })`; the original `HttpResponse` instance MUST NOT be mutated (techspec.md §Technical Considerations decision 6).
- A new spec file MUST be created at `src/app/core/api/interceptors/result-unwrap.interceptor.spec.ts` with the cases listed in techspec.md §Testing Approach.
- Prettier formatting (tabs, single quotes) MUST be applied to all new files.
</requirements>

## Subtasks

- [ ] 2.1 Create `src/app/core/api/interceptors/result-unwrap.interceptor.ts` exporting `SkipResultUnwrapHeader` constant and `resultUnwrapInterceptor` function per techspec.md §Implementation Design.
- [ ] 2.2 Register `resultUnwrapInterceptor` as the last entry in `withInterceptors([...])` in `src/app/app.config.ts`. Verify the final order matches techspec.md §System Architecture.
- [ ] 2.3 Create `src/app/core/api/interceptors/result-unwrap.interceptor.spec.ts` covering the five test cases listed in techspec.md §Testing Approach (envelope unwrap, pass-through on non-envelope, opt-out header strips + preserves body, error response untouched, original instance not mutated). Test names follow `given_X_when_Y_then_Z` convention.
- [ ] 2.4 Run `npm test --include=src/app/core/api/interceptors/result-unwrap.interceptor.spec.ts` and confirm all cases pass.
- [ ] 2.5 Run `npm run build` to confirm no TypeScript regressions across the codebase.

## Implementation Details

See techspec.md §Implementation Design → "Main Interfaces" for the exported symbols, §System Architecture → "Modified components" for the registration ordering, §Technical Considerations decisions 1, 5, 6 for the rationale behind placement and shape detection, and §Testing Approach for the full list of `given_X_when_Y_then_Z` spec cases and mocking conventions (`HttpClientTestingModule` + `HttpTestingController`).

## Success Criteria

- `resultUnwrapInterceptor` and `SkipResultUnwrapHeader` exported from the new interceptor file.
- `app.config.ts` interceptor chain ends with `resultUnwrapInterceptor`; first four entries remain in their existing order.
- New spec file passes all five cases via Karma/Jasmine.
- Existing test suite (`npm test`) continues to pass.
- Manually exercising any feature backed by an `Observable<T>`-typed API service (e.g., shopping list) returns the unwrapped domain shape to subscribers without explicit `value` access.
- `assets/jsons/locality.json` consumed by `AddressApiService` still flows through unmodified.

## Task Tests

- [ ] Unit tests: the five `given_X_when_Y_then_Z` cases listed in techspec.md §Testing Approach for `result-unwrap.interceptor.spec.ts`.
- [ ] E2E tests: not applicable (Protractor suite is not part of this initiative per PRD Out of Scope).

<critical>ALWAYS CREATE AND EXECUTE TASK TESTS BEFORE CONSIDERING IT COMPLETED</critical>

## Relevant Files

- `src/app/core/api/interceptors/result-unwrap.interceptor.ts` (new)
- `src/app/core/api/interceptors/result-unwrap.interceptor.spec.ts` (new)
- `src/app/app.config.ts` (modified)
- `src/app/core/api/models/result.ts` (read for envelope shape reference)
- `src/app/core/errors/interceptors/error-handling.interceptor.ts` (read for `SkipErrorHandlingHeader` convention)
- `src/app/core/layout/interceptors/loading.interceptor.ts` (read for `SkipLoadingHeader` convention)
