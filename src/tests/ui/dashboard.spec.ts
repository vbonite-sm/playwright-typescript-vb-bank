import { test, expect } from '../../fixtures';

test.describe('Dashboard Tests @regression', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('should display account balance and account number @smoke @e2e', async ({ dashboardPage }) => {
    await dashboardPage.expectDashboardLoaded();
  });

  test('should display financial statistics @e2e', async ({ dashboardPage }) => {
    await dashboardPage.expectStatsVisible();
  });

  test('should show formatted balance amount', async ({ dashboardPage }) => {
    const balance = await dashboardPage.getBalance();

    expect(balance).toContain('$');
  });

  test('should show account number', async ({ dashboardPage }) => {
    const accountNumber = await dashboardPage.getAccountNumber();

    expect(accountNumber).toBeTruthy();
    expect(accountNumber.length).toBeGreaterThan(0);
  });

  test('should display recent transactions', async ({ dashboardPage }) => {
    await expect(dashboardPage.getTransactionItem(0)).toBeVisible();
  });
});
