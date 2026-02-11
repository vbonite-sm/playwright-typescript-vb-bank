import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HistoryPage extends BasePage {
  readonly filterAll: Locator;
  readonly filterIncome: Locator;
  readonly filterExpense: Locator;
  readonly searchInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly minAmountInput: Locator;
  readonly maxAmountInput: Locator;
  readonly clearFiltersButton: Locator;
  readonly exportCsvButton: Locator;

  constructor(page: Page) {
    super(page);
    this.filterAll = page.getByTestId('filter-btn-all');
    this.filterIncome = page.getByTestId('filter-btn-income');
    this.filterExpense = page.getByTestId('filter-btn-expense');
    this.searchInput = page.getByTestId('input-search');
    this.startDateInput = page.getByTestId('input-start-date');
    this.endDateInput = page.getByTestId('input-end-date');
    this.minAmountInput = page.getByTestId('input-min-amount');
    this.maxAmountInput = page.getByTestId('input-max-amount');
    this.clearFiltersButton = page.getByTestId('btn-clear-filters');
    this.exportCsvButton = page.getByTestId('btn-export-csv');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/history');
  }

  async filterByAll(): Promise<void> {
    await this.filterAll.click();
  }

  async filterByIncome(): Promise<void> {
    await this.filterIncome.click();
  }

  async filterByExpense(): Promise<void> {
    await this.filterExpense.click();
  }

  async searchTransactions(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async exportCsv(): Promise<void> {
    await this.exportCsvButton.click();
  }

  async setDateRange(startDate: string, endDate: string): Promise<void> {
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async setAmountRange(minAmount: string, maxAmount: string): Promise<void> {
    await this.minAmountInput.fill(minAmount);
    await this.maxAmountInput.fill(maxAmount);
  }

  async clearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
  }

  getTransactionRow(index: number): Locator {
    return this.page.getByTestId(`transaction-row-${index}`);
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.filterAll).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async expectTransactionsVisible(): Promise<void> {
    await expect(this.getTransactionRow(0)).toBeVisible();
  }
}
