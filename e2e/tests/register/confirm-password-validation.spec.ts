// spec: e2e/specs/register.spec.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
	test('Confirm Password validation: required, mismatch, aria quirk, and live re-validation when Password changes', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/register.
		await page.goto('http://localhost:4200/account/register');

		const confirmPasswordField = page.locator('mat-form-field').nth(2);
		const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
		const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
		const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
		const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const phoneInput = page.getByRole('textbox', { name: 'Phone' });
		const genderCombobox = page.getByRole('combobox', { name: 'Gender' });
		const registerButton = page.getByRole('button', { name: 'Register' });

		await expect(confirmPasswordInput).toBeVisible();
		await expect(registerButton).toBeDisabled();
		const confirmPasswordHintText = await confirmPasswordField.locator('mat-hint').textContent();
		expect(confirmPasswordHintText).toBe(' / 6');

		// 2. Click into the Confirm Password field, then click into the Name field (focus then blur Confirm Password without typing).
		await confirmPasswordInput.click();
		await nameInput.click();
		await expect(confirmPasswordField.locator('mat-error')).toHaveText('Confirm Password is required.');
		await expect(registerButton).toBeDisabled();

		// 3. Fill Password with '123456'. Click into the Confirm Password field and type '1234' (mismatched, and also shorter than 6 chars), then blur by clicking into the Name field.
		await passwordInput.click();
		await passwordInput.fill('123456');
		await confirmPasswordInput.click();
		await confirmPasswordInput.fill('1234');
		await nameInput.click();
		await expect(confirmPasswordField.locator('mat-error')).toHaveText('Password must match.');
		// NOTE: deviation from the plan's stated reasoning here. The plan says to avoid asserting
		// aria-invalid='true' because Material supposedly doesn't set it in this situation. Verified
		// live: aria-invalid IS 'true' on the Confirm Password input at this point (value '1234',
		// touched, mustMatch error active). We still honor the plan's explicit instruction to not
		// assert aria-invalid here (it directs asserting on the visible mat-error text instead), but
		// the comment reflects what was actually observed rather than the plan's stated rationale.
		await expect(confirmPasswordInput).toHaveClass(/ng-invalid/);
		await expect(confirmPasswordInput).toHaveClass(/ng-touched/);
		await expect(registerButton).toBeDisabled();

		// 4. Clear Confirm Password and type '123456' to match Password exactly, then blur by clicking into the Name field.
		await confirmPasswordInput.click();
		await confirmPasswordInput.fill('123456');
		await nameInput.click();
		await expect(page.getByText('Password must match.')).toHaveCount(0);
		await expect(confirmPasswordField.locator('mat-error')).toHaveCount(0);
		await expect(confirmPasswordField.locator('mat-hint')).toHaveText('6 / 6');

		// 5. Fill the remaining required fields (Name, Last Name, Gender, Phone) with valid values so the entire form becomes valid.
		// NOTE: deviation from the plan's field list. Email is also a required field (Validators.required
		// + Validators.email) that was never filled in steps 1-4, so it must be filled here too, otherwise
		// the form cannot become valid regardless of Name/Last Name/Gender/Phone. The plan's parenthetical
		// list appears to be incomplete; the governing expectation "so the entire form becomes valid" is honored.
		await emailInput.click();
		await emailInput.fill('jane.doe@example.com');
		await nameInput.click();
		await nameInput.fill('Jane');
		await lastNameInput.click();
		await lastNameInput.fill('Doe');
		await genderCombobox.click();
		await page.getByRole('option', { name: 'Male', exact: true }).click();
		await phoneInput.click();
		await phoneInput.fill('(11) 99999-9999');
		await expect(registerButton).toBeEnabled();

		// 6. Without touching the Confirm Password field again, click into the Password field and change its value to '1234567' (still 6+ chars, but no longer equal to Confirm Password's '123456').
		await passwordInput.click();
		await passwordInput.fill('1234567');
		await expect(confirmPasswordField.locator('mat-error')).toHaveText('Password must match.');
		await expect(registerButton).toBeDisabled();

		// 7. Restore Password back to '123456' so it matches Confirm Password again.
		await passwordInput.fill('123456');
		await expect(confirmPasswordField.locator('mat-error')).toHaveCount(0);
		await expect(registerButton).toBeEnabled();
	});
});
