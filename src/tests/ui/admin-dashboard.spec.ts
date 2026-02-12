import { test, expect } from '../../fixtures';

test.describe('Admin Dashboard Tests', { tag: ['@regression', '@admin'] }, () => {
  test.beforeEach(async ({ adminDashboardPage }) => {
    await adminDashboardPage.goto();
  });

  test('should display admin dashboard with statistics', { tag: ['@smoke', '@high', '@security'] }, async ({ adminDashboardPage }) => {
    await adminDashboardPage.expectDashboardLoaded();
  });

  test('should display all system statistics', { tag: ['@e2e', '@high'] }, async ({ adminDashboardPage }) => {
    await adminDashboardPage.expectAllStatsVisible();
  });

  test('should show total users count', { tag: '@high' }, async ({ adminDashboardPage }) => {
    const totalUsers = await adminDashboardPage.statTotalUsers.innerText();

    expect(totalUsers).toBeTruthy();
  });

  test('should show total system balance', { tag: '@high' }, async ({ adminDashboardPage }) => {
    const totalBalance = await adminDashboardPage.statTotalBalance.innerText();

    expect(totalBalance).toBeTruthy();
  });
});
