// spec: e2e/specs/home.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Home Page', () => {
	test('Logout control logs the user out and clears the session', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');
		const logoutControl = page.getByLabel('Loggout');
		await expect(logoutControl).toBeVisible();

		// 2. Click the 'Loggout' control.
		await logoutControl.click();
		await expect(page).toHaveURL('http://localhost:4200/account/login');
		expect(await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'))).toBeNull();
	});
});
