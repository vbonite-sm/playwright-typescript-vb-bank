import { test, expect } from '../../fixtures';
import { defaultUser, admin } from '../../data';

test.describe('Authentication Tests @regression', () => {
  /**
   * Test: User can log in with valid credentials.
   * AAA Pattern: Arrange → Act → Assert
   */
  test('should login successfully with valid user credentials @smoke @e2e', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login(defaultUser.username, defaultUser.password);

    // Assert
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('balance-amount')).toBeVisible();
  });

  /**
   * Test: Admin can log in and reach admin dashboard.
   */
  test('should login successfully as admin @smoke @e2e', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login(admin.username, admin.password);

    // Assert
    await page.waitForURL('**/admin/dashboard');
    await expect(page.getByTestId('stat-total-users')).toBeVisible();
  });

  /**
   * Test: Login fails with invalid credentials.
   */
  test('should show error for invalid credentials @e2e', async ({ loginPage }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('invalid_user', 'wrong_pass');

    // Assert
    await loginPage.expectErrorMessage('Invalid username or password');
  });

  /**
   * Test: Quick login as user works.
   */
  test('should quick login as user', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.quickLoginAsUser();

    // Assert
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('balance-amount')).toBeVisible();
  });

  /**
   * Test: Quick login as admin works.
   */
  test('should quick login as admin', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.quickLoginAsAdmin();

    // Assert
    await page.waitForURL('**/admin/dashboard');
    await expect(page.getByTestId('stat-total-users')).toBeVisible();
  });

  /**
   * Test: Navigate to register page from login.
   */
  test('should navigate to registration page', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.goToRegister();

    // Assert
    await expect(page).toHaveURL(/.*register/);
  });

  /**
   * Test: All login page elements are visible.
   */
  test('should display all login form elements', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.goto();

    // Assert
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.quickLoginUserButton).toBeVisible();
    await expect(loginPage.quickLoginAdminButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });
});
