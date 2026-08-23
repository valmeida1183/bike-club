import { test as setup, expect } from '@playwright/test';
import { MONITOR_CREDENTIALS } from './credentials';
import { MONITOR_STORAGE_STATE } from './storage-state';

setup('authenticate as Monitor', async ({ page }) => {
	await page.goto('http://localhost:4200/account/login');
	await page.evaluate(() => localStorage.clear());
	await page.goto('http://localhost:4200/account/login');

	await page.getByRole('textbox', { name: 'Email' }).fill(MONITOR_CREDENTIALS.email);
	await page.getByRole('textbox', { name: 'Password' }).fill(MONITOR_CREDENTIALS.password);
	await page.getByRole('button', { name: 'Login' }).click();

	await expect(page).toHaveURL('http://localhost:4200/home');
	await page.context().storageState({ path: MONITOR_STORAGE_STATE });
});
