// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Name and Last Name validation: required and maxLength(50), with no HTML truncation', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register.
		await page.goto('http://localhost:4200/account/register');

		const nameField = page.locator('mat-form-field').nth(3);
		const lastNameField = page.locator('mat-form-field').nth(4);
		const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
		const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
		const registerButton = page.getByRole('button', { name: 'Register' });
		const longValue = 'A'.repeat(51);

		await expect(nameInput).toBeVisible();
		await expect(registerButton).toBeDisabled();

		// 2. Click into the Name field, then click into the Last Name field (focus then blur Name without typing).
		await nameInput.click();
		await lastNameInput.click();
		await expect(nameField.locator('mat-error')).toHaveText('Name is required.');
		await expect(registerButton).toBeDisabled();

		// 3. Click into the Name field and type a string of 51 'A' characters, then blur by clicking into the Last Name field.
		// NOTE: types with real keystrokes (pressSequentially) rather than fill(), since fill() sets the
		// value through the DOM setter and bypasses any HTML maxlength attribute, which would defeat the
		// purpose of this assertion. Verified live: the input has no maxlength attribute at all (only a
		// reactive-form Validators.maxLength(50)), so real keystrokes are not truncated either.
		await nameInput.click();
		await nameInput.pressSequentially(longValue);
		await lastNameInput.click();
		await expect(nameInput).toHaveValue(longValue);
		await expect(nameInput).not.toHaveAttribute('maxlength');
		await expect(nameField.locator('mat-error')).toHaveText('Name must be at maximum 50 characters.');
		await expect(registerButton).toBeDisabled();

		// 4. Clear the Name field and type a valid short value, e.g. 'TestFirstName', then blur.
		await nameInput.click();
		await nameInput.fill('TestFirstName');
		await lastNameInput.click();
		await expect(nameField.locator('mat-error')).toHaveCount(0);

		// 5. Click into the Last Name field, then click into the Name field (focus then blur Last Name without typing).
		await lastNameInput.click();
		await nameInput.click();
		await expect(lastNameField.locator('mat-error')).toHaveText('Last Name is required.');
		await expect(registerButton).toBeDisabled();

		// 6. Click into the Last Name field and type a string of 51 'A' characters, then blur by clicking into the Name field.
		await lastNameInput.click();
		await lastNameInput.pressSequentially(longValue);
		await nameInput.click();
		await expect(lastNameInput).toHaveValue(longValue);
		await expect(lastNameInput).not.toHaveAttribute('maxlength');
		await expect(lastNameField.locator('mat-error')).toHaveText('Last Name must be at maximum 50 characters.');
		await expect(registerButton).toBeDisabled();

		// 7. Clear the Last Name field and type a valid short value, e.g. 'TestLastName', then blur.
		await lastNameInput.click();
		await lastNameInput.fill('TestLastName');
		await nameInput.click();
		await expect(lastNameField.locator('mat-error')).toHaveCount(0);
	});
});
