// spec: e2e/specs/shopping.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Page Search', () => {
	test('An out-of-range Gears value shows a validation error and disables Search', async ({ page }) => {
		// 1. Start already authenticated as Cyclist (see e2e/auth/cyclist.setup.ts) and land on /home.
		await page.goto('http://localhost:4200/home');
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'Shop' nav link.
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping');
		const searchButton = page.getByRole('button', { name: 'Search', exact: true });
		const gearsInput = page.getByRole('spinbutton', { name: 'Gears' });
		const frameSizeInput = page.getByRole('spinbutton', { name: 'Frame Size' });

		// 3. Type '-1' into the 'Gears' field, then move focus to another field to blur it.
		await gearsInput.fill('-1');
		await frameSizeInput.click();
		await expect(page.getByText('Minimum value is 0.')).toBeVisible();
		await expect(searchButton).toBeDisabled();

		// 4. Clear the 'Gears' field and type '37', then blur it.
		await gearsInput.fill('37');
		await frameSizeInput.click();
		await expect(page.getByText('Maximum value is 36.')).toBeVisible();
		await expect(searchButton).toBeDisabled();
	});
});
