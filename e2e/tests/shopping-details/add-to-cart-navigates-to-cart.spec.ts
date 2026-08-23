// spec: e2e/specs/shopping-details.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect, Page } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

// The cart list renders from store.shopCart(), which starts out null until the GET
// /shop-carts/{userId} response lands — so counting delete buttons right after navigation
// can't tell "genuinely empty" from "not loaded yet". Wait for that response before reading
// the list.
async function gotoCart(page: Page): Promise<void> {
	const cartLoaded = page.waitForResponse(
		(response) => /\/shop-carts\/\d+$/.test(response.url()) && response.request().method() === 'GET',
	);
	await page.goto('http://localhost:4200/shopping/cart');
	await cartLoaded;
}

// Removal isn't optimistic (cart.store.ts patches state only after the DELETE response
// comes back), so a delete click must be confirmed to have actually taken effect before
// moving on — otherwise a slow response leaves a stale item in the shared account's cart
// with no test failure to flag it.
//
// Scoped to this test's own bike row (not "delete every item in the cart"): the cart is
// real backend state shared with other spec files (e.g. shopping/add-to-cart.spec.ts),
// which targets a different bike ('Silver Mountain') and may be running concurrently under
// `fullyParallel`. This test deliberately uses 'Mechanical Orange' instead, so the two
// specs never touch the same cart row — but even so, wiping the whole cart here would
// delete that other test's in-flight item, so only this bike's own row is ever cleared.
async function clearOwnCartItem(page: Page, bikeTitle: string): Promise<void> {
	const row = page
		.locator('.cart-item-container')
		.filter({ has: page.getByRole('heading', { name: bikeTitle, level: 2 }) });

	if ((await row.count()) > 0) {
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);
	}
}

test.describe('Shopping Details Page Cart Actions', () => {
	test('"Add to Cart" adds the chosen quantity and navigates to the cart page', async ({ page }) => {
		// 1. Start already authenticated as Cyclist and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Navigate to the cart and delete any pre-existing 'Mechanical Orange' item — the cart
		// is real backend state tied to this account and is not reset between test runs.
		await gotoCart(page);
		await clearOwnCartItem(page, 'Mechanical Orange');

		// 3. Navigate to the Shopping list, search with no filters, and click 'Details' on the
		// 'Mechanical Orange' card.
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const mechanicalOrangeCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Mechanical Orange$/ }) });
		await mechanicalOrangeCard.getByRole('button', { name: 'Details' }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping/details/2');

		// 4. Set the 'Quantity' field to '2' and click 'Add to Cart'.
		await page.getByRole('spinbutton', { name: 'Quantity' }).fill('2');
		await page.getByRole('button', { name: 'Add to Cart' }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping/cart');

		// Assertions are scoped to this item's own row rather than the shared-cart aggregates
		// (nav badge total, overall cart total) — those combine every bike in the account's cart
		// and are not guaranteed stable while another spec concurrently adds a different bike.
		const row = page
			.locator('.cart-item-container')
			.filter({ has: page.getByRole('heading', { name: 'Mechanical Orange', level: 2 }) });
		await expect(row).toBeVisible();
		await expect(row.locator('.increment-container').getByText('2', { exact: true })).toBeVisible();
		await expect(row.getByRole('heading', { name: 'Total: $901.80', level: 3 })).toBeVisible();

		// 5. Clean up: delete the item added by this test so the shared account is left as found.
		await gotoCart(page);
		await clearOwnCartItem(page, 'Mechanical Orange');
	});
});
