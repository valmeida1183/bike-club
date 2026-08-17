# Register Page E2E Test Plan

## Application Overview

BikeClub is an Angular 21 standalone-component app. The Register page (http://localhost:4200/account/register) is a Material reactive form with seven fields — Email, Password, Confirm Password, Name, Last Name, Gender, and Phone — plus a "Register" submit button, all validated live against the running app and its real backend at https://localhost:5001. Material only reveals `mat-error` messages once a field has been touched (focused then blurred) — typing alone does not trigger them, exactly as on the Login page. The Register button is bound to `[disabled]="registerForm.invalid"`, so it is physically unclickable while the form is invalid; there is no "submit empty form" scenario to test.

Field-by-field, verified live: Email requires a value and a valid email pattern ("Email is required." / "Email is invalid."). Password requires a value and a minimum of 6 characters ("Password is required." / "Password must be at least 6 characters."), is `type="password"` (masked), and has a live character-count hint that renders as `" / 6"` (leading space, no leading zero) when empty — note this is the raw `textContent`; if an assertion library normalizes whitespace it will read as `"/ 6"`, so prefer reading `textContent` directly or matching `/\/ 6$/` rather than an exact `toHaveText(' / 6')` — while typing it updates live (verified: after typing '123' the hint reads '3 / 6' even before blur), and is uncapped past the max (e.g. '7 / 6' for a 7-character value). The hint occupies the same DOM slot as the mat-error and is replaced by it when the field is invalid, then reappears when the field becomes valid again. Confirm Password requires a value and must match Password via a custom `matchValueValidator` ("Confirm Password is required." / "Password must match."), is also `type="password"`, and shares the same hint/error-slot behavior; only the match error was observed to display for a too-short mismatched value (no separate minLength-style message for this field was seen — plausible since Confirm Password's only length-independent rule is the match validator, but this plan does not assert on Confirm Password's validator composition beyond what was observed). Confirm Password's cross-field validation is properly bidirectional: it was verified live that after both Password and Confirm Password hold matching valid values (form valid, button enabled), editing Password alone (without ever re-touching Confirm Password) immediately re-triggers "Password must match." under Confirm Password and disables the Register button again — this is correct, non-buggy behavior and should be asserted, not assumed. One real quirk: Confirm Password's underlying `<input>` never receives an `aria-invalid="true"` attribute even when its `mat-error` is visible and it carries Angular's `ng-invalid ng-touched` CSS classes (verified via DOM inspection); tests should assert on the visible `mat-error` text for this field rather than an ARIA-invalid state. Name and Last Name both require a value and have a maxLength of 50 ("Name is required." / "Name must be at maximum 50 characters." and the equivalent "Last Name..." pair) — maxLength is a Reactive Forms validator only, not an HTML `maxlength` attribute, so typing 51 characters leaves the full string in the field's value/DOM and merely turns the form invalid rather than truncating input. Gender is a Material `mat-select` (not a native `<select>`, so it must be driven via click + option-click, not `selectOption`) populated by the route's `genders` resolver with three options: a placeholder `"--"`, `"Female"`, and `"Male"`. Because "Male" is a substring of "Female", locate the option with `getByRole('option', { name: 'Male', exact: true })` — an inexact match resolves two elements and throws a strict-mode violation (hit live while authoring this plan). Gender is required ("Please choose a gender."), and this was verified in both directions: opening the dropdown and closing it via Escape without picking a real option marks it touched and shows the error, and — more subtly — deliberately re-opening the dropdown and re-selecting the `"--"` placeholder after a real option (e.g. "Male") was already chosen also re-triggers "Please choose a gender." and re-disables the Register button. On successful registration the value is sent as a single-letter `genderCode` ("F" for Female, verified live via the persisted localStorage payload). Phone requires a value and must match the pattern `(99) 99999-9999` ("Phone is required." / "Phone is invalid.") with a static hint "Ex: (99) 99999-9999" that is likewise replaced by whichever error is active; the field has no input mask, so raw unformatted digits (e.g. "1234567890") are accepted verbatim into the input and only rejected by the pattern validator on blur.

On submit, a successful registration (verified live using a runtime-generated, timestamp-based disposable email) behaves like a successful login: it navigates to `/home` and persists a JSON object under the localStorage key `bikeClubAuthUserData` containing `user` (including `id`, `email`, `phone`, `name`, `lastName`, `genderCode`, `roleName`, and a nested `shopCart`), `token`, and `expiresIn`. Because this is a real backend and each successful run creates a new persistent user (auto-incrementing `id`), any test that performs a genuine registration MUST generate its email at runtime (e.g. `` `e2e-register-${Date.now()}@example.com` ``) and must never hardcode a literal address — a hardcoded address will pass once and then fail every subsequent run as a duplicate. To minimize data pollution, only one scenario in this plan (the happy-path test) actually registers a new account; the auto-login-guard scenario deliberately reuses an existing account via the Login page instead of registering a second one (see below). Two already-registered addresses are documented here for use in the duplicate-email negative scenario instead of registering yet another one: `test3@gmail.com` (the account used throughout `login.spec.md`, password `123456`) and `e2e-test-planner-1760471000@example.com` (password `123456`, id 9, created live during the authoring of this plan). Submitting a well-formed but already-registered email opens a global Material error dialog with heading "Error" (an `<h3>`, accompanied by an "error" icon), body text "An account with this email already exists", and a "Close" button — this differs from the Login page's dialog, whose heading is "Authentication Error"; do not assume the two pages share dialog copy. After closing the dialog, all form field values remain exactly as entered (nothing is cleared), the Register button re-enables (the form is still client-side valid), and no `bikeClubAuthUserData` key is written to localStorage. As with the login error-dialog scenario, do not assert on console error counts — the backend's error response and corresponding console entries are the expected, correct side effect of this flow, not a bug.

Two navigation/guard behaviors were also verified live and are notable because they correct or extend what `login.spec.md` states. First, `login.spec.md` claims that a full/direct browser navigation straight to `/account/register` redirects back to `/account/login`; this was re-tested here from a genuinely logged-out state (localStorage cleared, then `page.goto('/account/register')` twice) and it reliably loads the Register form directly with no redirect — that claim does not reproduce for an unauthenticated user and should not be relied upon or repeated. Second, what IS real and reproducible: an already-authenticated user (valid `bikeClubAuthUserData` present in localStorage) performing a hard/direct navigation to `/account/register` is redirected by the route guard straight to `/home`, mirroring the equivalent guard behavior already documented for `/account/login` in `login.spec.md`. The header's "Login"/"Register" tab-style links perform reliable client-side (SPA) navigation in both directions between the two forms, and switching pages produces a fresh component instance (previously entered values in one form are not carried over when navigating to the other and back).

## Test Scenarios

### 1. Register Page

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Page loads with expected fields, labels, and a disabled Register button

**File:** `e2e/tests/register/page-loads.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register on a fresh browser context (no localStorage seeded).
    - expect: Page loads successfully with title 'Bike Club'.
    - expect: URL is http://localhost:4200/account/register.
  2. Inspect the header area above the form.
    - expect: A 'Login' tab/link is present, pointing to /account/login.
    - expect: A 'Register' tab/link is present, pointing to /account/register.
  3. Inspect the form.
    - expect: A heading/label 'Register' is visible above the form fields.
    - expect: Fields are visible in order: Email, Password, Confirm Password, Name, Last Name, Gender, Phone, each with a required-marker '*' next to its label.
    - expect: The Password field's input type is 'password' (masked).
    - expect: The Confirm Password field's input type is 'password' (masked).
    - expect: The Password and Confirm Password fields each show a hint whose raw textContent is ' / 6' (leading space, slash, space, 6, no leading zero) — read via textContent or match /\/ 6$/ rather than an exact toHaveText(' / 6'), since normalized text matchers will see '/ 6' without the leading space.
    - expect: The Phone field shows a static hint 'Ex: (99) 99999-9999'.
    - expect: The Gender field is a combobox (mat-select), not a native <select>.
  4. Locate the Register submit button.
    - expect: The button is visible with accessible name 'Register'.
    - expect: The button is disabled (all fields empty, form is invalid).
  5. Assert no inline validation error messages (mat-error) are visible yet, since no field has been touched.
    - expect: None of 'Email is required.', 'Password is required.', 'Confirm Password is required.', 'Name is required.', 'Last Name is required.', 'Please choose a gender.', or 'Phone is required.' are present.

#### 1.2. Email field validation: required and invalid-format errors appear only after blur

**File:** `e2e/tests/register/email-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register.
    - expect: Register form is visible, Register button is disabled.
  2. Click into the Email field, then click into the Password field (focuses then blurs Email without typing anything).
    - expect: A mat-error with text 'Email is required.' becomes visible under the Email field.
    - expect: The Register button remains disabled.
  3. Click into the Email field and type 'notanemail' (no @ symbol), then click into the Password field to blur Email.
    - expect: The 'Email is required.' message is replaced by a mat-error with text 'Email is invalid.'
    - expect: The Email field is marked invalid (aria-invalid / Material invalid state).
    - expect: The Register button remains disabled.
  4. Clear the Email field and type a well-formed address, e.g. 'someone@example.com', then blur by clicking into the Password field.
    - expect: The 'Email is invalid.' message disappears.
    - expect: No email-related mat-error is visible.

#### 1.3. Password field validation: required, minimum-length errors, and live character-count hint

**File:** `e2e/tests/register/password-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register.
    - expect: Register form is visible, Register button is disabled.
    - expect: The Password hint's textContent is ' / 6'.
  2. Click into the Password field, then click into the Email field (focus then blur Password without typing).
    - expect: A mat-error with text 'Password is required.' becomes visible under the Password field (replacing the hint).
    - expect: The Register button remains disabled.
  3. Click into the Password field and type '123' (3 characters), without blurring yet.
    - expect: While still focused (before blur), the character-count hint updates live to read '3 / 6' — this is the concrete, verified assertion for the 'live hint' behavior described in the overview.
  4. Click into the Email field to blur Password.
    - expect: The '3 / 6' hint is replaced by a mat-error with text 'Password must be at least 6 characters.'
    - expect: The Password field is marked invalid.
    - expect: The Register button remains disabled.
  5. Clear the Password field and type '123456' (6 characters), then blur by clicking into the Email field.
    - expect: The 'Password must be at least 6 characters.' message disappears.
    - expect: No password-related mat-error is visible.
    - expect: The hint reappears reading '6 / 6'.
  6. Click back into the Password field and type one more character so the value is '1234567' (7 characters).
    - expect: The hint updates live to read '7 / 6' (the counter is not capped at the max and does not turn into an error by itself, since minLength is satisfied).

#### 1.4. Confirm Password validation: required, mismatch, aria quirk, and live re-validation when Password changes

**File:** `e2e/tests/register/confirm-password-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register.
    - expect: Register form is visible, Register button is disabled.
    - expect: The Confirm Password hint's textContent is ' / 6'.
  2. Click into the Confirm Password field, then click into the Name field (focus then blur Confirm Password without typing).
    - expect: A mat-error with text 'Confirm Password is required.' becomes visible under the Confirm Password field.
    - expect: The Register button remains disabled.
  3. Fill Password with '123456'. Click into the Confirm Password field and type '1234' (mismatched, and also shorter than 6 chars), then blur by clicking into the Name field.
    - expect: A mat-error with text 'Password must match.' becomes visible under Confirm Password (only the match-validator error was observed here; no separate minLength-style message appeared for this field).
    - expect: The Confirm Password input carries Angular's 'ng-invalid' and 'ng-touched' CSS classes, but do NOT assert an aria-invalid='true' attribute on this specific field — verified live that Material does not set it here even though the error is genuinely showing; assert on the visible mat-error text instead.
    - expect: The Register button remains disabled.
  4. Clear Confirm Password and type '123456' to match Password exactly, then blur by clicking into the Name field.
    - expect: The 'Password must match.' message disappears.
    - expect: No confirm-password-related mat-error is visible.
    - expect: The hint reappears reading '6 / 6'.
  5. Fill the remaining required fields (Name, Last Name, Gender, Phone) with valid values so the entire form becomes valid.
    - expect: The Register button becomes enabled.
  6. Without touching the Confirm Password field again, click into the Password field and change its value to '1234567' (still 6+ chars, but no longer equal to Confirm Password's '123456').
    - expect: The mat-error 'Password must match.' reappears under Confirm Password immediately, even though Confirm Password itself was not re-focused or re-blurred — the cross-field validator reacts live to changes on Password.
    - expect: The Register button becomes disabled again.
  7. Restore Password back to '123456' so it matches Confirm Password again.
    - expect: The 'Password must match.' message disappears again.
    - expect: The Register button becomes enabled again (assuming all other fields remain valid).

#### 1.5. Name and Last Name validation: required and maxLength(50), with no HTML truncation

**File:** `e2e/tests/register/name-lastname-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register.
    - expect: Register form is visible, Register button is disabled.
  2. Click into the Name field, then click into the Last Name field (focus then blur Name without typing).
    - expect: A mat-error with text 'Name is required.' becomes visible under the Name field.
    - expect: The Register button remains disabled.
  3. Click into the Name field and type a string of 51 'A' characters, then blur by clicking into the Last Name field.
    - expect: The Name input's value contains the full 51-character string (no HTML maxlength attribute truncates it).
    - expect: A mat-error with text 'Name must be at maximum 50 characters.' becomes visible.
    - expect: The Register button remains disabled.
  4. Clear the Name field and type a valid short value, e.g. 'TestFirstName', then blur.
    - expect: The maxLength mat-error disappears.
    - expect: No Name-related mat-error is visible.
  5. Click into the Last Name field, then click into the Name field (focus then blur Last Name without typing).
    - expect: A mat-error with text 'Last Name is required.' becomes visible under the Last Name field.
    - expect: The Register button remains disabled.
  6. Click into the Last Name field and type a string of 51 'A' characters, then blur by clicking into the Name field.
    - expect: The Last Name input's value contains the full 51-character string.
    - expect: A mat-error with text 'Last Name must be at maximum 50 characters.' becomes visible.
    - expect: The Register button remains disabled.
  7. Clear the Last Name field and type a valid short value, e.g. 'TestLastName', then blur.
    - expect: The maxLength mat-error disappears.
    - expect: No Last Name-related mat-error is visible.

#### 1.6. Gender select validation: required, verified via close-without-choosing and re-selecting the placeholder

**File:** `e2e/tests/register/gender-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register.
    - expect: Register form is visible, Register button is disabled.
  2. Click the Gender combobox to open its dropdown panel.
    - expect: A listbox opens showing exactly three options in order: '--', 'Female', 'Male'.
  3. Press Escape to close the dropdown without selecting any option.
    - expect: The dropdown closes.
    - expect: A mat-error with text 'Please choose a gender.' becomes visible under the Gender field (opening and closing without a choice counts as touching the control).
    - expect: The Register button remains disabled.
  4. Click the Gender combobox again and click the 'Male' option in the listbox, locating it with an exact-name match (e.g. getByRole('option', { name: 'Male', exact: true })) since a non-exact match also matches 'Female' and throws a strict-mode violation.
    - expect: The combobox now displays 'Male'.
    - expect: The 'Please choose a gender.' mat-error disappears.
  5. Fill Email, Password, Confirm Password (matching), Name, Last Name, and Phone with valid values so the whole form becomes valid.
    - expect: The Register button becomes enabled.
  6. Click the Gender combobox again, and this time click the '--' placeholder option to explicitly clear the previously valid selection.
    - expect: The combobox reverts to its empty/placeholder display.
    - expect: The mat-error 'Please choose a gender.' reappears.
    - expect: The Register button becomes disabled again.

#### 1.7. Phone field validation: required, pattern mismatch, no input mask, and helper-hint restoration

**File:** `e2e/tests/register/phone-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register.
    - expect: Register form is visible, Register button is disabled.
    - expect: The Phone field shows the static hint 'Ex: (99) 99999-9999'.
  2. Click into the Phone field, then click into the Email field (focus then blur Phone without typing).
    - expect: The hint is replaced by a mat-error with text 'Phone is required.'
    - expect: The Register button remains disabled.
  3. Click into the Phone field and type '1234567890' (raw digits, no parentheses/dash), then blur by clicking into the Email field.
    - expect: The Phone input's value is exactly '1234567890' as typed — there is no input mask auto-inserting parentheses/spaces/dashes while typing.
    - expect: The 'Phone is required.' message is replaced by a mat-error with text 'Phone is invalid.'
    - expect: The Register button remains disabled.
  4. Clear the Phone field and type a well-formed value, e.g. '(11) 91234-5678', then blur.
    - expect: The 'Phone is invalid.' mat-error disappears.
    - expect: The static hint 'Ex: (99) 99999-9999' reappears in its place.
    - expect: No Phone-related mat-error is visible.

#### 1.8. Register button enables and disables in response to overall form validity

**File:** `e2e/tests/register/button-enable-disable.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register.
    - expect: Register button is disabled.
  2. Fill Email 'someone@example.com', Password '123456', Confirm Password '123456', Name 'TestFirstName', Last Name 'TestLastName', select Gender 'Female' via the mat-select dropdown (use an exact-name option locator, e.g. getByRole('option', { name: 'Female', exact: true }), for consistency with the Gender test), and Phone '(11) 91234-5678' (all valid).
    - expect: The Register button becomes enabled (no [disabled] attribute).
  3. With the form fully valid, clear the Phone field and re-type only '123456789' (does not match the required pattern).
    - expect: The Register button becomes disabled again, demonstrating the enabled-to-disabled reverse transition.
  4. Restore the Phone field to '(11) 91234-5678'.
    - expect: The Register button becomes enabled again.
  5. Clear the Email field entirely (leave it empty) while all other fields remain valid.
    - expect: The Register button becomes disabled.
  6. Restore Email to 'someone@example.com', then open the Gender combobox and re-select the '--' placeholder option.
    - expect: The Register button becomes disabled once more, confirming Gender participates in overall form validity like every other field.

#### 1.9. Happy path: valid registration with a unique disposable email creates an account and lands on /home

**File:** `e2e/tests/register/happy-path-register.spec.ts`

**Steps:**
  1. Before navigating, ensure a clean state: navigate to http://localhost:4200/account/register and clear localStorage via page.evaluate (e.g. `() => localStorage.clear()`), then reload the page.
    - expect: Register form is visible, Register button is disabled, localStorage has no 'bikeClubAuthUserData' key.
  2. Generate a unique disposable email at runtime, e.g. `const email = `e2e-register-${Date.now()}@example.com`;` — do NOT hardcode a literal email address anywhere in this test, since each successful run permanently creates a backend user and a hardcoded address will fail as a duplicate on the second run.
    - expect: A syntactically valid, unique email string is available for use in the next step.
  3. Fill Email with the generated address, Password '123456', Confirm Password '123456', Name 'E2E', Last Name 'Tester', select Gender 'Female' (exact-name option locator), and Phone '(11) 98765-4321'.
    - expect: The Register button becomes enabled.
  4. Click the Register button.
    - expect: The browser navigates to http://localhost:4200/home (assert page.url()).
    - expect: The /home page shows the marketing heading 'Join the Ride' and nav links 'Home', 'Shop', 'Club', 'About'.
    - expect: The header shows a logout control whose accessible name is literally 'Loggout' (the known app typo also documented in login.spec.md — assert this exact string).
  5. Read localStorage key 'bikeClubAuthUserData' via page.evaluate and JSON.parse it.
    - expect: The value is present and is valid JSON.
    - expect: Parsed object has `user.email` equal to the generated email variable (not a hardcoded literal).
    - expect: Parsed object has `user.name === 'E2E'`, `user.lastName === 'Tester'`, `user.genderCode === 'F'`, and `user.phone === '(11) 98765-4321'`.
    - expect: Parsed object has a non-empty string `token`.
    - expect: Parsed object has a non-empty `expiresIn` value.

#### 1.10. Registering with an already-used email shows a global 'Error' dialog and persists no session

**File:** `e2e/tests/register/duplicate-email-error.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register and clear localStorage via page.evaluate, then reload.
    - expect: Register form is visible, Register button disabled, no 'bikeClubAuthUserData' in localStorage.
  2. Fill the form with a well-formed but already-registered email — use 'test3@gmail.com' (the account documented in login.spec.md) — plus valid values for all other fields: Password '123456', Confirm Password '123456', Name 'Dup', Last Name 'Test', Gender 'Male' (exact-name option locator), Phone '(11) 91234-5678'.
    - expect: The Register button becomes enabled (form is valid client-side; only the backend will reject it).
  3. Click the Register button.
    - expect: A dialog becomes visible with heading text 'Error' (do not assume 'Registration Error' — the actual heading is the generic 'Error' string, verified live, and differs from Login's 'Authentication Error').
    - expect: The dialog body contains the text 'An account with this email already exists'.
    - expect: The dialog has a visible 'Close' button.
    - expect: The page URL remains http://localhost:4200/account/register (no navigation occurred).
    - expect: Do NOT assert on console error counts — the backend's error response and corresponding console entries are the expected, correct side effect of this flow, not a bug.
  4. Click the dialog's 'Close' button.
    - expect: The dialog closes/is no longer visible.
    - expect: All previously entered field values are still present and unchanged (Email still 'test3@gmail.com', Password/Confirm Password still '123456', Name 'Dup', Last Name 'Test', Gender 'Male', Phone '(11) 91234-5678').
    - expect: The Register button is enabled again (the form is still client-side valid).
  5. Read localStorage key 'bikeClubAuthUserData' via page.evaluate.
    - expect: The value is null/absent — no session was persisted after the failed attempt.

#### 1.11. An already-authenticated user hard-navigating to /account/register is redirected to /home

**File:** `e2e/tests/register/auto-login-guard.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register and clear localStorage, then reload to start from a clean, logged-out state.
    - expect: Register form is visible, Register button disabled.
  2. As a sanity baseline first, with localStorage still empty/cleared, perform a full page navigation (page.goto, not a client-side link click) directly to http://localhost:4200/account/register.
    - expect: The Register form loads directly at /account/register with no redirect to /account/login — this corrects an outdated claim in login.spec.md; do not assert a redirect here for a logged-out user.
  3. Navigate to http://localhost:4200/account/login and log in with the existing, already-registered account 'test3@gmail.com' / '123456' (do NOT register a new account in this test — reuse this known account, exactly as login.spec.md's own auto-login-guard test does, to avoid creating an extra persistent user on every run).
    - expect: Navigation to http://localhost:4200/home occurs, confirming the login succeeded and a session now exists.
  4. Read the resulting localStorage value of 'bikeClubAuthUserData' via page.evaluate and keep it in a variable for this test (do NOT hardcode a JSON literal/fixture — capture it live each run, since it contains a short-lived expiring token).
    - expect: A non-null JSON string is captured.
  5. Via page.evaluate, clear localStorage and then set 'bikeClubAuthUserData' back to the captured value (simulating a returning user with a valid stored session, but with AuthStore not yet initialized in memory).
    - expect: localStorage.getItem('bikeClubAuthUserData') returns the same value that was captured.
  6. Perform a full page navigation (page.goto, not a client-side/SPA link click) to http://localhost:4200/account/register so the app bootstraps fresh and AuthStore's auto-login logic reads localStorage on init.
    - expect: The browser ends up at http://localhost:4200/home, not on the register page — the route guard/AuthStore auto-login redirected away from /account/register because a valid session was already present in storage.

#### 1.12. Login link/tab navigates away from the Register form and back, discarding entered values

**File:** `e2e/tests/register/login-navigation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:4200/account/register (clear localStorage first to ensure logged-out state).
    - expect: Register form is visible with a 'Login' tab/link and a 'Register' tab/link both visible in the header.
  2. Type a partial value into the Name field, e.g. 'PartiallyFilled', without submitting.
    - expect: The Name field contains 'PartiallyFilled'.
  3. Click the 'Login' link in the header.
    - expect: The browser navigates (client-side) to http://localhost:4200/account/login.
    - expect: A Login form is visible with fields Email and Password and a disabled 'Login' submit button.
  4. Click the 'Register' link in the header from the Login page.
    - expect: The browser navigates back (client-side) to http://localhost:4200/account/register.
    - expect: The Register form (Email, Password, Confirm Password, Name, Last Name, Gender, Phone, and a disabled 'Register' submit button) is visible again.
    - expect: The Name field is empty, not 'PartiallyFilled' — confirming a fresh Register component instance was created and no state was carried over.
