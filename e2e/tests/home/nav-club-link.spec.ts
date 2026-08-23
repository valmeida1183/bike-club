// spec: e2e/specs/home.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Home Page', () => {
	test('Club nav link navigates to the club page', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');
		const clubNavLink = page.getByRole('link', { name: 'Club' });
		await expect(clubNavLink).toBeVisible();

		// 2. Click the 'Club' nav link.
		await clubNavLink.click();
		await expect(page).toHaveURL('http://localhost:4200/club');
	});
});
