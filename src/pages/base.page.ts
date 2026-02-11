import { Page } from '@playwright/test';

/**
 * Abstract base class for all page objects.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

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

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
