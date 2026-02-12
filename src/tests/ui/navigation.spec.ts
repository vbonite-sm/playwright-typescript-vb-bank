import { test, expect } from '../../fixtures';

test.describe('Navigation Tests', { tag: '@regression' }, () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('should display all user navigation links', { tag: ['@smoke', '@low'] }, async ({ nav }) => {
    await nav.expectUserNavVisible();
  });

  test('should navigate to transfer page', { tag: '@low' }, async ({ nav, page }) => {
    await nav.goToTransfer();

    await expect(page).toHaveURL(/.*transfer/);
  });

  test('should navigate to history page', { tag: '@low' }, async ({ nav, page }) => {
    await nav.goToHistory();

    await expect(page).toHaveURL(/.*history/);
  });

  test('should navigate to top up page', { tag: '@low' }, async ({ nav, page }) => {
    await nav.goToTopUp();

    await expect(page).toHaveURL(/.*top-up/);
  });

  test('should navigate to bill pay page', { tag: '@low' }, async ({ nav, page }) => {
    await nav.goToBillPay();

    await expect(page).toHaveURL(/.*bill-pay/);
  });

  test('should navigate to cards page', { tag: '@low' }, async ({ nav, page }) => {
    await nav.goToCards();

    await expect(page).toHaveURL(/.*cards/);
  });

  test('should navigate to loans page', { tag: '@low' }, async ({ nav, page }) => {
    await nav.goToLoans();

    await expect(page).toHaveURL(/.*loans/);
  });

  test('should navigate to settings page', { tag: '@low' }, async ({ nav, page }) => {
    await nav.goToSettings();

    await expect(page).toHaveURL(/.*settings/);
  });

  test('should logout and redirect to login', { tag: ['@critical', '@security'] }, async ({ nav, page }) => {
    await nav.logout();

    await expect(page).toHaveURL(/.*login/);
  });

  test('should toggle sidebar visibility', { tag: '@low' }, async ({ nav }) => {
    await nav.toggleSidebar();

    await expect(nav.sidebarToggle).toBeVisible();
  });
});
