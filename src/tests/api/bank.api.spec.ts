import { test, expect } from '../../fixtures/api.fixtures';
import { expectApiSuccess, expectApiArray } from '../../helpers';

test.describe('Bank API @api @regression', () => {
  test.describe('Balance', () => {
    test('should get account balance @smoke', async ({ userApi }) => {
      const response = await userApi.getBalance();

      expectApiSuccess(response);
      expect(response.data.balance).toBeGreaterThanOrEqual(0);
    });

    test('should fail without authentication', async ({ api }) => {
      await expect(async () => {
        await api.getBalance();
      }).rejects.toThrow('No userId provided and not logged in');
    });
  });

  test.describe('Transactions', () => {
    test('should get transactions @smoke', async ({ userApi }) => {
      const response = await userApi.getTransactions();

      expectApiArray(response);
    });

    test('should respect limit parameter', async ({ userApi }) => {
      const response = await userApi.getTransactions(undefined, 5);

      expectApiSuccess(response);
      expect(response.data.length).toBeLessThanOrEqual(5);
    });

    test('should return transactions with correct structure', async ({ userApi }) => {
      const response = await userApi.getTransactions(undefined, 3);

      expectApiSuccess(response);
    });
  });
});
