# Playwright API Testing Guide

VB Bank exposes all APIs on `window.__API__` for direct testing via `page.evaluate()`.

## Quick Start

```javascript
import { test, expect } from '@playwright/test';

test('API testing example', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Call any API directly
  const response = await page.evaluate(async () => {
    return await window.__API__.auth.apiLogin('john.doe', 'user123');
  });
  
  expect(response.success).toBe(true);
  expect(response.data.accessToken).toBeDefined();
});
```

## Available APIs

```javascript
window.__API__.auth    // Login, register, logout, session, token refresh
window.__API__.bank    // Transfers, deposits, cards, loans, bills, transactions
window.__API__.admin   // System stats, user management, analytics
```

## Response Structure

```javascript
{
  success: boolean,
  status: number,        // HTTP status (200, 400, 401, etc.)
  data?: any,           // Response data if success
  error?: {             // Error if failure
    code: string,
    message: string
  },
  meta: {
    requestId: string,
    timestamp: string,
    duration: number,
    endpoint: string,
    method: string
  }
}
```

## Common Test Patterns

### Login and Execute

```javascript
test('transfer money', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Login
  await page.evaluate(async () => {
    await window.__API__.auth.apiLogin('john.doe', 'user123');
  });
  
  // Execute API call
  const response = await page.evaluate(async () => {
    const session = JSON.parse(localStorage.getItem('vb_bank_session'));
    return await window.__API__.bank.apiTransferMoney(
      session.userId,
      '2345678901',
      100,
      'Test transfer'
    );
  });
  
  expect(response.success).toBe(true);
  expect(response.data.newBalance).toBeDefined();
});
```

### Validate Error Responses

```javascript
test('invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  const response = await page.evaluate(async () => {
    return await window.__API__.auth.apiLogin('invalid', 'wrong');
  });
  
  expect(response.success).toBe(false);
  expect(response.status).toBe(400);
  expect(response.error.code).toBe('INVALID_CREDENTIALS');
});
```

### Test Authorization

```javascript
test('requires authentication', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Clear tokens
  await page.evaluate(() => {
    localStorage.removeItem('vb_bank_token');
  });
  
  const response = await page.evaluate(async () => {
    return await window.__API__.bank.apiGetBalance('1');
  });
  
  expect(response.status).toBe(401);
  expect(response.error.code).toBe('UNAUTHORIZED');
});
```

### Helper Functions

```javascript
async function loginAndGetUserId(page, username = 'john.doe', password = 'user123') {
  return await page.evaluate(async ([user, pass]) => {
    await window.__API__.auth.apiLogin(user, pass);
    return JSON.parse(localStorage.getItem('vb_bank_session')).userId;
  }, [username, password]);
}

// Use in tests
test('helper example', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const userId = await loginAndGetUserId(page);
  
  const response = await page.evaluate(async (id) => {
    return await window.__API__.bank.apiGetBalance(id);
  }, userId);
  
  expect(response.success).toBe(true);
});
```

## Key APIs

```javascript
// Auth
window.__API__.auth.apiLogin(username, password)
window.__API__.auth.apiRegister(userData)
window.__API__.auth.apiLogout()
window.__API__.auth.apiGetSession()
window.__API__.auth.apiRefreshToken()
window.__API__.auth.apiUpdateProfile(userId, updates)

// Banking
window.__API__.bank.apiGetBalance(userId)
window.__API__.bank.apiGetAccountDetails(userId)
window.__API__.bank.apiGetUserProfile(userId)
window.__API__.bank.apiGetTransactions(userId, limit?)
window.__API__.bank.apiGetTransactionStats(userId)
window.__API__.bank.apiTransferMoney(fromUserId, recipientAccount, amount, description)
window.__API__.bank.apiDepositMoney(userId, amount, description)
window.__API__.bank.apiWithdrawMoney(userId, amount, description)
window.__API__.bank.apiSearchUsers(query)
window.__API__.bank.apiPayBill(userId, provider, amount, description, paymentMethod)
  // provider: "electric" | "water" | "internet" | "gas" | "phone" | "streaming"
  // paymentMethod: "account" | "card" (default: "account")
window.__API__.bank.apiGetBillHistory(userId)
window.__API__.bank.apiGetCards(userId)
window.__API__.bank.apiFreezeCard(userId, cardId)
window.__API__.bank.apiUnfreezeCard(userId, cardId)
window.__API__.bank.apiBlockCard(userId, cardId)
window.__API__.bank.apiGetCardPIN(userId, cardId)
window.__API__.bank.apiApplyForLoan(userId, loanType, amount, term)
  // loanType: "personal" | "auto" | "home" | "education"
  // Note: App internally uses "loan_personal", "loan_home" format
window.__API__.bank.apiGetLoanApplications(userId)
window.__API__.bank.apiUpdateProfile(userId, updates)
window.__API__.bank.apiChangePassword(userId, currentPassword, newPassword)

// Admin
window.__API__.admin.apiGetAllUsers()
window.__API__.admin.apiGetUserDetails(userId)
window.__API__.admin.apiGetAllTransactions(limit?)
window.__API__.admin.apiGetSystemStats()
window.__API__.admin.apiGetTransactionTrends(days?)
window.__API__.admin.apiSearchUsers(query)
window.__API__.admin.apiGetUserActivity(userId)
```

## Test Accounts

- User: `john.doe` / `user123` (Account: 1234567890)
- User: `jane.smith` / `user123` (Account: 2345678901)
- Admin: `admin` / `admin123`

## Running Tests

```bash
npx playwright test              # Run all tests
npx playwright test --headed     # Run with browser UI
npx playwright test --debug      # Debug mode
```
