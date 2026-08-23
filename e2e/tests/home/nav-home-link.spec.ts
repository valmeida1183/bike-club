// spec: e2e/specs/home.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Home Page', () => {
	test('Home nav link keeps the user on /home and shows as active', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');
		const homeNavLink = page.getByRole('link', { name: 'Home' });
		await expect(homeNavLink).toBeVisible();

		// 2. Click the 'Home' nav link.
		await homeNavLink.click();
		await expect(page).toHaveURL('http://localhost:4200/home');
		await expect(homeNavLink).toHaveClass(/header-link-active/);
	});
});
