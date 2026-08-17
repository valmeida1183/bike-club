# Login Page E2E Test Plan

## Application Overview

BikeClub is an Angular 21 standalone-component app. The Login page (http://localhost:4200/account/login) is a Material reactive form with two fields — Email (type=email) and Password (type=password) — and a Login button. Validation: Email requires a value and a valid email pattern; Password requires a value and a minimum of 6 characters. Material only reveals `mat-error` messages once a field has been touched (focused then blurred) — typing alone does not trigger them. The Login button is bound to `[disabled]="loginForm.invalid"`, so it is physically unclickable while the form is invalid; there is no "submit empty form" scenario to test. On submit, a successful login (verified live with test3@gmail.com / 123456) navigates to `/home` and persists a JSON object under the localStorage key `bikeClubAuthUserData` (containing `user`, `token`, `expiresIn`). A failed login (verified live with a wrong but well-formed password) does NOT show an inline error — instead a global HTTP error interceptor opens a Material dialog with heading "Authentication Error", body text "You are not authorized to perform this action.", and a "Close" button; the form fields and their values remain intact behind the dialog, the button re-enables after the dialog closes, and nothing is written to localStorage. The `/account/login` route is protected by an `autoLoginGuard`: a fresh full page load with a valid `bikeClubAuthUserData` value already in localStorage redirects straight to `/home` (verified live by seeding a genuine, freshly-issued token and reloading). The page also has "Login"/"Register" tab-style links in the header that perform client-side (SPA) navigation between `/account/login` and `/account/register` reliably; note that a full/direct browser navigation straight to `/account/register` was observed to redirect back to `/account/login` (a real, reproducible quirk — likely a guard or route resolver difference between hard navigation and Angular Router navigation), which is out of scope for the login page test file but is documented here for QA awareness. The login page has no forgot-password link, no remember-me checkbox, no social login buttons, and no show/hide password toggle — these are confirmed absent, not overlooked. The header/nav "Logout" control on the authenticated `/home` page has an accessible name of "Loggout" (a real typo in the app) — testers should not "fix" this in selectors.

## Test Scenarios

### 1. Login Page

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Page loads with expected fields, labels, and a disabled Login button

**File:** `e2e/tests/login/page-loads.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/login on a fresh browser context (no localStorage seeded).
    - expect: Page loads successfully with title 'Bike Club'.
    - expect: URL is http://localhost:4200/account/login.
  2. Inspect the header area above the form.
    - expect: A 'Login' tab/link is present and appears active/selected, pointing to /account/login.
    - expect: A 'Register' tab/link is present, pointing to /account/register.
  3. Inspect the form.
    - expect: A heading/label 'Login' is visible above the form fields.
    - expect: An Email field is visible with label text 'Email' and a required-marker '*' next to it.
    - expect: A Password field is visible with label text 'Password' and a required-marker '*' next to it.
    - expect: The Password field's input type is 'password' (masked).
  4. Locate the Login submit button.
    - expect: The button is visible with accessible name 'Login'.
    - expect: The button is disabled (both fields are empty, form is invalid).
  5. Assert no inline validation error messages (mat-error) are visible yet, since no field has been touched.
    - expect: No 'Email is required.' or 'Password is required.' text is present.

#### 1.2. Email field validation: required and invalid-format errors appear only after blur

**File:** `e2e/tests/login/email-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/login.
    - expect: Login form is visible, Login button is disabled.
  2. Click into the Email field, then click into the Password field (this focuses then blurs Email without typing anything).
    - expect: A mat-error with text 'Email is required.' becomes visible under the Email field.
    - expect: The Login button remains disabled.
  3. Click into the Email field and type 'notanemail' (no @ symbol), then click into the Password field to blur Email.
    - expect: The 'Email is required.' message is replaced by a mat-error with text 'Email is invalid.'
    - expect: The Email field is marked invalid (aria-invalid / Material invalid state).
    - expect: The Login button remains disabled.
  4. Clear the Email field and type a well-formed address, e.g. 'test3@gmail.com', then blur by clicking into the Password field.
    - expect: The 'Email is invalid.' message disappears.
    - expect: No email-related mat-error is visible.

#### 1.3. Password field validation: required and minimum-length errors appear only after blur

**File:** `e2e/tests/login/password-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/login.
    - expect: Login form is visible, Login button is disabled.
  2. Click into the Password field, then click into the Email field (focus then blur Password without typing).
    - expect: A mat-error with text 'Password is required.' becomes visible under the Password field.
    - expect: The Login button remains disabled.
  3. Click into the Password field and type '123' (3 characters), then click into the Email field to blur Password.
    - expect: The 'Password is required.' message is replaced by a mat-error with text 'Password must be at least 6 characters.'
    - expect: The Password field is marked invalid.
    - expect: The Login button remains disabled.
  4. Clear the Password field and type '123456' (6 characters), then blur by clicking into the Email field.
    - expect: The 'Password must be at least 6 characters.' message disappears.
    - expect: No password-related mat-error is visible.

#### 1.4. Login button enables and disables in response to overall form validity

**File:** `e2e/tests/login/button-enable-disable.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/login.
    - expect: Login button is disabled.
  2. Fill Email with 'test3@gmail.com' and Password with '123456' (both valid).
    - expect: The Login button becomes enabled (no [disabled] attribute).
  3. With both fields still valid/filled, clear the Password field and re-type only '12345' (5 characters, below the 6-character minimum).
    - expect: The Login button becomes disabled again, demonstrating the enabled-to-disabled reverse transition.
  4. Restore the Password field to '123456'.
    - expect: The Login button becomes enabled again.
  5. Clear the Email field entirely (leave it empty) while Password remains '123456'.
    - expect: The Login button becomes disabled.

#### 1.5. Happy path: valid credentials log the user in and land on /home

**File:** `e2e/tests/login/happy-path-login.spec.ts`

**Steps:**
  1. Before navigating, ensure a clean state: navigate to http://localhost:4200/account/login and clear localStorage via page.evaluate (e.g. `() => localStorage.clear()`), then reload the page.
    - expect: Login form is visible, Login button is disabled, localStorage has no 'bikeClubAuthUserData' key.
  2. Fill Email with 'test3@gmail.com' and Password with '123456'.
    - expect: The Login button becomes enabled.
  3. Click the Login button.
    - expect: The browser navigates to http://localhost:4200/home (assert page.url()).
    - expect: The /home page shows the marketing heading 'Join the Ride' and nav links 'Home', 'Shop', 'Club', 'About'.
    - expect: The header shows a logout control whose accessible name is literally 'Loggout' (a known app typo — assert this exact string, do not 'correct' it to Logout).
  4. Read localStorage key 'bikeClubAuthUserData' via page.evaluate and JSON.parse it.
    - expect: The value is present and is valid JSON.
    - expect: Parsed object has `user.email === 'test3@gmail.com'`.
    - expect: Parsed object has a non-empty string `token`.
    - expect: Parsed object has a non-empty `expiresIn` value.

#### 1.6. Invalid credentials show a global error dialog and persist no session

**File:** `e2e/tests/login/invalid-credentials.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/login and clear localStorage via page.evaluate, then reload.
    - expect: Login form is visible, Login button disabled, no 'bikeClubAuthUserData' in localStorage.
  2. Fill Email with 'test3@gmail.com' (well-formed, valid domain) and Password with a wrong but 6+ character value, e.g. 'wrongpass'.
    - expect: The Login button becomes enabled (form is valid client-side; the API will reject it).
  3. Click the Login button.
    - expect: A dialog becomes visible with heading text 'Authentication Error'.
    - expect: The dialog body contains the text 'You are not authorized to perform this action.'
    - expect: The dialog has a visible 'Close' button.
    - expect: The page URL remains http://localhost:4200/account/login (no navigation occurred).
    - expect: Do NOT assert on console error counts — a 401 network error and corresponding HttpErrorResponse console entries are the expected, correct side effect of this flow, not a bug.
  4. While the dialog is open, attempt to query the underlying Login button by its accessible role/name.
    - expect: The Login button behind the dialog is not the active/interactable element (the dialog traps interaction) — assert the dialog's Close button is the actionable element, rather than asserting a specific aria-hidden attribute on the form container.
  5. Click the dialog's 'Close' button.
    - expect: The dialog closes/is no longer visible.
    - expect: The Email field still contains 'test3@gmail.com' and the Password field still contains 'wrongpass' (form state is preserved, not cleared).
    - expect: The Login button is enabled again (form is still client-side valid).
  6. Read localStorage key 'bikeClubAuthUserData' via page.evaluate.
    - expect: The value is null/absent — no session was persisted after the failed attempt.

#### 1.7. autoLoginGuard redirects an already-authenticated user away from /account/login

**File:** `e2e/tests/login/auto-login-guard.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/login and clear localStorage, then reload to start from a clean, logged-out state.
    - expect: Login form is visible, Login button disabled.
  2. Fill Email with 'test3@gmail.com' and Password with '123456', then click Login to perform a genuine login.
    - expect: Navigation to http://localhost:4200/home occurs.
  3. Read the resulting localStorage value of 'bikeClubAuthUserData' via page.evaluate and keep it in a variable for this test (do NOT hardcode a JSON literal/fixture — capture it live each run, since it contains a short-lived expiring token).
    - expect: A non-null JSON string is captured.
  4. Via page.evaluate, clear localStorage and then set 'bikeClubAuthUserData' back to the captured value (simulating a returning user with a valid stored session, but with AuthStore not yet initialized in memory).
    - expect: localStorage.getItem('bikeClubAuthUserData') returns the same value that was captured.
  5. Perform a full page navigation (page.goto, not a client-side/SPA link click) to http://localhost:4200/account/login so the app bootstraps fresh and AuthStore's auto-login logic reads localStorage on init.
    - expect: The browser ends up at http://localhost:4200/home, not on the login page — the autoLoginGuard/AuthStore auto-login redirected away from /account/login because a valid session was already present in storage.

#### 1.8. Register link/tab navigates away from the login form and back

**File:** `e2e/tests/login/register-navigation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/login (clear localStorage first to ensure logged-out state).
    - expect: Login form is visible with 'Login' tab/link appearing active and a 'Register' tab/link visible.
  2. Click the 'Register' link in the header.
    - expect: The browser navigates (client-side) to http://localhost:4200/account/register.
    - expect: A Register form is visible with fields: Email, Password, Confirm Password, Name, Last Name, Gender, Phone, and a disabled 'Register' submit button.
    - expect: The 'Register' tab/link now appears active.
  3. Click the 'Login' link in the header from the Register page.
    - expect: The browser navigates back (client-side) to http://localhost:4200/account/login.
    - expect: The Login form (Email + Password + Login button) is visible again, and any values previously entered in the Register form are gone (fresh Login component instance).
