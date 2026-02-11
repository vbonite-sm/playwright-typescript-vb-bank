import { test, expect } from '../../fixtures';

test.describe('Navigation Tests @regression', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('should display all user navigation links @smoke', async ({ nav }) => {
    await nav.expectUserNavVisible();
  });

  test('should navigate to transfer page', async ({ nav, page }) => {
    await nav.goToTransfer();

    await expect(page).toHaveURL(/.*transfer/);
  });

  test('should navigate to history page', async ({ nav, page }) => {
    await nav.goToHistory();

    await expect(page).toHaveURL(/.*history/);
  });

  test('should navigate to top up page', async ({ nav, page }) => {
    await nav.goToTopUp();

    await expect(page).toHaveURL(/.*top-up/);
  });

  test('should navigate to bill pay page', async ({ nav, page }) => {
    await nav.goToBillPay();

    await expect(page).toHaveURL(/.*bill-pay/);
  });

  test('should navigate to cards page', async ({ nav, page }) => {
    await nav.goToCards();

    await expect(page).toHaveURL(/.*cards/);
  });

  test('should navigate to loans page', async ({ nav, page }) => {
    await nav.goToLoans();

    await expect(page).toHaveURL(/.*loans/);
  });

  test('should navigate to settings page', async ({ nav, page }) => {
    await nav.goToSettings();

    await expect(page).toHaveURL(/.*settings/);
  });

  test('should logout and redirect to login', async ({ nav, page }) => {
    await nav.logout();

    await expect(page).toHaveURL(/.*login/);
  });

  test('should toggle sidebar visibility', async ({ nav }) => {
    await nav.toggleSidebar();

    await expect(nav.sidebarToggle).toBeVisible();
  });
});
