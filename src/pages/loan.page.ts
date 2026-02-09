import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoanPage - Page Object for the Loan Application wizard.
 */
export class LoanPage extends BasePage {
  // ----- Locators -----
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly submitButton: Locator;
  readonly amountInput: Locator;
  readonly termInput: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.nextButton = page.getByTestId('btn-next');
    this.backButton = page.getByTestId('btn-back');
    this.submitButton = page.getByTestId('btn-submit');
    this.amountInput = page.getByTestId('input-amount');
    this.termInput = page.getByTestId('input-term');
    this.errorAlert = page.getByTestId('alert-error');
    this.successAlert = page.getByTestId('alert-success');
  }

  // ----- Actions -----
  async goto(): Promise<void> {
    await this.navigateTo('/loans');
  }

  async selectLoanType(loanTypeId: string): Promise<void> {
    await this.page.getByTestId(`loan-type-${loanTypeId}`).click();
  }

  async fillLoanDetails(amount: string, term: string): Promise<void> {
    await this.amountInput.fill(amount);
    await this.termInput.fill(term);
  }

  async goToNextStep(): Promise<void> {
    await this.nextButton.click();
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }

  async submitApplication(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Complete loan application flow: Select type → Fill details → Review → Submit
   */
  async applyForLoan(loanTypeId: string, amount: string, term: string): Promise<void> {
    // Step 1: Select loan type
    await this.selectLoanType(loanTypeId);
    await this.goToNextStep();

    // Step 2: Fill details
    await this.fillLoanDetails(amount, term);
    await this.goToNextStep();

    // Step 3: Review & Submit
    await this.submitApplication();
  }

  getLoanApplication(index: number): Locator {
    return this.page.getByTestId('loan-application').nth(index);
  }

  // ----- Assertions -----
  async expectPageLoaded(): Promise<void> {
    await expect(this.page.getByTestId('step-1')).toBeVisible();
  }

  async expectApplicationSuccess(): Promise<void> {
    await expect(this.successAlert).toBeVisible();
  }

  async expectApplicationError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
  }

  async expectStep(stepNumber: number): Promise<void> {
    await expect(this.page.getByTestId(`step-${stepNumber}`)).toBeVisible();
  }
}
