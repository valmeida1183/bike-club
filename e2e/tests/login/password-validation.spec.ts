// spec: e2e/specs/login.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
	test('Password field validation: required and minimum-length errors appear only after blur', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login.
		await page.goto('http://localhost:4200/account/login');

		const passwordField = page.locator('mat-form-field').filter({ hasText: 'Password' });
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		const loginButton = page.getByRole('button', { name: 'Login' });

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeDisabled();

		// 2. Click into the Password field, then click into the Email field (focus then blur Password without typing).
		await passwordInput.click();
		await emailInput.click();
		await expect(passwordField.locator('mat-error')).toHaveText('Password is required.');
		await expect(loginButton).toBeDisabled();

		// 3. Click into the Password field and type '123' (3 characters), then click into the Email field to blur Password.
		await passwordInput.click();
		await passwordInput.fill('123');
		await emailInput.click();
		await expect(passwordField.locator('mat-error')).toHaveText('Password must be at least 6 characters.');
		await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
		await expect(loginButton).toBeDisabled();

		// 4. Clear the Password field and type '123456' (6 characters), then blur by clicking into the Email field.
		await passwordInput.click();
		await passwordInput.fill('123456');
		await emailInput.click();
		await expect(page.getByText('Password must be at least 6 characters.')).toHaveCount(0);
		await expect(passwordField.locator('mat-error')).toHaveCount(0);
	});
});
