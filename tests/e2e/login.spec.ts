import { test, expect } from '@playwright/test';

test('login and see landing widgets', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@band.app');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForURL('**/landing');
  await expect(page.getByRole('region', { name: 'System Status' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'System Health' })).toBeVisible();
});
