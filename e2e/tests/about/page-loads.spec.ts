// spec: e2e/specs/about.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('About Page Content', () => {
	test('Page loads with the "About" heading, banner image, and body copy', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage, reload, then fill Email and Password and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');

		// 2. Click the 'About' nav link.
		await page.getByRole('link', { name: 'About' }).click();
		await expect(page).toHaveURL('http://localhost:4200/about');
		await expect(page).toHaveTitle('Bike Club');

		// 3. Inspect the page heading.
		await expect(page.getByRole('heading', { name: 'About', level: 1 })).toBeVisible();

		// 4. Inspect the image column.
		await expect(page.getByRole('figure', { name: 'Bike Art' })).toBeVisible();
		await expect(page.getByRole('img', { name: 'vintage dark red' })).toBeVisible();

		// 5. Inspect the text column.
		await expect(page.getByRole('heading', { name: 'More than just a store', level: 2 })).toBeVisible();
		await expect(
			page.getByText('Welcome to Bycicle Club, where passion meets craftsmanship.'),
		).toBeVisible();
		await expect(
			page.getByText('At Bycicle Club, we believe that a bicycle is more than just a means of transportation'),
		).toBeVisible();
		await expect(
			page.getByText('Beyond our store, Bycicle Club is also a community.'),
		).toBeVisible();
	});
});
