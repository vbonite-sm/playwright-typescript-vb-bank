import { test, expect } from '../../fixtures';

test.describe('Admin Dashboard Tests @regression @admin', () => {
  test.beforeEach(async ({ adminDashboardPage }) => {
    await adminDashboardPage.goto();
  });

  test('should display admin dashboard with statistics @smoke', async ({ adminDashboardPage }) => {
    await adminDashboardPage.expectDashboardLoaded();
  });

  test('should display all system statistics @e2e', async ({ adminDashboardPage }) => {
    await adminDashboardPage.expectAllStatsVisible();
  });

  test('should show total users count', async ({ adminDashboardPage }) => {
    const totalUsers = await adminDashboardPage.statTotalUsers.innerText();

    expect(totalUsers).toBeTruthy();
  });

  test('should show total system balance', async ({ adminDashboardPage }) => {
    const totalBalance = await adminDashboardPage.statTotalBalance.innerText();

    expect(totalBalance).toBeTruthy();
  });
});
