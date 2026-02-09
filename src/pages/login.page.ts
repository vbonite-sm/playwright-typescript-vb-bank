import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoginPage - Page Object for the Login screen.
 */
export class LoginPage extends BasePage {
  // ----- Locators -----
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly quickLoginUserButton: Locator;
  readonly quickLoginAdminButton: Locator;
  readonly registerLink: Locator;
  readonly errorAlert: Locator;
  readonly loginForm: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('input-username');
    this.passwordInput = page.getByTestId('input-password');
    this.loginButton = page.getByTestId('btn-login');
    this.quickLoginUserButton = page.getByTestId('btn-quick-login-user');
    this.quickLoginAdminButton = page.getByTestId('btn-quick-login-admin');
    this.registerLink = page.getByTestId('link-register');
    this.errorAlert = page.getByTestId('alert-error');
    this.loginForm = page.getByTestId('form-login');
  }

  // ----- Actions -----
  async goto(): Promise<void> {
    await this.navigateTo('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async quickLoginAsUser(): Promise<void> {
    await this.quickLoginUserButton.click();
  }

  async quickLoginAsAdmin(): Promise<void> {
    await this.quickLoginAdminButton.click();
  }

  async goToRegister(): Promise<void> {
    await this.registerLink.click();
  }

  // ----- Assertions -----
  async expectToBeOnLoginPage(): Promise<void> {
    await expect(this.loginForm).toBeVisible();
  }

  async expectErrorMessage(message?: string): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    if (message) {
      await expect(this.errorAlert).toContainText(message);
    }
  }
}
