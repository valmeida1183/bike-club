// spec: e2e/specs/shopping.spec.md
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
// comes back), so each click must be confirmed to have actually taken effect before the
// next one fires — otherwise a slow response leaves stale items in the shared account's
// cart with no test failure to flag it.
async function clearCart(page: Page): Promise<void> {
	const deleteButtons = page.getByRole('button').filter({ hasText: 'delete' });
	let remaining = await deleteButtons.count();

	while (remaining > 0) {
		await deleteButtons.first().click();
		await expect(deleteButtons).toHaveCount(remaining - 1);
		remaining -= 1;
	}
}

test.describe('Shopping Page Item Actions', () => {
	test("'Add to Cart' updates the shell nav's Cart badge without navigating away", async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Navigate to the cart and delete any pre-existing items — the cart is real backend
		// state tied to this account and is not reset between test runs.
		await gotoCart(page);
		await clearCart(page);

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
		await gotoCart(page);
		await clearCart(page);
	});
});
