import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class UserManagementPage extends BasePage {
  readonly searchInput: Locator;
  readonly closeModalButton: Locator;
  readonly userDetailsModal: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('input-search-users');
    this.closeModalButton = page.getByTestId('btn-close-modal');
    this.userDetailsModal = page.getByTestId('user-details-modal');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/admin/users');
  }

  async searchUsers(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  getUserRow(index: number): Locator {
    return this.page.getByTestId(`user-row-${index}`);
  }

  getViewUserButton(index: number): Locator {
    return this.page.getByTestId(`btn-view-user-${index}`);
  }

  /** View user details by row index (0-based). */
  async viewUserDetailsByIndex(index: number): Promise<void> {
    await this.getViewUserButton(index).click();
    await this.userDetailsModal.waitFor({ state: 'visible' });
  }

  /** @deprecated Use `viewUserDetailsByIndex` instead. */
  async viewUserDetails(userId: string): Promise<void> {
    await this.viewUserDetailsByIndex(0);
  }

  async closeModal(): Promise<void> {
    await this.closeModalButton.click();
    await this.userDetailsModal.waitFor({ state: 'hidden' });
  }

  getModalTransaction(index: number): Locator {
    return this.page.getByTestId(`modal-transaction-${index}`);
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
  }

  async expectUsersVisible(): Promise<void> {
    await expect(this.getUserRow(0)).toBeVisible();
  }

  async expectModalVisible(): Promise<void> {
    await expect(this.userDetailsModal).toBeVisible();
  }

  async expectModalClosed(): Promise<void> {
    await expect(this.userDetailsModal).not.toBeVisible();
  }

  async expectModalTransactionsVisible(): Promise<void> {
    await expect(this.getModalTransaction(0)).toBeVisible();
  }
}
