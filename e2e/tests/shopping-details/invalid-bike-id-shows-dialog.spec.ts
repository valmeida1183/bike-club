// spec: e2e/specs/shopping-details.spec.md
// auth: cyclist (see e2e/auth/cyclist.setup.ts)

import { test, expect } from '@playwright/test';
import { CYCLIST_STORAGE_STATE } from '../../auth/storage-state';

test.use({ storageState: CYCLIST_STORAGE_STATE });

test.describe('Shopping Details Page Error Handling', () => {
	test('An invalid bike id shows a "Resource Not Found" dialog instead of a broken page', async ({
		page,
	}) => {
		// 1. Start already authenticated as Cyclist and land on /home, then navigate directly to an
		// id not present in the seeded catalog.
		await page.goto('http://localhost:4200/home');
		await page.goto('http://localhost:4200/shopping/details/9999');
		const dialog = page.getByRole('dialog');
		await expect(dialog.getByRole('heading', { name: 'Resource Not Found', level: 3 })).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible();

		// 2. Click 'Close' on the dialog.
		await dialog.getByRole('button', { name: 'Close' }).click();
		await expect(dialog).not.toBeVisible();
		await expect(page).toHaveURL('http://localhost:4200/shopping/details/9999');
	});
});
