// spec: e2e/specs/login.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
	test('Page loads with expected fields, labels, and a disabled Login button', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login on a fresh browser context (no localStorage seeded).
		await page.goto('http://localhost:4200/account/login');
		await expect(page).toHaveTitle('Bike Club');
		await expect(page).toHaveURL('http://localhost:4200/account/login');

		// 2. Inspect the header area above the form.
		const loginLink = page.getByRole('link', { name: 'Login' });
		const registerLink = page.getByRole('link', { name: 'Register' });
		await expect(loginLink).toBeVisible();
		await expect(loginLink).toHaveAttribute('href', '/account/login');
		await expect(loginLink).toHaveClass(/mat-accent/);
		await expect(registerLink).toBeVisible();
		await expect(registerLink).toHaveAttribute('href', '/account/register');

		// 3. Inspect the form.
		await expect(page.locator('mat-card-title')).toHaveText('Login');

		const emailField = page.locator('mat-form-field').filter({ hasText: 'Email' });
		await expect(emailField.locator('mat-label')).toHaveText('Email');
		await expect(emailField.locator('.mat-mdc-form-field-required-marker')).toBeVisible();

		const passwordField = page.locator('mat-form-field').filter({ hasText: 'Password' });
		await expect(passwordField.locator('mat-label')).toHaveText('Password');
		await expect(passwordField.locator('.mat-mdc-form-field-required-marker')).toBeVisible();

		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		await expect(passwordInput).toHaveAttribute('type', 'password');

		// 4. Locate the Login submit button.
		const loginButton = page.getByRole('button', { name: 'Login' });
		await expect(loginButton).toBeVisible();
		await expect(loginButton).toBeDisabled();

		// 5. Assert no inline validation error messages (mat-error) are visible yet, since no field has been touched.
		await expect(page.locator('mat-error')).toHaveCount(0);
		await expect(page.getByText('Email is required.')).toHaveCount(0);
		await expect(page.getByText('Password is required.')).toHaveCount(0);
	});
});
