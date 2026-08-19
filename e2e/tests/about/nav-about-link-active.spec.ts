// spec: e2e/specs/about.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('About Page Content', () => {
	test('About nav link shows the active-route state while on /about', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage, reload, then fill Email and Password and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'About' nav link.
		const aboutNavLink = page.getByRole('link', { name: 'About' });
		await aboutNavLink.click();
		await expect(page).toHaveURL('http://localhost:4200/about');

		// 3. Inspect the 'About' nav link.
		await expect(aboutNavLink).toHaveClass(/header-link-active/);
	});
});
