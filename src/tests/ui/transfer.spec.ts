import { test, expect } from '../../fixtures';
import { transferData, transferRecipients } from '../../data';

test.describe('Money Transfer Tests @regression', () => {
  test.beforeEach(async ({ transferPage }) => {
    await transferPage.goto();
  });

  test('should load transfer page with all form elements @smoke', async ({ transferPage }) => {
    await transferPage.expectPageLoaded();
  });

  test('should transfer money successfully @smoke @e2e', async ({ transferPage }) => {
    const { recipientAccount, amount, description } = transferData.valid;

    await transferPage.transferMoney(recipientAccount, amount, description);

    await transferPage.expectTransferSuccess();
  });

  test('should fill transfer form with recipient details @e2e', async ({ transferPage }) => {
    const recipient = transferRecipients.janeSmith;

    await transferPage.fillTransferForm(recipient.accountNumber, '250', 'Payment to Jane');

    await expect(transferPage.recipientAccountInput).toHaveValue(recipient.accountNumber);
    await expect(transferPage.amountInput).toHaveValue('250');
    await expect(transferPage.descriptionInput).toHaveValue('Payment to Jane');
  });

  test('should handle large transfer amounts', async ({ transferPage }) => {
    const { recipientAccount, amount, description } = transferData.largeAmount;

    await transferPage.transferMoney(recipientAccount, amount, description);

    await transferPage.expectTransferSuccess();
  });
});
