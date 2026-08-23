// spec: e2e/specs/home.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Home Page', () => {
	test('"Go to Shopping" CTA navigates to the shopping list', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');
		const goToShoppingLink = page.getByRole('link', { name: 'Go to Shopping' });
		await expect(goToShoppingLink).toBeVisible();

		// 2. Click the 'Go to Shopping' link.
		await goToShoppingLink.click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		expect(page.url()).toBe('http://localhost:4200/shopping');
	});
});
