import { test, expect } from '../../fixtures';

test.describe('Dashboard Tests @regression', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  /**
   * Test: Dashboard loads with balance and account info.
   */
  test('should display account balance and account number @smoke @e2e', async ({ dashboardPage }) => {
    // Arrange - page already loaded in beforeEach

    // Act - dashboard auto-loads data

    // Assert
    await dashboardPage.expectDashboardLoaded();
  });

  /**
   * Test: Dashboard statistics are visible.
   */
  test('should display financial statistics @e2e', async ({ dashboardPage }) => {
    // Arrange - page loaded

    // Act - stats auto-load

    // Assert
    await dashboardPage.expectStatsVisible();
  });

  /**
   * Test: Balance displays a monetary value.
   */
  test('should show formatted balance amount', async ({ dashboardPage }) => {
    // Arrange - page loaded

    // Act
    const balance = await dashboardPage.getBalance();

    // Assert
    expect(balance).toContain('$');
  });

  /**
   * Test: Account number is displayed.
   */
  test('should show account number', async ({ dashboardPage }) => {
    // Arrange - page loaded

    // Act
    const accountNumber = await dashboardPage.getAccountNumber();

    // Assert
    expect(accountNumber).toBeTruthy();
    expect(accountNumber.length).toBeGreaterThan(0);
  });

  /**
   * Test: Recent transactions are shown on the dashboard.
   */
  test('should display recent transactions', async ({ dashboardPage }) => {
    // Arrange - page loaded

    // Act - transactions load automatically

    // Assert
    await expect(dashboardPage.getTransactionItem(0)).toBeVisible();
  });
});
