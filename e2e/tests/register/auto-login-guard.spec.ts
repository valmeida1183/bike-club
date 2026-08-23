// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { CYCLIST_CREDENTIALS } from '../../auth/credentials';

test.describe('Register Page', () => {
	test('An already-authenticated user hard-navigating to /account/register is redirected to /home', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register and clear localStorage, then reload to start from a clean, logged-out state.
		await page.goto('http://localhost:4200/account/register');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/register');

		const registerButton = page.getByRole('button', { name: 'Register' });
		await expect(registerButton).toBeDisabled();

		// 2. As a sanity baseline first, with localStorage still empty/cleared, perform a full page navigation (page.goto, not a client-side link click) directly to http://localhost:4200/account/register.
		await page.goto('http://localhost:4200/account/register');
		await expect(registerButton).toBeDisabled();
		await expect(page).toHaveURL('http://localhost:4200/account/register');

		// 3. Navigate to http://localhost:4200/account/login and log in with the existing, already-registered Cyclist E2E account.
		await page.goto('http://localhost:4200/account/login');
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		const loginButton = page.getByRole('button', { name: 'Login' });
		await emailInput.fill(CYCLIST_CREDENTIALS.email);
		await passwordInput.fill(CYCLIST_CREDENTIALS.password);
		await loginButton.click();
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 4. Read the resulting localStorage value of 'bikeClubAuthUserData' via page.evaluate and keep it in a variable for this test.
		const capturedAuthData = await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'));
		expect(capturedAuthData).not.toBeNull();
		expect(() => JSON.parse(capturedAuthData as string)).not.toThrow();

		// 5. Via page.evaluate, clear localStorage and then set 'bikeClubAuthUserData' back to the captured value.
		await page.evaluate((value) => {
			localStorage.clear();
			localStorage.setItem('bikeClubAuthUserData', value as string);
		}, capturedAuthData);
		const restoredAuthData = await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'));
		expect(restoredAuthData).toBe(capturedAuthData);

		// 6. Perform a full page navigation (page.goto, not a client-side/SPA link click) to http://localhost:4200/account/register so the app bootstraps fresh and AuthStore's auto-login logic reads localStorage on init.
		await page.goto('http://localhost:4200/account/register');
		await expect(page).toHaveURL('http://localhost:4200/home');
	});
});
