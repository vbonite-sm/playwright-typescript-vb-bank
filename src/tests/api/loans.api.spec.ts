import { test, expect } from '../../fixtures/api.fixtures';
import { expectApiSuccess, expectApiError } from '../../helpers';

test.describe('Loans API', { tag: ['@api', '@regression'] }, () => {
  test('should apply for a personal loan', { tag: ['@smoke', '@e2e', '@high', '@financial', '@compliance'] }, async ({ userApi }) => {
    // Act - loan types are prefixed with 'loan_'
    const response = await userApi.applyForLoan('loan_personal', 5000, 12);

    expectApiSuccess(response);
    expect(response.data.loanType).toBe('loan_personal');
  });

  test('should apply for a home loan', { tag: ['@high', '@financial', '@compliance'] }, async ({ userApi }) => {
    const response = await userApi.applyForLoan('loan_home', 200000, 360);

    expectApiSuccess(response);
    expect(response.data.loanType).toBe('loan_home');
  });

  test('should reject invalid loan type', { tag: '@medium' }, async ({ userApi }) => {
    const response = await userApi.applyForLoan('invalid_type', 5000, 12);

    expectApiError(response);
    expect(response.error?.code).toBe('BAD_REQUEST');
    expect(response.error?.message).toBe('Invalid loan type');
  });
});
