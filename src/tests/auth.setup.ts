import { test as setup, expect } from '@playwright/test';
import { defaultUser, admin } from '../data';
import { LoginPage } from '../pages';
import path from 'node:path';
import fs from 'node:fs';

const storageDir = path.resolve(__dirname, '../../storage-state');

// Ensure storage-state directory exists
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const userFile = path.join(storageDir, 'user.json');
const adminFile = path.join(storageDir, 'admin.json');

setup('authenticate as user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(defaultUser.username, defaultUser.password);

  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page.getByTestId('balance-amount')).toBeVisible();

  await page.context().storageState({ path: userFile });
});

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(admin.username, admin.password);

  await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
  await expect(page.getByTestId('stat-total-users')).toBeVisible();

  await page.context().storageState({ path: adminFile });
});
