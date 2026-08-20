# Shopping List Page E2E Test Plan

## Application Overview

BikeClub is an Angular 21 standalone-component app. The Shopping page (`http://localhost:4200/shopping`, `ShoppingListComponent`, selector `bc-shopping`) is the searchable bike catalog reached from the Home page's "Go to Shopping" CTA and the shell nav's "Shop" link (both already covered by `home.spec.md`). It renders a `<bc-title>` block with an `<h1>` heading "Shop" and a separator, then a `bc-shop-filter` search panel, then a `bc-shop-list` results grid. Unlike Home and About, this page has live server data: the route's resolvers (`categoriesResolverFn`, `gendersResolverFn` in `shopping.routes.ts`) fetch `Category[]`/`Gender[]` for the filter dropdowns before the component loads, and `ShoppingListStore.getBikes()` (via `ShoppingListApiService`, `GET {baseApiUrl}/bikes`) fetches the actual bike results only when the user submits the search form — `ShoppingListComponent.ngOnInit` only wires the resolver data into signals, it does **not** call `getBikes` itself, so `store.bikes()` starts as `[]` and the results grid is empty until the first search.

Verified live (test3@gmail.com / 123456, live backend at `https://localhost:5001`): the "Search for Bicycles" panel (`bc-panel`, a Material expansion panel) is expanded by default and stays expanded after searching — it never auto-collapses. It contains six optional fields, none of them required, so the form is **valid and the "Search" button is enabled from the moment the page loads**, before any field is touched: a "Category" `mat-select` (options verified live: `--`, Road, Mountain, Hybrid, Touring, Folding, Women's, Electric — not all of these appear on any bike currently in the seeded data), a "Gender" `mat-select` (populated from the `genders` resolver), a "$ Price" text field validated with a currency-shaped regex (`Validators.pattern`), and three numeric spinbuttons — "Gears" (`min(0)`/`max(36)`), "Frame Size" (`min(13)`/`max(24)`), "Rim Size" (`min(12)`/`max(29)`). Each of these four fields shows its own `mat-error` (e.g. "Price is invalid.", "Minimum value is 0.", "Maximum value is 36.") only once the field has been touched (verified: filling an invalid value alone does not show the error — the field must additionally be blurred), and while any field is invalid the "Search" button (`[disabled]="shopForm.invalid"`) is disabled. Submitting the panel's own submit control (label "Search") emits `(search)` on `bc-shop-filter`, which the container forwards to `store.getBikes(filter)`.

Verified live with an empty/default filter: the search returns the full 20-bike seeded catalog. Each result renders as a `mat-card` (`bc-shop-item`) showing the bike's model name (card title), category name (card subtitle), a bike image whose `alt` is the raw image filename (e.g. `alt="mountain1.png"`) — unlike Home's images, this `alt` is real, so `getByRole('img', { name: '<filename>' })` resolves it — a formatted price heading (Angular `currency` pipe, e.g. `$600.90`), a description paragraph, and two buttons: "Details" and "Add to Cart". Verified live: selecting Category "Mountain" and searching narrows the 20 results down to exactly the 4 mountain-category cards (by title: Silver Mountain, Snow Mountain, Silver Mountain II, Scarlet Mountain); selecting Category "Folding" (a category with zero matching bikes in the seed data) and searching produces zero cards and **no empty-state message** — `bc-shop-list`'s `.shop-list-content` container is simply left empty, so a no-results scenario must assert absence (`toHaveCount(0)`), not a "no results" text.

Verified live: clicking "Details" on a card navigates to `/shopping/details/:id` with that bike's numeric id (`ShopItemComponent.onDetails`) — the details page itself is out of scope for this plan. Clicking "Add to Cart" (`ShopItemComponent.onAddToCart`, quantity always 1 per click) calls `CartStore.addPurchaseToCart` and is reflected immediately, without navigation, in the shell nav's Cart icon: the icon (`getByLabel('Cart')`) gets a `<span class="caret">` badge showing the running total item count across all "Add to Cart" clicks (verified: two clicks on the same bike show "2", not two separate line items) — before any click the badge is absent (see `home.spec.md`'s note that the badge only renders when the cart is non-empty). Navigating away via "Details" and back (browser back) re-mounts `ShoppingListComponent` (its store is component-provided, not root-provided — `providers: [ShoppingListStore, ...]` on the container) and resets `store.bikes()` back to `[]`, so the results grid is empty again on return; this plan does not add a dedicated regression test for that reset, since it is standard component-store lifecycle behavior, not app-specific logic.

**Important, discovered during generation:** the cart is **not** reset between test runs or by login/logout — it is real backend state tied to the `test3@gmail.com` account (`CartStore`/`shop-cart.api.service`, not `localStorage`), so it persists indefinitely across separate `npx playwright test` invocations, including ones from earlier manual exploration. Scenario 2.2 must therefore clear any pre-existing cart items (via the cart page's per-item delete button, `getByRole('button').filter({ hasText: 'delete' })`, looped until none remain) before asserting the badge is absent, and must delete the item(s) it added at the end so the account is left clean for the next run. Without this, the "badge is absent" assertion at the start of the scenario would be flaky/false on any run after the first.

`e2e/seed.authenticated.spec.ts` is a spec file, not a shared fixture — there is no `e2e/fixtures.ts` in this project and `playwright.config.ts` runs `fullyParallel: true` with no `storageState` — so, per the pattern established in `home.spec.md` and `about.spec.md`, every scenario in groups 1 and 2 below inlines the seed's own steps as its step 1 (navigate to `/account/login`, clear localStorage, fill Email `test3@gmail.com` and Password `123456`, click Login, expect URL `/home`) before navigating to `/shopping`. The `**Seed:**` line still names the correct exploration entry point for the Generate phase.

`/shopping` is protected by the same `authGuard` (`src/app/core/auth/guards/auth.guard.ts`) documented in `home.spec.md`'s guard scenario (`e2e/tests/home/auth-guard-redirect.spec.ts`) — verified live, an unauthenticated hard navigation to `/shopping` redirects to `/account/login`, the same mechanism, so this plan adds one dedicated guard scenario for this route (group 3) following that scenario's exact shape rather than assuming it's fully covered elsewhere, since each protected route in this project gets its own guard test.

## Test Scenarios

### 1. Shopping Page Search

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 1.1. Page loads with the Shop heading and an expanded, empty search panel

**File:** `e2e/tests/shopping/page-loads.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'Shop' nav link.
    - expect: Page URL is `http://localhost:4200/shopping`.
    - expect: Page title is 'Bike Club' (document title does not change on this route).
  3. Inspect the page heading and search panel.
    - expect: A level-1 heading 'Shop' is visible.
    - expect: The 'Search for Bicycles' panel is expanded (its region content, e.g. the 'Category' field, is visible without clicking the header).
    - expect: A 'Search' button is visible and enabled.
  4. Inspect the results grid before any search.
    - expect: No bike result cards are present (`store.bikes()` starts empty — see Application Overview).

#### 1.2. Submitting the search with no filters returns the full bike catalog

**File:** `e2e/tests/shopping/search-no-filters.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'Shop' nav link.
    - expect: Page URL is `http://localhost:4200/shopping`.
  3. Click the 'Search' button without filling in any field.
    - expect: 20 bike result cards are rendered.
    - expect: A card titled 'Silver Mountain' with subtitle 'Mountain' is visible.
    - expect: The 'Silver Mountain' card shows the price '$600.90'.
    - expect: The 'Silver Mountain' card's image is visible (`getByRole('img', { name: 'mountain1.png' })`).
    - expect: The 'Search for Bicycles' panel is still expanded after the search (it does not auto-collapse).

#### 1.3. Filtering by Category narrows the results to matching bikes

**File:** `e2e/tests/shopping/filter-by-category.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'Shop' nav link.
    - expect: Page URL is `http://localhost:4200/shopping`.
  3. Open the 'Category' select and choose 'Mountain'.
    - expect: The 'Category' select shows 'Mountain' as its selected value.
  4. Click the 'Search' button.
    - expect: Exactly 4 bike result cards are rendered.
    - expect: Cards titled 'Silver Mountain', 'Snow Mountain', 'Silver Mountain II', and 'Scarlet Mountain' are visible.
    - expect: No card with subtitle other than 'Mountain' is present.

#### 1.4. Filtering by a Category with no matching bikes shows an empty results grid

**File:** `e2e/tests/shopping/filter-no-results.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'Shop' nav link.
    - expect: Page URL is `http://localhost:4200/shopping`.
  3. Open the 'Category' select and choose 'Folding'.
    - expect: The 'Category' select shows 'Folding' as its selected value.
  4. Click the 'Search' button.
    - expect: Zero bike result cards are rendered (no "no results" message is shown by this app — see Application Overview).

#### 1.5. An invalid Price value shows a validation error and disables Search

**File:** `e2e/tests/shopping/price-validation.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'Shop' nav link.
    - expect: Page URL is `http://localhost:4200/shopping`.
    - expect: The 'Search' button is enabled (empty form is valid by default).
  3. Type 'abc' into the '$ Price' field, then move focus to another field (e.g. click 'Gears') to blur it.
    - expect: The error message 'Price is invalid.' is visible.
    - expect: The 'Search' button is disabled.

#### 1.6. An out-of-range Gears value shows a validation error and disables Search

**File:** `e2e/tests/shopping/gears-validation.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'Shop' nav link.
    - expect: Page URL is `http://localhost:4200/shopping`.
  3. Type '-1' into the 'Gears' field, then move focus to another field (e.g. click 'Frame Size') to blur it.
    - expect: The error message 'Minimum value is 0.' is visible.
    - expect: The 'Search' button is disabled.
  4. Clear the 'Gears' field and type '37', then blur it.
    - expect: The error message 'Maximum value is 36.' is visible.
    - expect: The 'Search' button is disabled.

### 2. Shopping Page Item Actions

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 2.1. "Details" navigates to the bike's detail page

**File:** `e2e/tests/shopping/item-details-navigation.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'Shop' nav link, then click the 'Search' button with no filters.
    - expect: Page URL is `http://localhost:4200/shopping`.
    - expect: A card titled 'Silver Mountain' is visible.
  3. Click the 'Details' button on the 'Silver Mountain' card.
    - expect: The browser navigates to `http://localhost:4200/shopping/details/1`.

#### 2.2. "Add to Cart" updates the shell nav's Cart badge without navigating away

**File:** `e2e/tests/shopping/add-to-cart.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Navigate to `http://localhost:4200/shopping/cart` and delete any pre-existing items (loop over `getByRole('button').filter({ hasText: 'delete' })` until none remain) — the cart is real backend state tied to this account and is not reset between test runs (see Application Overview).
  3. Click the 'Shop' nav link, then click the 'Search' button with no filters.
    - expect: Page URL is `http://localhost:4200/shopping`.
    - expect: The Cart icon link (`getByLabel('Cart')`) shows no badge (cart confirmed empty by step 2).
  4. Click 'Add to Cart' on the 'Silver Mountain' card.
    - expect: Page URL remains `http://localhost:4200/shopping` (no navigation).
    - expect: The Cart icon's badge (`.caret`) shows '1'.
  5. Click 'Add to Cart' on the 'Silver Mountain' card again.
    - expect: The Cart icon's badge shows '2' (same bike, quantity accumulates — not two separate entries).
  6. Navigate to `http://localhost:4200/shopping/cart` and delete the item(s) added by this test (cleanup, so the shared account is left empty for the next run).

### 3. Shopping Page Route Guard

**Seed:** `e2e/seed.spec.ts`

#### 3.1. An unauthenticated user hard-navigating to /shopping is redirected to the login page

**File:** `e2e/tests/shopping/auth-guard-redirect.spec.ts`

**Steps:**
  1. On a fresh browser context, clear localStorage via `page.evaluate` to guarantee a logged-out starting point (defensive — a fresh context already has none), then perform a full page navigation (`page.goto`, not a client-side link click) directly to `http://localhost:4200/shopping`.
    - expect: The browser ends up at `http://localhost:4200/account/login`, not `/shopping` — `authGuard` (`src/app/core/auth/guards/auth.guard.ts`) redirected the unauthenticated request away from the protected route.
    - expect: The Login form (Email + Password fields and a disabled 'Login' button) is visible, confirming the redirect landed on a working Login page and not an error state.
