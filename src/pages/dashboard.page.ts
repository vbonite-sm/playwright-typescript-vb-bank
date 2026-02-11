import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly balanceAmount: Locator;
  readonly accountNumber: Locator;
  readonly statDeposits: Locator;
  readonly statTransfers: Locator;
  readonly statTransactions: Locator;
  readonly refreshRatesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.balanceAmount = page.getByTestId('balance-amount');
    this.accountNumber = page.getByTestId('account-number');
    this.statDeposits = page.getByTestId('stat-total-deposits');
    this.statTransfers = page.getByTestId('stat-total-transfers-out');
    this.statTransactions = page.getByTestId('stat-total-transactions');
    this.refreshRatesButton = page.getByTestId('btn-refresh-rates');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/dashboard');
  }

  async refreshCurrencyRates(): Promise<void> {
    await this.refreshRatesButton.click();
  }

  async getBalance(): Promise<string> {
    return this.balanceAmount.innerText();
  }

  async getAccountNumber(): Promise<string> {
    return this.accountNumber.innerText();
  }

  getTransactionItem(index: number): Locator {
    return this.page.getByTestId(`transaction-item-${index}`);
  }

  getCurrencyRate(code: string): Locator {
    return this.page.getByTestId(`currency-rate-${code}`);
  }

  async expectDashboardLoaded(): Promise<void> {
    await expect(this.balanceAmount).toBeVisible();
    await expect(this.accountNumber).toBeVisible();
  }

  async expectBalanceVisible(): Promise<void> {
    await expect(this.balanceAmount).toBeVisible();
  }

  async expectStatsVisible(): Promise<void> {
    await expect(this.statDeposits).toBeVisible();
    await expect(this.statTransfers).toBeVisible();
    await expect(this.statTransactions).toBeVisible();
  }
}
