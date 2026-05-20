# PRD — Result Pattern Integration (Frontend Alignment with Vertical-Slice Backend)

## Overview

The Bike Club REST API has been refactored to a vertical-slice architecture and now wraps every response in a `Result<T>` envelope (`{ value, isSuccess, isFailure, error }`). Failures arrive as HTTP error statuses with the same envelope in the response body. Payload validation failures arrive specifically as **HTTP 422** with an additional `errors[]` array (`ValidationResult`).

Today, the Angular SPA only handles this envelope in one place — `AuthApiService` + `AuthStore` — and every other feature service is currently broken because consumers receive a wrapper object instead of the domain data they expect. The `errorHandlingInterceptor` only knows how to react to HTTP status codes; it has no awareness of the backend `Error` envelope or the new validation payload.

This PRD defines a centralized, interceptor-based integration with the new contract so the SPA continues to work without touching every consumer twice. The frontend already owns a `Result<T>` class, an `Error` model, and an `ErrorTypeEnum` mirroring the backend — this initiative leverages them rather than introducing parallel types.

## Objectives

- **Restore feature parity** with the backend within a single coordinated change set: every feature that currently performs HTTP calls must work end-to-end against the new contract.
- **Centralize Result handling** so that exactly one place in the codebase unwraps successful envelopes and exactly one place translates backend `Error` envelopes (including validation) into user-visible feedback.
- **Keep API routes untouched** — the integration is a contract/shape change only; URLs, HTTP verbs, and request payloads remain as they are today.
- **Preserve current UX patterns** — errors and validation failures continue to surface through the existing `LayoutStore.openMessageDialog` channel; no new error-display mechanisms are introduced.
- **Eliminate boilerplate Result inspection** in stores and components — consumers receive the domain value (`T`) directly on success and are notified through the standard error pipeline on failure.

Success is measured by: (a) all existing flows (auth, shopping list, shopping details, cart, address, club) functioning unchanged from the user's perspective; (b) no consumer outside the interceptor layer references `isSuccess` / `isFailure` / `value` after the change; (c) validation failures (HTTP 422) display a single dialog containing every field-level message.

## User Stories

- **As a cyclist (end user)**, I want application screens to keep loading and submitting data so that my experience is unaffected by the backend refactor.
- **As a cyclist (end user)**, when an action fails I want to see a clear message describing what went wrong (e.g., "You are not authorized") so that I understand the system's response.
- **As a cyclist (end user)**, when I submit an invalid form I want a single dialog that lists every field problem so that I can correct them all in one pass.
- **As a frontend developer**, I want API services to return `Observable<T>` (the domain value) so that I can call them from stores without writing Result inspection logic each time.
- **As a frontend developer**, I want one place to teach the application how to read the backend envelope so that contract changes do not ripple through every service.
- **As a frontend developer**, I want to be able to opt a specific request out of envelope unwrapping for edge cases (e.g., a future endpoint that does not use the Result pattern) without removing the global behavior.

## Main Features

### F1. Response Unwrap Interceptor (auto-unwrap success envelopes)

- **What**: A new HTTP interceptor that, on successful responses, inspects the body and replaces it with `body.value` when the envelope shape is present (`isSuccess === true` with a `value` field).
- **Why**: Eliminates boilerplate in every service and store. Callers see the domain object directly.
- **How (high level)**: Registered in the existing interceptor chain in `app.config.ts`. Runs on responses only (no request mutation). Leaves bodies that do not match the envelope shape untouched so it is safe for non-API traffic.

**Functional Requirements**
1. FR-1.1 The interceptor MUST detect responses whose body contains the keys `value`, `isSuccess`, and `isFailure` and replace the emitted body with the value at `body.value`.
2. FR-1.2 The interceptor MUST leave responses without that shape unchanged (no false positives on third-party calls or static assets).
3. FR-1.3 The interceptor MUST act only on success-class HTTP responses; error responses are handled by F3/F4.
4. FR-1.4 The interceptor MUST be registered in `app.config.ts` **after** `errorHandlingInterceptor` (i.e., last in the existing chain) so that, on the response path, it is the first to observe the raw backend body and unwraps it before any other interceptor sees the success shape. Errors MUST continue to propagate through `errorHandlingInterceptor` untouched by the unwrap step, and the existing four-interceptor ordering MUST remain otherwise unchanged.

### F2. Opt-out Header for Endpoints That Should Not Be Unwrapped

- **What**: A custom request header (e.g., `X-Skip-Result-Unwrap`) that callers can set to bypass F1 for a specific request.
- **Why**: Future-proofs the interceptor for any endpoint that legitimately returns a non-Result body, mirroring the existing `X-Skip-Error-Handling` pattern.

**Functional Requirements**
5. FR-2.1 The interceptor MUST recognize a documented opt-out header on the request and, when present, pass the response through unchanged.
6. FR-2.2 The interceptor MUST strip the opt-out header from the outgoing request before it leaves the client, consistent with how `X-Skip-Error-Handling` is handled today.

### F3. Backend Error Envelope Handling in `errorHandlingInterceptor`

- **What**: Extend the existing `errorHandlingInterceptor` so that, when an `HttpErrorResponse` body matches the backend Result/Error shape, the dialog message and title are sourced from `error.error.error.description` / `error.error.error.code` instead of the generic status-code map.
- **Why**: Users currently get generic messages ("An error has occurred!") even when the backend supplied a precise reason. The backend `Error` object carries a `code`, `description`, and `type` that should drive the user-visible message.

**Functional Requirements**
7. FR-3.1 When `HttpErrorResponse.error` exposes the Result envelope, the interceptor MUST use the embedded `Error.description` as the dialog message.
8. FR-3.2 The interceptor MUST continue to fall back to the existing `HttpErrorHandlerService.httpErrorMap` when no envelope is present (e.g., network errors, non-API hosts).
9. FR-3.3 The `X-Skip-Error-Handling` opt-out MUST continue to work exactly as today.
10. FR-3.4 The interceptor MUST continue to call `LayoutStore.openMessageDialog` for all unhandled failures and rethrow the error so downstream subscribers can react.

### F4. HTTP 422 ValidationResult Handling

- **What**: When the backend returns HTTP 422 with a `ValidationResult` body (`errors[]` array of `{ code, description, type }`), the interceptor concatenates every `description` into a single dialog message.
- **Why**: Payload validation failures must communicate every offending field at once, in plain language, through the same dialog channel.

**Functional Requirements**
11. FR-4.1 The interceptor MUST recognize HTTP 422 responses carrying an `errors[]` array.
12. FR-4.2 The dialog message MUST be the concatenation of each `errors[i].description`, one per line, in the order received from the backend.
13. FR-4.3 The dialog title MUST reflect the validation context (e.g., the `Error.description` from the envelope, falling back to a sensible default such as "Validation error").
14. FR-4.4 The interceptor MUST rethrow the error so forms can decide whether to remain on screen for the user to correct input.
15. FR-4.5 Inline mapping of individual `errors[i].code` to specific form controls is explicitly out of scope (see Out of Scope).

### F5. AuthStore + AuthApiService Refactor

- **What**: Remove the manual `response.isSuccess && response.value` checks from `AuthStore`; let `AuthApiService` return `Observable<AuthResponse>` directly.
- **Why**: `AuthStore` is the only consumer that handles Result manually today. After F1 is in place, this code becomes redundant and inconsistent with the rest of the codebase.

**Functional Requirements**
16. FR-5.1 `AuthApiService.signIn` and `AuthApiService.signUp` MUST return `Observable<AuthResponse>` (no `Result<>` wrapping).
17. FR-5.2 `AuthStore.signIn` and `AuthStore.signUp` MUST consume `AuthResponse` directly in the `next` handler and call `_handleAuthentication(response)` without further envelope checks.
18. FR-5.3 Auto-login behavior, expiration timer, and `localStorage` synchronization MUST remain functionally identical.

### F6. Alignment of All Feature API Services

- **What**: Update every `*.api.service.ts` under `features/` and any other in-app HTTP call site so the declared return type matches the unwrapped shape (`Observable<T>` instead of `Observable<Result<T>>`).
- **Why**: The backend change broke these services; after F1 they will functionally work, but their TypeScript signatures must reflect reality so consumers compile against the correct contract and IDE inference is accurate.

**Functional Requirements**
19. FR-6.1 Every existing API service method MUST declare a return type of `Observable<T>` matching the domain shape, removing `Result<>` from the public signature.
20. FR-6.2 API routes, HTTP verbs, request bodies, headers, and query parameters MUST remain unchanged.
21. FR-6.3 Feature stores that currently consume these services MUST be updated to consume `T` directly (no `isSuccess`/`value` checks at the call site).
22. FR-6.4 Existing unit tests that mock service responses MUST be updated to return the unwrapped shape so suites continue to pass.

### F7. Reuse of Existing Result / Error / ErrorTypeEnum Models

- **What**: The interceptor work MUST use the existing `Result<T>` class (`core/api/models/result.ts`), `Error` class (`core/errors/models/error.ts`), and `ErrorTypeEnum` (`core/errors/enums/error-type.ts`) rather than introducing parallel types.
- **Why**: These types already mirror the backend contract. Duplicating them would create drift risk.

**Functional Requirements**
23. FR-7.1 No new types representing the Result envelope or Error structure MAY be introduced; existing types must be reused (and, if needed, augmented in place — e.g., to express `ValidationResult` as a typed variant carrying `errors[]`).
24. FR-7.2 Any structural gap between the current TypeScript `Result<T>` / `Error` and the backend payload (e.g., missing `errors[]` on validation) MUST be closed by augmenting the existing class definitions in their current files.

## User Experience

The user-visible experience targets parity, not redesign:

- **Happy path**: Identical — the cyclist sees the same screens, same lists, same forms, with the same data, in the same time-to-render bracket.
- **Domain failure path**: Where the SPA previously showed a generic dialog ("An error has occurred!") on a backend failure, it now shows the backend's `Error.description` — a precise, human-readable message. Dialog channel is the existing `LayoutStore.openMessageDialog`.
- **Validation failure path (HTTP 422)**: After submitting an invalid form, the cyclist sees one dialog whose body lists every validation problem (one per line), so they can correct all fields in a single pass. Forms stay on screen (the error is rethrown, not swallowed).
- **Network / non-envelope errors**: The existing status-code-based fallback continues to operate, so connectivity issues and infrastructure errors display the same dialogs as today.

No new screens, components, navigation, or theming are introduced.

## High-Level Technical Constraints

- **Framework & state**: Must work within Angular 21 standalone components and the NgRx Signals pattern already in use (`signalStore`, `withProps` for DI, `patchState` for mutation).
- **Interceptor chain**: The current ordering in `app.config.ts` — `requestParamsInterceptor` → `authInterceptor` → `loadingInterceptor` → `errorHandlingInterceptor` — must remain valid. The new unwrap interceptor must be inserted at a position that does not interfere with auth header injection, loading state, or error capture.
- **Opt-out convention**: The new opt-out header must follow the same naming and lifecycle convention as the existing `X-Skip-Error-Handling` header (custom header, stripped before leaving the client).
- **Backend contract (read-only)**: Frontend treats the backend contract as fixed for this initiative. Success: HTTP 2xx + `{ value, isSuccess: true, isFailure: false, error: { code: "", description: "", type: 0 } }`. Domain failure: HTTP 4xx/5xx mapped from `ErrorType` (e.g., 401 for `Unauthorized`, 404 for `NotFound`, 409 for `Conflict`) + envelope in `error.error`. Validation failure: **HTTP 422** + envelope with `errors[]` array.
- **Compatibility**: All existing API routes and request shapes are preserved. The change is response-side only.
- **Tooling**: Existing tooling stays — TSLint + Codelyzer remain in place; no ESLint migration as part of this work. Prettier formatting (tabs, single quotes) applies to all new and modified files.
- **Reference**: The Result pattern follows the conventions described at https://www.milanjovanovic.tech/blog/functional-error-handling-in-dotnet-with-the-result-pattern.

## Out of Scope

- **Inline form-field error mapping** — translating `ValidationResult.errors[i].code` into specific reactive form control errors so messages appear next to fields. Current iteration shows a concatenated dialog only; inline mapping is a follow-up initiative.
- **Backend changes** — the API contract is treated as fixed input. No requests for additional fields, status code changes, or new endpoints are made through this initiative.
- **New error-display surfaces** — no toast system, no error banner component, no error log dashboard. The existing `LayoutStore.openMessageDialog` remains the sole channel.
- **Retry / circuit-breaker logic** — no automatic retry of failed Result responses; the interceptor surfaces the failure and rethrows.
- **Test infrastructure rewrite** — only existing tests whose mocks no longer match the new shape are updated. No new framework, no Jest migration.
- **Refactor of components or stores beyond what is required** to consume `T` instead of `Result<T>` — no unrelated cleanup, no architectural refactors of unrelated areas.
- **Localization / i18n of backend error descriptions** — backend `Error.description` is rendered as-is; translation layers are not introduced here.
- **Tech Spec content** — this PRD intentionally avoids prescribing exact file structures, interceptor implementation strategies, signature shapes for helper functions, or detailed RxJS operator choices. Those decisions belong in the Tech Spec that follows this PRD.
