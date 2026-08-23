// spec: e2e/specs/shopping-details.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Details Page Content', () => {
	test('"Change Address" and "Buy Now" are unfinished stubs with no visible effect', async ({
		page,
	}) => {
		// 1. Start already authenticated as Cyclist, land on /home, navigate to the Shopping list,
		// search with no filters, and click "Details" on the "Silver Mountain" card.
		await page.goto('http://localhost:4200/home');
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const silverMountainCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Silver Mountain$/ }) });
		await silverMountainCard.getByRole('button', { name: 'Details' }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping/details/1');

		// The cart is real shared backend state for this account, and other specs (e.g.
		// add-to-cart-navigates-to-cart.spec.ts) legitimately add/remove items in parallel test
		// runs — so the badge is not guaranteed to be absent at any given moment. Snapshot its
		// state up front and assert it stays UNCHANGED by these stub clicks, rather than assuming
		// it starts (or stays) empty.
		const cartIconLink = page.getByRole('link', { name: 'Cart' });
		const badgeCountBefore = await cartIconLink.locator('.caret').count();

		// 2. Click the 'Change Address' button.
		await page.getByRole('button', { name: 'Change Address' }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping/details/1');
		await expect(page.getByRole('dialog')).not.toBeVisible();
		await expect(cartIconLink.locator('.caret')).toHaveCount(badgeCountBefore);

		// 3. Click the 'Buy Now' button (default quantity 1, a valid value).
		await page.getByRole('button', { name: 'Buy Now' }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping/details/1');
		await expect(page.getByRole('dialog')).not.toBeVisible();
		await expect(cartIconLink.locator('.caret')).toHaveCount(badgeCountBefore);
	});
});
