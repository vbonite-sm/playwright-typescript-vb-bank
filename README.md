# VB Bank - Playwright Test Automation Framework

![Risk-Based Tests](https://github.com/vbonite-sm/playwright-typescript-vb-bank/actions/workflows/risk-based.yml/badge.svg)
![Playwright Tests](https://github.com/vbonite-sm/playwright-typescript-vb-bank/actions/workflows/playwright.yml/badge.svg)
![Nightly Regression](https://github.com/vbonite-sm/playwright-typescript-vb-bank/actions/workflows/regression-schedule.yml/badge.svg)

A production-grade Playwright + TypeScript test automation framework for the [VB Bank Demo](https://vb-bank-demo.vercel.app/) application.

## 📁 Project Structure

```
playwright-typescript-vb-bank/
├── src/
│   ├── api/                 # API testing infrastructure
│   │   ├── client/          # API client for mock REST API
│   │   │   └── api.client.ts
│   │   └── types/           # TypeScript types for API responses
│   │       └── api.types.ts
│   ├── config/              # Environment & app configuration
│   │   └── env.config.ts
│   ├── data/                # Test data & credentials management
│   │   ├── credentials.ts   # User/admin credentials
│   │   └── test-data.ts     # Feature-specific test data
│   ├── fixtures/            # Custom Playwright fixtures
│   │   ├── page.fixtures.ts # Page Object injection fixtures
│   │   └── api.fixtures.ts  # API client fixtures
│   ├── helpers/             # Shared utilities & assertion helpers
│   │   ├── api-assertions.ts   # expectApiSuccess, expectApiError, etc.
│   │   ├── data-generators.ts  # uniqueId, randomUsername, randomAmount, etc.
│   │   ├── format.helpers.ts   # formatCurrency, parseCurrency, maskString, etc.
│   │   ├── wait.helpers.ts     # pollUntil, retryAsync, waitForNetworkSettle
│   │   ├── logger.ts           # Zero-dependency structured JSONL logger
│   │   └── index.ts            # Barrel export
│   ├── pages/               # Page Object Models (POM)
│   │   ├── base.page.ts     # Abstract base page
│   │   ├── login.page.ts
│   │   ├── dashboard.page.ts
│   │   ├── transfer.page.ts
│   │   ├── ... (other pages)
│   │   └── components/
│   │       └── navigation.component.ts
│   ├── reporters/           # Custom Playwright reporters
│   │   └── json-log.reporter.ts  # Structured test lifecycle logger
│   └── tests/               # Test specs (AAA pattern)
│       ├── auth.setup.ts    # Auth state setup
│       ├── ui/              # UI/Functional tests (9 suites)
│       └── api/             # API tests (9 suites)
├── storage-state/           # Saved auth states (gitignored)
├── test-logs/               # Structured JSONL logs (gitignored)
├── global-setup.ts          # Pre-run health checks & artifact cleanup
├── global-teardown.ts       # Post-run summary & log archiving
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
npx playwright install chromium
```

### Configure Environment
Copy `.env.example` to `.env` and adjust values if needed:
```bash
cp .env.example .env
```

## 🧪 Running Tests

### Standard Test Commands

| Command | Description |
|---|---|
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:regression` | Run regression tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:api-only` | Run API tests only |
| `npm run test:ui-only` | Run UI tests only |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Debug mode with inspector |
| `npm run test:auth` | Run auth setup project |
| `npm run test:user` | Run user (chromium) project |
| `npm run test:admin` | Run admin project |
| `npm run test:api` | Run API project |
| `npm run report` | Open HTML test report |

### 🎯 Risk-Based Testing (NEW)

Tests are prioritized by business impact, security, and compliance requirements:

| Command | Tests | Duration | When to Run |
|---------|-------|----------|-------------|
| `npm run test:critical` | 10 | ~35s | Every commit (deployment gate) |
| `npm run test:pre-deploy` | 18 | ~55s | Before staging/production |
| `npm run test:high` | 8 | ~20s | Pre-release validation |
| `npm run test:financial` | All financial | Varies | Money operations |
| `npm run test:security` | All security | Varies | Auth/authorization |
| `npm run risk:report` | N/A | N/A | Generate risk report |

**Risk Tags:**
- `@critical` - Must pass before deployment (auth, transfers, bills)
- `@high` - High-impact features (loans, top-up, admin)
- `@medium` - Supporting features (history, dashboard)
- `@low` - UI/UX enhancements (navigation)

📖 **See:** [Risk-Based Testing Guide](docs/03-guides/risk-based-testing.md) | [Quick Reference](docs/03-guides/RISK-QUICK-REF.md)

### CI/CD Workflows

Three GitHub Actions workflows implement the risk-based testing strategy:

| Workflow | Trigger | What Runs |
|----------|---------|-----------|
| **Risk-Based Tests** | Push/PR to main, manual | Critical (P0) on every push; High (P1) + domain tests on PRs |
| **Playwright Tests** | Push/PR to main, manual | Smoke, E2E, regression, API (selectable) |
| **Nightly Regression** | Daily 2 AM UTC, weekly Sunday 3 AM | Nightly: P0-P2; Weekly: full suite (P0-P3) |

**Pipeline flow:**
```
Push to main  -->  Critical (P0)  ──[must pass]──>  Merge allowed
Pull request  -->  Critical (P0)  -->  High (P1) + Domain tests (parallel)
Nightly       -->  Critical (P0)  -->  High (P1)  -->  Medium (P2)
Weekly        -->  Critical (P0)  -->  High (P1)  -->  Medium (P2)  -->  Low (P3)
```

Each job produces:
- dorny/test-reporter check annotations
- JUnit step summary with pass/fail counts
- Playwright HTML report as downloadable artifact

## 🏗️ Architecture

### Page Object Model (POM)
Every page/component has a dedicated class encapsulating:
- **Locators** — defined using `data-testid` attributes
- **Actions** — user interactions (fill, click, navigate)
- **Assertions** — page-specific expect helpers

### AAA Pattern (Arrange-Act-Assert)
All tests follow the AAA structure:
```typescript
test('should transfer money successfully', async ({ transferPage }) => {
  // Arrange - set up preconditions
  const data = transferData.valid;

  // Act - perform the action
  await transferPage.transferMoney(data.recipientAccount, data.amount, data.description);

  // Assert - verify outcomes
  await transferPage.expectTransferSuccess();
});
```

### Auth State Management
- `auth.setup.ts` authenticates as user + admin and saves browser state
- Tests reuse saved state via Playwright projects — no repeated logins
- Auth tests run independently without pre-existing state

### Test Data Management
- **Credentials** are centralized in `src/data/credentials.ts`
- **Feature data** is organized in `src/data/test-data.ts`
- **Environment config** is loaded from `.env` via `src/config/env.config.ts`

### Helpers & Utilities (`src/helpers/`)
A zero-dependency shared utilities layer used across all test suites:

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| `api-assertions.ts` | API response validation with TypeScript type narrowing | `expectApiSuccess`, `expectApiError`, `expectApiArray`, `expectUnauthorized` |
| `data-generators.ts` | Unique test data generation via `node:crypto` | `uniqueId`, `randomUsername`, `randomAmount`, `randomRegistrationData` |
| `format.helpers.ts` | Currency & string formatting | `formatCurrency`, `parseCurrency`, `maskString`, `formatDateISO` |
| `wait.helpers.ts` | Smart waits & retry logic | `pollUntil`, `retryAsync`, `waitForNetworkSettle` |
| `logger.ts` | Structured JSONL logging | `createLogger`, `clearLogs` |

### Structured Logging
The framework writes structured JSONL logs to `test-logs/`:
- **`test-execution.jsonl`** — all test lifecycle events, fixture setup, API calls
- **`errors.jsonl`** — error-level entries only (quick triage)
- **`run-summary.json`** — generated post-run with totals, pass rate, failures, and slowest tests

Logging is powered by a custom zero-dependency logger (`src/helpers/logger.ts`) and a custom Playwright reporter (`src/reporters/json-log.reporter.ts`). No winston/pino required.

### Global Hooks
- **`global-setup.ts`** — environment health check (fail-fast if app is unreachable), stale artifact cleanup, log initialization
- **`global-teardown.ts`** — parses JSONL logs, generates `run-summary.json`, prints a console summary with failures and slowest tests

## 🔑 Test Accounts

| Role | Username | Password |
|------|----------|----------|
| User | john.doe | user123 |
| User | jane.smith | user123 |
| User | mike.wilson | user123 |
| Admin | admin | admin123 |

## 📊 Test Coverage

**Total: 124 tests across 19 files (9 UI + 9 API + 1 setup)**

### UI Tests (53 tests)

| Module | Tests |
|--------|-------|
| Authentication | Login, Quick Login, Invalid Login, Navigation to Register |
| Dashboard | Balance display, Stats, Transactions, Account info |
| Transfer | Form fill, Successful transfer, Large amounts |
| History | Filters, Search, CSV export |
| Top Up | Custom amount, Quick amounts, Payment gateway |
| Loans | Wizard steps, Type selection, Application submission |
| Navigation | All sidebar links, Logout, Sidebar toggle |
| Admin Dashboard | System stats visibility |
| Admin Users | User list, Search, Details modal |

### API Tests (71 tests)

The framework includes a comprehensive API test layer that tests the mock REST API directly through the browser's Service Worker.

| Endpoint Group | Tests |
|----------------|-------|
| Auth API | Login, Register, Logout, Session, Token Refresh |
| Account API | Balance, Account Details, User Profile, Deposit, Withdraw |
| Transfer API | Money Transfer, User Search |
| Transaction API | Get Transactions, Transaction Stats |
| Cards API | List Cards, Freeze, Unfreeze, Block, Get PIN |
| Loans API | Apply for Loan, Get Applications |
| Bills API | Pay Bill, Bill History |
| Profile API | Update Profile, Change Password |
| Admin API | Users, User Details, Stats, Trends, Search, Activity |

## 🔌 API Testing Architecture

The VB Bank Demo uses a **mock REST API** with Service Worker interception. API tests:

1. Navigate to the app to register the Service Worker
2. Use `page.evaluate()` to make `fetch()` calls inside the browser context
3. The Service Worker intercepts `/api/*` requests and returns mock responses

### API Client Usage
```typescript
import { test } from '../../fixtures/api.fixtures';
import { expectApiSuccess } from '../../helpers';

test('should login via API', async ({ userApi }) => {
  const response = await userApi.getBalance();
  expectApiSuccess(response);
  // response.data is now type-narrowed — no optional chaining needed
  console.log(response.data.balance);
});
```

### API Test Fixtures
| Fixture | Description |
|---------|-------------|
| `api` | Un-authenticated API client |
| `userApi` | Pre-authenticated as default user (john.doe) |
| `adminApi` | Pre-authenticated as admin |

### Running API Tests
```bash
npm run test:api           # Run all API tests
npm run test:api:auth      # Auth API tests only
npm run test:api:account   # Account API tests only
npm run test:api:transfer  # Transfer API tests only
npm run test:api:admin     # Admin API tests only
```
