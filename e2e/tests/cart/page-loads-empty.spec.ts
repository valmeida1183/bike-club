// spec: e2e/specs/cart.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect, Page } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

// The cart list renders from store.shopCart(), populated once per login by MainLayoutComponent
// (not by CartComponent itself) via GET /shop-carts/{userId} — waiting for that response before
// reading the list avoids a race with this test's assertions.
async function gotoCart(page: Page): Promise<void> {
	const cartLoaded = page.waitForResponse(
		(response) => /\/shop-carts\/\d+$/.test(response.url()) && response.request().method() === 'GET',
	);
	await page.goto('http://localhost:4200/shopping/cart');
	await cartLoaded;
}

// This scenario needs the *entire* cart empty (not just one bike's row) to assert the empty-state
// markup. Removal isn't optimistic (cart.store.ts patches state only after the DELETE response
// lands), so each click is awaited to actually take effect before checking for the next button —
// see e2e/specs/cart.spec.md's "Empty-cart scenario" note for the shared-state risk this implies
// under fullyParallel.
async function clearWholeCart(page: Page): Promise<void> {
	const deleteButtons = page.getByRole('button').filter({ hasText: 'delete' });
	let count = await deleteButtons.count();

	while (count > 0) {
		await deleteButtons.first().click();
		await expect(deleteButtons).toHaveCount(count - 1);
		count -= 1;
	}
}

test.describe('Shopping Cart Page Content', () => {
	test('Page loads with an empty cart, no address, and a disabled Buy Now button', async ({ page }) => {
		// 1. Start already authenticated as Cyclist, land on the cart, and delete every pre-existing
		// line item so the cart is genuinely empty.
		await gotoCart(page);
		await clearWholeCart(page);
		await expect(page).toHaveURL('http://localhost:4200/shopping/cart');

		// 2. Inspect the page heading and back button.
		await expect(page.getByRole('heading', { name: 'Shopping Cart', level: 1 })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();

		// 3. Inspect the summary panel with no items present.
		await expect(page.getByRole('heading', { name: 'Total: $0.00', level: 1 })).toBeVisible();
		await expect(
			page.getByText('No delivery address found. Please add an address to your profile or choose.'),
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Add Address' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Buy Now' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Buy Now' })).toBeDisabled();
		await expect(page.locator('.cart-item-container')).toHaveCount(0);
	});
});
