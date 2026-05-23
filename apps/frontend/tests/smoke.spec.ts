import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page).toHaveTitle(/Memora AI/);
});

test('login form exists', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.getByPlaceholder('Email')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
