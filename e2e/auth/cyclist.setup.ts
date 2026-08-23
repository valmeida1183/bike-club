import { test as setup, expect } from '@playwright/test';
import { CYCLIST_CREDENTIALS } from './credentials';
import { CYCLIST_STORAGE_STATE } from './storage-state';

setup('authenticate as Cyclist', async ({ page }) => {
	await page.goto('http://localhost:4200/account/login');
	await page.evaluate(() => localStorage.clear());
	await page.goto('http://localhost:4200/account/login');

	await page.getByRole('textbox', { name: 'Email' }).fill(CYCLIST_CREDENTIALS.email);
	await page.getByRole('textbox', { name: 'Password' }).fill(CYCLIST_CREDENTIALS.password);
	await page.getByRole('button', { name: 'Login' }).click();

	await expect(page).toHaveURL('http://localhost:4200/home');
	await page.context().storageState({ path: CYCLIST_STORAGE_STATE });
});
