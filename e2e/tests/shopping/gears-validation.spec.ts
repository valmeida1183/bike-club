// spec: e2e/specs/shopping.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Page Search', () => {
	test('An out-of-range Gears value shows a validation error and disables Search', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage via page.evaluate, reload, then fill Email and Password and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
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
