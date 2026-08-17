// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test("Registering with an already-used email shows a global 'Error' dialog and persists no session", async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register and clear localStorage via page.evaluate, then reload.
		await page.goto('http://localhost:4200/account/register');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/register');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
		const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
		const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
		const genderCombobox = page.getByRole('combobox', { name: 'Gender' });
		const phoneInput = page.getByRole('textbox', { name: 'Phone' });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(emailInput).toBeVisible();
		await expect(genderCombobox).toBeVisible();
		await expect(registerButton).toBeVisible();
		await expect(registerButton).toBeDisabled();
		expect(await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'))).toBeNull();

		// 2. Fill the form with a well-formed but already-registered email — use 'test3@gmail.com' (the account documented in login.spec.md) —
		// plus valid values for all other fields: Password '123456', Confirm Password '123456', Name 'Dup', Last Name 'Test',
		// Gender 'Male' (exact-name option locator), Phone '(11) 91234-5678'.
		await emailInput.click();
		await emailInput.fill('test3@gmail.com');
		await passwordInput.click();
		await passwordInput.fill('123456');
		await confirmPasswordInput.click();
		await confirmPasswordInput.fill('123456');
		await nameInput.click();
		await nameInput.fill('Dup');
		await lastNameInput.click();
		await lastNameInput.fill('Test');
		await genderCombobox.click();
		await page.getByRole('option', { name: 'Male', exact: true }).click();
		await phoneInput.click();
		await phoneInput.fill('(11) 91234-5678');
		await expect(registerButton).toBeEnabled();

		// 3. Click the Register button.
		await registerButton.click();

		const dialog = page.getByRole('dialog');
		await expect(dialog.getByRole('heading', { name: 'Error', exact: true })).toBeVisible();
		await expect(dialog.getByText('An account with this email already exists')).toBeVisible();

		const closeButton = page.getByRole('button', { name: 'Close' });
		await expect(closeButton).toBeVisible();

		expect(page.url()).toBe('http://localhost:4200/account/register');
		// Note: the backend's duplicate-email error response and corresponding console entries are the
		// expected, correct side effect of this flow and are intentionally not asserted on here.

		// 4. Click the dialog's 'Close' button.
		await closeButton.click();
		await expect(dialog).not.toBeVisible();

		await expect(emailInput).toHaveValue('test3@gmail.com');
		await expect(passwordInput).toHaveValue('123456');
		await expect(confirmPasswordInput).toHaveValue('123456');
		await expect(nameInput).toHaveValue('Dup');
		await expect(lastNameInput).toHaveValue('Test');
		await expect(genderCombobox).toHaveText('Male');
		await expect(phoneInput).toHaveValue('(11) 91234-5678');
		await expect(registerButton).toBeEnabled();

		// 5. Read localStorage key 'bikeClubAuthUserData' via page.evaluate.
		expect(await page.evaluate(() => localStorage.getItem('bikeClubAuthUserData'))).toBeNull();
	});
});
