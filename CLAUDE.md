# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Source of Truth

The canonical project specification lives at `.specs/project-specs.md`. Treat it as non-negotiable — if a request conflicts with it, surface the conflict before proceeding. The notes below are a quick orientation; consult `.specs/project-specs.md` for full architectural detail.

## Common Commands

- `npm start` — dev server at `http://localhost:4200`
- `npm run build` — production build to `dist/bike-club`
- `npm test` — Karma/Jasmine unit tests
- `npm run e2e` — Protractor end-to-end tests
- `npm run lint` — TSLint (legacy, still wired into `ng lint`)
- Single test: `ng test --include=src/app/path/to/file.spec.ts` (Karma)

The backend API is expected at `https://localhost:5001` (`v1`) per `src/environments/environment.ts`. The `feature/adapt-to-vertical-slice-backend` branch indicates ongoing work to align the frontend with a vertical-slice backend.

## Architecture (big picture)

Angular 21 standalone-component app using **NgRx Signals** for state and a **Smart/Dumb component** split inside each feature.

### Layered structure under `src/app/`

- `core/` — singletons used app-wide. Notable: `core/auth/store/auth.store.ts` (signal store with auto-login from `localStorage` key `bikeClubAuthUserData`, navigates to `/home` or `/account/login` via an effect), `core/api/models/result.ts` (the `Result<T>` envelope returned by API services), `core/errors/` (global HTTP error handling + the `X-Skip-Error-Handling` opt-out header), `core/layout/` (loading + request-params interceptors, layout store).
- `features/` — vertical slices, each lazy-loaded via `loadChildren`. Examples: `shopping/shopping-list`, `shopping/shopping-details`, `shopping/cart`, `account`, `address`, `club`, `home`, `about`. A feature owns its own `containers/`, `components/`, `services/`, `store/`, and `models/`.
- `shared/` — cross-feature reusables (`BreakpointService`, `DialogService`, `simple-dialog`, resolvers like `categories.resolver`, `match-value` validator, `dialog-type.enum`).
- `main/` — application shell (`main-layout`, top-level `main.routes`).
- `models/` — global enums and auth DTOs (`Bike` lives under `features/shopping/models`, not here).

### Routing

`app.routes.ts` lazy-loads `main/container/main.routes` for `''` and `features/account/account.routes` for `/account`. Use `withComponentInputBinding()` — route params are bound directly to component `input()` signals. Protect routes with `authGuard` from `core/auth/guards/`.

### HTTP interceptor chain

Registered in `app.config.ts` in this exact order — order matters:

1. `requestParamsInterceptor` — strips `null`/`undefined`/`""` from `HttpParams`
2. `authInterceptor` — adds `Authorization: Bearer <token>` when `AuthStore.isAuthenticated()` is true
3. `loadingInterceptor` — drives the global spinner state
4. `errorHandlingInterceptor` — catches errors, opens a message dialog via `LayoutStore.openMessageDialog`, and re-throws. Set the `X-Skip-Error-Handling` header on a request to bypass it.

### State management — NgRx Signals pattern

Stores follow this shape (see `core/auth/store/auth.store.ts` for the canonical example):

- `signalStore({ providedIn: 'root' }, withState(initialState), withProps(...inject deps...), withComputed(...), withMethods(...), withHooks(...))`
- API services are injected through `withProps`, not constructors.
- Mutate via `patchState(store, partial)`. Side effects (router navigation, `localStorage` sync, expiration timers) live in `withHooks(onInit)` using `effect(...)` + `untracked(...)`.
- Feature stores (`shopping-list.store`, `shopping-details.store`, `cart` state, `layout.store`) follow the same template.

### API service pattern

Each feature has a `*.api.service.ts` (e.g., `shopping-list.api.service.ts`, `auth.api.service.ts`). Services use `inject(HttpClient)`, return `Observable<Result<T>>` for endpoints that wrap responses, and read `environment.baseApiUrl` / `environment.imageResource` for URLs.

### Smart vs. Dumb components (strict)

- **Smart** lives in `containers/` (or `container/`). Owns store access, service injection, route data, and is usually the routed component. Multiple smart components in one feature each get their own subfolder.
- **Dumb** lives in `components/<name>/`. Receives data via `input()` signals, emits via `output()`. Exception: a dumb component may touch a store directly to avoid bubbling events through a deep grandparent chain (see `shop-item.component.ts`).

## Conventions

- **Standalone everywhere** — `standalone: true` in every `@Component`. Import Material modules inline in the component's `imports` array.
- **Signals API** — prefer `input()`, `output()`, `signal()`, `computed()`, `viewChild()` over decorators.
- **DI** — use `inject()`, not constructor parameters.
- **Selectors** — `bc-` prefix for elements (`<bc-main-nav>`), `bc` for attributes.
- **File naming** — `kebab-case.component.ts`, `kebab-case.api.service.ts`, `kebab-case.store.ts`, `kebab-case.state.ts`.
- **Formatting (`.prettierrc`)** — tabs, `tabWidth: 1`, single quotes. Angular parser for `.html`. Match this when editing.
- **TS config** — `strict` Angular 21 defaults; TSLint + Codelyzer are still present (deprecated upstream — don't migrate to ESLint without being asked).

## When making changes

- Adding a feature: create `features/<name>/` with its own `<name>.routes.ts`, smart component(s) in `containers/`, dumb components in `components/`, services in `services/`, and store files in `store/`. Wire it in via `loadChildren` in the parent routes file.
- Adding an authenticated screen: inject `AuthStore`, gate the route with `authGuard`, and read `authStore.isAuthenticated()` / `authStore.userRole()` directly in templates.
- New API call: add a method on the feature's `*.api.service.ts` returning `Observable<Result<T>>`, then call it from the feature store's `withMethods` block and `patchState` on success.
