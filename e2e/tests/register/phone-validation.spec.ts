// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Phone field validation: required, pattern mismatch, no input mask, and helper-hint restoration', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register.
		await page.goto('http://localhost:4200/account/register');

		const phoneField = page.locator('mat-form-field').filter({ hasText: 'Phone' });
		const phoneHint = phoneField.locator('mat-hint');
		const phoneInput = page.getByRole('textbox', { name: 'Phone' });
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(phoneInput).toBeVisible();
		await expect(registerButton).toBeDisabled();
		await expect(phoneHint).toHaveText('Ex: (99) 99999-9999');

		// 2. Click into the Phone field, then click into the Email field (focus then blur Phone without typing).
		await phoneInput.click();
		await emailInput.click();
		await expect(phoneField.locator('mat-error')).toHaveText('Phone is required.');
		await expect(phoneHint).toHaveCount(0);
		await expect(registerButton).toBeDisabled();

		// 3. Click into the Phone field and type '1234567890' (raw digits, no parentheses/dash), then blur by clicking into the Email field.
		// NOTE: types with real keystrokes (pressSequentially) rather than fill(), since fill() sets the
		// value through the DOM setter and would not exercise a live input mask if one existed. Verified
		// live: the Phone input has no input mask — the raw digits land in the value untouched.
		await phoneInput.click();
		await phoneInput.pressSequentially('1234567890');
		await expect(phoneInput).toHaveValue('1234567890'); // no mask applied while typing
		await emailInput.click();
		await expect(phoneInput).toHaveValue('1234567890'); // and none applied on blur
		await expect(phoneField.locator('mat-error')).toHaveText('Phone is invalid.');
		await expect(registerButton).toBeDisabled();

		// 4. Clear the Phone field and type a well-formed value, e.g. '(11) 91234-5678', then blur.
		await phoneInput.click();
		await phoneInput.fill('');
		await phoneInput.pressSequentially('(11) 91234-5678');
		await emailInput.click();
		await expect(phoneField.locator('mat-error')).toHaveCount(0);
		await expect(phoneHint).toHaveText('Ex: (99) 99999-9999');
	});
});
