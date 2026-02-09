// ============================================
// Bank API Tests - Balance & Transactions
// ============================================

import { test, expect } from '../../fixtures/api.fixtures';

test.describe('Bank API @api @regression', () => {
  test.describe('Balance', () => {
    test('should get account balance @smoke', async ({ userApi }) => {
      // Act
      const response = await userApi.getBalance();

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data!.balance).toBeGreaterThanOrEqual(0);
    });

    test('should fail without authentication', async ({ api }) => {
      // Act - try to get balance without logging in
      await expect(async () => {
        await api.getBalance();
      }).rejects.toThrow('No userId provided and not logged in');
    });
  });

  test.describe('Transactions', () => {
    test('should get transactions @smoke', async ({ userApi }) => {
      // Act
      const response = await userApi.getTransactions();

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should respect limit parameter', async ({ userApi }) => {
      // Act
      const response = await userApi.getTransactions(undefined, 5);

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data!.length).toBeLessThanOrEqual(5);
    });

    test('should return transactions with correct structure', async ({ userApi }) => {
      // Act
      const response = await userApi.getTransactions(undefined, 3);

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });
  });
});
