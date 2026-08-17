// spec: e2e/specs/home.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('"Go to Shopping" CTA navigates to the shopping list', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage, reload, then fill Email and Password and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');
		const goToShoppingLink = page.getByRole('link', { name: 'Go to Shopping' });
		await expect(goToShoppingLink).toBeVisible();

		// 2. Click the 'Go to Shopping' link.
		await goToShoppingLink.click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		expect(page.url()).toBe('http://localhost:4200/shopping');
	});
});
