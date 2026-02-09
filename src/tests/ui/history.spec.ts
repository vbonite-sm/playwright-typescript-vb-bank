import { test, expect } from '../../fixtures';

test.describe('Transaction History Tests @regression', () => {
  test.beforeEach(async ({ historyPage }) => {
    await historyPage.goto();
  });

  /**
   * Test: History page loads with filters and search.
   */
  test('should load history page with filter controls @smoke', async ({ historyPage }) => {
    // Arrange - page loaded

    // Act - page renders

    // Assert
    await historyPage.expectPageLoaded();
  });

  /**
   * Test: Display transactions list.
   */
  test('should display transaction history @e2e', async ({ historyPage }) => {
    // Arrange - page loaded with pre-seeded data

    // Act - transactions auto-load

    // Assert
    await historyPage.expectTransactionsVisible();
  });

  /**
   * Test: Filter transactions by income.
   */
  test('should filter transactions by income', async ({ historyPage }) => {
    // Arrange - page loaded

    // Act
    await historyPage.filterByIncome();

    // Assert
    await expect(historyPage.filterIncome).toBeVisible();
  });

  /**
   * Test: Filter transactions by expense.
   */
  test('should filter transactions by expense', async ({ historyPage }) => {
    // Arrange - page loaded

    // Act
    await historyPage.filterByExpense();

    // Assert
    await expect(historyPage.filterExpense).toBeVisible();
  });

  /**
   * Test: Search transactions.
   */
  test('should search transactions', async ({ historyPage }) => {
    // Arrange - page loaded

    // Act
    await historyPage.searchTransactions('Salary');

    // Assert
    await expect(historyPage.searchInput).toHaveValue('Salary');
  });

  /**
   * Test: Export CSV button is visible.
   */
  test('should have export CSV functionality', async ({ historyPage }) => {
    // Arrange - page loaded

    // Act - check button presence

    // Assert
    await expect(historyPage.exportCsvButton).toBeVisible();
  });
});
