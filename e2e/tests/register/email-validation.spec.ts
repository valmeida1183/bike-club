// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Email field validation: required and invalid-format errors appear only after blur', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register.
		await page.goto('http://localhost:4200/account/register');

		const emailField = page.locator('mat-form-field').filter({ hasText: 'Email' });
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(emailInput).toBeVisible();
		await expect(registerButton).toBeDisabled();

		// 2. Click into the Email field, then click into the Password field (focuses then blurs Email without typing anything).
		await emailInput.click();
		await passwordInput.click();
		await expect(emailField.locator('mat-error')).toHaveText('Email is required.');
		await expect(registerButton).toBeDisabled();

		// 3. Click into the Email field and type 'notanemail' (no @ symbol), then click into the Password field to blur Email.
		await emailInput.click();
		await emailInput.fill('notanemail');
		await passwordInput.click();
		await expect(emailField.locator('mat-error')).toHaveText('Email is invalid.');
		await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
		await expect(registerButton).toBeDisabled();

		// 4. Clear the Email field and type a well-formed address, e.g. 'someone@example.com', then blur by clicking into the Password field.
		await emailInput.click();
		await emailInput.fill('someone@example.com');
		await passwordInput.click();
		await expect(page.getByText('Email is invalid.')).toHaveCount(0);
		await expect(emailField.locator('mat-error')).toHaveCount(0);
	});
});
