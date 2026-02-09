import { test, expect } from '../../fixtures';

test.describe('Admin Dashboard Tests @regression @admin', () => {
  test.beforeEach(async ({ adminDashboardPage }) => {
    await adminDashboardPage.goto();
  });

  /**
   * Test: Admin dashboard loads with system statistics.
   */
  test('should display admin dashboard with statistics @smoke', async ({ adminDashboardPage }) => {
    // Arrange - page loaded

    // Act - stats auto-load

    // Assert
    await adminDashboardPage.expectDashboardLoaded();
  });

  /**
   * Test: All admin statistics are visible.
   */
  test('should display all system statistics @e2e', async ({ adminDashboardPage }) => {
    // Arrange - page loaded

    // Act - data renders

    // Assert
    await adminDashboardPage.expectAllStatsVisible();
  });

  /**
   * Test: Total users stat shows a value.
   */
  test('should show total users count', async ({ adminDashboardPage }) => {
    // Arrange - page loaded

    // Act
    const totalUsers = await adminDashboardPage.statTotalUsers.innerText();

    // Assert
    expect(totalUsers).toBeTruthy();
  });

  /**
   * Test: Total balance stat shows a monetary value.
   */
  test('should show total system balance', async ({ adminDashboardPage }) => {
    // Arrange - page loaded

    // Act
    const totalBalance = await adminDashboardPage.statTotalBalance.innerText();

    // Assert
    expect(totalBalance).toBeTruthy();
  });
});
