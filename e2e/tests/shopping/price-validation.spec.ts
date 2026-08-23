// spec: e2e/specs/shopping.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Page Search', () => {
	test('An invalid Price value shows a validation error and disables Search', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'Shop' nav link.
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		const searchButton = page.getByRole('button', { name: 'Search', exact: true });
		await expect(searchButton).toBeEnabled();

		// 3. Type 'abc' into the '$ Price' field, then move focus to another field to blur it.
		await page.getByRole('textbox', { name: '$ Price' }).fill('abc');
		await page.getByRole('spinbutton', { name: 'Gears' }).click();
		await expect(page.getByText('Price is invalid.')).toBeVisible();
		await expect(searchButton).toBeDisabled();
	});
});
