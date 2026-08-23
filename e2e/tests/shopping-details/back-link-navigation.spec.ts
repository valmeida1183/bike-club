// spec: e2e/specs/shopping-details.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Details Page Content', () => {
	test('The back button navigates to the Shopping list', async ({ page }) => {
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

		// 2. Click the 'Go back' button.
		await page.getByRole('button', { name: 'Go back' }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
	});
});
