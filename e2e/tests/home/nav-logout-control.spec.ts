// spec: e2e/specs/home.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('Logout control logs the user out and clears the session', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage, reload, then fill Email and Password and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');
		const logoutControl = page.getByLabel('Loggout');
		await expect(logoutControl).toBeVisible();

		// 2. Click the 'Loggout' control.
		await logoutControl.click();
		await expect(page).toHaveURL('http://localhost:4200/account/login');
		expect(await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'))).toBeNull();
	});
});
