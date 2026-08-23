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
// comes back), so a delete click must be confirmed to have actually taken effect before
// moving on — otherwise a slow response leaves a stale item in the shared account's cart
// with no test failure to flag it.
//
// Scoped to a single bike's own row (not "delete every item in the cart"): the cart is
// real backend state shared with other spec files (e.g.
// shopping-details/add-to-cart-navigates-to-cart.spec.ts), which may be adding/removing a
// *different* bike concurrently under `fullyParallel`. Wiping the whole cart here would
// delete that other test's in-flight item too.
async function clearOwnCartItem(page: Page, bikeTitle: string): Promise<void> {
	const row = page
		.locator('.cart-item-container')
		.filter({ has: page.getByRole('heading', { name: bikeTitle, level: 2 }) });

	if ((await row.count()) > 0) {
		await row.getByRole('button').filter({ hasText: 'delete' }).click();
		await expect(row).toHaveCount(0);
	}
}

// The shell nav Cart badge is an aggregate across every bike in the shared cart, so a
// concurrently-running spec adding a different bike changes it too. Read it as a numeric
// baseline and assert it moves by the expected delta, rather than asserting an absolute
// value that assumes this test owns the whole cart.
async function getCartBadgeCount(page: Page): Promise<number> {
	const badge = page.getByRole('link', { name: 'Cart' }).locator('.caret');

	if ((await badge.count()) === 0) {
		return 0;
	}

	return Number(await badge.innerText());
}

test.describe('Shopping Page Item Actions', () => {
	// Tagged '@cart-shared': this test asserts an exact value on the shell nav Cart badge,
	// which is an account-wide aggregate across every bike in the cart — not something that
	// can be scoped to "this test's own row" like shopping-details/add-to-cart-navigates-to-cart.spec.ts
	// does, because the badge itself is what's under test here. It must never run concurrently
	// with any other '@cart-shared' test against the same account. See package.json's
	// 'test:e2e-no-register' script, which runs '@cart-shared' tests as a separate serial pass.
	test(
		"'Add to Cart' updates the shell nav's Cart badge without navigating away",
		{ tag: '@cart-shared' },
		async ({ page }) => {
			// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
			await page.goto('http://localhost:4200/home');
			await expect(page).toHaveURL('http://localhost:4200/home');

			// 2. Navigate to the cart and delete any pre-existing 'Silver Mountain' item — the cart is
			// real backend state tied to this account and is not reset between test runs.
			await gotoCart(page);
			await clearOwnCartItem(page, 'Silver Mountain');

			// 3. Click the 'Shop' nav link, then click the 'Search' button with no filters.
			await page.getByRole('link', { name: 'Shop', exact: true }).click();
			await expect(page).toHaveURL('http://localhost:4200/shopping');
			await page.getByRole('button', { name: 'Search', exact: true }).click();
			const cartIconLink = page.getByRole('link', { name: 'Cart' });
			const badgeBefore = await getCartBadgeCount(page);
			const silverMountainCard = page
				.locator('.shop-card')
				.filter({ has: page.locator('mat-card-title', { hasText: /^Silver Mountain$/ }) });
			const addToCartButton = silverMountainCard.getByRole('button', { name: 'Add to Cart' });

			// 4. Click 'Add to Cart' on the 'Silver Mountain' card.
			await addToCartButton.click();
			await expect(page).toHaveURL('http://localhost:4200/shopping');
			await expect(cartIconLink.locator('.caret')).toHaveText(String(badgeBefore + 1));

			// 5. Click 'Add to Cart' on the 'Silver Mountain' card again.
			await addToCartButton.click();
			await expect(cartIconLink.locator('.caret')).toHaveText(String(badgeBefore + 2));

			// 6. Clean up: delete the item added by this test so the shared account is left as found.
			await gotoCart(page);
			await clearOwnCartItem(page, 'Silver Mountain');
		},
	);
});
