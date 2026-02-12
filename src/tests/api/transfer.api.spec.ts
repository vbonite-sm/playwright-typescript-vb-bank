import { test } from '../../fixtures/api.fixtures';
import { transferRecipients } from '../../data/credentials';
import { expectApiSuccess, expectApiError } from '../../helpers';

test.describe('Transfer API', { tag: ['@api', '@regression'] }, () => {
  test('should transfer money to another user', { tag: ['@smoke', '@e2e', '@critical', '@financial'] }, async ({ userApi }) => {
    const recipient = transferRecipients.janeSmith;
    const amount = 50;
    const description = 'Test transfer';

    const response = await userApi.transfer(recipient.accountNumber, amount, description);

    expectApiSuccess(response);
  });

  test('should fail transfer with insufficient balance', { tag: ['@critical', '@financial'] }, async ({ userApi }) => {
    // Arrange - try to transfer more than balance
    const recipient = transferRecipients.janeSmith;
    const amount = 999999999;

    const response = await userApi.transfer(recipient.accountNumber, amount, 'Large transfer');

    expectApiError(response);
  });

  test('should fail transfer to invalid account', { tag: ['@critical', '@financial'] }, async ({ userApi }) => {
    const response = await userApi.transfer('0000000000', 10, 'Test');

    expectApiError(response);
  });
});
