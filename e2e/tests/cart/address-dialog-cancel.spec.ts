// spec: e2e/specs/cart.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

const NO_ADDRESS_TEXT =
	'No delivery address found. Please add an address to your profile or choose.';

test.describe('Shopping Cart Address and Buy Now', () => {
	test('Opening the address dialog and cancelling leaves the cart unchanged', async ({ page }) => {
		// 1. Start already authenticated as Cyclist and land on the cart.
		await page.goto('http://localhost:4200/shopping/cart');
		await expect(page.getByText(NO_ADDRESS_TEXT)).toBeVisible();

		// 2. Click the 'Add Address' button. Deliberately not completing/saving this form — see
		// e2e/specs/cart.spec.md's Application Overview: there is no delete-address endpoint, so a
		// saved address on this shared cart could not be reverted afterward.
		await page.getByRole('button', { name: 'Add Address' }).click();
		await expect(page.getByRole('heading', { name: 'Add Address', level: 2 })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'State' })).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'City' })).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Street' })).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Complement' })).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Zip Code' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();

		// 3. Click 'Cancel'.
		await page.getByRole('button', { name: 'Cancel' }).click();
		await expect(page.getByRole('heading', { name: 'Add Address', level: 2 })).not.toBeVisible();
		await expect(page.getByText(NO_ADDRESS_TEXT)).toBeVisible();
	});
});
