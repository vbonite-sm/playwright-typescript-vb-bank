import type { Page } from '@playwright/test';

/** Options for polling and retry operations. */
export interface RetryOptions {
  timeout?: number;
  interval?: number;
  /** Human-readable label for error messages. */
  description?: string;
}

/** Poll an async function until it returns truthy or times out. Use instead of `waitForTimeout`. */
export async function pollUntil<T>(
  fn: () => Promise<T | null | undefined | false>,
  options: RetryOptions = {},
): Promise<T> {
  const { timeout = 10000, interval = 500, description = 'condition' } = options;
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    const result = await fn();
    if (result) return result;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Timed out after ${timeout}ms waiting for ${description}`);
}

/** Retry an async operation that may throw, with configurable timeout. */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { timeout = 10000, interval = 1000, description = 'operation' } = options;
  const deadline = Date.now() + timeout;
  let lastError: Error | undefined;

  while (Date.now() < deadline) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      await new Promise((resolve) => setTimeout(resolve, Math.min(interval, remaining)));
    }
  }

  throw new Error(
    `Retry failed after ${timeout}ms for ${description}: ${lastError?.message}`,
  );
}

/** Wait for navigation to a URL pattern. */
export async function waitForNavigation(
  page: Page,
  urlPattern: string | RegExp,
  options: { timeout?: number } = {},
): Promise<void> {
  const { timeout = 15000 } = options;
  await page.waitForURL(urlPattern, { timeout });
}

/** Wait for network activity to settle. Preferred over arbitrary `waitForTimeout` calls. */
export async function waitForNetworkSettle(
  page: Page,
  options: { timeout?: number } = {},
): Promise<void> {
  const { timeout = 10000 } = options;
  await page.waitForLoadState('networkidle', { timeout });
}
