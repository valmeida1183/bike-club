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

// Scoped to this test's own bike row. 'Orange Speed' is this plan's claimed bike for this
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

// The nav badge (.caret) sums quantity across every bike in the shared cart, not just this
// test's own item, so its value is read as a baseline and compared by delta rather than as an
// absolute number — another spec may be concurrently adding a different bike under fullyParallel.
async function readCartBadgeCount(page: Page): Promise<number> {
	const badge = page.getByLabel('Cart').locator('.caret');

	if ((await badge.count()) === 0) {
		return 0;
	}

	return Number((await badge.textContent())?.trim() ?? '0');
}

test.describe('Shopping Cart Item Removal', () => {
	test('Deleting a line item removes it and updates the nav badge', async ({ page }) => {
		// 1. Start already authenticated as Cyclist, land on the cart, and delete any pre-existing
		// 'Orange Speed' row.
		await gotoCart(page);
		await clearOwnCartItem(page, 'Orange Speed');

		// 2. Read the shell nav Cart badge's current value as a baseline.
		const baseline = await readCartBadgeCount(page);

		// 3. Navigate to the Shopping list, search with no filters, and click 'Add to Cart' on the
		// 'Orange Speed' card.
		await page.goto('http://localhost:4200/shopping');
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const orangeSpeedCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Orange Speed$/ }) });
		await orangeSpeedCard.getByRole('button', { name: 'Add to Cart' }).click();
		await expect(page.getByLabel('Cart').locator('.caret')).toHaveText(String(baseline + 1));

		// 4. Navigate to the cart.
		await gotoCart(page);
		const row = page
			.locator('.cart-item-container')
			.filter({ has: page.getByRole('heading', { name: 'Orange Speed', level: 2 }) });
		await expect(row).toBeVisible();

		// 5. Click the row's delete button.
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);

		if (baseline === 0) {
			await expect(page.getByLabel('Cart').locator('.caret')).toHaveCount(0);
		} else {
			await expect(page.getByLabel('Cart').locator('.caret')).toHaveText(String(baseline));
		}
	});
});
