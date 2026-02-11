import type { Page, Locator } from '@playwright/test';

/** Build a locator from a dynamic test ID like `page.getByTestId('prefix-value')`. */
export function testIdLocator(
  page: Page,
  prefix: string,
  value: string | number,
): Locator {
  return page.getByTestId(`${prefix}-${value}`);
}

/** Format a number as currency, e.g. `formatCurrency(15000)` → `"$15,000.00"`. */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/** Parse a currency string to a number. Strips non-numeric chars except `.` and `-`. */
export function parseCurrency(value: string): number {
  const cleaned = value.replaceAll(/[^0-9.-]/g, '');
  const parsed = Number.parseFloat(cleaned);
  if (Number.isNaN(parsed)) {
    throw new TypeError(`Cannot parse currency value: "${value}"`);
  }
  return parsed;
}

/** Check whether a string looks like a formatted USD value. */
export function isCurrencyFormat(value: string): boolean {
  return /^\$\s?[\d,]+(\.\d{2})?$/.test(value.trim());
}

/** Format a Date as `YYYY-MM-DD`. */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Date N days ago as `YYYY-MM-DD`. Useful for date-range filters. */
export function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDateISO(date);
}

/** Today as `YYYY-MM-DD`. */
export function today(): string {
  return formatDateISO(new Date());
}

/** Mask a string, showing only the last N chars. Useful for card numbers. */
export function maskString(value: string, visibleChars = 4): string {
  if (value.length <= visibleChars) return value;
  const masked = '*'.repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
}
