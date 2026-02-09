// ============================================
// Loans API Tests
// ============================================

import { test, expect } from '../../fixtures/api.fixtures';

test.describe('Loans API @api @regression', () => {
  test('should apply for a personal loan @smoke @e2e', async ({ userApi }) => {
    // Act - loan types are prefixed with 'loan_'
    const response = await userApi.applyForLoan('loan_personal', 5000, 12);

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.loanType).toBe('loan_personal');
  });

  test('should apply for a home loan', async ({ userApi }) => {
    // Act
    const response = await userApi.applyForLoan('loan_home', 200000, 360);

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.loanType).toBe('loan_home');
  });

  test('should reject invalid loan type', async ({ userApi }) => {
    // Act
    const response = await userApi.applyForLoan('invalid_type', 5000, 12);

    // Assert
    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('BAD_REQUEST');
    expect(response.error?.message).toBe('Invalid loan type');
  });
});
