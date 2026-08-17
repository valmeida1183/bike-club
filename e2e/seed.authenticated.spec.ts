// e2e/seed.authenticated.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authenticated seed', () => {
	test('seed', async ({ page }) => {
		// 1. Navigate to the login page.
		await page.goto('http://localhost:4200/account/login');

		// 2. Clear localStorage and reload to guarantee a clean, logged-out starting point.
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');

		// 3. Fill Email and Password.
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');

		// 4. Click the Login button.
		await page.getByRole('button', { name: 'Login' }).click();

		// 5. Land on the authenticated /home page.
		await expect(page).toHaveURL('http://localhost:4200/home');
	});
});
