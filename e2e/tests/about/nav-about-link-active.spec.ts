// spec: e2e/specs/about.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('About Page Content', () => {
	test('About nav link shows the active-route state while on /about', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'About' nav link.
		const aboutNavLink = page.getByRole('link', { name: 'About' });
		await aboutNavLink.click();
		await expect(page).toHaveURL('http://localhost:4200/about');

		// 3. Inspect the 'About' nav link.
		await expect(aboutNavLink).toHaveClass(/header-link-active/);
	});
});
