import { test } from '../../fixtures/api.fixtures';
import { expectApiSuccess } from '../../helpers';

test.describe('Bills API', { tag: ['@api', '@regression'] }, () => {
  test('should pay electricity bill', { tag: ['@smoke', '@e2e', '@high', '@financial'] }, async ({ userApi }) => {
    const response = await userApi.payBill('electricity', 75.5, 'Monthly electricity bill');

    expectApiSuccess(response);
  });

  test('should pay water bill', { tag: ['@high', '@financial'] }, async ({ userApi }) => {
    const response = await userApi.payBill('water', 45, 'Water bill');

    expectApiSuccess(response);
  });

  test('should pay internet bill', { tag: ['@high', '@financial'] }, async ({ userApi }) => {
    const response = await userApi.payBill('internet', 89.99, 'Internet subscription');

    expectApiSuccess(response);
  });

  test('should pay phone bill', { tag: ['@high', '@financial'] }, async ({ userApi }) => {
    const response = await userApi.payBill('phone', 55, 'Phone bill');

    expectApiSuccess(response);
  });
});
