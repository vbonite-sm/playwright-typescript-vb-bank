// ============================================
// Transfer API Tests
// ============================================

import { test, expect } from '../../fixtures/api.fixtures';
import { transferRecipients } from '../../data/credentials';

test.describe('Transfer API @api @regression', () => {
  test('should transfer money to another user @smoke @e2e', async ({ userApi }) => {
    // Arrange
    const recipient = transferRecipients.janeSmith;
    const amount = 50;
    const description = 'Test transfer';

    // Act
    const response = await userApi.transfer(recipient.accountNumber, amount, description);

    // Assert
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should fail transfer with insufficient balance', async ({ userApi }) => {
    // Arrange - try to transfer more than balance
    const recipient = transferRecipients.janeSmith;
    const amount = 999999999;

    // Act
    const response = await userApi.transfer(recipient.accountNumber, amount, 'Large transfer');

    // Assert
    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
  });

  test('should fail transfer to invalid account', async ({ userApi }) => {
    // Act
    const response = await userApi.transfer('0000000000', 10, 'Test');

    // Assert
    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
  });
});
