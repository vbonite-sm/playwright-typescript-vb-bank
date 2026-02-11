import { expect } from '@playwright/test';
import type { ApiResponse } from '../api/client/api.client';

/** Assert success and narrow `response.data` to non-null via `asserts`. */
export function expectApiSuccess<T>(
  response: ApiResponse<T>,
  expectedStatus?: number,
): asserts response is ApiResponse<T> & { data: T } {
  expect(response.success).toBe(true);
  if (expectedStatus !== undefined) {
    expect(response.status).toBe(expectedStatus);
  }
  expect(response.data).toBeDefined();
}

/** Assert failure. Optionally checks status code and error code. */
export function expectApiError(
  response: ApiResponse<unknown>,
  expectedStatus?: number,
  expectedCode?: string,
): void {
  expect(response.success).toBe(false);
  expect(response.error).toBeDefined();
  if (expectedStatus !== undefined) {
    expect(response.status).toBe(expectedStatus);
  }
  if (expectedCode !== undefined) {
    expect(response.error?.code).toBe(expectedCode);
  }
}

/** Assert success + data is an array. Optionally validates length constraints. */
export function expectApiArray<T>(
  response: ApiResponse<T[]>,
  options?: { minLength?: number; maxLength?: number },
): asserts response is ApiResponse<T[]> & { data: T[] } {
  expectApiSuccess(response);
  expect(Array.isArray(response.data)).toBe(true);
  if (options?.minLength !== undefined) {
    expect(response.data.length).toBeGreaterThanOrEqual(options.minLength);
  }
  if (options?.maxLength !== undefined) {
    expect(response.data.length).toBeLessThanOrEqual(options.maxLength);
  }
}

/** Shorthand for 401 UNAUTHORIZED assertion. */
export function expectUnauthorized(response: ApiResponse<unknown>): void {
  expectApiError(response, 401, 'UNAUTHORIZED');
}
