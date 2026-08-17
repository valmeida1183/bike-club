// spec: e2e/specs/login.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
	test('autoLoginGuard redirects an already-authenticated user away from /account/login', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login and clear localStorage, then reload to start from a clean, logged-out state.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		const loginButton = page.getByRole('button', { name: 'Login' });

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeDisabled();

		// 2. Fill Email with 'test3@gmail.com' and Password with '123456', then click Login to perform a genuine login.
		await emailInput.fill('test3@gmail.com');
		await passwordInput.fill('123456');
		await loginButton.click();
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 3. Read the resulting localStorage value of 'bikeClubAuthUserData' via page.evaluate and keep it in a variable for this test.
		const capturedAuthData = await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'));
		expect(capturedAuthData).not.toBeNull();
		expect(() => JSON.parse(capturedAuthData as string)).not.toThrow();

		// 4. Via page.evaluate, clear localStorage and then set 'bikeClubAuthUserData' back to the captured value.
		await page.evaluate((value) => {
			localStorage.clear();
			localStorage.setItem('bikeClubAuthUserData', value as string);
		}, capturedAuthData);
		const restoredAuthData = await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'));
		expect(restoredAuthData).toBe(capturedAuthData);

		// 5. Perform a full page navigation (page.goto, not a client-side/SPA link click) to http://localhost:4200/account/login so the app bootstraps fresh and AuthStore's auto-login logic reads localStorage on init.
		await page.goto('http://localhost:4200/account/login');
		await expect(page).toHaveURL('http://localhost:4200/home');
	});
});
