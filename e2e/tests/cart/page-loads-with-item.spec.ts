// spec: e2e/specs/cart.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect, Page } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

async function gotoCart(page: Page): Promise<void> {
	const cartLoaded = page.waitForResponse(
		(response) => /\/shop-carts\/\d+$/.test(response.url()) && response.request().method() === 'GET',
	);
	await page.goto('http://localhost:4200/shopping/cart');
	await cartLoaded;
}

// Scoped to this test's own bike row (not "delete every item in the cart"): the cart is real
// backend state shared with other spec files that may be running concurrently under
// fullyParallel. 'Blue Sky' is this plan's claimed bike for this scenario, not used elsewhere.
async function clearOwnCartItem(page: Page, bikeTitle: string): Promise<void> {
	const row = page
		.locator('.cart-item-container')
		.filter({ has: page.getByRole('heading', { name: bikeTitle, level: 2 }) });

	if ((await row.count()) > 0) {
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);
	}
}

test.describe('Shopping Cart Page Content', () => {
	test('Page loads with a cart item showing its image, description, price, and totals', async ({ page }) => {
		// 1. Start already authenticated as Cyclist, land on the cart, and delete any pre-existing
		// 'Blue Sky' row.
		await gotoCart(page);
		await clearOwnCartItem(page, 'Blue Sky');

		// 2. Navigate to the Shopping list, search with no filters, and click 'Add to Cart' on the
		// 'Blue Sky' card.
		await page.goto('http://localhost:4200/shopping');
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const blueSkyCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Blue Sky$/ }) });
		await blueSkyCard.getByRole('button', { name: 'Add to Cart' }).click();

		// 3. Navigate back to the cart.
		await gotoCart(page);

		const row = page
			.locator('.cart-item-container')
			.filter({ has: page.getByRole('heading', { name: 'Blue Sky', level: 2 }) });
		await expect(row).toBeVisible();
		// Not getByRole('img', ...): cart-item.component.html binds alt to bike()?.name, a field the
		// Bike model doesn't have (it's `model`), so alt is always empty and the image never gets
		// ARIA role 'img' at all (an <img alt=""> is accessibility-presentational) — a real app bug,
		// see e2e/specs/cart.spec.md's Application Overview.
		await expect(row.locator('img')).toBeVisible();
		await expect(row.getByText('Price: $1,200.90')).toBeVisible();
		await expect(row.locator('.increment-container').getByText('1', { exact: true })).toBeVisible();
		await expect(row.getByRole('button', { name: '-' })).toBeDisabled();
		await expect(row.getByRole('heading', { name: 'Total: $1,200.90', level: 3 })).toBeVisible();

		// 4. Clean up: delete the item added by this test.
		await gotoCart(page);
		await clearOwnCartItem(page, 'Blue Sky');
	});
});
