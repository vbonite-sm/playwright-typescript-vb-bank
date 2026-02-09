// ============================================
// API Test Fixtures for VB Bank Mock API
// ============================================
// Provides pre-configured ApiClient instances for API tests.
// - `api`: A bare API client (no auth). Use for auth endpoint tests.
// - `userApi`: Authenticated as default user (john.doe).
// - `adminApi`: Authenticated as admin.
// ============================================

import { test as base, expect } from '@playwright/test';
import { ApiClient } from '../api';
import { defaultUser, admin } from '../data/credentials';

type ApiFixtures = {
  /** Un-authenticated API client — initialized with SW but no token */
  api: ApiClient;
  /** API client authenticated as the default user (john.doe) */
  userApi: ApiClient;
  /** API client authenticated as admin */
  adminApi: ApiClient;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ page }, use) => {
    const client = new ApiClient(page);
    await client.init();
    await use(client);
  },

  userApi: async ({ page }, use) => {
    const client = new ApiClient(page);
    await client.init();
    const loginResponse = await client.login(defaultUser.username, defaultUser.password);
    expect(loginResponse.success).toBe(true);
    await use(client);
  },

  adminApi: async ({ page }, use) => {
    const client = new ApiClient(page);
    await client.init();
    const loginResponse = await client.login(admin.username, admin.password);
    expect(loginResponse.success).toBe(true);
    await use(client);
  },
});

export { expect } from '@playwright/test';
