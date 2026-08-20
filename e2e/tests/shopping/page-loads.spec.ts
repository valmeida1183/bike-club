// spec: e2e/specs/shopping.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Page Search', () => {
	test('Page loads with the Shop heading and an expanded, empty search panel', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage via page.evaluate, reload, then fill Email test3@gmail.com and Password 123456 and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'Shop' nav link.
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		await expect(page).toHaveTitle('Bike Club');

		// 3. Inspect the page heading and search panel.
		await expect(page.getByRole('heading', { name: 'Shop', level: 1 })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'Category' })).toBeVisible();
		const searchButton = page.getByRole('button', { name: 'Search', exact: true });
		await expect(searchButton).toBeVisible();
		await expect(searchButton).toBeEnabled();

		// 4. Inspect the results grid before any search.
		await expect(page.locator('bc-shop-item')).toHaveCount(0);
	});
});
