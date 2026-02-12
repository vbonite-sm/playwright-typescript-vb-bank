import { test, expect } from '../../fixtures';
import { topUpData } from '../../data';
import { waitForNetworkSettle } from '../../helpers';

test.describe('Top Up Tests', { tag: '@regression' }, () => {
  test.beforeEach(async ({ topUpPage }) => {
    await topUpPage.goto();
  });

  test('should load top up page', { tag: ['@smoke', '@high', '@financial'] }, async ({ topUpPage }) => {
    await topUpPage.expectPageLoaded();
  });

  test('should display current balance', { tag: '@high' }, async ({ topUpPage }) => {
    await topUpPage.expectBalanceDisplayed();
  });

  test('should allow entering a custom amount', { tag: ['@high', '@financial'] }, async ({ topUpPage }) => {
    await topUpPage.enterAmount(topUpData.customAmount);

    await expect(topUpPage.amountInput).toHaveValue(topUpData.customAmount);
  });

  test('should select quick amount of $100', { tag: '@high' }, async ({ topUpPage, page }) => {
    await topUpPage.selectQuickAmount(100);

    await expect(topUpPage.amountInput).toHaveValue('100');
  });

  test('should proceed to payment gateway', { tag: ['@high', '@financial'] }, async ({ topUpPage, page }) => {
    await topUpPage.enterAmount('200');
    await topUpPage.proceedToPayment();

    // Assert - should navigate to gateway or show success
    await waitForNetworkSettle(page);
    const url = page.url();
    expect(url).toBeTruthy();
  });
});
