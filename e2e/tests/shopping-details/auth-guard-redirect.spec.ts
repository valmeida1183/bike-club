// spec: e2e/specs/shopping-details.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Details Page Route Guard', () => {
	test('An unauthenticated user hard-navigating to a details URL is redirected to the login page', async ({
		page,
	}) => {
		// 1. On a fresh browser context, clear localStorage to guarantee a logged-out starting point, then perform a full page navigation directly to a details URL.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/shopping/details/1');
		await expect(page).toHaveURL('http://localhost:4200/account/login');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		const loginButton = page.getByRole('button', { name: 'Login' });
		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeVisible();
		await expect(loginButton).toBeDisabled();
	});
});
