import { test, expect } from '../../fixtures';

test.describe('Dashboard Tests', { tag: '@regression' }, () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('should display account balance and account number', { tag: ['@smoke', '@e2e', '@medium'] }, async ({ dashboardPage }) => {
    await dashboardPage.expectDashboardLoaded();
  });

  test('should display financial statistics', { tag: ['@e2e', '@medium'] }, async ({ dashboardPage }) => {
    await dashboardPage.expectStatsVisible();
  });

  test('should show formatted balance amount', { tag: '@medium' }, async ({ dashboardPage }) => {
    const balance = await dashboardPage.getBalance();

    expect(balance).toContain('$');
  });

  test('should show account number', { tag: '@medium' }, async ({ dashboardPage }) => {
    const accountNumber = await dashboardPage.getAccountNumber();

    expect(accountNumber).toBeTruthy();
    expect(accountNumber.length).toBeGreaterThan(0);
  });

  test('should display recent transactions', { tag: '@medium' }, async ({ dashboardPage }) => {
    await expect(dashboardPage.getTransactionItem(0)).toBeVisible();
  });
});
