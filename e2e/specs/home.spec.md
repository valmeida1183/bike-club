# Home Page E2E Test Plan

## Application Overview

BikeClub is an Angular 21 standalone-component app. The Home page (`http://localhost:4200/home`, `HomeComponent`) is the default landing page of the authenticated shell rendered after login — it is purely static marketing content with no store, no service injection, and no dynamic data, so there are no loading states and no forms to validate. Verified live (test3@gmail.com / 123456): the hero section shows two `<h1>` headings — "Join the Ride" and "Explore. Connect. Belong." — a sub-text paragraph "Since 1962 Building Bikes, Creating Experiences", and exactly one interactive element, a "Go to Shopping" link (a Material `mat-raised-button` rendered as an `<a>`, so it has accessibility role `link`, not `button`) with `routerLink="/shopping"`. Below the hero, an "All classic models" section shows a heading, a descriptive paragraph, and two `<img>` elements (`Home_info_yellow.png`, `Home_info_green.png`); the hero image (`Hero_1.png`) and both info images have no `alt` attribute, so none of the three are exposed as `img`-role accessible elements — locate them with a CSS/structural locator (e.g. `page.locator('.hero-image')`, `page.locator('.info-images img')`) rather than `getByRole('img')`. Below that, four static text blocks render as `<h4>`/`<p>` pairs, verified live to read exactly: "Comfort and elegance" / "The best combination for everyday life", "Durability and robustness" / "To last for a long time", "Custom build" / "Choose the model and customize", and "The best components" / "Excellence in quality" — purely static content, worth a lightweight visibility/text assertion but nothing interactive.

The authenticated shell nav (rendered by `MainLayoutComponent`, not part of the Home feature itself, but the default landing surface for it and worth covering here) is visible at the default desktop viewport used by `playwright.config.ts` (`devices['Desktop Chrome']`; the nav collapses behind a sidenav toggle only at handset breakpoints, which this plan does not cover). It shows four nav links — Home (`/home`), Shop (`/shopping`), Club (`/club`), About (`/about`) — plus, on the right, a Cart icon link with `aria-label="Cart"` going to `/shopping/cart` (it renders a numeric badge only when `cartCounter() > 0`; verified live with test3@gmail.com's empty cart, no badge is present, so scenarios must not assert a specific count, only that the icon/link itself is visible and navigable), a Profile icon link with `aria-label="Profile"` going to `/about`, and a Logout control. The Logout control's real accessible name is "Loggout" — a genuine, reproducible typo in the app's HTML — and it is NOT a `link`-role element: unlike every other nav item it has no `href`/`routerLink`, only a `(click)` handler, so an anchor with no href gets accessibility role `generic`. Locate it with `getByLabel('Loggout')`, not `getByRole('link', { name: 'Loggout' })`. Verified live: clicking it calls `AuthStore.logout()`, which clears `bikeClubAuthUserData` from localStorage and navigates to `/account/login`.

Each scenario that clicks a nav link, the Cart icon, the Profile icon, the "Go to Shopping" CTA, or Logout navigates the browser AWAY from `/home` — per this project's usual scenario-independence rule, these are NOT chained into one "click through the whole nav" test; each get their own scenario, restarting fresh from the seed. The one exception is the Home nav link itself: since the seed already lands on `/home`, clicking it is a same-route no-op and is asserted as such (URL stays `/home`, link shows the active state) rather than as a "navigates away" case.

`e2e/seed.authenticated.spec.ts` is a spec file, not a shared fixture — there is no `e2e/fixtures.ts` in this project and `playwright.config.ts` runs `fullyParallel: true` with no `storageState`, so nothing it does carries into another test file. Every scenario in groups 1 and 2 below must therefore inline the seed's own steps as its step 1 (navigate to `/account/login`, clear localStorage, fill Email `test3@gmail.com` and Password `123456`, click Login, expect URL `/home`) rather than referencing the seed file — the same pattern `login.spec.md`'s own `auto-login-guard.spec.ts` uses for its seed (`e2e/seed.spec.ts`, inlined). The `**Seed:**` line on each group still names the correct exploration entry point for the Generate phase to launch via `playwright-cli`.

The `/home` route is protected by `authGuard` (`src/app/core/auth/guards/auth.guard.ts`), which is distinct from the `autoLoginGuard` documented in `login.spec.md`/`register.spec.md` (that one only guards `/account/login` and `/account/register` against already-authenticated users). Verified live: an unauthenticated user performing a full page navigation straight to `/home` (fresh browser context, no `bikeClubAuthUserData` in localStorage) is redirected by `authGuard` to `/account/login`, landing on the Login form — this is the mirror-image case of the guard scenario in `login.spec.md` (`auto-login-guard.spec.ts`), which redirects an already-authenticated user AWAY from the login page; here an unauthenticated user is redirected AWAY from a protected page.

## Test Scenarios

### 1. Home Page Content

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 1.1. Page loads with the hero, "All classic models" section, and static info blocks

**File:** `e2e/tests/home/page-loads.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: Page title is 'Bike Club'.
  2. Inspect the hero section.
    - expect: A heading 'Join the Ride' is visible.
    - expect: A heading 'Explore. Connect. Belong.' is visible.
    - expect: The paragraph 'Since 1962 Building Bikes, Creating Experiences' is visible.
    - expect: A 'Go to Shopping' link is visible (accessible role `link`, not `button`).
    - expect: The hero image (`page.locator('.hero-image')`) is visible.
  3. Inspect the "All classic models" section.
    - expect: A heading 'All classic models' is visible.
    - expect: The paragraph 'Combining modern components with classic 50s and 60s design' is visible.
    - expect: Two images are visible inside `.info-images` (`page.locator('.info-images img')` resolves to 2 elements).
  4. Inspect the four static info-text blocks.
    - expect: Heading 'Comfort and elegance' with paragraph 'The best combination for everyday life' is visible.
    - expect: Heading 'Durability and robustness' with paragraph 'To last for a long time' is visible.
    - expect: Heading 'Custom build' with paragraph 'Choose the model and customize' is visible.
    - expect: Heading 'The best components' with paragraph 'Excellence in quality' is visible.

#### 1.2. "Go to Shopping" CTA navigates to the shopping list

**File:** `e2e/tests/home/go-to-shopping-cta.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: The 'Go to Shopping' link is visible.
  2. Click the 'Go to Shopping' link.
    - expect: The browser navigates to `http://localhost:4200/shopping` (assert `page.url()`).

### 2. Home Page Shell Navigation

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 2.1. Home nav link keeps the user on /home and shows as active

**File:** `e2e/tests/home/nav-home-link.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: The 'Home' nav link is visible.
  2. Click the 'Home' nav link.
    - expect: The URL remains `http://localhost:4200/home` (same-route no-op, not a "navigate away" case).
    - expect: The 'Home' nav link carries the `header-link-active` class (`routerLinkActive`).

#### 2.2. Shop nav link navigates to the shopping list

**File:** `e2e/tests/home/nav-shop-link.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: The 'Shop' nav link is visible.
  2. Click the 'Shop' nav link.
    - expect: The browser navigates to `http://localhost:4200/shopping`.

#### 2.3. Club nav link navigates to the club page

**File:** `e2e/tests/home/nav-club-link.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: The 'Club' nav link is visible.
  2. Click the 'Club' nav link.
    - expect: The browser navigates to `http://localhost:4200/club`.

#### 2.4. About nav link navigates to the about page

**File:** `e2e/tests/home/nav-about-link.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: The 'About' nav link is visible.
  2. Click the 'About' nav link.
    - expect: The browser navigates to `http://localhost:4200/about`.

#### 2.5. Cart icon navigates to the cart page

**File:** `e2e/tests/home/nav-cart-icon.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: A Cart icon link with accessible name 'Cart' is visible (do not assert a specific badge count — the badge only renders when the cart is non-empty and is not guaranteed across runs).
  2. Click the Cart icon link.
    - expect: The browser navigates to `http://localhost:4200/shopping/cart`.

#### 2.6. Profile icon navigates to the about page

**File:** `e2e/tests/home/nav-profile-icon.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: A Profile icon link with accessible name 'Profile' is visible.
  2. Click the Profile icon link.
    - expect: The browser navigates to `http://localhost:4200/about`.

#### 2.7. Logout control logs the user out and clears the session

**File:** `e2e/tests/home/nav-logout-control.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
    - expect: A Logout control with accessible name 'Loggout' (verbatim — a genuine, reproducible app typo, not to be "corrected") is visible. It is not a `link`-role element (no href/routerLink, only a click handler); locate it with `getByLabel('Loggout')`.
  2. Click the 'Loggout' control.
    - expect: The browser navigates to `http://localhost:4200/account/login`.
    - expect: Reading localStorage key `bikeClubAuthUserData` via `page.evaluate` returns null — the session was cleared.

### 3. Home Page Route Guard

**Seed:** `e2e/seed.spec.ts`

#### 3.1. An unauthenticated user hard-navigating to /home is redirected to the login page

**File:** `e2e/tests/home/auth-guard-redirect.spec.ts`

**Steps:**
  1. On a fresh browser context, clear localStorage via `page.evaluate` to guarantee a logged-out starting point (defensive — a fresh context already has none), then perform a full page navigation (`page.goto`, not a client-side link click) directly to `http://localhost:4200/home`.
    - expect: The browser ends up at `http://localhost:4200/account/login`, not `/home` — `authGuard` (`src/app/core/auth/guards/auth.guard.ts`) redirected the unauthenticated request away from the protected route.
    - expect: The Login form (Email + Password fields and a disabled 'Login' button) is visible, confirming the redirect landed on a working Login page and not an error state.
