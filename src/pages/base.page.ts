import { Page } from '@playwright/test';

/**
 * BasePage - Abstract base class for all page objects.
 * Provides shared navigation and utility methods.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // ----- Navigation Helpers -----
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // ----- Common Element Helpers -----
  async getAlertSuccess(): Promise<string> {
    const alert = this.page.getByTestId('alert-success');
    await alert.waitFor({ state: 'visible' });
    return alert.innerText();
  }

  async getAlertError(): Promise<string> {
    const alert = this.page.getByTestId('alert-error');
    await alert.waitFor({ state: 'visible' });
    return alert.innerText();
  }

  async isAlertSuccessVisible(): Promise<boolean> {
    return this.page.getByTestId('alert-success').isVisible();
  }

  async isAlertErrorVisible(): Promise<boolean> {
    return this.page.getByTestId('alert-error').isVisible();
  }

  // ----- URL Helpers -----
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
