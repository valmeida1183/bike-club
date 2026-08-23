// spec: e2e/specs/login.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { CYCLIST_CREDENTIALS } from '../../auth/credentials';

test.describe('Login Page', () => {
	test('Happy path: valid credentials log the user in and land on /home', async ({ page }) => {
		// 1. Before navigating, ensure a clean state: navigate to http://localhost:4200/account/login and clear localStorage via page.evaluate, then reload the page.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		const loginButton = page.getByRole('button', { name: 'Login' });

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeDisabled();
		expect(await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'))).toBeNull();

		// 2. Fill Email and Password with the Cyclist E2E account credentials.
		await emailInput.fill(CYCLIST_CREDENTIALS.email);
		await passwordInput.fill(CYCLIST_CREDENTIALS.password);
		await expect(loginButton).toBeEnabled();

		// 3. Click the Login button.
		await loginButton.click();
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

		// 4. Read localStorage key 'bikeClubAuthUserData' via page.evaluate and JSON.parse it.
		const authData = await page.evaluate(() => {
			const raw = localStorage.getItem('bikeClubAuthUserData');
			return raw ? JSON.parse(raw) : null;
		});

		expect(authData).not.toBeNull();
		expect(authData.user.email).toBe(CYCLIST_CREDENTIALS.email);
		expect(typeof authData.token).toBe('string');
		expect(authData.token.length).toBeGreaterThan(0);
		expect(authData.expiresIn).toBeTruthy();
	});
});
