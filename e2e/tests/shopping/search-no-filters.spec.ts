// spec: e2e/specs/shopping.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Page Search', () => {
	test('Submitting the search with no filters returns the full bike catalog', async ({ page }) => {
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

		// 3. Click the 'Search' button without filling in any field.
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const shopCards = page.locator('.shop-card');
		await expect(shopCards).toHaveCount(20);
		const silverMountainCard = shopCards.filter({ has: page.locator('mat-card-title', { hasText: /^Silver Mountain$/ }) });
		await expect(silverMountainCard).toBeVisible();
		await expect(silverMountainCard.locator('mat-card-subtitle')).toHaveText('Mountain');
		await expect(silverMountainCard.locator('.shop-card-price')).toHaveText('$600.90');
		await expect(silverMountainCard.getByRole('img', { name: 'mountain1.png' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Search for Bicycles' })).toHaveAttribute('aria-expanded', 'true');
	});
});
