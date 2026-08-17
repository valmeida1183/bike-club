// spec: e2e/specs/login.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
	test('Invalid credentials show a global error dialog and persist no session', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login and clear localStorage via page.evaluate, then reload.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password' });
		const loginButton = page.getByRole('button', { name: 'Login' });

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(loginButton).toBeDisabled();
		expect(await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'))).toBeNull();

		// 2. Fill Email with 'test3@gmail.com' (well-formed, valid domain) and Password with a wrong but 6+ character value, e.g. 'wrongpass'.
		await emailInput.fill('test3@gmail.com');
		await passwordInput.fill('wrongpass');
		await expect(loginButton).toBeEnabled();

		// 3. Click the Login button.
		await loginButton.click();

		const dialog = page.getByRole('dialog');
		await expect(page.getByRole('heading', { name: 'Authentication Error' })).toBeVisible();
		await expect(dialog.getByText('You are not authorized to perform this action.')).toBeVisible();

		const closeButton = page.getByRole('button', { name: 'Close' });
		await expect(closeButton).toBeVisible();

		expect(page.url()).toBe('http://localhost:4200/account/login');
		// Note: a 401 network error and corresponding HttpErrorResponse console entries are the
		// expected, correct side effect of this flow and are intentionally not asserted on here.

		// 4. While the dialog is open, attempt to query the underlying Login button by its accessible role/name.
		// The dialog traps interaction: the underlying form is aria-hidden, so the Login button is no
		// longer exposed via its accessible role/name, while the dialog's Close button is the actionable element.
		await expect(page.getByRole('button', { name: 'Login' })).toHaveCount(0);
		await expect(closeButton).toBeEnabled();

		// 5. Click the dialog's 'Close' button.
		await closeButton.click();
		await expect(dialog).not.toBeVisible();

		await expect(emailInput).toHaveValue('test3@gmail.com');
		await expect(passwordInput).toHaveValue('wrongpass');
		await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();

		// 6. Read localStorage key 'bikeClubAuthUserData' via page.evaluate.
		expect(await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'))).toBeNull();
	});
});
