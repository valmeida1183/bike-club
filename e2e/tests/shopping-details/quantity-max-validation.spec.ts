// spec: e2e/specs/shopping-details.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Details Page Content', () => {
	test('A Quantity above the maximum shows a validation error and disables both action buttons', async ({
		page,
	}) => {
		// 1. Start already authenticated as Cyclist, land on /home, navigate to the Shopping list,
		// search with no filters, and click "Details" on the "Silver Mountain" card.
		await page.goto('http://localhost:4200/home');
		await page.getByRole('link', { name: 'Shop', exact: true }).click();
		await page.getByRole('button', { name: 'Search', exact: true }).click();
		const silverMountainCard = page
			.locator('.shop-card')
			.filter({ has: page.locator('mat-card-title', { hasText: /^Silver Mountain$/ }) });
		await silverMountainCard.getByRole('button', { name: 'Details' }).click();
		await expect(page).toHaveURL('http://localhost:4200/shopping/details/1');

		// 2. Clear the 'Quantity' field, type '21', then move focus elsewhere to blur it.
		const quantityField = page.getByRole('spinbutton', { name: 'Quantity' });
		await quantityField.fill('21');
		await quantityField.press('Tab');
		await expect(page.getByText('Maximum value is 20.')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeDisabled();
		await expect(page.getByRole('button', { name: 'Buy Now' })).toBeDisabled();
	});
});
