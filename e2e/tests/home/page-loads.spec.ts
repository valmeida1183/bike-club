// spec: e2e/specs/home.spec.md
// seed: e2e/seed.authenticated.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('Page loads with the hero, "All classic models" section, and static info blocks', async ({ page }) => {
		// 1. Navigate to http://localhost:4200/account/login, clear localStorage, reload, then fill Email and Password and click Login.
		await page.goto('http://localhost:4200/account/login');
		await page.evaluate(() => localStorage.clear());
		await page.goto('http://localhost:4200/account/login');
		await page.getByRole('textbox', { name: 'Email' }).fill('test3@gmail.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('123456');
		await page.getByRole('button', { name: 'Login' }).click();
		await expect(page).toHaveURL('http://localhost:4200/home');
		await expect(page).toHaveTitle('Bike Club');

		// 2. Inspect the hero section.
		await expect(page.getByRole('heading', { name: 'Join the Ride' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Explore. Connect. Belong.' })).toBeVisible();
		await expect(page.getByText('Since 1962 Building Bikes, Creating Experiences')).toBeVisible();
		const goToShoppingLink = page.getByRole('link', { name: 'Go to Shopping' });
		await expect(goToShoppingLink).toBeVisible();
		await expect(page.locator('.hero-image')).toBeVisible();

		// 3. Inspect the "All classic models" section.
		await expect(page.getByRole('heading', { name: 'All classic models' })).toBeVisible();
		await expect(page.getByText('Combining modern components with classic 50s and 60s design')).toBeVisible();
		await expect(page.locator('.info-images img')).toHaveCount(2);

		// 4. Inspect the four static info-text blocks.
		await expect(page.getByRole('heading', { name: 'Comfort and elegance' })).toBeVisible();
		await expect(page.getByText('The best combination for everyday life')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Durability and robustness' })).toBeVisible();
		await expect(page.getByText('To last for a long time')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Custom build' })).toBeVisible();
		await expect(page.getByText('Choose the model and customize')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'The best components' })).toBeVisible();
		await expect(page.getByText('Excellence in quality')).toBeVisible();
	});
});
