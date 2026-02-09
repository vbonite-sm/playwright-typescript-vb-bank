import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * RegisterPage - Page Object for the Registration screen.
 */
export class RegisterPage extends BasePage {
  // ----- Locators -----
  readonly fullNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page.getByTestId('input-fullname');
    this.usernameInput = page.getByTestId('input-username');
    this.emailInput = page.getByTestId('input-email');
    this.passwordInput = page.getByTestId('input-password');
    this.confirmPasswordInput = page.getByTestId('input-confirm-password');
    this.registerButton = page.getByTestId('btn-register');
    this.loginLink = page.getByTestId('link-login');
    this.errorAlert = page.getByTestId('alert-error');
  }

  // ----- Actions -----
  async goto(): Promise<void> {
    await this.navigateTo('/register');
  }

  async register(
    fullName: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    await this.fullNameInput.fill(fullName);
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.registerButton.click();
  }

  async goToLogin(): Promise<void> {
    await this.loginLink.click();
  }

  // ----- Assertions -----
  async expectToBeOnRegisterPage(): Promise<void> {
    await expect(this.registerButton).toBeVisible();
  }

  async expectErrorMessage(message?: string): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    if (message) {
      await expect(this.errorAlert).toContainText(message);
    }
  }
}
