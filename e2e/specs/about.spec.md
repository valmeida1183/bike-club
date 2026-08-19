# About Page E2E Test Plan

## Application Overview

BikeClub is an Angular 21 standalone-component app. The About page (`http://localhost:4200/about`, `AboutComponent`) is the simplest authenticated page in the app: purely static marketing content with no service injection, no forms, and no dynamic data — there is nothing to load, submit, or validate. Verified live (test3@gmail.com / 123456): the page renders a `<bc-title>` block showing an `<h1>` heading "About" followed by a `separator` (a Material divider), then a two-column content area — an image column with a single `<figure>` (accessible name "Bike Art", from its `<figcaption>`) containing one `<img>` with `alt="vintage dark red"` (`src="assets/images/vintage_dark_red.png"`), and a text column with an `<h2>` heading "More than just a store" followed by exactly three `<p>` paragraphs of static copy about the brand. Unlike the Home page's images (which have no `alt` and must be located structurally), this image has a real `alt` attribute and its `<figure>` wrapper exposes an accessible name via `<figcaption>`, so `getByRole('figure', { name: 'Bike Art' })` and `getByRole('img', { name: 'vintage dark red' })` both work. The browser document title does not change on this route — it stays "Bike Club" (set once at the app shell level); the in-page `<h1>` "About" heading is the only page-level title signal, and is not to be confused with `page.title()`.

The authenticated shell nav (`MainLayoutComponent`) is visible as on every other authenticated page. Two different nav controls already point to `/about` and are covered by `home.spec.md` from the Home page's perspective (`e2e/tests/home/nav-about-link.spec.ts` for the "About" text link, `e2e/tests/home/nav-profile-icon.spec.ts` for the Profile icon) — those scenarios assert only that clicking navigates away from `/home` to `/about`, not what `/about` itself renders or that the "About" link reflects the active-route state once there. Verified live: once on `/about`, the "About" nav link's `<a>` element carries the Material `header-link-active` class (`routerLinkActive`), the same mechanism documented for the Home link in `home.spec.md` — this plan adds that check, scoped to the About page's own test file rather than duplicating the Home-page departure scenarios.

As with `home.spec.md`: `e2e/seed.authenticated.spec.ts` is a spec file, not a shared fixture (no `e2e/fixtures.ts` exists, and `playwright.config.ts` runs `fullyParallel: true` with no `storageState`), so every scenario below inlines the seed's own steps as its step 1 (navigate to `/account/login`, clear localStorage, fill Email `test3@gmail.com` and Password `123456`, click Login, expect URL `/home`) before navigating to `/about`. The `**Seed:**` line still names the correct exploration entry point for the Generate phase.

`/about` is protected by the same `authGuard` (`src/app/core/auth/guards/auth.guard.ts`) documented in `home.spec.md`'s guard scenario (`e2e/tests/home/auth-guard-redirect.spec.ts`); that scenario already covers the guard's unauthenticated-redirect behavior generically for the authenticated shell, so this plan does not repeat a dedicated guard test for `/about`.

## Test Scenarios

### 1. About Page Content

**Seed:** `e2e/seed.authenticated.spec.ts`

#### 1.1. Page loads with the "About" heading, banner image, and body copy

**File:** `e2e/tests/about/page-loads.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'About' nav link.
    - expect: Page URL is `http://localhost:4200/about`.
    - expect: Page title is 'Bike Club' (document title does not change on this route — see Application Overview).
  3. Inspect the page heading.
    - expect: A level-1 heading 'About' is visible.
  4. Inspect the image column.
    - expect: A figure with accessible name 'Bike Art' is visible (`getByRole('figure', { name: 'Bike Art' })`).
    - expect: An image with accessible name 'vintage dark red' is visible inside the figure (`getByRole('img', { name: 'vintage dark red' })`).
  5. Inspect the text column.
    - expect: A level-2 heading 'More than just a store' is visible.
    - expect: A paragraph starting with 'Welcome to Bycicle Club, where passion meets craftsmanship.' is visible.
    - expect: A paragraph starting with 'At Bycicle Club, we believe that a bicycle is more than just a means of transportation' is visible.
    - expect: A paragraph starting with 'Beyond our store, Bycicle Club is also a community.' is visible.

#### 1.2. About nav link shows the active-route state while on /about

**File:** `e2e/tests/about/nav-about-link-active.spec.ts`

**Steps:**
  1. Navigate to `http://localhost:4200/account/login`, clear localStorage via `page.evaluate`, reload, then fill Email `test3@gmail.com` and Password `123456` and click Login (inlined from `e2e/seed.authenticated.spec.ts` — see Application Overview).
    - expect: Page URL is `http://localhost:4200/home`.
  2. Click the 'About' nav link.
    - expect: Page URL is `http://localhost:4200/about`.
  3. Inspect the 'About' nav link.
    - expect: The 'About' nav link carries the `header-link-active` class (`routerLinkActive`).
