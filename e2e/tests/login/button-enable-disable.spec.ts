// spec: e2e/specs/login.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
	test('Login button enables and disables in response to overall form validity', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login.
		await page.goto('http://localhost:4200/account/login');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		const loginButton = page.getByRole('button', { name: 'Login' });

		await expect(loginButton).toBeDisabled();

		// 2. Fill Email with 'test3@gmail.com' and Password with '123456' (both valid).
		await emailInput.fill('test3@gmail.com');
		await passwordInput.fill('123456');
		await expect(loginButton).toBeEnabled();

		// 3. With both fields still valid/filled, clear the Password field and re-type only '12345' (5 characters, below the 6-character minimum).
		await passwordInput.click();
		await passwordInput.fill('12345');
		await expect(loginButton).toBeDisabled();

		// 4. Restore the Password field to '123456'.
		await passwordInput.fill('123456');
		await expect(loginButton).toBeEnabled();

		// 5. Clear the Email field entirely (leave it empty) while Password remains '123456'.
		await emailInput.click();
		await emailInput.fill('');
		await expect(loginButton).toBeDisabled();
	});
});
