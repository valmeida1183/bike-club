// e2e/seed.authenticated.spec.ts
//
// Standalone seed for the playwright-cli skill's interactive `--debug=cli` generation workflow.
// Performs a REAL UI login on purpose (works even with `--no-deps`, before any storageState file
// exists). Authenticated specs themselves do NOT use this seed — they use storageState produced by
// e2e/auth/cyclist.setup.ts / e2e/auth/monitor.setup.ts. See e2e/auth/storage-state.ts.
import { test, expect } from '@playwright/test';
import { CYCLIST_CREDENTIALS } from './auth/credentials';

test.describe('Authenticated seed', () => {
	test('seed', async ({ page }) => {
		// 1. Navigate to the login page.
		await page.goto('http://localhost:4200/account/login');

		// 2. Clear localStorage and reload to guarantee a clean, logged-out starting point.
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');

		// 3. Fill Email and Password.
		await page.getByRole('textbox', { name: 'Email' }).fill(CYCLIST_CREDENTIALS.email);
		await page.getByRole('textbox', { name: 'Password' }).fill(CYCLIST_CREDENTIALS.password);

		// 4. Click the Login button.
		await page.getByRole('button', { name: 'Login' }).click();

		// 5. Land on the authenticated /home page.
		await expect(page).toHaveURL('http://localhost:4200/home');
	});
});
