// spec: e2e/specs/login.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
	test('Email field validation: required and invalid-format errors appear only after blur', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login.
		await page.goto('http://localhost:4200/account/login');

		const emailField = page.locator('mat-form-field').filter({ hasText: 'Email' });
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		const loginButton = page.getByRole('button', { name: 'Login' });

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeDisabled();

		// 2. Click into the Email field, then click into the Password field (this focuses then blurs Email without typing anything).
		await emailInput.click();
		await passwordInput.click();
		await expect(emailField.locator('mat-error')).toHaveText('Email is required.');
		await expect(loginButton).toBeDisabled();

		// 3. Click into the Email field and type 'notanemail' (no @ symbol), then click into the Password field to blur Email.
		await emailInput.click();
		await emailInput.fill('notanemail');
		await passwordInput.click();
		await expect(emailField.locator('mat-error')).toHaveText('Email is invalid.');
		await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
		await expect(loginButton).toBeDisabled();

		// 4. Clear the Email field and type a well-formed address, e.g. 'test3@gmail.com', then blur by clicking into the Password field.
		await emailInput.click();
		await emailInput.fill('test3@gmail.com');
		await passwordInput.click();
		await expect(page.getByText('Email is invalid.')).toHaveCount(0);
		await expect(emailField.locator('mat-error')).toHaveCount(0);
	});
});
