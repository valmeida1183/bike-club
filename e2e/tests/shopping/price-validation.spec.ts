// spec: e2e/specs/shopping.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Page Search', () => {
	test('An invalid Price value shows a validation error and disables Search', async ({ page }) => {
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
		await expect(searchButton).toBeEnabled();

		// 3. Type 'abc' into the '$ Price' field, then move focus to another field to blur it.
		await page.getByRole('textbox', { name: '$ Price' }).fill('abc');
		await page.getByRole('spinbutton', { name: 'Gears' }).click();
		await expect(page.getByText('Price is invalid.')).toBeVisible();
		await expect(searchButton).toBeDisabled();
	});
});
