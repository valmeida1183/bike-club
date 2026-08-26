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

// Scoped to this test's own bike row. 'Snow Mountain' is this plan's claimed bike for this
// scenario, not used by any other spec's cart-mutating test.
async function clearOwnCartItem(page: Page, bikeTitle: string): Promise<void> {
	const row = page
		.locator('.cart-item-container')
		.filter({ has: page.getByRole('heading', { name: bikeTitle, level: 2 }) });

	if ((await row.count()) > 0) {
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);
	}
}

test.describe('Shopping Cart Quantity Controls', () => {
	test('Incrementing and decrementing quantity updates totals and the button bounds', async ({ page }) => {
		// 1. Start already authenticated as Cyclist, land on the cart, and delete any pre-existing
		// 'Snow Mountain' row.
		await gotoCart(page);
		await clearOwnCartItem(page, 'Snow Mountain');

		// 2. Navigate to the Shopping list, search with no filters, click 'Add to Cart' on the
		// 'Snow Mountain' card, then navigate to the cart.
		await page.goto('http://localhost:4200/shopping');
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const snowMountainCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Snow Mountain$/ }) });
		await snowMountainCard.getByRole('button', { name: 'Add to Cart' }).click();
		await gotoCart(page);

		const row = page
			.locator('.cart-item-container')
			.filter({ has: page.getByRole('heading', { name: 'Snow Mountain', level: 2 }) });
		await expect(row.locator('.increment-container').getByText('1', { exact: true })).toBeVisible();
		await expect(row.getByRole('button', { name: '-' })).toBeDisabled();

		// 3. Click the row's '+' button once. Quantity update isn't optimistic (cart.store.ts
		// patches state only after the PATCH response lands), so the totals below are awaited via
		// their own auto-retrying assertions.
		await row.getByRole('button', { name: '+' }).click();
		await expect(row.locator('.increment-container').getByText('2', { exact: true })).toBeVisible();
		await expect(row.getByRole('button', { name: '-' })).toBeEnabled();
		await expect(row.getByRole('heading', { name: 'Total: $2,801.80', level: 3 })).toBeVisible();

		// 4. Click the row's '-' button once.
		await row.getByRole('button', { name: '-' }).click();
		await expect(row.locator('.increment-container').getByText('1', { exact: true })).toBeVisible();
		await expect(row.getByRole('button', { name: '-' })).toBeDisabled();
		await expect(row.getByRole('heading', { name: 'Total: $1,400.90', level: 3 })).toBeVisible();

		// 5. Clean up: delete the item added by this test.
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);
	});
});
