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

// Scoped to this test's own bike row. 'Blue Sky' is also used by page-loads-with-item.spec.ts,
// but that test always cleans up its own row before finishing, so the two never collide as long
// as neither is mid-run when the other starts — matching this suite's convention (see
// e2e/specs/cart.spec.md).
async function clearOwnCartItem(page: Page, bikeTitle: string): Promise<void> {
	const row = page
		.locator('.cart-item-container')
		.filter({ has: page.getByRole('heading', { name: bikeTitle, level: 2 }) });

	if ((await row.count()) > 0) {
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);
	}
}

test.describe('Shopping Cart Address and Buy Now', () => {
	test('"Buy Now" stays disabled while the cart has no address', async ({ page }) => {
		// 1. Start already authenticated as Cyclist, land on the cart, and delete any pre-existing
		// 'Blue Sky' row.
		await gotoCart(page);
		await clearOwnCartItem(page, 'Blue Sky');

		// 2. Navigate to the Shopping list, search with no filters, click 'Add to Cart' on the
		// 'Blue Sky' card, then navigate to the cart.
		await page.goto('http://localhost:4200/shopping');
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const blueSkyCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Blue Sky$/ }) });
		await blueSkyCard.getByRole('button', { name: 'Add to Cart' }).click();
		await gotoCart(page);

		const row = page
			.locator('.cart-item-container')
			.filter({ has: page.getByRole('heading', { name: 'Blue Sky', level: 2 }) });
		await expect(row).toBeVisible();
		await expect(
			page.getByText('No delivery address found. Please add an address to your profile or choose.'),
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Buy Now' })).toBeDisabled();

		// 3. Clean up: delete the item added by this test.
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);
	});
});
