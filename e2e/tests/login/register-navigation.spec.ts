// spec: e2e/specs/login.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
	test('Register link/tab navigates away from the login form and back', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login (clear localStorage first to ensure logged-out state).
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');

		const loginLink = page.getByRole('link', { name: 'Login' });
		const registerLink = page.getByRole('link', { name: 'Register' });
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const loginButton = page.getByRole('button', { name: 'Login' });

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeVisible();
		await expect(loginLink).toBeVisible();
		await expect(loginLink).toHaveClass(/mat-accent/);
		await expect(registerLink).toBeVisible();
		await expect(registerLink).not.toHaveClass(/mat-accent/);

		// 2. Click the 'Register' link in the header.
		// Must be a client-side link click: a hard navigation to /account/register is redirected
		// back to /account/login, so reaching this URL at all proves SPA navigation occurred.
		await registerLink.click();
		await expect(page).toHaveURL('http://localhost:4200/account/register');

		const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password', exact: true });
		const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
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

		await expect(registerLink).toHaveClass(/mat-accent/);
		await expect(loginLink).not.toHaveClass(/mat-accent/);

		// Fill the Register form with marker values so we can later verify they do not leak into the Login form.
		await emailInput.fill('marker-register@example.com');
		await passwordInput.fill('markerpass123');

		// 3. Click the 'Login' link in the header from the Register page.
		await loginLink.click();
		await expect(page).toHaveURL('http://localhost:4200/account/login');

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeVisible();
		await expect(emailInput).toHaveValue('');
		await expect(passwordInput).toHaveValue('');
	});
});
