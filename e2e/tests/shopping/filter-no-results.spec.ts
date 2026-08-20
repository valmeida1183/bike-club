// spec: e2e/specs/shopping.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Page Search', () => {
	test('Filtering by a Category with no matching bikes shows an empty results grid', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage via page.evaluate, reload, then fill Email and Password and click Login.
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

		// 3. Open the 'Category' select and choose 'Folding'.
		const categorySelect = page.getByRole('combobox', { name: 'Category' });
		await categorySelect.click();
		await page.getByRole('option', { name: 'Folding' }).click();
		await expect(categorySelect).toHaveText('Folding');

		// 4. Click the 'Search' button.
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		await expect(page.locator('.shop-card')).toHaveCount(0);
	});
});
