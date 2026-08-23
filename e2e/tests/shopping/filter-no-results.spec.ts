// spec: e2e/specs/shopping.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Page Search', () => {
	test('Filtering by a Category with no matching bikes shows an empty results grid', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'Shop' nav link.
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');

		// 3. Open the 'Category' select and choose 'Folding'.
		const categorySelect = page.getByRole('combobox', { name: 'Category' });
		await categorySelect.click();
		await page.getByRole('option', { name: 'Folding' }).click();
		await expect(categorySelect).toHaveText('Folding');

		// 4. Click the 'Search' button.
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		await expect(page.locator('.shop-card')).toHaveCount(0);
	});
});
