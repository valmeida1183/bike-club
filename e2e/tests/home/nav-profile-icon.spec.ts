// spec: e2e/specs/home.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('Profile icon navigates to the about page', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage, reload, then fill Email and Password and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');
		const profileIconLink = page.getByRole('link', { name: 'Profile' });
		await expect(profileIconLink).toBeVisible();

		// 2. Click the Profile icon link.
		await profileIconLink.click();
		await expect(page).toHaveURL('http://localhost:4200/about');
	});
});
