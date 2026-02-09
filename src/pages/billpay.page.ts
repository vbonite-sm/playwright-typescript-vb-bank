import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * BillPayPage - Page Object for the Bill Pay screen.
 */
export class BillPayPage extends BasePage {
  // ----- Locators -----
  readonly amountInput: Locator;
  readonly descriptionInput: Locator;
  readonly accountNumberInput: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.getByTestId('input-amount');
    this.descriptionInput = page.getByTestId('input-description');
    this.accountNumberInput = page.getByTestId('input-account-number');
    this.errorAlert = page.getByTestId('alert-error');
    this.successAlert = page.getByTestId('alert-success');
  }

  // ----- Actions -----
  async goto(): Promise<void> {
    await this.navigateTo('/bill-pay');
  }

  async selectProvider(providerName: string): Promise<void> {
    await this.page.getByText(providerName).click();
  }

  async selectPaymentMethod(method: 'account' | 'card'): Promise<void> {
    await this.page.getByRole('radio', { name: new RegExp(method, 'i') }).check();
  }

  async fillBillDetails(accountNumber: string, amount: string, description?: string): Promise<void> {
    await this.accountNumberInput.fill(accountNumber);
    await this.amountInput.fill(amount);
    if (description) {
      await this.descriptionInput.fill(description);
    }
  }

  // ----- Assertions -----
  async expectPageLoaded(): Promise<void> {
    await expect(this.page.locator('.bill-pay-page, .billpay-page')).toBeVisible();
  }

  async expectPaymentSuccess(): Promise<void> {
    await expect(this.successAlert).toBeVisible();
  }

  async expectPaymentError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
  }
}
