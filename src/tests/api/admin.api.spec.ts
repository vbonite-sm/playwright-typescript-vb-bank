import { test, expect } from '../../fixtures/api.fixtures';
import { expectApiSuccess, expectApiError, expectApiArray, expectUnauthorized } from '../../helpers';

test.describe('Admin API @api @regression @admin', () => {
  test('should get system statistics @smoke', async ({ adminApi }) => {
    const response = await adminApi.adminGetSystemStats();

    expectApiSuccess(response);
  });

  test('should get all users @smoke', async ({ adminApi }) => {
    const response = await adminApi.adminGetAllUsers();

    expectApiArray(response);
  });

  test('should get all transactions', async ({ adminApi }) => {
    const response = await adminApi.adminGetAllTransactions();

    expectApiSuccess(response);
  });

  test('should get transactions with limit', async ({ adminApi }) => {
    const response = await adminApi.adminGetAllTransactions(10);

    expectApiSuccess(response);
  });

  test('should verify system stats structure', async ({ adminApi }) => {
    const response = await adminApi.adminGetSystemStats();

    expectApiSuccess(response);
    expect(response.data).toHaveProperty('totalUsers');
    expect(response.data).toHaveProperty('totalBalance');
  });
});

test.describe('Admin API - Extended @api @admin', () => {
  test.describe('User Details', () => {
    test('should get detailed user information', async ({ adminApi }) => {
      // Arrange - first get a user ID from the list
      const usersResponse = await adminApi.adminGetAllUsers();
      expectApiSuccess(usersResponse);
      const userId = usersResponse.data[0]?.id;
      test.skip(!userId, 'No users available');

      const response = await adminApi.adminGetUserDetails(userId!);

      expectApiSuccess(response, 200);
      expect(response.data.id).toBe(userId);
      expect(response.data.username).toBeDefined();
      expect(response.data.email).toBeDefined();
      expect(response.data.fullName).toBeDefined();
    });

    test('should reject getting details for non-existent user', async ({ adminApi }) => {
      const response = await adminApi.adminGetUserDetails('non-existent-user-id');

      expectApiError(response);
    });
  });

  test.describe('Transaction Trends', () => {
    test('should get transaction trends', async ({ adminApi }) => {
      const response = await adminApi.adminGetTransactionTrends();

      expectApiArray(response);

      if (response.data.length > 0) {
        const trend = response.data[0];
        expect(trend.date).toBeDefined();
        expect(typeof trend.volume).toBe('number');
        expect(typeof trend.count).toBe('number');
      }
    });

    test('should get transaction trends for specific days', async ({ adminApi }) => {
      const response = await adminApi.adminGetTransactionTrends(7);

      expectApiArray(response);
    });

    test('should get transaction trends for 30 days', async ({ adminApi }) => {
      const response = await adminApi.adminGetTransactionTrends(30);

      expectApiSuccess(response, 200);
    });
  });

  test.describe('User Search', () => {
    test('should search users by name', async ({ adminApi }) => {
      const response = await adminApi.adminSearchUsers('john');

      expectApiArray(response);
    });

    test('should search users by account number', async ({ adminApi }) => {
      const response = await adminApi.adminSearchUsers('1234567890');

      expectApiArray(response);
    });

    test('should return empty for non-matching search', async ({ adminApi }) => {
      const response = await adminApi.adminSearchUsers('nonexistentuserxyz123');

      expectApiArray(response);
      expect(response.data.length).toBe(0);
    });
  });

  test.describe('User Activity', () => {
    test('should get user activity logs', async ({ adminApi }) => {
      // Arrange - get a user ID first
      const usersResponse = await adminApi.adminGetAllUsers();
      expectApiArray(usersResponse);
      const userId = usersResponse.data[0]?.id;
      test.skip(!userId, 'No users available');

      const response = await adminApi.adminGetUserActivity(userId!);

      // Assert - API may return activity or empty object
      expectApiSuccess(response, 200);
    });
  });
});

test.describe('Admin API - Security @api @admin @security', () => {
  test('should reject admin operations without authentication', async ({ api }) => {
    await api.init();
    await api.clearAuth();

    const response = await api.adminGetAllUsers();

    expectUnauthorized(response);
  });
});
