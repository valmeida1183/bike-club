// spec: e2e/specs/shopping.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Page Search', () => {
	test('Submitting the search with no filters returns the full bike catalog', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'Shop' nav link.
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');

		// 3. Click the 'Search' button without filling in any field.
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const shopCards = page.locator('.shop-card');
		await expect(shopCards).toHaveCount(20);
		const silverMountainCard = shopCards.filter({ has: page.locator('mat-card-title', { hasText: /^Silver Mountain$/ }) });
		await expect(silverMountainCard).toBeVisible();
		await expect(silverMountainCard.locator('mat-card-subtitle')).toHaveText('Mountain');
		await expect(silverMountainCard.locator('.shop-card-price')).toHaveText('$600.90');
		await expect(silverMountainCard.getByRole('img', { name: 'mountain1.png' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Search for Bicycles' })).toHaveAttribute('aria-expanded', 'true');
	});
});
