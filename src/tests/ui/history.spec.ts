import { test, expect } from '../../fixtures';

test.describe('Transaction History Tests @regression', () => {
  test.beforeEach(async ({ historyPage }) => {
    await historyPage.goto();
  });

  test('should load history page with filter controls @smoke', async ({ historyPage }) => {
    await historyPage.expectPageLoaded();
  });

  test('should display transaction history @e2e', async ({ historyPage }) => {
    await historyPage.expectTransactionsVisible();
  });

  test('should filter transactions by income', async ({ historyPage }) => {
    await historyPage.filterByIncome();

    await expect(historyPage.filterIncome).toBeVisible();
  });

  test('should filter transactions by expense', async ({ historyPage }) => {
    await historyPage.filterByExpense();

    await expect(historyPage.filterExpense).toBeVisible();
  });

  test('should search transactions', async ({ historyPage }) => {
    await historyPage.searchTransactions('Salary');

    await expect(historyPage.searchInput).toHaveValue('Salary');
  });

  test('should have export CSV functionality', async ({ historyPage }) => {
    await expect(historyPage.exportCsvButton).toBeVisible();
  });
});
