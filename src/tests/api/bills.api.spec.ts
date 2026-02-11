import { test } from '../../fixtures/api.fixtures';
import { expectApiSuccess } from '../../helpers';

test.describe('Bills API @api @regression', () => {
  test('should pay electricity bill @smoke @e2e', async ({ userApi }) => {
    const response = await userApi.payBill('electricity', 75.5, 'Monthly electricity bill');

    expectApiSuccess(response);
  });

  test('should pay water bill', async ({ userApi }) => {
    const response = await userApi.payBill('water', 45, 'Water bill');

    expectApiSuccess(response);
  });

  test('should pay internet bill', async ({ userApi }) => {
    const response = await userApi.payBill('internet', 89.99, 'Internet subscription');

    expectApiSuccess(response);
  });

  test('should pay phone bill', async ({ userApi }) => {
    const response = await userApi.payBill('phone', 55, 'Phone bill');

    expectApiSuccess(response);
  });
});
