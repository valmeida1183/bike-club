// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Login link/tab navigates away from the Register form and back, discarding entered values', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register (clear localStorage first to ensure logged-out state).
		await page.goto('http://localhost:4200/account/register');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/register');

		const loginLink = page.getByRole('link', { name: 'Login' });
		const registerLink = page.getByRole('link', { name: 'Register' });
		const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });

		await expect(loginLink).toBeVisible();
		await expect(registerLink).toBeVisible();
		await expect(nameInput).toBeVisible();

		// 2. Type a partial value into the Name field, e.g. 'PartiallyFilled', without submitting.
		await nameInput.fill('PartiallyFilled');
		await expect(nameInput).toHaveValue('PartiallyFilled');

		// 3. Click the 'Login' link in the header.
		await loginLink.click();
		await expect(page).toHaveURL('http://localhost:4200/account/login');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const loginButton = page.getByRole('button', { name: 'Login' });

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeVisible();
		await expect(loginButton).toBeDisabled();

		// 4. Click the 'Register' link in the header from the Login page.
		await registerLink.click();
		await expect(page).toHaveURL('http://localhost:4200/account/register');

		const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password', exact: true });
		const lastNameInput = page.getByRole('textbox', { name: 'Last Name', exact: true });
		const genderSelect = page.getByRole('combobox', { name: 'Gender' });
		const phoneInput = page.getByRole('textbox', { name: 'Phone' });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(confirmPasswordInput).toBeVisible();
		await expect(nameInput).toBeVisible();
		await expect(lastNameInput).toBeVisible();
		await expect(genderSelect).toBeVisible();
		await expect(phoneInput).toBeVisible();
		await expect(registerButton).toBeVisible();
		await expect(registerButton).toBeDisabled();

		// The Name field is empty, not 'PartiallyFilled' — confirming a fresh Register component instance was created and no state was carried over.
		await expect(nameInput).toHaveValue('');
	});
});
