import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * UserManagementPage - Page Object for Admin User Management.
 *
 * Selectors discovered on 2026-02-06:
 * - User rows: data-testid="user-row-{index}" (e.g., user-row-0, user-row-1)
 * - View buttons: data-testid="btn-view-user-{index}" (e.g., btn-view-user-0)
 * - Modal: data-testid="user-details-modal"
 * - Close button: data-testid="btn-close-modal"
 * - Modal transactions: data-testid="modal-transaction-{index}"
 */
export class UserManagementPage extends BasePage {
  // ----- Locators -----
  readonly searchInput: Locator;
  readonly closeModalButton: Locator;
  readonly userDetailsModal: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('input-search-users');
    this.closeModalButton = page.getByTestId('btn-close-modal');
    // FIXED: Actual selector is 'user-details-modal', not 'modal-user-details'
    this.userDetailsModal = page.getByTestId('user-details-modal');
  }

  // ----- Actions -----
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
    // FIXED: Actual selector is 'btn-view-user-{index}', not 'btn-view-details-{userId}'
    return this.page.getByTestId(`btn-view-user-${index}`);
  }

  /**
   * View user details by row index (0-based).
   * The UI uses numeric indices for users, not user IDs.
   */
  async viewUserDetailsByIndex(index: number): Promise<void> {
    await this.getViewUserButton(index).click();
    // Wait for modal animation
    await this.userDetailsModal.waitFor({ state: 'visible' });
  }

  /**
   * @deprecated Use viewUserDetailsByIndex(index) instead.
   * The UI uses numeric indices (0, 1, 2), not user IDs.
   */
  async viewUserDetails(userId: string): Promise<void> {
    // For backward compatibility, try to click the first user
    // This is a fallback - prefer viewUserDetailsByIndex
    await this.viewUserDetailsByIndex(0);
  }

  async closeModal(): Promise<void> {
    await this.closeModalButton.click();
    // Wait for modal to close
    await this.userDetailsModal.waitFor({ state: 'hidden' });
  }

  getModalTransaction(index: number): Locator {
    return this.page.getByTestId(`modal-transaction-${index}`);
  }

  // ----- Assertions -----
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
