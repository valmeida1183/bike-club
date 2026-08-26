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

// Scoped to this test's own bike row. 'Orange Tour' is this plan's claimed bike for this
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
	test('Quantity cannot be incremented past 10', async ({ page }) => {
		// 1. Start already authenticated as Cyclist, land on the cart, and delete any pre-existing
		// 'Orange Tour' row.
		await gotoCart(page);
		await clearOwnCartItem(page, 'Orange Tour');

		// 2. Navigate to the Shopping list, search with no filters, click 'Add to Cart' on the
		// 'Orange Tour' card, then navigate to the cart.
		await page.goto('http://localhost:4200/shopping');
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const orangeTourCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Orange Tour$/ }) });
		await orangeTourCard.getByRole('button', { name: 'Add to Cart' }).click();
		await gotoCart(page);

		const row = page
			.locator('.cart-item-container')
			.filter({ has: page.getByRole('heading', { name: 'Orange Tour', level: 2 }) });
		const incrementButton = row.getByRole('button', { name: '+' });

		// 3. Click the row's '+' button nine times (quantity 1 -> 10). Each click's effect isn't
		// optimistic, so wait for the displayed quantity to advance before the next click.
		for (let target = 2; target <= 10; target += 1) {
			await incrementButton.click();
			await expect(row.locator('.increment-container').getByText(String(target), { exact: true })).toBeVisible();
		}

		await expect(incrementButton).toBeDisabled();
		await expect(row.getByRole('heading', { name: 'Total: $3,809.00', level: 3 })).toBeVisible();

		// 4. Clean up: delete the item added by this test.
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);
	});
});
