import { test, expect } from '../../fixtures';
import { loanData } from '../../data';

test.describe('Loan Application Tests @regression', () => {
  test.beforeEach(async ({ loanPage }) => {
    await loanPage.goto();
  });

  /**
   * Test: Loan page loads with wizard step 1.
   */
  test('should load loan application wizard @smoke', async ({ loanPage }) => {
    // Arrange - page loaded

    // Act - wizard renders

    // Assert
    await loanPage.expectPageLoaded();
    await loanPage.expectStep(1);
  });

  /**
   * Test: Select a loan type and proceed to next step.
   */
  test('should select loan type and advance to step 2 @e2e', async ({ loanPage }) => {
    // Arrange - page loaded at step 1

    // Act
    await loanPage.selectLoanType(loanData.personal.type);
    await loanPage.goToNextStep();

    // Assert
    await loanPage.expectStep(2);
  });

  /**
   * Test: Navigate through all wizard steps.
   */
  test('should navigate through all loan wizard steps', async ({ loanPage }) => {
    // Arrange
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

  /**
   * Test: Go back from step 2 to step 1.
   */
  test('should navigate back from step 2 to step 1', async ({ loanPage }) => {
    // Arrange
    await loanPage.selectLoanType(loanData.personal.type);
    await loanPage.goToNextStep();

    // Act
    await loanPage.goBack();

    // Assert
    await loanPage.expectStep(1);
  });

  /**
   * Test: Submit a complete loan application.
   */
  test('should submit a personal loan application', async ({ loanPage }) => {
    // Arrange
    const { type, amount, term } = loanData.personal;

    // Act
    await loanPage.applyForLoan(type, amount, term);

    // Assert
    await loanPage.expectApplicationSuccess();
  });
});
