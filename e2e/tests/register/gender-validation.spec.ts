// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Gender select validation: required, verified via close-without-choosing and re-selecting the placeholder', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register.
		await page.goto('http://localhost:4200/account/register');

		const genderField = page.locator('mat-form-field').filter({ hasText: 'Gender' });
		const genderCombobox = page.getByRole('combobox', { name: 'Gender' });
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
		const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
		const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
		const phoneInput = page.getByRole('textbox', { name: 'Phone' });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(genderCombobox).toBeVisible();
		await expect(registerButton).toBeDisabled();

		// 2. Click the Gender combobox to open its dropdown panel.
		await genderCombobox.click();
		const listbox = page.getByRole('listbox', { name: 'Gender' });
		await expect(listbox.getByRole('option')).toHaveText(['--', 'Female', 'Male']);

		// 3. Press Escape to close the dropdown without selecting any option.
		await page.keyboard.press('Escape');
		await expect(listbox).toBeHidden();
		await expect(genderField.locator('mat-error')).toHaveText('Please choose a gender.');
		await expect(registerButton).toBeDisabled();

		// 4. Click the Gender combobox again and click the 'Male' option in the listbox, locating it with an
		// exact-name match since a non-exact match also matches 'Female' and throws a strict-mode violation.
		await genderCombobox.click();
		await page.getByRole('option', { name: 'Male', exact: true }).click();
		await expect(genderCombobox).toHaveText('Male');
		await expect(genderField.locator('mat-error')).toHaveCount(0);

		// 5. Fill Email, Password, Confirm Password (matching), Name, Last Name, and Phone with valid values so the whole form becomes valid.
		await emailInput.click();
		await emailInput.fill('jane.doe@example.com');
		await passwordInput.click();
		await passwordInput.fill('123456');
		await confirmPasswordInput.click();
		await confirmPasswordInput.fill('123456');
		await nameInput.click();
		await nameInput.fill('Jane');
		await lastNameInput.click();
		await lastNameInput.fill('Doe');
		await phoneInput.click();
		await phoneInput.fill('(11) 99999-9999');
		await expect(registerButton).toBeEnabled();

		// 6. Click the Gender combobox again, and this time click the '--' placeholder option to explicitly clear the previously valid selection.
		await genderCombobox.click();
		await page.getByRole('option', { name: '--' }).click();
		await expect(genderCombobox).toHaveText('');
		await expect(genderField.locator('mat-error')).toHaveText('Please choose a gender.');
		await expect(registerButton).toBeDisabled();
	});
});
