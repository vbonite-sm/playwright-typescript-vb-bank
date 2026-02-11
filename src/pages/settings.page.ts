import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SettingsPage extends BasePage {
  readonly profileTab: Locator;
  readonly passwordTab: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly saveProfileButton: Locator;

  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly changePasswordButton: Locator;

  readonly errorAlert: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.profileTab = page.getByTestId('tab-profile');
    this.passwordTab = page.getByTestId('tab-password');
    this.fullNameInput = page.getByTestId('input-fullname');
    this.emailInput = page.getByTestId('input-email');
    this.phoneInput = page.getByTestId('input-phone');
    this.saveProfileButton = page.getByTestId('btn-save-profile');
    this.currentPasswordInput = page.getByTestId('input-current-password');
    this.newPasswordInput = page.getByTestId('input-new-password');
    this.confirmPasswordInput = page.getByTestId('input-confirm-password');
    this.changePasswordButton = page.getByTestId('btn-change-password');
    this.errorAlert = page.getByTestId('alert-error');
    this.successAlert = page.getByTestId('alert-success');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/settings');
  }

  async switchToProfileTab(): Promise<void> {
    await this.profileTab.click();
  }

  async switchToPasswordTab(): Promise<void> {
    await this.passwordTab.click();
  }

  async updateProfile(fullName: string, email: string, phone: string): Promise<void> {
    await this.fullNameInput.clear();
    await this.fullNameInput.fill(fullName);
    await this.emailInput.clear();
    await this.emailInput.fill(email);
    await this.phoneInput.clear();
    await this.phoneInput.fill(phone);
    await this.saveProfileButton.click();
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    await this.switchToPasswordTab();
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.changePasswordButton.click();
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page.locator('.settings-page')).toBeVisible();
  }

  async expectUpdateSuccess(): Promise<void> {
    await expect(this.successAlert).toBeVisible();
  }

  async expectUpdateError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
  }
}
