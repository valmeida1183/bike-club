// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Page loads with expected fields, labels, and a disabled Register button', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register on a fresh browser context (no localStorage seeded).
		await page.goto('http://localhost:4200/account/register');
		await expect(page).toHaveTitle('Bike Club');
		await expect(page).toHaveURL('http://localhost:4200/account/register');

		// 2. Inspect the header area above the form.
		const loginLink = page.getByRole('link', { name: 'Login' });
		const registerLink = page.getByRole('link', { name: 'Register' });
		await expect(loginLink).toBeVisible();
		await expect(loginLink).toHaveAttribute('href', '/account/login');
		await expect(registerLink).toBeVisible();
		await expect(registerLink).toHaveAttribute('href', '/account/register');

		// 3. Inspect the form.
		await expect(page.locator('mat-card-title')).toHaveText('Register');

		const formFields = page.locator('mat-form-field');
		await expect(formFields).toHaveCount(7);
		await expect(formFields.locator('mat-label')).toHaveText([
			'Email',
			'Password',
			'Confirm Password',
			'Name',
			'Last Name',
			'Gender',
			'Phone',
		]);
		await expect(formFields.locator('.mat-mdc-form-field-required-marker')).toHaveCount(7);

		const passwordField = formFields.nth(1);
		const confirmPasswordField = formFields.nth(2);
		const phoneField = formFields.nth(6);

		await expect(passwordField.locator('input')).toHaveAttribute('type', 'password');
		await expect(confirmPasswordField.locator('input')).toHaveAttribute('type', 'password');

		const passwordHintText = await passwordField.locator('mat-hint').textContent();
		expect(passwordHintText).toBe(' / 6');

		const confirmPasswordHintText = await confirmPasswordField.locator('mat-hint').textContent();
		expect(confirmPasswordHintText).toBe(' / 6');

		await expect(phoneField.locator('mat-hint')).toHaveText('Ex: (99) 99999-9999');

		await expect(page.getByRole('combobox', { name: 'Gender' })).toBeVisible();
		await expect(page.locator('select')).toHaveCount(0);

		// 4. Locate the Register submit button.
		const registerButton = page.getByRole('button', { name: 'Register' });
		await expect(registerButton).toBeVisible();
		await expect(registerButton).toBeDisabled();

		// 5. Assert no inline validation error messages (mat-error) are visible yet, since no field has been touched.
		await expect(page.locator('mat-error')).toHaveCount(0);
		await expect(page.getByText('Email is required.')).toHaveCount(0);
		await expect(page.getByText('Password is required.')).toHaveCount(0);
		await expect(page.getByText('Confirm Password is required.')).toHaveCount(0);
		await expect(page.getByText('Name is required.')).toHaveCount(0);
		await expect(page.getByText('Last Name is required.')).toHaveCount(0);
		await expect(page.getByText('Please choose a gender.')).toHaveCount(0);
		await expect(page.getByText('Phone is required.')).toHaveCount(0);
	});
});
