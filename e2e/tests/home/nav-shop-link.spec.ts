// spec: e2e/specs/home.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Home Page', () => {
	test('Shop nav link navigates to the shopping list', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');
		const shopNavLink = page.getByRole('link', { name: 'Shop', exact: true });
		await expect(shopNavLink).toBeVisible();

		// 2. Click the 'Shop' nav link.
		await shopNavLink.click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
	});
});
