import { test, expect } from '../../fixtures';
import { defaultUser, admin } from '../../data';

// Clear storage state so auth tests start logged out
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication Tests', { tag: '@regression' }, () => {
  test('should login successfully with valid user credentials', { tag: ['@smoke', '@e2e', '@critical', '@security'] }, async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(defaultUser.username, defaultUser.password);

    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('balance-amount')).toBeVisible();
  });

  test('should login successfully as admin', { tag: ['@smoke', '@e2e', '@critical', '@security'] }, async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(admin.username, admin.password);

    await page.waitForURL('**/admin/dashboard');
    await expect(page.getByTestId('stat-total-users')).toBeVisible();
  });

  test('should show error for invalid credentials', { tag: ['@e2e', '@critical', '@security'] }, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid_user', 'wrong_pass');

    await loginPage.expectErrorMessage('Invalid username or password');
  });

  test('should quick login as user', { tag: '@medium' }, async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.quickLoginAsUser();

    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('balance-amount')).toBeVisible();
  });

  test('should quick login as admin', { tag: ['@medium', '@security'] }, async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.quickLoginAsAdmin();

    await page.waitForURL('**/admin/dashboard');
    await expect(page.getByTestId('stat-total-users')).toBeVisible();
  });

  test('should navigate to registration page', { tag: '@low' }, async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.goToRegister();

    await expect(page).toHaveURL(/.*register/);
  });

  test('should display all login form elements', { tag: '@low' }, async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.quickLoginUserButton).toBeVisible();
    await expect(loginPage.quickLoginAdminButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });
});
