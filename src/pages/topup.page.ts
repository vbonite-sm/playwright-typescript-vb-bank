import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * TopUpPage - Page Object for the Top Up screen.
 */
export class TopUpPage extends BasePage {
  // ----- Locators -----
  readonly amountInput: Locator;
  readonly proceedButton: Locator;
  readonly currentBalance: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.getByTestId('input-amount');
    this.proceedButton = page.getByTestId('btn-proceed');
    this.currentBalance = page.getByTestId('current-balance');
    this.errorAlert = page.getByTestId('alert-error');
    this.successAlert = page.getByTestId('alert-success');
  }

  // ----- Actions -----
  async goto(): Promise<void> {
    await this.navigateTo('/top-up');
  }

  async enterAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async selectQuickAmount(amount: 50 | 100 | 250 | 500): Promise<void> {
    await this.page.getByTestId(`btn-quick-${amount}`).click();
  }

  async proceedToPayment(): Promise<void> {
    await this.proceedButton.click();
  }

  async topUpWithAmount(amount: string): Promise<void> {
    await this.enterAmount(amount);
    await this.proceedToPayment();
  }

  // ----- Assertions -----
  async expectPageLoaded(): Promise<void> {
    await expect(this.amountInput).toBeVisible();
    await expect(this.proceedButton).toBeVisible();
  }

  async expectBalanceDisplayed(): Promise<void> {
    await expect(this.currentBalance).toBeVisible();
  }

  async expectTopUpSuccess(): Promise<void> {
    await expect(this.successAlert).toBeVisible();
  }

  async expectTopUpError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
  }
}
