// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Register button enables and disables in response to overall form validity', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register.
		await page.goto('http://localhost:4200/account/register');

		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
		const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
		const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
		const genderCombobox = page.getByRole('combobox', { name: 'Gender' });
		const phoneInput = page.getByRole('textbox', { name: 'Phone' });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(registerButton).toBeDisabled();

		// 2. Fill Email 'someone@example.com', Password '123456', Confirm Password '123456', Name 'TestFirstName',
		// Last Name 'TestLastName', select Gender 'Female' via the mat-select dropdown (use an exact-name option
		// locator for consistency with the Gender test), and Phone '(11) 91234-5678' (all valid).
		await emailInput.click();
		await emailInput.fill('someone@example.com');
		await passwordInput.click();
		await passwordInput.fill('123456');
		await confirmPasswordInput.click();
		await confirmPasswordInput.fill('123456');
		await nameInput.click();
		await nameInput.fill('TestFirstName');
		await lastNameInput.click();
		await lastNameInput.fill('TestLastName');
		await genderCombobox.click();
		await page.getByRole('option', { name: 'Female', exact: true }).click();
		await phoneInput.click();
		await phoneInput.fill('(11) 91234-5678');
		await expect(registerButton).toBeEnabled();

		// 3. With the form fully valid, clear the Phone field and re-type only '123456789' (does not match the required pattern).
		await phoneInput.click();
		await phoneInput.fill('123456789');
		await expect(registerButton).toBeDisabled();

		// 4. Restore the Phone field to '(11) 91234-5678'.
		await phoneInput.fill('(11) 91234-5678');
		await expect(registerButton).toBeEnabled();

		// 5. Clear the Email field entirely (leave it empty) while all other fields remain valid.
		await emailInput.click();
		await emailInput.fill('');
		await expect(registerButton).toBeDisabled();

		// 6. Restore Email to 'someone@example.com', then open the Gender combobox and re-select the '--' placeholder option.
		await emailInput.fill('someone@example.com');
		await expect(registerButton).toBeEnabled();
		await genderCombobox.click();
		await page.getByRole('option', { name: '--' }).click();
		await expect(registerButton).toBeDisabled();
	});
});
