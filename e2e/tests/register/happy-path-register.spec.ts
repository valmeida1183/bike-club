// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Happy path: valid registration with a unique disposable email creates an account and lands on /home', async ({ page }) => {
		// 1. Before navigating, ensure a clean state: navigate to http://localhost:4200/account/register and clear localStorage via page.evaluate, then reload the page.
		await page.goto('http://localhost:4200/account/register');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/register');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
		const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
		const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
		const genderCombobox = page.getByRole('combobox', { name: 'Gender' });
		const phoneInput = page.getByRole('textbox', { name: 'Phone' });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(emailInput).toBeVisible();
		await expect(genderCombobox).toBeVisible();
		await expect(registerButton).toBeVisible();
		await expect(registerButton).toBeDisabled();
		expect(await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'))).toBeNull();

		// 2. Generate a unique disposable email at runtime — do NOT hardcode a literal email address anywhere in this test,
		// since each successful run permanently creates a backend user and a hardcoded address will fail as a duplicate on the second run.
		const email = `e2e-register-${Date.now()}@example.com`;

		// 3. Fill Email with the generated address, Password '123456', Confirm Password '123456', Name 'E2E', Last Name 'Tester',
		// select Gender 'Female' (exact-name option locator), and Phone '(11) 98765-4321'.
		await emailInput.click();
		await emailInput.fill(email);
		await passwordInput.click();
		await passwordInput.fill('123456');
		await confirmPasswordInput.click();
		await confirmPasswordInput.fill('123456');
		await nameInput.click();
		await nameInput.fill('E2E');
		await lastNameInput.click();
		await lastNameInput.fill('Tester');
		await genderCombobox.click();
		await page.getByRole('option', { name: 'Female', exact: true }).click();
		await phoneInput.click();
		await phoneInput.fill('(11) 98765-4321');
		await expect(registerButton).toBeEnabled();

		// 4. Click the Register button.
		await registerButton.click();
		await expect(page).toHaveURL('http://localhost:4200/home');
		expect(page.url()).toBe('http://localhost:4200/home');

		await expect(page.getByRole('heading', { name: 'Join the Ride' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Shop', exact: true })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Club' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'About' })).toBeVisible();

		const logoutControl = page.locator('[aria-label="Loggout"]');
		await expect(logoutControl).toBeVisible();
		await expect(logoutControl).toHaveAttribute('aria-label', 'Loggout');

		// 5. Read localStorage key 'bikeClubAuthUserData' via page.evaluate and JSON.parse it.
		const authData = await page.evaluate(() => {
			const raw = localStorage.getItem('bikeClubAuthUserData');
			return raw ? JSON.parse(raw) : null;
		});

		expect(authData).not.toBeNull();
		expect(authData.user.email).toBe(email);
		expect(authData.user.name).toBe('E2E');
		expect(authData.user.lastName).toBe('Tester');
		expect(authData.user.genderCode).toBe('F');
		expect(authData.user.phone).toBe('(11) 98765-4321');
		expect(typeof authData.token).toBe('string');
		expect(authData.token.length).toBeGreaterThan(0);
		expect(authData.expiresIn).toBeTruthy();
	});
});
