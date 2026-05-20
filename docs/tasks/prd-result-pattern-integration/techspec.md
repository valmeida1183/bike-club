# Tech Spec — Result Pattern Integration

## Executive Summary

The integration extends the existing four-interceptor HTTP chain with a single new response-path interceptor that unwraps the backend `Result<T>` envelope before any caller observes it, and augments the existing `errorHandlingInterceptor` to read the envelope on failure (including the HTTP 422 `ValidationResult` variant) so dialog content reflects backend-supplied semantics. Models in `core/api/models/result.ts` and `core/errors/models/error.ts` are reused; a new `ValidationResult<T>` subclass is added in the same file as `Result<T>` to carry the `errors` array.

Public API service signatures move from `Observable<Result<T>>` to `Observable<T>` only in `AuthApiService` (the sole place that today wraps the envelope in its type). All other feature API services already declare `Observable<T>` and become functional once the unwrap interceptor is in place — they require no signature change, only verification that store callbacks consume `T` directly. The change is response-side only; routes, verbs, payloads, and the existing dialog channel (`LayoutStore.openMessageDialog`) are untouched.

## System Architecture

### Component Overview

**New components**

- `resultUnwrapInterceptor` — `src/app/core/api/interceptors/result-unwrap.interceptor.ts`. Response-path-only `HttpInterceptorFn`. Detects the envelope shape on `HttpResponse`, replaces the body with `body.value` via `event.clone({ body })`. Handles the `X-Skip-Result-Unwrap` opt-out header and strips it from the outgoing request. Does not touch error responses.
- `ValidationResult<T>` — class in `src/app/core/api/models/result.ts`, extending `Result<T>` with a required `errors: Error[]` field. Mirrors the backend `ValidationResult<TValue>` type.
- `SkipResultUnwrapHeader` constant — exported from the new interceptor file alongside the function, following the `SkipErrorHandlingHeader` / `SkipLoadingHeader` precedent.

**Modified components**

- `app.config.ts` — register `resultUnwrapInterceptor` as the last entry of the `withInterceptors([...])` array. New chain: `requestParamsInterceptor → authInterceptor → loadingInterceptor → errorHandlingInterceptor → resultUnwrapInterceptor`.
- `errorHandlingInterceptor` (`core/errors/interceptors/error-handling.interceptor.ts`) — extend the `catchError` branch to inspect `error.error` for the Result envelope shape. On match, use `error.error.error.description` as the dialog message while preserving the existing `httpErrorMap`-derived title. On HTTP 422 with `errors[]`, concatenate every `errors[i].description` (newline-separated, original order) as the message and use `error.error.error.description` (fallback `"Validation error"`) as the title.
- `AuthApiService.signUp` / `AuthApiService.signIn` — return `Observable<AuthResponse>` (drop the `Result<>` wrapping). `http.post` generic stays unchanged at the call site or is also relaxed to `AuthResponse` — both behave identically because the interceptor reshapes the body before it reaches the subscriber.
- `AuthStore.signUp` / `AuthStore.signIn` — remove the `response.isSuccess && response.value` guard; call `_handleAuthentication(response)` directly with the typed `AuthResponse`.
- Feature stores (`ShoppingListStore`, `ShoppingDetailsStore`, `CartStore`, `AddressStore`) — already consume `T` directly; verify and adjust only if a callback is typed as `Result<T>`.

**Untouched**

- `requestParamsInterceptor`, `authInterceptor`, `loadingInterceptor` — order and behaviour preserved.
- `LayoutStore.openMessageDialog` — sole UX channel.
- `Result<T>`, `Error`, `ErrorTypeEnum` — existing definitions reused.

**Data flow (success):** backend → HttpClient → request-params → auth → loading → error-handling (pass-through) → result-unwrap (replaces body with `value`) → caller subscribes to `T`.

**Data flow (failure):** backend (4xx/5xx) → HttpClient throws `HttpErrorResponse` → result-unwrap (no action on errors) → error-handling (parses envelope, opens dialog, rethrows) → caller's `error` handler receives `HttpErrorResponse`.

## Implementation Design

### Main Interfaces

```ts
// core/api/interceptors/result-unwrap.interceptor.ts
export const SkipResultUnwrapHeader = 'X-Skip-Result-Unwrap';
export const resultUnwrapInterceptor: HttpInterceptorFn;
```

```ts
// core/api/models/result.ts (existing class unchanged; new subclass added)
export class Result<T> { /* unchanged */ }

export class ValidationResult<T> extends Result<T> {
	errors: Error[];

	constructor(errors: Error[], error: Error) {
		super(false, error);
		this.errors = errors;
	}
}
```

```ts
// core/auth/services/auth.api.service.ts
signUp(user: User): Observable<AuthResponse>;
signIn(email: string, password: string): Observable<AuthResponse>;
```

### Data Models

The interceptor reasons about response bodies via a structural predicate, not via instanceof checks (HTTP bodies are plain JSON objects, not class instances):

- **Envelope shape**: object whose own properties include `value`, `isSuccess`, and `isFailure`.
- **Unwrap condition (success path)**: shape matches AND `isSuccess === true`.
- **Validation shape (error path)**: shape matches AND `Array.isArray(body.errors)`.

No new domain entities are added. All existing models (`AuthResponse`, `Bike`, `ShopCart`, `Category`, `Gender`, `State`, `City`) flow through unchanged.

### API Endpoints

None added. All existing routes (`/v1/accounts/login`, `/accounts/register`, `/bikes`, `/bikes/{id}`, `/shop-carts/*`, `/categories`, `/genders`, `/addresses`) preserved verbatim.

## Integration Points

Backend contract treated as fixed input:

- **Success** — HTTP 2xx with `{ value: T, isSuccess: true, isFailure: false, error: { code: "", description: "", type: 0 } }`.
- **Domain failure** — HTTP 4xx/5xx (per `ErrorType` mapping) with the same envelope but `isSuccess: false` and populated `error`.
- **Validation failure** — HTTP 422 with `{ errors: Error[], value: null, isSuccess: false, isFailure: true, error: { code: "Validation.Error", description: "...", type: 1 } }`.

No external auth or third-party integration changes. The `AddressApiService` consumes a static JSON file (`assets/jsons/locality.json`) whose body lacks the envelope shape — the unwrap interceptor passes it through untouched by virtue of the structural predicate.

## Testing Approach

### Unit Tests

#### Use Jasmine and Karma for Unit Tests

**New spec files**

- `core/api/interceptors/result-unwrap.interceptor.spec.ts`
  - given_responseHasResultEnvelope_when_intercepted_then_emitsValueOnly
  - given_responseHasNoEnvelopeShape_when_intercepted_then_passesThroughUnchanged
  - given_requestHasSkipUnwrapHeader_when_intercepted_then_bodyPreserved_and_headerStripped
  - given_errorResponse_when_intercepted_then_doesNotAttemptUnwrap
  - given_envelopeBody_when_intercepted_then_originalResponseInstanceNotMutated

- `core/errors/interceptors/error-handling.interceptor.spec.ts`
  - given_errorBodyHasResultEnvelope_when_4xx_then_dialogMessageIsErrorDescription
  - given_errorBodyHasResultEnvelope_when_4xx_then_dialogTitleIsHttpStatusTitle
  - given_errorBodyHasNoEnvelope_when_4xx_then_fallsBackToHttpErrorMap
  - given_422WithErrorsArray_when_intercepted_then_messageConcatenatesEveryDescriptionInOrder
  - given_422WithErrorsArray_when_intercepted_then_titleIsEnvelopeErrorDescription
  - given_422WithEmptyOrMissingErrors_when_intercepted_then_fallsBackToValidationErrorTitle
  - given_skipErrorHandlingHeader_when_intercepted_then_noDialog_and_headerStripped
  - given_anyHandledError_when_intercepted_then_errorRethrownDownstream

**Mock requirements (external only)**

- `LayoutStore.openMessageDialog` — spy via `jasmine.createSpyObj` injected through `TestBed.overrideProvider`.
- HTTP traffic — `HttpClientTestingModule` + `HttpTestingController` to inject envelope, validation, and error bodies; no real network calls.

**Test conventions**

- Names follow `given_X_when_Y_then_Z` (matches `code-standards.md`).
- Bodies follow Arrange / Act / Assert.
- Existing stub specs (`auth.api.service.spec.ts`, `shop-cart.api.service.spec.ts`, `shopping-details.api.service.spec.ts`, `shopping-list.api.service.spec.ts`) keep their single "should be created" test; no new behaviour tests are added beyond the new interceptor specs (PRD: existing tests updated only where mocks no longer match).

## Development Sequencing

### Build Order

1. **Types (F7)** — add `ValidationResult<T>` to `core/api/models/result.ts`. Pure additive change; unblocks step 3 references.
2. **Unwrap interceptor (F1 / F2)** — create `resultUnwrapInterceptor` + opt-out header constant; register last in `app.config.ts`. After this step, every feature service that already declares `Observable<T>` becomes functional end-to-end.
3. **Error interceptor extension (F3 / F4)** — modify `errorHandlingInterceptor` to read the envelope on errors and special-case 422. After this step, the dialog UX matches the PRD.
4. **Auth refactor (F5)** — drop `Result<>` from `AuthApiService.signUp/signIn` signatures and from the corresponding `AuthStore` callback types. Verify auto-login, expiration timer, and `localStorage` sync behave identically (no functional change beyond type cleanup).
5. **Feature alignment sweep (F6)** — grep for residual `Result<` references in `features/`; confirm none remain. Verify resolvers (`CategoriesResolver`, `GendersResolver`) still compile; they need no edits because their declared types already match.
6. **Interceptor specs** — add the two new spec files once their behaviour is stable.

### Technical Dependencies

- Backend already deployed with the new contract on the `feature/adapt-to-vertical-slice-backend` branch's API counterpart.
- `HttpClientTestingModule` (Angular standard) — already available; no package additions.
- No infrastructure or environment changes required.

## Monitoring and Observability

This project has no Prometheus or Grafana stack. Observability uses two existing surfaces:

- **Console** — `errorHandlingInterceptor` already calls `console.error('HTTP Error:', error)`; preserved verbatim. Useful for QA when debugging failed flows.
- **User dialog** — `LayoutStore.openMessageDialog` is the only user-visible surface and remains so. Post-change, dialog content reflects backend semantics (`Error.description` / concatenated validation messages) instead of generic status-code copy — a measurable improvement in support / QA signal quality.

No new logs, metrics, or dashboards are introduced.

## Technical Considerations

### Main Decisions

1. **Unwrap interceptor placed last in the chain.** Angular runs interceptors top-down on requests and bottom-up on responses; placing the unwrap last means it is the first to observe the raw envelope on the way out. Because errors bypass it (the unwrap branch operates on `HttpResponse` only), `errorHandlingInterceptor` still sees the raw error body with the envelope intact for F3 / F4.

2. **`ValidationResult<T>` as subclass, not optional `errors?` field on `Result<T>`** (user choice). Preserves parity with the backend `ValidationResult<TValue> : Result<TValue>` model and makes the `errors` field a required, typed contract of the variant rather than an implicit optional that callers may forget to check.

3. **Dialog title preservation on non-422 errors** (user choice). The existing `httpErrorMap` title (`"Authentication Error"`, `"Resource Not Found"`, etc.) is kept; only the message is replaced with `Error.description`. `Error.code` (e.g., `Account.LoginFailed`) is a developer-facing identifier and would degrade UX if surfaced as a title.

4. **Rethrow original `HttpErrorResponse` on 422** (user choice). No additional shape is attached to the error stream. Inline form-field error mapping is explicitly out of scope per PRD; the simpler rethrow keeps the error type identical to today's contract and avoids speculative API.

5. **Shape-based envelope detection.** The interceptor checks for presence of `value`, `isSuccess`, `isFailure` keys rather than URL prefixes or runtime type tags. This keeps third-party traffic (the static JSON consumed by `AddressApiService`) safe without per-endpoint configuration and avoids coupling the interceptor to environment URLs.

6. **`event.clone({ body })`, not body mutation.** Angular `HttpResponse` instances are immutable; the unwrap must produce a new instance via `clone`. A spec test asserts the original event reference is not mutated.

7. **F6 is mostly a verification sweep, not a refactor.** Audit shows only `AuthApiService` declares `Observable<Result<T>>` today; all other feature services already declare `Observable<T>`. They were functionally broken because nothing was unwrapping the envelope — the interceptor alone restores them. F6's net change reduces to the Auth cleanup plus a grep-confirmation across `features/`.

### Known Risks

- **False-positive envelope detection.** A non-backend response that happens to carry `value`, `isSuccess`, `isFailure` keys would be silently unwrapped. The structural predicate requires all three keys; collision in this project is implausible. Future endpoints that legitimately return a non-envelope body can set `X-Skip-Result-Unwrap`.
- **Spec mocks misalignment.** Any unit test that mocks `Observable<Result<T>>` from an API service must be updated. The current audit shows existing specs are creation-only stubs, so the blast radius is minimal — but a `Result<` grep across `*.spec.ts` is mandatory before merge.
- **Forms depending on validation error stream.** Components subscribed to a 422-producing endpoint still receive an `HttpErrorResponse` and can decide whether to remain on screen. No inline error-control mapping is provided; forms that previously expected granular per-field errors must accept the dialog-only surface for this iteration.
- **Dialog message overflow on large validation sets.** Concatenated `errors[].description` strings can grow long. The existing `SimpleDialogComponent` already handles multi-line text; no truncation is introduced. If overflow becomes a real-world issue, a follow-up initiative can introduce inline mapping (already noted as out of scope).

### Compliance with Standard Skills

- `.claude/skills/task-review/references/code-standards.md` — camelCase methods/vars, PascalCase classes, kebab-case files, English-only identifiers, no abbreviations, single-action functions, named constants (the `SkipResultUnwrapHeader` constant exemplifies this), max 50 lines per method, max 300 lines per class, no inline comments. The new interceptor and `ValidationResult` class comply.
- `.claude/skills/create-tasks/` — task breakdown will mirror the PRD feature numbering (F1–F7) and the build order in this spec.
- `.claude/skills/task-review/SKILL.md` — per-task review will verify TypeScript compilation, Karma/Jasmine pass, and Prettier formatting (tabs, single quotes) on every modified file.

### Relevant and Dependent Files

**New**

- `src/app/core/api/interceptors/result-unwrap.interceptor.ts`
- `src/app/core/api/interceptors/result-unwrap.interceptor.spec.ts`
- `src/app/core/errors/interceptors/error-handling.interceptor.spec.ts`

**Modified**

- `src/app/app.config.ts`
- `src/app/core/api/models/result.ts`
- `src/app/core/errors/interceptors/error-handling.interceptor.ts`
- `src/app/core/auth/services/auth.api.service.ts`
- `src/app/core/auth/store/auth.store.ts`

**Verified, edited only if a residual `Result<` reference is found**

- `src/app/features/shopping/shopping-list/services/shopping-list.api.service.ts`
- `src/app/features/shopping/shopping-list/store/shopping-list.store.ts`
- `src/app/features/shopping/shopping-details/services/shopping-details.api.service.ts`
- `src/app/features/shopping/shopping-details/store/shopping-details.store.ts`
- `src/app/features/shopping/cart/services/shop-cart.api.service.ts`
- `src/app/features/shopping/cart/store/cart.store.ts`
- `src/app/features/address/services/address.api.service.ts`
- `src/app/features/address/store/address.store.ts`
- `src/app/shared/services/select-options.api.service.ts`
- `src/app/shared/resolvers/categories.resolver.ts`
- `src/app/shared/resolvers/genders.resolver.ts`

**Read for context, no edits expected**

- `src/app/core/auth/interceptors/auth.interceptor.ts`
- `src/app/core/layout/interceptors/loading.interceptor.ts`
- `src/app/core/layout/interceptors/request-params.interceptor.ts`
- `src/app/core/layout/store/layout.store.ts`
- `src/app/core/errors/services/http-error-handler.service.ts`
- `src/app/core/errors/enums/error-type.ts`
- `src/app/core/errors/models/error.ts`
