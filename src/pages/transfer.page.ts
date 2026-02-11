import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class TransferPage extends BasePage {
  readonly recipientAccountInput: Locator;
  readonly amountInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitTransferButton: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.recipientAccountInput = page.getByTestId('input-recipient-account');
    this.amountInput = page.getByTestId('input-amount');
    this.descriptionInput = page.getByTestId('input-description');
    this.submitTransferButton = page.getByTestId('btn-submit-transfer');
    this.errorAlert = page.getByTestId('alert-error');
    this.successAlert = page.getByTestId('alert-success');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/transfer');
  }

  async fillTransferForm(
    recipientAccount: string,
    amount: string,
    description: string,
  ): Promise<void> {
    await this.recipientAccountInput.fill(recipientAccount);
    await this.amountInput.fill(amount);
    await this.descriptionInput.fill(description);
  }

  async submitTransfer(): Promise<void> {
    await this.submitTransferButton.click();
  }

  async transferMoney(
    recipientAccount: string,
    amount: string,
    description: string,
  ): Promise<void> {
    await this.fillTransferForm(recipientAccount, amount, description);
    await this.submitTransfer();
  }

  getSearchResult(index: number): Locator {
    return this.page.getByTestId(`search-result-${index}`);
  }

  async expectTransferSuccess(): Promise<void> {
    await expect(this.successAlert).toBeVisible();
  }

  async expectTransferError(message?: string): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    if (message) {
      await expect(this.errorAlert).toContainText(message);
    }
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.recipientAccountInput).toBeVisible();
    await expect(this.amountInput).toBeVisible();
    await expect(this.submitTransferButton).toBeVisible();
  }
}
