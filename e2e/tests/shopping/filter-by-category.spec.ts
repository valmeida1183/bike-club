// spec: e2e/specs/shopping.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Page Search', () => {
	test('Filtering by Category narrows the results to matching bikes', async ({ page }) => {
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

		// 3. Open the 'Category' select and choose the 'Mountain' option.
		const categorySelect = page.getByRole('combobox', { name: 'Category' });
		await categorySelect.click();
		await page.getByRole('option', { name: 'Mountain' }).click();
		await expect(categorySelect).toHaveText('Mountain');

		// 4. Click the 'Search' button.
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const shopCards = page.locator('.shop-card');
		await expect(shopCards).toHaveCount(4);
		await expect(shopCards.getByText('Silver Mountain', { exact: true })).toBeVisible();
		await expect(shopCards.getByText('Snow Mountain', { exact: true })).toBeVisible();
		await expect(shopCards.getByText('Silver Mountain II', { exact: true })).toBeVisible();
		await expect(shopCards.getByText('Scarlet Mountain', { exact: true })).toBeVisible();
		const subtitles = shopCards.locator('mat-card-subtitle');
		await expect(subtitles).toHaveCount(4);
		const subtitleTexts = await subtitles.allTextContents();
		expect(subtitleTexts.every((text) => text.trim() === 'Mountain')).toBe(true);
	});
});
