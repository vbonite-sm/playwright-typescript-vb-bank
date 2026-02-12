import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: Number.parseInt(process.env.RETRIES || '1'),
  workers: Number.parseInt(process.env.WORKERS || '2'),
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
    ['./src/reporters/json-log.reporter.ts'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://vb-bank-demo.vercel.app',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: Number.parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    navigationTimeout: Number.parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
  },

  expect: {
    timeout: Number.parseInt(process.env.EXPECT_TIMEOUT || '10000'),
  },

  projects: [
    // Setup project: authenticates and saves storage state
    {
      name: 'user-setup',
      testMatch: /.*\.setup\.ts/,
    },

    // ========================================================================
    // RISK-BASED TEST PROJECTS
    // ========================================================================

    // CRITICAL tests - Must pass before any deployment
    {
      name: 'critical',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/user.json',
      },
      dependencies: ['user-setup'],
      testIgnore: /.*\.setup\.ts/,
      grep: /@critical/,
      retries: 2,
      timeout: 120000,
    },

    // HIGH risk tests - Run before staging/production deploys
    {
      name: 'high-risk',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/user.json',
      },
      dependencies: ['user-setup'],
      testIgnore: /.*\.setup\.ts/,
      grep: /@high/,
      retries: 1,
    },

    // MEDIUM risk tests - Run in nightly regression
    {
      name: 'medium-risk',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/user.json',
      },
      dependencies: ['user-setup'],
      testIgnore: /.*\.setup\.ts/,
      grep: /@medium/,
    },

    // LOW risk tests - Run weekly or before major releases
    {
      name: 'low-risk',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/user.json',
      },
      dependencies: ['user-setup'],
      testIgnore: /.*\.setup\.ts/,
      grep: /@low/,
    },

    // FINANCIAL tests - All money-related operations
    {
      name: 'financial',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/user.json',
      },
      dependencies: ['user-setup'],
      testIgnore: /.*\.setup\.ts/,
      grep: /@financial/,
      retries: 2,
    },

    // SECURITY tests - Authentication, authorization, data protection
    {
      name: 'security',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/user.json',
      },
      dependencies: ['user-setup'],
      testIgnore: /.*\.setup\.ts/,
      grep: /@security/,
      retries: 2,
    },

    // COMPLIANCE tests - Regulatory requirements
    {
      name: 'compliance',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/user.json',
      },
      dependencies: ['user-setup'],
      testIgnore: /.*\.setup\.ts/,
      grep: /@compliance/,
    },

    // ========================================================================
    // STANDARD PROJECTS (Original)
    // ========================================================================

    // Chrome tests with authenticated user state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/user.json',
      },
      dependencies: ['user-setup'],
      testIgnore: /.*admin.*|.*auth\.spec.*|.*\.api\.spec.*/,
    },

    // Admin tests with admin state
    {
      name: 'admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './storage-state/admin.json',
      },
      dependencies: ['user-setup'],
      testMatch: /.*admin.*/,
      testIgnore: /.*\.api\.spec\.ts/,
    },

    // Auth tests (no pre-existing state)
    {
      name: 'auth',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /.*auth\.spec\.ts/,
    },

    // API tests — use browser context for Service Worker access
    {
      name: 'api',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /.*\.api\.spec\.ts/,
    },
  ],
});
