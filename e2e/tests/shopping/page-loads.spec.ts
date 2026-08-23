// spec: e2e/specs/shopping.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Page Search', () => {
	test('Page loads with the Shop heading and an expanded, empty search panel', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'Shop' nav link.
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		await expect(page).toHaveTitle('Bike Club');

		// 3. Inspect the page heading and search panel.
		await expect(page.getByRole('heading', { name: 'Shop', level: 1 })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'Category' })).toBeVisible();
		const searchButton = page.getByRole('button', { name: 'Search', exact: true });
		await expect(searchButton).toBeVisible();
		await expect(searchButton).toBeEnabled();

		// 4. Inspect the results grid before any search.
		await expect(page.locator('bc-shop-item')).toHaveCount(0);
	});
});
