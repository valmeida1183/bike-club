# Shopping Cart Page E2E Test Plan

## Application Overview

BikeClub is an Angular 21 standalone-component app. The Shopping Cart page (`http://localhost:4200/shopping/cart`, `CartComponent`, selector `bc-cart`) is reached from the shell nav's Cart icon (`getByLabel('Cart')`, visible on every authenticated route) or from Shopping Details' "Add to Cart" (which always navigates here — see `shopping-details.spec.md`). Unlike Shopping Details' `bc-title`, whose `backLink` is the static string `/shopping`, the Cart page's `bc-title` binds `[backLink]="layoutStore.previousUrl() || '/'"` (`cart.component.html:1`) — a dynamic value driven by `LayoutStore`'s router-event hook (`core/layout/store/layout.store.ts`), which records the URL the app was on immediately before the current navigation. Verified live: arriving at the cart from `/home` via the nav Cart icon and clicking "Go back" returns to `/home`; arriving from `/shopping` the same way returns to `/shopping`. `CartStore` (`features/shopping/cart/store/cart.store.ts`) is root-provided (`{ providedIn: 'root' }`), a singleton for the whole app session — unlike `ShoppingListStore`/`ShoppingDetailsStore`, which are component-provided and reset on navigation. Its `shopCart` state is populated once per login by `MainLayoutComponent` calling `cartStore.getCartByUserId(user.id)` (`main-layout.component.ts:43`), not by `CartComponent` itself, so by the time a test reaches `/shopping/cart` the cart data has already loaded (no null/loading gap to account for, unlike Shopping Details' `store.bike()`).

The page renders a `<bc-title title="Shopping Cart">` block with a "Go back" button, then a list of `bc-cart-item` rows (one per `purchase` in `store.shopCart().purchases`, `@for` tracked by `bikeId`) followed by a `bc-cart-summary` panel. Verified live with an empty cart: the row list renders nothing (no empty-state text), and the summary shows an `<h1>` "Total: $0.00", a paragraph "No delivery address found. Please add an address to your profile or choose.", an "Add Address" button, and a "Buy Now" button that is `[disabled]` (`CartSummaryComponent.isBuyNowDisabled`, `computed(() => !cart?.address || cart.purchases.length === 0)` — true here on both counts).

Verified live with one item added ("Blue Sky", $1,200.90, quantity 1): each `bc-cart-item` row (wrapper class `.cart-item-container`, same convention `shopping-details.spec.md` already relies on) renders the bike's image, an `<h2>` model name, a description paragraph, a price paragraph reading literally `Price: $1,200.90` (a "Price: " prefix — a different format than Shopping Details' bare `$600.90` heading), a `bc-increment` control (`-` / current value / `+` buttons), a delete `matMiniFab` button (`mat-icon` "delete", matched the same way as other specs: `getByRole('button').filter({ hasText: 'delete' })`), and its own `<h3>` "Total: $1,200.90" (quantity × price). The summary's aggregate `<h1>` mirrors the same total when only one item is present.

**Bug, found while generating (not caught during planning — the source read alone was misleading): the row image's `alt` is always empty.** `cart-item.component.html:3` binds `alt="{{ bike()?.name }}"`, but the `Bike` model (`features/shopping/models/bike.model.ts`) has no `name` field — only `model` (which is what the row's `<h2>` correctly binds). So `bike()?.name` is always `undefined` and the rendered `alt` is `""`. Verified live via `img.alt` (empty string) and confirmed the consequence: an `<img alt="">` is accessibility-presentational, so it never gets ARIA role `img` at all — `getByRole('img', { name: ... })` cannot find it under any name. This differs from Shopping and Shopping Details, where the equivalent image's `alt` is real (the image filename) and `getByRole('img', ...)` works. Tests here must locate the row image with `row.locator('img')` (or `.img-responsive`), not `getByRole`.

**Quantity control bounds, verified live (`shared/components/increment/increment.component.ts`):** the `-` button is `[disabled]` whenever quantity is `1` (`disabledDecrement = value() <= 1`) and the `+` button is `[disabled]` whenever quantity is `10` (`disabledIncrement = value() >= 10` — note this cap is lower than Shopping Details' own quantity field, which allows up to 20). Each click calls `CartStore.updateQuantityPurchaseInCart`, which PATCHes `shop-carts/update-purchase/:cartId/:bikeId` and only calls `patchState` in the response's `next` handler — not optimistic — so a click's visible effect (new quantity, new per-item and aggregate totals) should be awaited via the resulting network response, the same non-optimistic pattern `shopping-details.spec.md` already documents for cart removal.

**Nav badge, verified live:** the shell nav Cart icon's badge (`.caret`, same element `shopping.spec.md`/`shopping-details.spec.md` document) sums `quantity` across **all** purchases in the cart, not the number of distinct line items — adding two different bikes at quantity 1 each shows badge "2"; the badge is entirely absent (no `<span>` at all) when the cart has zero purchases.

**Shared backend state — important, same caveat as `shopping.spec.md`/`shopping-details.spec.md`:** the cart is real backend state tied to the Cyclist account (`CartStore`, root-provided, backed by `GET/POST/PATCH/DELETE shop-carts/...`), not reset between test runs or by login/logout, and is the **same account and the same singleton cart** every other e2e spec in this project uses. Any scenario here that adds a bike must use one not already claimed by another spec's cart-mutating test — `shopping.spec.md` claims **Silver Mountain** (id 1) and `shopping-details.spec.md` claims **Mechanical Orange** (id 2) — and must delete what it added afterward, scoped to its own `.cart-item-container` row. This plan claims **Blue Sky** (id 3, $1,200.90), **Snow Mountain** (id 4, $1,400.90), **Orange Tour** (id 5, $380.90), and **Orange Speed** (id 8, $350.00) for its four item-mutating scenarios below, so no two specs in the suite ever touch the same row concurrently under `fullyParallel: true`. Per the existing healing note in `shopping-details.spec.md`, any assertion against the shared nav badge or the summary's aggregate total (as opposed to a single scoped row) must be a **before/after delta**, not an absolute value, since another spec's test may be concurrently adding a different bike to the same cart.

**Empty-cart scenario — known shared-state risk, inherited from `shopping.spec.md`'s `add-to-cart.spec.ts` (not itself fully resolved there either):** scenario 1.1 below needs the *entire* cart empty (not just its own row) to assert the "Total: $0.00" / "No delivery address found" empty state, which means clearing every pre-existing line item first — including ones a concurrently-running spec may be mid-way through adding under `fullyParallel`. This mirrors a pre-existing, documented risk in this suite rather than introducing a new one; if this scenario is observed to flake, the fix (per the same healing precedent) would be to run it with reduced parallelism rather than to abandon the empty-state assertion.

**Address dialog, verified live:** clicking "Add Address" opens a Material dialog (`AddressDialogComponent`, feature `features/address`) titled "Add Address" with a "State" combobox, a "City" combobox, "Street"/"Complement"/"Zip Code" text fields, and "Cancel"/"Save" buttons (Save `[disabled]` until the form is valid). Clicking "Cancel" closes the dialog with no observable change to the cart (verified live: address remains unset, summary still shows "No delivery address found."). **Deliberately out of scope for this plan: actually completing and saving the address form.** `ShopCartApiService` (`shop-cart.api.service.ts`) exposes `updateAddressCart` (a PATCH that sets the address on the shared cart) but no corresponding delete/clear-address endpoint, so — unlike a cart item, which has a delete button — there is no way to revert a saved address afterward via the app. Saving a real address here would permanently change the shared account's cart for every subsequent spec run. A future task could add this coverage against a disposable/seeded test account instead.

**"Buy Now" is effectively inert today, verified by reading the source (not exercised live, since doing so live would require the out-of-scope address save above):** `cart.component.html:13` binds `(onBuyNow)="onBuyNow()"` on `bc-cart-summary`, but `CartSummaryComponent` only declares an output named `buyNow` (`cart-summary.component.ts:14`), not `onBuyNow` — so the parent's listener never actually binds to that output, and `CartComponent.onBuyNow()` (itself an empty no-op, `cart.component.ts:42-44`) never runs on click. Only the child's own `onBuyNow()` executes (`console.log('Buy now clicked')`, then an emit nothing is listening for). This looks like an unintentional wiring bug, but since the button is `[disabled]` in every state this plan can safely reach (no address ever gets set), the only thing verifiable here without the out-of-scope mutation is that "Buy Now" stays disabled — which is enough to confirm the stub has no visible effect through this plan's test surface.

`/shopping/cart` is protected by the same `authGuard` covering all of `/shopping/**` (`src/app/main/container/main.routes.ts`, `canActivate: [authGuard]` at the parent level — the same guard `shopping.spec.md` and `shopping-details.spec.md` each add a dedicated test for). Verified live: clearing `localStorage` and hard-navigating straight to `/shopping/cart` lands on `/account/login`.

**Auth pattern, same as `shopping-details.spec.md`, supersedes `shopping.spec.md`'s older inlined-login style:** authenticated scenarios use `test.use({ storageState: CYCLIST_STORAGE_STATE })` (from `e2e/auth/storage-state.ts`) and open with `page.goto('http://localhost:4200/home')` as step 1, per the `// auth: cyclist (see e2e/auth/cyclist.setup.ts)` convention already used in `e2e/tests/shopping-details/*.spec.ts`. The `**Seed:**` lines below still name `e2e/seed.authenticated.spec.ts` as the interactive exploration/generation entry point (this plan's own exploration was done directly against a loaded `cyclist.json` storage state, refreshed live since the checked-in copy had expired).

## Test Scenarios

### 1. Shopping Cart Page Content

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 1.1. Page loads with an empty cart, no address, and a disabled Buy Now button

**File:** `e2e/tests/cart/page-loads-empty.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist (storageState) and land on `/home`, then navigate to `http://localhost:4200/shopping/cart` and delete every pre-existing line item (loop `getByRole('button').filter({ hasText: 'delete' })` until none remain) so the cart is genuinely empty — real backend state, not reset between runs (see Application Overview's shared-state risk note).
    - expect: Page URL is `http://localhost:4200/shopping/cart`.
  2. Inspect the page heading and back button.
    - expect: A level-1 heading "Shopping Cart" is visible.
    - expect: A "Go back" button is visible.
  3. Inspect the summary panel with no items present.
    - expect: A level-1 heading "Total: $0.00" is visible.
    - expect: The text "No delivery address found. Please add an address to your profile or choose." is visible.
    - expect: An "Add Address" button is visible.
    - expect: The "Buy Now" button is visible and disabled.
    - expect: No `.cart-item-container` rows are present.

#### 1.2. Page loads with a cart item showing its image, description, price, and totals

**File:** `e2e/tests/cart/page-loads-with-item.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, then navigate to `http://localhost:4200/shopping/cart` and delete any pre-existing "Blue Sky" row (scoped to its own `.cart-item-container`, not the whole cart).
  2. Navigate to the Shopping list, search with no filters, and click "Add to Cart" on the "Blue Sky" card (scoped to that card, not by button index, to avoid clicking a neighboring card's button).
  3. Navigate back to `http://localhost:4200/shopping/cart`.
    - expect: A `.cart-item-container` row for "Blue Sky" is visible.
    - expect: The row's image is visible (located via `row.locator('img')`, not `getByRole('img', ...)` — this row's `alt` is always empty, a real app bug, see Application Overview).
    - expect: The row shows the text "Price: $1,200.90".
    - expect: The row's quantity control shows "1" with its "-" button disabled.
    - expect: The row's own total reads "Total: $1,200.90" (level-3 heading; scoped to this row, not the shared aggregate — step 1 only clears this test's own "Blue Sky" row, not the whole cart, so the summary's aggregate total is not safe to assert here under `fullyParallel` — see Application Overview).
  4. Clean up: delete the "Blue Sky" row added by this test.

### 2. Shopping Cart Quantity Controls

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 2.1. Incrementing and decrementing quantity updates totals and the button bounds

**File:** `e2e/tests/cart/quantity-increment-decrement.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, then navigate to `http://localhost:4200/shopping/cart` and delete any pre-existing "Snow Mountain" row.
  2. Navigate to the Shopping list, search with no filters, click "Add to Cart" on the "Snow Mountain" card, then navigate to `http://localhost:4200/shopping/cart`.
    - expect: The "Snow Mountain" row's quantity is "1" with its "-" button disabled.
  3. Click the "Snow Mountain" row's "+" button once.
    - expect: The quantity shows "2".
    - expect: The row's "-" button is now enabled.
    - expect: The row's own total reads "Total: $2,801.80" (2 × $1,400.90).
  4. Click the row's "-" button once.
    - expect: The quantity shows "1" again.
    - expect: The row's "-" button is disabled again.
    - expect: The row's own total reads "Total: $1,400.90".
  5. Clean up: delete the "Snow Mountain" row added by this test.

#### 2.2. Quantity cannot be incremented past 10

**File:** `e2e/tests/cart/quantity-max-limit.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, then navigate to `http://localhost:4200/shopping/cart` and delete any pre-existing "Orange Tour" row.
  2. Navigate to the Shopping list, search with no filters, click "Add to Cart" on the "Orange Tour" card, then navigate to `http://localhost:4200/shopping/cart`.
  3. Click the "Orange Tour" row's "+" button nine times (quantity 1 → 10).
    - expect: The quantity shows "10".
    - expect: The row's "+" button is disabled.
    - expect: The row's own total reads "Total: $3,809.00" (10 × $380.90).
  4. Clean up: delete the "Orange Tour" row added by this test.

### 3. Shopping Cart Item Removal

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 3.1. Deleting a line item removes it and updates the nav badge

**File:** `e2e/tests/cart/remove-item.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, then navigate to `http://localhost:4200/shopping/cart` and delete any pre-existing "Orange Speed" row.
  2. Read the shell nav Cart badge's current value as a baseline (it may be non-zero from other bikes already in the shared cart — see Application Overview).
  3. Navigate to the Shopping list, search with no filters, and click "Add to Cart" on the "Orange Speed" card.
    - expect: The nav Cart badge reads exactly one more than the step-2 baseline (relative assertion, not an absolute value — see Application Overview).
  4. Navigate to `http://localhost:4200/shopping/cart`.
    - expect: A `.cart-item-container` row for "Orange Speed" is visible.
  5. Click the "Orange Speed" row's delete button.
    - expect: The "Orange Speed" row is no longer present.
    - expect: The nav Cart badge returns to exactly the step-2 baseline value.

### 4. Shopping Cart Address and Buy Now

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 4.1. Opening the address dialog and cancelling leaves the cart unchanged

**File:** `e2e/tests/cart/address-dialog-cancel.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, then navigate to `http://localhost:4200/shopping/cart`.
    - expect: The text "No delivery address found. Please add an address to your profile or choose." is visible (this account has no saved cart address — see Application Overview on why this plan never saves one).
  2. Click the "Add Address" button.
    - expect: A dialog titled "Add Address" is visible.
    - expect: The dialog shows "State" and "City" fields, "Street", "Complement", and "Zip Code" fields, and "Cancel"/"Save" buttons.
    - expect: The "Save" button is disabled (form starts empty/invalid).
  3. Click "Cancel".
    - expect: The dialog is no longer visible.
    - expect: The text "No delivery address found. Please add an address to your profile or choose." is still visible (no address was saved).

#### 4.2. "Buy Now" stays disabled while the cart has no address

**File:** `e2e/tests/cart/buy-now-disabled-without-address.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist, land on `/home`, then navigate to `http://localhost:4200/shopping/cart` and delete any pre-existing "Blue Sky" row.
  2. Navigate to the Shopping list, search with no filters, click "Add to Cart" on the "Blue Sky" card, then navigate to `http://localhost:4200/shopping/cart`.
    - expect: The "Blue Sky" row is visible (cart has at least one item).
    - expect: The text "No delivery address found. Please add an address to your profile or choose." is visible (cart has no address).
    - expect: The "Buy Now" button is disabled (both required conditions for enabling it are unmet — see Application Overview's `isBuyNowDisabled` note).
  3. Clean up: delete the "Blue Sky" row added by this test.

### 5. Shopping Cart Navigation

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 5.1. The back button returns to the page the user came from

**File:** `e2e/tests/cart/back-button-navigation.spec.ts`

**Steps:**
  1. Start already authenticated as Cyclist and land on `/home`.
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the shell nav's Cart icon.
    - expect: Page URL is `http://localhost:4200/shopping/cart`.
  3. Click the "Go back" button.
    - expect: Page URL is `http://localhost:4200/home` (the page visited immediately before the cart — a dynamic `previousUrl`, not a static link like Shopping Details' back button — see Application Overview).

### 6. Shopping Cart Route Guard

**Seed:** `e2e/seed.spec.ts`

#### 6.1. An unauthenticated user hard-navigating to the cart URL is redirected to the login page

**File:** `e2e/tests/cart/auth-guard-redirect.spec.ts`

**Steps:**
  1. On a fresh browser context, clear localStorage via `page.evaluate` to guarantee a logged-out starting point, then perform a full page navigation (`page.goto`, not a client-side link click) directly to `http://localhost:4200/shopping/cart`.
    - expect: The browser ends up at `http://localhost:4200/account/login`, not `/shopping/cart` — `authGuard` redirected the unauthenticated request away from the protected route (verify via `page.url()` / `location.href` since the client-side redirect can lag the tool's reported page URL).
    - expect: The Login form (Email + Password fields and a disabled "Login" button) is visible, confirming the redirect landed on a working Login page and not an error state.
