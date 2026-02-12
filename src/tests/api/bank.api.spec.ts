import { test, expect } from '../../fixtures/api.fixtures';
import { expectApiSuccess, expectApiArray } from '../../helpers';

test.describe('Bank API', { tag: ['@api', '@regression'] }, () => {
  test.describe('Balance', () => {
    test('should get account balance', { tag: ['@smoke', '@high', '@financial'] }, async ({ userApi }) => {
      const response = await userApi.getBalance();

      expectApiSuccess(response);
      expect(response.data.balance).toBeGreaterThanOrEqual(0);
    });

    test('should fail without authentication', { tag: ['@high', '@security'] }, async ({ api }) => {
      await expect(async () => {
        await api.getBalance();
      }).rejects.toThrow('No userId provided and not logged in');
    });
  });

  test.describe('Transactions', () => {
    test('should get transactions', { tag: ['@smoke', '@medium'] }, async ({ userApi }) => {
      const response = await userApi.getTransactions();

      expectApiArray(response);
    });

    test('should respect limit parameter', { tag: '@medium' }, async ({ userApi }) => {
      const response = await userApi.getTransactions(undefined, 5);

      expectApiSuccess(response);
      expect(response.data.length).toBeLessThanOrEqual(5);
    });

    test('should return transactions with correct structure', { tag: '@low' }, async ({ userApi }) => {
      const response = await userApi.getTransactions(undefined, 3);

      expectApiSuccess(response);
    });
  });
});
