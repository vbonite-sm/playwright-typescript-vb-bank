// ============================================
// Bills API Tests
// ============================================

import { test, expect } from '../../fixtures/api.fixtures';

test.describe('Bills API @api @regression', () => {
  test('should pay electricity bill @smoke @e2e', async ({ userApi }) => {
    // Act
    const response = await userApi.payBill('electricity', 75.5, 'Monthly electricity bill');

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should pay water bill', async ({ userApi }) => {
    // Act
    const response = await userApi.payBill('water', 45, 'Water bill');

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should pay internet bill', async ({ userApi }) => {
    // Act
    const response = await userApi.payBill('internet', 89.99, 'Internet subscription');

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should pay phone bill', async ({ userApi }) => {
    // Act
    const response = await userApi.payBill('phone', 55, 'Phone bill');

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });
});
