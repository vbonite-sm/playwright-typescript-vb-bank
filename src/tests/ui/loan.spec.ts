import { test, expect } from '../../fixtures';
import { loanData } from '../../data';

test.describe('Loan Application Tests', { tag: '@regression' }, () => {
  test.beforeEach(async ({ loanPage }) => {
    await loanPage.goto();
  });

  test('should load loan application wizard', { tag: ['@smoke', '@high', '@compliance'] }, async ({ loanPage }) => {
    await loanPage.expectPageLoaded();
    await loanPage.expectStep(1);
  });

  test('should select loan type and advance to step 2', { tag: ['@e2e', '@high', '@compliance'] }, async ({ loanPage }) => {
    await loanPage.selectLoanType(loanData.personal.type);
    await loanPage.goToNextStep();

    await loanPage.expectStep(2);
  });

  test('should navigate through all loan wizard steps', { tag: ['@high', '@compliance'] }, async ({ loanPage }) => {
    const { type, amount, term } = loanData.personal;

    // Act - Step 1: Select type
    await loanPage.selectLoanType(type);
    await loanPage.goToNextStep();

    // Act - Step 2: Fill details
    await loanPage.fillLoanDetails(amount, term);
    await loanPage.goToNextStep();

    // Assert - Step 3: Review page
    await loanPage.expectStep(3);
    await expect(loanPage.submitButton).toBeVisible();
  });

  test('should navigate back from step 2 to step 1', { tag: '@medium' }, async ({ loanPage }) => {
    await loanPage.selectLoanType(loanData.personal.type);
    await loanPage.goToNextStep();

    await loanPage.goBack();

    await loanPage.expectStep(1);
  });

  test('should submit a personal loan application', { tag: ['@high', '@compliance', '@e2e'] }, async ({ loanPage }) => {
    const { type, amount, term } = loanData.personal;

    await loanPage.applyForLoan(type, amount, term);

    await loanPage.expectApplicationSuccess();
  });
});
