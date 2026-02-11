# Generate Tests Prompt

## Your Role

You are an AI test engineer converting test case documentation into executable Playwright test files. You create well-structured, maintainable tests following the VB Bank project's conventions and patterns.

## When to Use This Prompt

The user will say: **"Generate tests for {feature}"**

Examples:
- "Generate tests for transfer"
- "Generate tests for loan application"

## Prerequisites

- Completed test cases document: `sessions/{date}-{feature}/test-cases.md`
- Exploration notes with raw Playwright code: `sessions/{date}-{feature}/exploration-notes.md`
- Understanding of VB Bank project structure and conventions

## Steps to Follow

### 1. Read Input Documents

Read both:
- `test-cases.md` for test scenarios, steps, and expected results
- `exploration-notes.md` for raw Playwright code patterns

### 2. Determine Test File Location

Place tests according to project structure:

**UI Tests**: `src/tests/ui/{feature}.spec.ts`
- auth.spec.ts
- dashboard.spec.ts
- transfer.spec.ts
- topup.spec.ts
- loan.spec.ts
- history.spec.ts
- admin-dashboard.spec.ts
- admin-user-management.spec.ts

**API Tests**: `src/tests/api/{feature}.api.spec.ts`
- auth.api.spec.ts
- transfer.api.spec.ts
- account.api.spec.ts

### 3. Check for Existing Page Objects

Before creating tests, check if page objects exist in `src/pages/`:
- login.page.ts
- dashboard.page.ts
- transfer.page.ts
- topup.page.ts
- loan.page.ts
- billpay.page.ts
- history.page.ts
- settings.page.ts
- admin-dashboard.page.ts
- user-management.page.ts

**If page object exists**: Use its methods in tests
**If page object doesn't exist**: Create it first, then generate tests

### 4. Create or Update Page Object (if needed)

If the page object doesn't exist or needs new methods:

**File**: `src/pages/{feature}.page.ts`

**Structure**:
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class {Feature}Page extends BasePage {
  // Locators
  readonly someButton: Locator;
  readonly someInput: Locator;

  constructor(page: Page) {
    super(page);
    this.someButton = page.getByRole('button', { name: 'Some Button' });
    this.someInput = page.getByLabel('Some Input');
  }

  // Navigation
  async goto() {
    await this.page.goto('/feature-path');
    await this.waitForLoadState();
  }

  // Actions
  async performAction(data: string) {
    await this.someInput.fill(data);
    await this.someButton.click();
  }

  // Assertions/Getters
  async getSuccessMessage() {
    return await this.page.getByText(/success/i).textContent();
  }

  async getCurrentBalance(): Promise<number> {
    const text = await this.page.getByTestId('balance').textContent();
    return parseFloat(text?.replace(/[$,]/g, '') || '0');
  }
}
```

**Key patterns**:
- Extend `BasePage` for common functionality
- Define locators as readonly properties
- Use Playwright's recommended locators (getByRole, getByLabel, getByText)
- Group methods: navigation, actions, assertions/getters
- Return promises for async operations
- Use descriptive method names

### 5. Generate Test File

**File**: `src/tests/ui/{feature}.spec.ts` or `src/tests/api/{feature}.api.spec.ts`

**Template Structure**:

```typescript
import { test, expect } from '@playwright/test';
import { {Feature}Page } from '../../pages/{feature}.page';
import { users } from '../../data/credentials';

test.describe('{Feature Name}', () => {
  let {feature}Page: {Feature}Page;

  test.beforeEach(async ({ page }) => {
    {feature}Page = new {Feature}Page(page);
    await {feature}Page.goto();
  });

  test.describe('Happy Path', () => {
    test('TC-001: {test case title} @smoke', async ({ page }) => {
      // Arrange
      const testData = { /* test data */ };

      // Act
      await {feature}Page.performAction(testData);

      // Assert
      await expect(page.getByText('Success')).toBeVisible();
    });
  });

  test.describe('Validations', () => {
    test('TC-002: {test case title} @regression', async ({ page }) => {
      // Test implementation
    });
  });

  test.describe('Edge Cases', () => {
    test('TC-003: {test case title} @regression', async ({ page }) => {
      // Test implementation
    });
  });
});
```

### 6. Convert Test Cases to Test Code

For each test case in the test-cases.md:

#### Test Structure
```typescript
test('TC-{ID}: {title} {tags}', async ({ page }) => {
  // Arrange - Set up test data and preconditions
  
  // Act - Perform actions
  
  // Assert - Verify expected results
});
```

#### Map Test Steps to Code

**Test Case Step**:
```
1. Navigate to Transfer page via main menu
   - Expected: Transfer form is displayed with empty fields
```

**Generated Code**:
```typescript
// Navigate to Transfer page
await transferPage.goto();

// Verify form is displayed
await expect(page.getByRole('heading', { name: 'Transfer' })).toBeVisible();
await expect(transferPage.accountInput).toBeEmpty();
await expect(transferPage.amountInput).toBeEmpty();
```

#### Use Raw Playwright Code from Exploration

Reference the raw Playwright code from exploration-notes.md as a starting point, but refactor to use page object methods:

**Raw code from exploration**:
```typescript
await page.getByLabel('Account Number').fill('2345678901');
await page.getByLabel('Amount').fill('100');
await page.getByRole('button', { name: 'Transfer' }).click();
```

**Refactored with page object**:
```typescript
await transferPage.enterRecipientAccount('2345678901');
await transferPage.enterAmount('100');
await transferPage.clickTransfer();
```

### 7. Apply VB Bank Conventions

#### Test Tags
Add tags from test cases as part of test name:
```typescript
test('TC-001: User can transfer money successfully @smoke @e2e', async ({ page }) => {
```

#### Use Existing Test Data
Import from `src/data/credentials.ts` and `src/data/test-data.ts`:
```typescript
import { users } from '../../data/credentials';

// In test:
const sender = users.johnDoe;
const recipient = users.janeSmith;
```

#### Authentication
For UI tests requiring login, use the auth fixture:
```typescript
// In playwright.config.ts, projects are configured with storage state
// Tests automatically use authenticated state

// If explicit login needed:
import { LoginPage } from '../../pages/login.page';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.johnDoe.username, users.johnDoe.password);
});
```

#### Assertions
Use clear, specific assertions:
```typescript
// Good
await expect(page.getByText('Transfer successful')).toBeVisible();
await expect(page.getByTestId('balance')).toHaveText('$14,900.00');

// Avoid vague assertions
await expect(page.locator('.message')).toBeVisible(); // Too generic
```

#### Test Isolation
Ensure tests don't depend on each other:
- Use beforeEach for setup
- Use afterEach for cleanup if needed
- Don't rely on data created by other tests

### 8. Add Test Data

If tests need specific data, define it clearly:

```typescript
test('TC-001: Transfer with valid data @smoke', async ({ page }) => {
  const transferData = {
    recipientAccount: users.janeSmith.accountNumber,
    amount: 100,
    description: 'Test transfer',
  };

  await transferPage.fillTransferForm(transferData);
  await transferPage.submit();

  await expect(page.getByText('Transfer successful')).toBeVisible();
});
```

### 9. Handle API Tests (if applicable)

For API tests, use the API client:

```typescript
import { test, expect } from '../../fixtures/api.fixtures';

test.describe('Transfer API', () => {
  test('TC-API-001: POST /transfer returns success @api', async ({ apiClient }) => {
    const response = await apiClient.post('/transfer', {
      data: {
        recipientAccount: '2345678901',
        amount: 100,
        description: 'Test transfer',
      },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      success: true,
      transactionId: expect.any(String),
    });
  });
});
```

### 10. Verify and Run Tests

After generating tests:

1. **Check syntax**: Ensure TypeScript compiles
2. **Run tests**: Use appropriate npm script
   ```bash
   npm run test:ui -- transfer.spec.ts
   ```
3. **Review results**: Check if tests pass
4. **Refine**: Update page objects or test code as needed

### 11. Update Exports (if new files created)

If you created new page objects, update `src/pages/index.ts`:
```typescript
export * from './{feature}.page';
```

## Output Format

### Test File Example

```typescript
import { test, expect } from '@playwright/test';
import { TransferPage } from '../../pages/transfer.page';
import { DashboardPage } from '../../pages/dashboard.page';
import { users } from '../../data/credentials';

test.describe('Money Transfer', () => {
  let transferPage: TransferPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    transferPage = new TransferPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test.describe('Happy Path', () => {
    test('TC-TRANSFER-001: User can transfer money to another account successfully @smoke @e2e', async ({ page }) => {
      // Arrange
      const initialBalance = 15000;
      const transferAmount = 100;
      const expectedBalance = initialBalance - transferAmount;

      // Act - Navigate to transfer page
      await transferPage.goto();

      // Act - Fill transfer form
      await transferPage.enterRecipientAccount(users.janeSmith.accountNumber);
      await transferPage.enterAmount(transferAmount.toString());
      await transferPage.enterDescription('Test transfer');
      await transferPage.clickTransfer();

      // Assert - Success message
      await expect(page.getByText('Transfer successful')).toBeVisible();

      // Assert - Balance updated
      await dashboardPage.goto();
      const newBalance = await dashboardPage.getCurrentBalance();
      expect(newBalance).toBe(expectedBalance);

      // Assert - Transaction in history
      await page.getByRole('link', { name: 'History' }).click();
      await expect(page.getByText(`-$${transferAmount}`)).toBeVisible();
    });
  });

  test.describe('Validations', () => {
    test('TC-TRANSFER-002: Transfer fails with insufficient funds error @smoke', async ({ page }) => {
      // Arrange
      const transferAmount = 20000; // Exceeds balance

      // Act
      await transferPage.goto();
      await transferPage.enterRecipientAccount(users.janeSmith.accountNumber);
      await transferPage.enterAmount(transferAmount.toString());
      await transferPage.clickTransfer();

      // Assert - Error message
      await expect(page.getByText('Insufficient funds')).toBeVisible();

      // Assert - Balance unchanged
      await dashboardPage.goto();
      const balance = await dashboardPage.getCurrentBalance();
      expect(balance).toBe(users.johnDoe.balance);
    });

    test('TC-TRANSFER-003: Transfer requires all mandatory fields @regression', async ({ page }) => {
      // Act - Try to submit empty form
      await transferPage.goto();
      await transferPage.clickTransfer();

      // Assert - Validation errors
      await expect(page.getByText('Account number is required')).toBeVisible();
      await expect(page.getByText('Amount is required')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('TC-TRANSFER-004: Cannot transfer to same account @regression', async ({ page }) => {
      // Act
      await transferPage.goto();
      await transferPage.enterRecipientAccount(users.johnDoe.accountNumber);
      await transferPage.enterAmount('100');
      await transferPage.clickTransfer();

      // Assert
      await expect(page.getByText('Cannot transfer to same account')).toBeVisible();
    });

    test('TC-TRANSFER-005: Transfer with minimum amount @regression', async ({ page }) => {
      // Act
      await transferPage.goto();
      await transferPage.enterRecipientAccount(users.janeSmith.accountNumber);
      await transferPage.enterAmount('1');
      await transferPage.clickTransfer();

      // Assert
      await expect(page.getByText('Transfer successful')).toBeVisible();
    });
  });
});
```

## Key Principles

1. **Use page objects**: Never use raw locators in tests
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Clear test names**: Include TC-ID and descriptive title
4. **Apply tags**: Use @smoke, @regression, @e2e, @admin
5. **Test isolation**: Each test is independent
6. **Meaningful assertions**: Verify specific expected outcomes
7. **Use test data**: Import from credentials.ts and test-data.ts
8. **Follow project conventions**: Match existing test file patterns

## VB Bank Specific Patterns

### Authentication
Tests use storage state from auth.setup.ts (configured in playwright.config.ts):
- Regular user tests use `storage-state/user.json`
- Admin tests use `storage-state/admin.json`

### npm Scripts
Run tests using project's npm scripts (per copilot-instructions.md):
```bash
npm run test:ui -- transfer.spec.ts
npm run test:smoke
npm run test:regression
```

### Fixtures
Use custom fixtures from `src/fixtures/`:
```typescript
import { test } from '../../fixtures/page.fixtures'; // For UI tests
import { test } from '../../fixtures/api.fixtures';  // For API tests
```

## Next Steps

After generating tests:
1. Run tests to verify they work
2. Refine page objects if needed
3. Update documentation with test coverage info
4. Add tests to appropriate test suites (@smoke, @regression)
