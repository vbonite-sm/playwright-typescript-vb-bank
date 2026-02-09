# VB Bank - Playwright Test Automation Framework

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
│   ├── pages/               # Page Object Models (POM)
│   │   ├── base.page.ts     # Abstract base page
│   │   ├── login.page.ts
│   │   ├── dashboard.page.ts
│   │   ├── transfer.page.ts
│   │   ├── ... (other pages)
│   │   └── components/
│   │       └── navigation.component.ts
│   └── tests/               # Test specs (AAA pattern)
│       ├── auth.setup.ts    # Auth state setup
│       ├── ui/              # UI/Functional tests
│       │   ├── auth.spec.ts
│       │   ├── dashboard.spec.ts
│       │   ├── transfer.spec.ts
│       │   ├── history.spec.ts
│       │   ├── topup.spec.ts
│       │   ├── loan.spec.ts
│       │   ├── navigation.spec.ts
│       │   ├── admin-dashboard.spec.ts
│       │   └── admin-user-management.spec.ts
│       └── api/             # API tests
│           ├── auth.api.spec.ts
│           ├── account.api.spec.ts
│           ├── transfer.api.spec.ts
│           ├── transaction.api.spec.ts
│           ├── cards.api.spec.ts
│           ├── loans.api.spec.ts
│           ├── bills.api.spec.ts
│           ├── profile.api.spec.ts
│           └── admin.api.spec.ts
├── storage-state/           # Saved auth states (gitignored)
├── .env                     # Environment variables (gitignored)
├── .env.example             # Template for environment config
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

| Command | Description |
|---|---|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Debug mode with inspector |
| `npm run test:auth` | Run auth tests only |
| `npm run test:user` | Run user portal tests only |
| `npm run test:admin` | Run admin portal tests only |
| `npm run report` | Open HTML test report |

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

## 🔑 Test Accounts

| Role | Username | Password |
|------|----------|----------|
| User | john.doe | user123 |
| User | jane.smith | user123 |
| User | mike.wilson | user123 |
| Admin | admin | admin123 |

## 📊 Test Coverage

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

### API Tests (66 tests)

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
import { test, expect } from '../../fixtures/api.fixtures';

test('should login via API', async ({ api }) => {
  // api fixture provides an initialized ApiClient
  const response = await api.login({ username: 'john.doe', password: 'user123' });
  expect(response.success).toBe(true);
  expect(response.data.accessToken).toBeTruthy();
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
