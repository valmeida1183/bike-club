// spec: e2e/specs/shopping-details.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect, Locator, Page } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

// The 'bike-tag-content' class is reused by both the group wrapper (bike-description-panel)
// and each individual bc-bike-tag's own wrapper, so filtering by that class matches both the
// wrapper and its child — scope by the bc-bike-tag element selector instead, which is unique
// per tag instance.
function bikeTag(page: Page, tag: string): Locator {
	return page
		.locator('bc-bike-tag')
		.filter({ has: page.getByRole('heading', { name: tag, level: 5 }) })
		.locator('.tag-value');
}

test.describe('Shopping Details Page Content', () => {
	test("Page loads with the bike's image, description, tags, and price", async ({ page }) => {
		// 1. Start already authenticated as Cyclist and land on /home, then navigate to the Shopping
		// list, search with no filters, and click "Details" on the "Silver Mountain" card.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const silverMountainCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Silver Mountain$/ }) });
		await silverMountainCard.getByRole('button', { name: 'Details' }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping/details/1');

		// 2. Inspect the page heading and back button.
		await expect(page.getByRole('heading', { name: 'Shopping Details', level: 1 })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();

		// 3. Inspect the image, description, and tag panels.
		await expect(page.getByRole('img', { name: 'mountain1.png' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Silver Mountain', level: 1 })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Category: Mountain', level: 3 })).toBeVisible();
		await expect(
			page.getByText(
				'The classic mountain bike. Equipped with front suspension, V-Brake and aluminum frame.',
			),
		).toBeVisible();
		await expect(bikeTag(page, 'Gears')).toHaveText('18');
		await expect(bikeTag(page, 'Frame')).toHaveText('17.5');
		await expect(bikeTag(page, 'Rim')).toHaveText('27.5');

		// 4. Inspect the price panel.
		await expect(page.getByRole('heading', { name: '$600.90', level: 1 })).toBeVisible();
		await expect(page.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue('1');
		await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeEnabled();
		await expect(page.getByRole('button', { name: 'Buy Now' })).toBeEnabled();
	});
});
