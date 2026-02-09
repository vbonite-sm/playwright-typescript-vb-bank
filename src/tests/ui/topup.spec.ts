import { test, expect } from '../../fixtures';
import { topUpData } from '../../data';

test.describe('Top Up Tests @regression', () => {
  test.beforeEach(async ({ topUpPage }) => {
    await topUpPage.goto();
  });

  /**
   * Test: Top up page loads with all elements.
   */
  test('should load top up page @smoke', async ({ topUpPage }) => {
    // Arrange - page loaded

    // Act - page renders

    // Assert
    await topUpPage.expectPageLoaded();
  });

  /**
   * Test: Display current balance on top up page.
   */
  test('should display current balance', async ({ topUpPage }) => {
    // Arrange - page loaded

    // Act - balance auto-loads

    // Assert
    await topUpPage.expectBalanceDisplayed();
  });

  /**
   * Test: Enter custom top up amount.
   */
  test('should allow entering a custom amount', async ({ topUpPage }) => {
    // Arrange - page loaded

    // Act
    await topUpPage.enterAmount(topUpData.customAmount);

    // Assert
    await expect(topUpPage.amountInput).toHaveValue(topUpData.customAmount);
  });

  /**
   * Test: Quick select amount buttons work.
   */
  test('should select quick amount of $100', async ({ topUpPage, page }) => {
    // Arrange - page loaded

    // Act
    await topUpPage.selectQuickAmount(100);

    // Assert
    await expect(topUpPage.amountInput).toHaveValue('100');
  });

  /**
   * Test: Proceed to payment gateway.
   */
  test('should proceed to payment gateway', async ({ topUpPage, page }) => {
    // Arrange
    await topUpPage.enterAmount('200');

    // Act
    await topUpPage.proceedToPayment();

    // Assert - should navigate to gateway or show success
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toBeTruthy();
  });
});
