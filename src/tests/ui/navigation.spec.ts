import { test, expect } from '../../fixtures';

test.describe('Navigation Tests @regression', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  /**
   * Test: All user navigation links are visible.
   */
  test('should display all user navigation links @smoke', async ({ nav }) => {
    // Arrange - dashboard loaded

    // Act - nav auto-renders

    // Assert
    await nav.expectUserNavVisible();
  });

  /**
   * Test: Navigate to Transfer page from sidebar.
   */
  test('should navigate to transfer page', async ({ nav, page }) => {
    // Arrange - on dashboard

    // Act
    await nav.goToTransfer();

    // Assert
    await expect(page).toHaveURL(/.*transfer/);
  });

  /**
   * Test: Navigate to History page.
   */
  test('should navigate to history page', async ({ nav, page }) => {
    // Arrange - on dashboard

    // Act
    await nav.goToHistory();

    // Assert
    await expect(page).toHaveURL(/.*history/);
  });

  /**
   * Test: Navigate to Top Up page.
   */
  test('should navigate to top up page', async ({ nav, page }) => {
    // Arrange - on dashboard

    // Act
    await nav.goToTopUp();

    // Assert
    await expect(page).toHaveURL(/.*top-up/);
  });

  /**
   * Test: Navigate to Bill Pay page.
   */
  test('should navigate to bill pay page', async ({ nav, page }) => {
    // Arrange - on dashboard

    // Act
    await nav.goToBillPay();

    // Assert
    await expect(page).toHaveURL(/.*bill-pay/);
  });

  /**
   * Test: Navigate to Cards page.
   */
  test('should navigate to cards page', async ({ nav, page }) => {
    // Arrange - on dashboard

    // Act
    await nav.goToCards();

    // Assert
    await expect(page).toHaveURL(/.*cards/);
  });

  /**
   * Test: Navigate to Loans page.
   */
  test('should navigate to loans page', async ({ nav, page }) => {
    // Arrange - on dashboard

    // Act
    await nav.goToLoans();

    // Assert
    await expect(page).toHaveURL(/.*loans/);
  });

  /**
   * Test: Navigate to Settings page.
   */
  test('should navigate to settings page', async ({ nav, page }) => {
    // Arrange - on dashboard

    // Act
    await nav.goToSettings();

    // Assert
    await expect(page).toHaveURL(/.*settings/);
  });

  /**
   * Test: Logout redirects to login page.
   */
  test('should logout and redirect to login', async ({ nav, page }) => {
    // Arrange - on dashboard

    // Act
    await nav.logout();

    // Assert
    await expect(page).toHaveURL(/.*login/);
  });

  /**
   * Test: Toggle sidebar.
   */
  test('should toggle sidebar visibility', async ({ nav }) => {
    // Arrange - sidebar is open by default

    // Act
    await nav.toggleSidebar();

    // Assert
    await expect(nav.sidebarToggle).toBeVisible();
  });
});
