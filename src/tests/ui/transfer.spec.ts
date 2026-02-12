import { test, expect } from '../../fixtures';
import { transferData, transferRecipients } from '../../data';

test.describe('Money Transfer Tests', { tag: '@regression' }, () => {
  test.beforeEach(async ({ transferPage }) => {
    await transferPage.goto();
  });

  test('should load transfer page with all form elements', { tag: ['@smoke', '@high'] }, async ({ transferPage }) => {
    await transferPage.expectPageLoaded();
  });

  test('should transfer money successfully', { tag: ['@smoke', '@e2e', '@critical', '@financial'] }, async ({ transferPage }) => {
    const { recipientAccount, amount, description } = transferData.valid;

    await transferPage.transferMoney(recipientAccount, amount, description);

    await transferPage.expectTransferSuccess();
  });

  test('should fill transfer form with recipient details', { tag: ['@e2e', '@medium'] }, async ({ transferPage }) => {
    const recipient = transferRecipients.janeSmith;

    await transferPage.fillTransferForm(recipient.accountNumber, '250', 'Payment to Jane');

    await expect(transferPage.recipientAccountInput).toHaveValue(recipient.accountNumber);
    await expect(transferPage.amountInput).toHaveValue('250');
    await expect(transferPage.descriptionInput).toHaveValue('Payment to Jane');
  });

  test('should handle large transfer amounts', { tag: ['@high', '@financial'] }, async ({ transferPage }) => {
    const { recipientAccount, amount, description } = transferData.largeAmount;

    await transferPage.transferMoney(recipientAccount, amount, description);

    await transferPage.expectTransferSuccess();
  });
});
