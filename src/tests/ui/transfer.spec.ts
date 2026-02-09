import { test, expect } from '../../fixtures';
import { transferData, transferRecipients } from '../../data';

test.describe('Money Transfer Tests @regression', () => {
  test.beforeEach(async ({ transferPage }) => {
    await transferPage.goto();
  });

  /**
   * Test: Transfer page loads correctly.
   */
  test('should load transfer page with all form elements @smoke', async ({ transferPage }) => {
    // Arrange - page loaded in beforeEach

    // Act - page renders

    // Assert
    await transferPage.expectPageLoaded();
  });

  /**
   * Test: Successful money transfer to another user.
   */
  test('should transfer money successfully @smoke @e2e', async ({ transferPage }) => {
    // Arrange
    const { recipientAccount, amount, description } = transferData.valid;

    // Act
    await transferPage.transferMoney(recipientAccount, amount, description);

    // Assert
    await transferPage.expectTransferSuccess();
  });

  /**
   * Test: Transfer form can be filled step by step.
   */
  test('should fill transfer form with recipient details @e2e', async ({ transferPage }) => {
    // Arrange
    const recipient = transferRecipients.janeSmith;

    // Act
    await transferPage.fillTransferForm(recipient.accountNumber, '250', 'Payment to Jane');

    // Assert
    await expect(transferPage.recipientAccountInput).toHaveValue(recipient.accountNumber);
    await expect(transferPage.amountInput).toHaveValue('250');
    await expect(transferPage.descriptionInput).toHaveValue('Payment to Jane');
  });

  /**
   * Test: Transfer with large amount.
   */
  test('should handle large transfer amounts', async ({ transferPage }) => {
    // Arrange
    const { recipientAccount, amount, description } = transferData.largeAmount;

    // Act
    await transferPage.transferMoney(recipientAccount, amount, description);

    // Assert
    await transferPage.expectTransferSuccess();
  });
});
