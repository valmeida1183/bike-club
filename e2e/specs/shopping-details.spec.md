# Shopping Details Page E2E Test Plan

## Application Overview

BikeClub is an Angular 21 standalone-component app. The Shopping Details page (`http://localhost:4200/shopping/details/:id`, `ShoppingDetailsComponent`, selector `bc-shopping-details`) shows a single bike, reached from the Shopping list page's "Details" button on a `bc-shop-item` card (covered by `shopping.spec.md`'s `item-details-navigation.spec.ts`). It renders a `<bc-title>` block with heading "Shopping Details" and a back button (`backLink="/shopping"`, a static `routerLink`, not browser history back — verified live: clicking it always lands on `/shopping`, even if the user arrived some other way), then three dumb panels: `bc-bike-image-panel`, `bc-bike-description-panel`, `bc-bike-price-panel`. The route's `id` param is bound to the component's `id` input via `withComponentInputBinding()`; `ngOnInit` calls `store.getBike(id)`. `ShoppingDetailsStore` is component-provided (`providers: [ShoppingDetailsStore, ShoppingDetailsApiService]` on the container), so it is a fresh instance per navigation and `store.bike()` starts `null` until the `GET {baseApiUrl}/bikes/:id` response lands.

**Auth pattern — important, verified against current generated tests, supersedes older `.md` plan text:** this project migrated authenticated E2E tests to Playwright `storageState` (see the "Added storageState to handle PlayWright authentications" commit). Current generated tests (`e2e/tests/shopping/page-loads.spec.ts`, `e2e/tests/shopping/add-to-cart.spec.ts`) do **not** inline a UI login — they open with a `// auth: cyclist (see e2e/auth/cyclist.setup.ts)` comment, call `test.use({ storageState: CYCLIST_STORAGE_STATE })` (from `e2e/auth/storage-state.ts`), then `page.goto('http://localhost:4200/home')` as step 1. The `**Seed:**` lines below still name `e2e/seed.authenticated.spec.ts` because that is what actually performs a real login for the interactive `--debug=cli` exploration/generation session (per the playwright-cli skill) — but the Generate phase must emit the `storageState` pattern shown in `page-loads.spec.ts`/`add-to-cart.spec.ts`, not an inlined login. This plan's own exploration was done directly against a `cyclist.json` storage state (loaded via `playwright-cli state-load`) rather than via the seed spec file, since there is no feature-specific setup on this route beyond authentication.

Verified live (Cyclist account, live backend at `https://localhost:5001`, bike id `1` = "Silver Mountain"): the image panel renders `<img class="img-responsive" [alt]="imageName">` — same convention as the Shopping list cards, `getByRole('img', { name: 'mountain1.png' })` resolves it. The description panel renders an `<h1>` with the model name ("Silver Mountain"), an `<h3>` reading exactly `Category: Mountain` (literal "Category: " prefix, verified live, then the category name), a description paragraph, and three `bc-bike-tag` blocks ("Gears" → 18, "Frame" → 17.5, "Rim" → 27.5, all rendered as plain numeric text, not form fields). The price panel renders an `<h1>` with the Angular `currency`-piped price (`$600.90`), a static paragraph about delivery address, a "Change Address" button, a "Quantity" `matInput` spinbutton (default value `1`, `Validators.min(1)`/`Validators.max(20)`, its own `mat-error`s "Minimum value is 1." / "Maximum value is 20." shown once the field is touched-and-blurred, same touched/blurred pattern documented in `shopping.spec.md`), and "Add to Cart" / "Buy Now" buttons that are both `[disabled]` while the quantity field is invalid.

**Verified live — "Change Address" and "Buy Now" are unfinished stubs**, reading `ShoppingDetailsComponent.onChangeAddress()`/`onBuyNow()`: both only `console.log` and have **no observable effect** — no navigation, no dialog, no cart change. This is current, intentional-looking WIP state (not a bug to fix), but worth a regression test asserting they stay inert, so an accidental future change (e.g. an unintended navigation) doesn't slip in unnoticed.

**Healing note, discovered running the generated suite under `fullyParallel: true`:** a scenario that asserts the Cart badge is *absent* (e.g. to prove a stub control has no cart effect) must not assume the shared account's cart starts/stays empty for the whole test — `add-to-cart-navigates-to-cart.spec.ts` (group 2) legitimately populates that same real backend cart for the middle portion of its own run, and with multiple workers the two can overlap, so a static "badge count is 0" assertion is flaky (reproduced: failed 1 run in ~7). The fix is to snapshot the badge's state immediately before the action under test and assert it is **unchanged** afterward, not that it is empty — this is what `stub-controls-no-effect.spec.ts` does. Any future scenario that reads the shared cart badge/state without itself owning a clean/known cart should follow the same before/after pattern rather than asserting an absolute value.

**Healing note, discovered running this plan's tests together with `shopping.spec.md`'s suite:** `add-to-cart-navigates-to-cart.spec.ts` (group 2) originally targeted "Silver Mountain" (bike id `1`) — the same bike `shopping.spec.md`'s `e2e/tests/shopping/add-to-cart.spec.ts` uses. Both specs hard-clear and re-read the shared account's cart around their own addition; run concurrently, they can race on the exact same cart line item (not just the aggregate badge), corrupting each other's expected quantity. Fixed by moving this plan's scenario to a different bike, **"Mechanical Orange" (bike id `2`, $450.90, so 2× = $901.80)**, so the two specs never touch the same row, and by scoping cleanup/assertions to that bike's own `.cart-item-container` row instead of the whole cart or the shared nav badge/overall-total aggregates (which still combine every bike in the account and aren't safe to assert on an exact value while another spec may be adding a different one concurrently). Any future scenario that adds a bike to this shared cart should pick a bike not already used by another cart-mutating spec, and should scope its cleanup and assertions to its own row rather than the whole cart or the global badge/total.

**Verified live — "Add to Cart" behaves differently here than on the Shopping list page**: `ShoppingDetailsComponent.onAddToCart(quantity)` calls `CartStore.addPurchaseToCart(bike, quantity)` **and then always navigates to `/shopping/cart`** (`router.navigate(['/shopping/cart'])` unconditionally) — unlike `ShopItemComponent`'s "Add to Cart" (documented in `shopping.spec.md`), which stays on the Shopping list page. Verified live: adding "Silver Mountain" with quantity `2` navigates to `/shopping/cart`, shows the shell nav Cart badge as `2`, and the cart line item shows quantity `2` with a running total of `$1,201.80` (2 × $600.90) — quantity accumulates on the same line item, it does not create duplicate entries (same accumulation behavior as the list page). **Important, reused from `shopping.spec.md`'s note:** the cart is real backend state tied to the Cyclist account and is not reset between test runs, so any scenario that adds an item must delete it afterward (loop `getByRole('button').filter({ hasText: 'delete' })` until none remain), and must not assume the cart starts empty without first clearing it.

**Verified live — a nonexistent bike id triggers the global error dialog, not a broken/blank page.** Navigating to `/shopping/details/9999` (id not in the seed catalog) causes `ShoppingDetailsApiService.getBike` to receive a 404 from `GET {baseApiUrl}/bikes/9999`; `ShoppingDetailsStore.getBike` only subscribes to `next`, so the error is caught upstream by `errorHandlingInterceptor`, which opens a Material dialog via `LayoutStore.openMessageDialog`. Verified live: the dialog shows an error icon, heading **"Resource Not Found"** (this title is stable — it comes from the interceptor's static `httpErrorMap` for HTTP 404, not from the backend response body) and body text "The bike with the specified ID was not found" (this message *is* backend-supplied via the API's problem-details response, so it is verified-live-accurate today but more likely to drift than the title if the backend copy changes) and a "Close" button. Closing the dialog leaves the browser on the same `/shopping/details/9999` URL — no redirect — with the page underneath rendered in a degraded-but-not-crashed state: the `<h3>` reads just `"Category:"` with nothing after it, the three bike-tag values are blank, and the price `<h1>` and the bike image are both absent from the accessibility tree entirely (empty/undefined bound values produce empty accessible names, verified live via snapshot diffing against the id=1 case — this is standard Angular signal-binding behavior for this component, not something to special-case, so the scenario only needs to assert the dialog and the URL, not probe every panel for absence).

`/shopping/details/:id` is protected by the same `authGuard` covering all of `/shopping/**` (`src/app/main/container/main.routes.ts` applies `canActivate: [authGuard]` at the parent level, confirmed by reading the route tree — this is the same guard documented in `shopping.spec.md`'s `auth-guard-redirect.spec.ts`). Verified live: clearing `localStorage` and hard-navigating straight to `/shopping/details/1` lands on `/account/login` (confirmed via `location.href`, not just the tool's reported page URL, which lagged behind the client-side redirect in this router). Per this project's "each protected route gets its own guard test" convention (see `shopping.spec.md`), this plan adds one dedicated guard scenario for this route.

## Test Scenarios

### 1. Shopping Details Page Content

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 1.1. Page loads with the bike's image, description, tags, and price

**File:** `e2e/tests/shopping-details/page-loads.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist (storageState, see `e2e/auth/cyclist.setup.ts`) and land on `/home`, then navigate to the Shopping list, search with no filters, and click "Details" on the "Silver Mountain" card.
    - expect: Page URL is `http://localhost:4200/shopping/details/1`.
  2. Inspect the page heading and back button.
    - expect: A level-1 heading "Shopping Details" is visible.
    - expect: A "Go back" button is visible.
  3. Inspect the image, description, and tag panels.
    - expect: The bike image is visible (`getByRole('img', { name: 'mountain1.png' })`).
    - expect: A level-1 heading "Silver Mountain" is visible.
    - expect: A level-3 heading "Category: Mountain" is visible.
    - expect: The description paragraph "The classic mountain bike. Equipped with front suspension, V-Brake and aluminum frame." is visible.
    - expect: The "Gears" tag shows "18", the "Frame" tag shows "17.5", the "Rim" tag shows "27.5".
  4. Inspect the price panel.
    - expect: A level-1 heading "$600.90" is visible.
    - expect: The "Quantity" field has value "1".
    - expect: "Add to Cart" and "Buy Now" buttons are visible and enabled.

#### 1.2. A Quantity below the minimum shows a validation error and disables both action buttons

**File:** `e2e/tests/shopping-details/quantity-min-validation.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, navigate to the Shopping list, search with no filters, and click "Details" on the "Silver Mountain" card.
    - expect: Page URL is `http://localhost:4200/shopping/details/1`.
  2. Type "0" into the "Quantity" field, then move focus elsewhere (e.g. click "Change Address") to blur it.
    - expect: The error message "Minimum value is 1." is visible.
    - expect: The "Add to Cart" button is disabled.
    - expect: The "Buy Now" button is disabled.

#### 1.3. A Quantity above the maximum shows a validation error and disables both action buttons

**File:** `e2e/tests/shopping-details/quantity-max-validation.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, navigate to the Shopping list, search with no filters, and click "Details" on the "Silver Mountain" card.
    - expect: Page URL is `http://localhost:4200/shopping/details/1`.
  2. Clear the "Quantity" field, type "21", then move focus elsewhere (e.g. press Tab) to blur it.
    - expect: The error message "Maximum value is 20." is visible.
    - expect: The "Add to Cart" button is disabled.
    - expect: The "Buy Now" button is disabled.

#### 1.4. "Change Address" and "Buy Now" are unfinished stubs with no visible effect

**File:** `e2e/tests/shopping-details/stub-controls-no-effect.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, navigate to the Shopping list, search with no filters, and click "Details" on the "Silver Mountain" card.
    - expect: Page URL is `http://localhost:4200/shopping/details/1`.
  2. Click the "Change Address" button.
    - expect: Page URL remains `http://localhost:4200/shopping/details/1` (no navigation).
    - expect: No dialog is visible.
  3. Click the "Buy Now" button (default quantity `1`, a valid value).
    - expect: Page URL remains `http://localhost:4200/shopping/details/1` (no navigation).
    - expect: No dialog is visible.
    - expect: The shell nav Cart icon shows no badge (nothing was added to the cart).

#### 1.5. The back button navigates to the Shopping list

**File:** `e2e/tests/shopping-details/back-link-navigation.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, navigate to the Shopping list, search with no filters, and click "Details" on the "Silver Mountain" card.
    - expect: Page URL is `http://localhost:4200/shopping/details/1`.
  2. Click the "Go back" button.
    - expect: Page URL is `http://localhost:4200/shopping` (a static `routerLink` to `/shopping`, not browser-history back — see Application Overview).

### 2. Shopping Details Page Cart Actions

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 2.1. "Add to Cart" adds the chosen quantity and navigates to the cart page

**File:** `e2e/tests/shopping-details/add-to-cart-navigates-to-cart.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist and land on `/home`.
    - expect: Page URL is `http://localhost:4200/home`.
  2. Navigate to `http://localhost:4200/shopping/cart` and, if a "Mechanical Orange" line item already exists (scoped to its own `.cart-item-container` row, not the whole cart — see Healing note), delete it — the cart is real backend state tied to this account and is not reset between test runs (see Application Overview).
  3. Navigate to the Shopping list, search with no filters, and click "Details" on the "Mechanical Orange" card (a different bike than `shopping.spec.md`'s cart test uses — see Healing note).
    - expect: Page URL is `http://localhost:4200/shopping/details/2`.
  4. Set the "Quantity" field to "2" and click "Add to Cart".
    - expect: Page URL is `http://localhost:4200/shopping/cart` (this page navigates away, unlike the Shopping list's "Add to Cart" — see Application Overview).
    - expect: The cart shows one line item for "Mechanical Orange" with quantity "2" and a per-item total of "$901.80" (assert against that item's own row, not the shared nav badge or the overall cart total — see Healing note).
  5. Clean up: delete the "Mechanical Orange" item added by this test so the shared account is left as found.

### 3. Shopping Details Page Error Handling

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 3.1. An invalid bike id shows a "Resource Not Found" dialog instead of a broken page

**File:** `e2e/tests/shopping-details/invalid-bike-id-shows-dialog.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist and land on `/home`, then navigate directly to `http://localhost:4200/shopping/details/9999` (an id not present in the seeded catalog).
    - expect: A dialog with heading "Resource Not Found" is visible.
    - expect: The dialog shows a "Close" button.
  2. Click "Close" on the dialog.
    - expect: The dialog is no longer visible.
    - expect: Page URL remains `http://localhost:4200/shopping/details/9999` (no redirect back to the Shopping list).

### 4. Shopping Details Page Route Guard

**Seed:** `e2e/seed.spec.ts`

#### 4.1. An unauthenticated user hard-navigating to a details URL is redirected to the login page

**File:** `e2e/tests/shopping-details/auth-guard-redirect.spec.ts`

**Steps:**
  1. On a fresh browser context, clear localStorage via `page.evaluate` to guarantee a logged-out starting point, then perform a full page navigation (`page.goto`, not a client-side link click) directly to `http://localhost:4200/shopping/details/1`.
    - expect: The browser ends up at `http://localhost:4200/account/login`, not `/shopping/details/1` — `authGuard` redirected the unauthenticated request away from the protected route (verify via `page.url()` / `location.href` since the client-side redirect can lag the tool's reported page URL).
    - expect: The Login form (Email + Password fields and a disabled "Login" button) is visible, confirming the redirect landed on a working Login page and not an error state.
