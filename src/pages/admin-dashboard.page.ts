import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminDashboardPage extends BasePage {
  readonly statTotalUsers: Locator;
  readonly statTotalBalance: Locator;
  readonly statTotalTransactions: Locator;
  readonly statTotalDeposits: Locator;

  constructor(page: Page) {
    super(page);
    this.statTotalUsers = page.getByTestId('stat-total-users');
    this.statTotalBalance = page.getByTestId('stat-total-balance');
    this.statTotalTransactions = page.getByTestId('stat-total-transactions');
    this.statTotalDeposits = page.getByTestId('stat-total-deposits');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/admin/dashboard');
  }

  async expectDashboardLoaded(): Promise<void> {
    await expect(this.statTotalUsers).toBeVisible();
    await expect(this.statTotalBalance).toBeVisible();
  }

  async expectAllStatsVisible(): Promise<void> {
    await expect(this.statTotalUsers).toBeVisible();
    await expect(this.statTotalBalance).toBeVisible();
    await expect(this.statTotalTransactions).toBeVisible();
    await expect(this.statTotalDeposits).toBeVisible();
  }
}
