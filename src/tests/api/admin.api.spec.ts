// ============================================
// Admin API Tests
// ============================================

import { test, expect } from '../../fixtures/api.fixtures';

test.describe('Admin API @api @regression @admin', () => {
  test('should get system statistics @smoke', async ({ adminApi }) => {
    // Act
    const response = await adminApi.adminGetSystemStats();

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should get all users @smoke', async ({ adminApi }) => {
    // Act
    const response = await adminApi.adminGetAllUsers();

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should get all transactions', async ({ adminApi }) => {
    // Act
    const response = await adminApi.adminGetAllTransactions();

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should get transactions with limit', async ({ adminApi }) => {
    // Act
    const response = await adminApi.adminGetAllTransactions(10);

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should verify system stats structure', async ({ adminApi }) => {
    // Act
    const response = await adminApi.adminGetSystemStats();

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('totalUsers');
    expect(response.data).toHaveProperty('totalBalance');
  });
});

test.describe('Admin API - Extended @api @admin', () => {
  test.describe('User Details', () => {
    test('should get detailed user information', async ({ adminApi }) => {
      // Arrange - first get a user ID from the list
      const usersResponse = await adminApi.adminGetAllUsers();
      expect(usersResponse.success).toBe(true);
      const userId = usersResponse.data?.[0]?.id;
      test.skip(!userId, 'No users available');

      // Act
      const response = await adminApi.adminGetUserDetails(userId!);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data?.id).toBe(userId);
      expect(response.data?.username).toBeDefined();
      expect(response.data?.email).toBeDefined();
      expect(response.data?.fullName).toBeDefined();
    });

    test('should reject getting details for non-existent user', async ({ adminApi }) => {
      // Act
      const response = await adminApi.adminGetUserDetails('non-existent-user-id');

      // Assert
      expect(response.success).toBe(false);
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.error).toBeDefined();
    });
  });

  test.describe('Transaction Trends', () => {
    test('should get transaction trends', async ({ adminApi }) => {
      // Act
      const response = await adminApi.adminGetTransactionTrends();

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data && response.data.length > 0) {
        const trend = response.data[0];
        expect(trend.date).toBeDefined();
        expect(typeof trend.volume).toBe('number');
        expect(typeof trend.count).toBe('number');
      }
    });

    test('should get transaction trends for specific days', async ({ adminApi }) => {
      // Act
      const response = await adminApi.adminGetTransactionTrends(7);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should get transaction trends for 30 days', async ({ adminApi }) => {
      // Act
      const response = await adminApi.adminGetTransactionTrends(30);

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
    });
  });

  test.describe('User Search', () => {
    test('should search users by name', async ({ adminApi }) => {
      // Act
      const response = await adminApi.adminSearchUsers('john');

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should search users by account number', async ({ adminApi }) => {
      // Act
      const response = await adminApi.adminSearchUsers('1234567890');

      // Assert
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should return empty for non-matching search', async ({ adminApi }) => {
      // Act
      const response = await adminApi.adminSearchUsers('nonexistentuserxyz123');

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data?.length).toBe(0);
    });
  });

  test.describe('User Activity', () => {
    test('should get user activity logs', async ({ adminApi }) => {
      // Arrange - get a user ID first
      const usersResponse = await adminApi.adminGetAllUsers();
      const userId = usersResponse.data?.[0]?.id;
      test.skip(!userId, 'No users available');

      // Act
      const response = await adminApi.adminGetUserActivity(userId!);

      // Assert - API may return activity or empty object
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });
  });
});

test.describe('Admin API - Security @api @admin @security', () => {
  test('should reject admin operations without authentication', async ({ api }) => {
    // Arrange
    await api.init();
    await api.clearAuth();

    // Act
    const response = await api.adminGetAllUsers();

    // Assert
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
  });
});
