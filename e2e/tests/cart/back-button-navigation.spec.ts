// spec: e2e/specs/cart.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Cart Navigation', () => {
	test('The back button returns to the page the user came from', async ({ page }) => {
		// 1. Start already authenticated as Cyclist and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the shell nav's Cart icon.
		await page.getByLabel('Cart').click();
		await expect(page).toHaveURL('http://localhost:4200/shopping/cart');

		// 3. Click the 'Go back' button. The cart's back link is the dynamic previousUrl
		// (LayoutStore), not a static link like Shopping Details' back button.
		await page.getByRole('button', { name: 'Go back' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');
	});
});
