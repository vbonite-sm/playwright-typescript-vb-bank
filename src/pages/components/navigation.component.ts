import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class NavigationComponent extends BasePage {
  readonly dashboardLink: Locator;
  readonly transferLink: Locator;
  readonly historyLink: Locator;
  readonly topUpLink: Locator;
  readonly billPayLink: Locator;
  readonly cardsLink: Locator;
  readonly loanLink: Locator;
  readonly settingsLink: Locator;
  readonly logoutButton: Locator;
  readonly sidebarToggle: Locator;
  readonly adminDashboardLink: Locator;
  readonly adminUsersLink: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardLink = page.getByTestId('nav-link-dashboard');
    this.transferLink = page.getByTestId('nav-link-transfer');
    this.historyLink = page.getByTestId('nav-link-history');
    this.topUpLink = page.getByTestId('nav-link-top-up');
    this.billPayLink = page.getByTestId('nav-link-bills-payment');
    this.cardsLink = page.getByTestId('nav-link-cards');
    this.loanLink = page.getByTestId('nav-link-loans');
    this.settingsLink = page.getByTestId('nav-link-settings');
    this.logoutButton = page.getByTestId('btn-logout');
    this.sidebarToggle = page.getByTestId('btn-sidebar-toggle');
    this.adminDashboardLink = page.getByTestId('nav-link-dashboard');
    this.adminUsersLink = page.getByTestId('nav-link-user-management');
  }

  async goToDashboard(): Promise<void> {
    await this.dashboardLink.click();
  }

  async goToTransfer(): Promise<void> {
    await this.transferLink.click();
  }

  async goToHistory(): Promise<void> {
    await this.historyLink.click();
  }

  async goToTopUp(): Promise<void> {
    await this.topUpLink.click();
  }

  async goToBillPay(): Promise<void> {
    await this.billPayLink.click();
  }

  async goToCards(): Promise<void> {
    await this.cardsLink.click();
  }

  async goToLoans(): Promise<void> {
    await this.loanLink.click();
  }

  async goToSettings(): Promise<void> {
    await this.settingsLink.click();
  }

  async goToAdminDashboard(): Promise<void> {
    await this.adminDashboardLink.click();
  }

  async goToAdminUsers(): Promise<void> {
    await this.adminUsersLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async toggleSidebar(): Promise<void> {
    await this.sidebarToggle.click();
  }

  async expectUserNavVisible(): Promise<void> {
    await expect(this.dashboardLink).toBeVisible();
    await expect(this.transferLink).toBeVisible();
    await expect(this.historyLink).toBeVisible();
  }

  async expectAdminNavVisible(): Promise<void> {
    await expect(this.adminDashboardLink).toBeVisible();
    await expect(this.adminUsersLink).toBeVisible();
  }
}
