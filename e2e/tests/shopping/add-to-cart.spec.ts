// spec: e2e/specs/shopping.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Page Item Actions', () => {
	test("'Add to Cart' updates the shell nav's Cart badge without navigating away", async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage via page.evaluate, reload, then fill Email and Password and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Navigate to the cart and delete any pre-existing items — the cart is real backend
		// state tied to this account and is not reset between test runs.
		await page.goto('http://localhost:4200/shopping/cart');
		const deleteButtons = page.getByRole('button').filter({ hasText: 'delete' });
		while (await deleteButtons.count() > 0) {
			await deleteButtons.first().click();
		}

		// 3. Click the 'Shop' nav link, then click the 'Search' button with no filters.
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const cartIconLink = page.getByRole('link', { name: 'Cart' });
		await expect(cartIconLink.locator('.caret')).toHaveCount(0);
		const silverMountainCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Silver Mountain$/ }) });
		const addToCartButton = silverMountainCard.getByRole('button', { name: 'Add to Cart' });

		// 4. Click 'Add to Cart' on the 'Silver Mountain' card.
		await addToCartButton.click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		await expect(cartIconLink.locator('.caret')).toHaveText('1');

		// 5. Click 'Add to Cart' on the 'Silver Mountain' card again.
		await addToCartButton.click();
		await expect(cartIconLink.locator('.caret')).toHaveText('2');

		// 6. Clean up: delete the item(s) added by this test so the shared account is left empty.
		await page.goto('http://localhost:4200/shopping/cart');
		while (await deleteButtons.count() > 0) {
			await deleteButtons.first().click();
		}
	});
});
