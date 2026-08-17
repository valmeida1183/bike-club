// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Password field validation: required, minimum-length errors, and live character-count hint', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register.
		await page.goto('http://localhost:4200/account/register');

		const passwordField = page.locator('mat-form-field').nth(1);
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(passwordInput).toBeVisible();
		await expect(registerButton).toBeDisabled();
		const passwordHintText = await passwordField.locator('mat-hint').textContent();
		expect(passwordHintText).toBe(' / 6');

		// 2. Click into the Password field, then click into the Email field (focus then blur Password without typing).
		await passwordInput.click();
		await emailInput.click();
		await expect(passwordField.locator('mat-error')).toHaveText('Password is required.');
		await expect(registerButton).toBeDisabled();

		// 3. Click into the Password field and type '123' (3 characters), without blurring yet.
		await passwordInput.click();
		await passwordInput.pressSequentially('123');
		// NOTE: deviation from the plan's expectation here. The plan expects the live hint to read
		// '3 / 6' while still focused. Verified live: Password was already touched in step 2 (it was
		// blurred once), and Angular's `touched` state persists across refocus. Material's default
		// ErrorStateMatcher shows the error as soon as the control is invalid AND touched, regardless
		// of focus, so the minlength mat-error is already visible here (hint absent) even though the
		// field is still focused. The '3 / 6' live hint was confirmed to appear only when the field has
		// never been touched/blurred before (verified separately, outside this step's sequence).
		await expect(passwordInput).toBeFocused();
		await expect(passwordField.locator('mat-hint')).toHaveCount(0);
		await expect(passwordField.locator('mat-error')).toHaveText('Password must be at least 6 characters.');

		// 4. Click into the Email field to blur Password.
		await emailInput.click();
		await expect(passwordField.locator('mat-error')).toHaveText('Password must be at least 6 characters.');
		await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
		await expect(registerButton).toBeDisabled();

		// 5. Clear the Password field and type '123456' (6 characters), then blur by clicking into the Email field.
		await passwordInput.click();
		await passwordInput.fill('123456');
		await expect(passwordInput).toHaveValue('123456');
		await emailInput.click();
		await expect(passwordField.locator('mat-error')).toHaveCount(0);
		await expect(passwordField.locator('mat-hint')).toHaveText('6 / 6');

		// 6. Click back into the Password field and type one more character so the value is '1234567' (7 characters).
		await passwordInput.click();
		await page.keyboard.press('End');
		await passwordInput.pressSequentially('7');
		await expect(passwordInput).toHaveValue('1234567');
		await expect(passwordField.locator('mat-hint')).toHaveText('7 / 6');
	});
});
