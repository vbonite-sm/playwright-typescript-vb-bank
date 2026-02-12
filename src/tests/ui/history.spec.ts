import { test, expect } from '../../fixtures';

test.describe('Transaction History Tests', { tag: '@regression' }, () => {
  test.beforeEach(async ({ historyPage }) => {
    await historyPage.goto();
  });

  test('should load history page with filter controls', { tag: ['@smoke', '@medium', '@compliance'] }, async ({ historyPage }) => {
    await historyPage.expectPageLoaded();
  });

  test('should display transaction history', { tag: ['@e2e', '@medium', '@compliance'] }, async ({ historyPage }) => {
    await historyPage.expectTransactionsVisible();
  });

  test('should filter transactions by income', { tag: '@medium' }, async ({ historyPage }) => {
    await historyPage.filterByIncome();

    await expect(historyPage.filterIncome).toBeVisible();
  });

  test('should filter transactions by expense', { tag: '@medium' }, async ({ historyPage }) => {
    await historyPage.filterByExpense();

    await expect(historyPage.filterExpense).toBeVisible();
  });

  test('should search transactions', { tag: ['@medium', '@compliance'] }, async ({ historyPage }) => {
    await historyPage.searchTransactions('Salary');

    await expect(historyPage.searchInput).toHaveValue('Salary');
  });

  test('should have export CSV functionality', { tag: ['@medium', '@compliance'] }, async ({ historyPage }) => {
    await expect(historyPage.exportCsvButton).toBeVisible();
  });
});
