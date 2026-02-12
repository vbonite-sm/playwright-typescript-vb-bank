# VB Bank Demo Application - UI Selector Discovery Report

**Date:** February 6, 2026  
**Application URL:** https://vb-bank-demo.vercel.app

---

## Executive Summary

This report documents all `data-testid` attributes and UI selectors discovered in the VB Bank demo application. The exploration covered login, registration, user dashboard, admin dashboard, and all main feature pages.

---

## 1. Navigation Selectors

### User Sidebar Navigation (All User Pages)
| Element | Actual data-testid | Current Framework | Status |
|---------|-------------------|-------------------|--------|
| Dashboard | `nav-link-dashboard` | `nav-dashboard` | ❌ NEEDS UPDATE |
| Transfer | `nav-link-transfer` | `nav-transfer` | ❌ NEEDS UPDATE |
| History | `nav-link-history` | `nav-history` | ❌ NEEDS UPDATE |
| Bills Payment | `nav-link-bills-payment` | `nav-bill-pay` | ❌ NEEDS UPDATE |
| Cards | `nav-link-cards` | `nav-cards` | ❌ NEEDS UPDATE |
| Loans | `nav-link-loans` | `nav-loan` | ❌ NEEDS UPDATE |
| Top Up | `nav-link-top-up` | `nav-top-up` | ❌ NEEDS UPDATE |
| Settings | `nav-link-settings` | `nav-settings` | ❌ NEEDS UPDATE |
| Logout Button | `btn-logout` | `btn-logout` | ✅ CORRECT |
| Sidebar Toggle | `btn-sidebar-toggle` | `btn-sidebar-toggle` | ✅ CORRECT |

### Admin Sidebar Navigation
| Element | Actual data-testid |
|---------|-------------------|
| Dashboard | `nav-link-dashboard` |
| User Management | `nav-link-user-management` |
| Logout | `btn-logout` |
| Sidebar Toggle | `btn-sidebar-toggle` |

---

## 2. Authentication Pages

### Login Page (`/login`)
| Element | data-testid | Tag |
|---------|------------|-----|
| Login Form | `form-login` | form |
| Username Input | `input-username` | input |
| Password Input | `input-password` | input |
| Login Button | `btn-login` | button |
| Quick Login User | `btn-quick-login-user` | button |
| Quick Login Admin | `btn-quick-login-admin` | button |
| Register Link | `link-register` | a |

### Register Page (`/register`)
| Element | data-testid | Tag |
|---------|------------|-----|
| Full Name | `input-fullname` | input |
| Username | `input-username` | input |
| Email | `input-email` | input |
| Password | `input-password` | input |
| Confirm Password | `input-confirm-password` | input |
| Register Button | `btn-register` | button |
| Login Link | `link-login` | a |

---

## 3. User Dashboard (`/dashboard`)

| Element | data-testid | Tag |
|---------|------------|-----|
| Balance Amount | `balance-amount` | h2 |
| Account Number | `account-number` | span |
| Total Deposits Stat | `stat-total-deposits` | div |
| Total Transfers Out Stat | `stat-total-transfers-out` | div |
| Total Transactions Stat | `stat-total-transactions` | div |
| Crypto Refresh Button | `btn-crypto-refresh` | button |
| Crypto Total Value | `crypto-total-value` | div |
| Crypto Asset BTC | `crypto-asset-btc` | div |
| Crypto Asset ETH | `crypto-asset-eth` | div |
| Transaction Items | `transaction-item-{0,1,2...}` | div |
| Refresh Rates Button | `btn-refresh-rates` | button |
| Currency Items | `currency-item-{0,1,2...}` | div |
| Buggy Toggle | `btn-buggy-toggle` | button |

**Note:** Current framework has `stat-deposits`, `stat-transfers`, `stat-transactions` - NEEDS UPDATE to actual names.

---

## 4. History Page (`/history`)

### Filter Controls
| Element | Actual data-testid | Current Framework | Status |
|---------|-------------------|-------------------|--------|
| Filter All | `filter-btn-all` | `filter-all` | ❌ NEEDS UPDATE |
| Filter Income | `filter-btn-income` | `filter-income` | ❌ NEEDS UPDATE |
| Filter Expense | `filter-btn-expense` | `filter-expense` | ❌ NEEDS UPDATE |
| Search Input | `input-search` | `input-search` | ✅ CORRECT |
| Start Date | `input-start-date` | - | 🆕 NEW |
| End Date | `input-end-date` | - | 🆕 NEW |
| Min Amount | `input-min-amount` | - | 🆕 NEW |
| Max Amount | `input-max-amount` | - | 🆕 NEW |
| Clear Filters | `btn-clear-filters` | - | 🆕 NEW |
| Export CSV | `btn-export-csv` | `btn-export-csv` | ✅ CORRECT |

### Transaction Rows
| Element | data-testid |
|---------|------------|
| Transaction Rows | `transaction-row-{0,1,2,3,4}` |

---

## 5. Transfer Page (`/transfer`)

| Element | data-testid | Tag |
|---------|------------|-----|
| Available Balance | `available-balance` | span |
| Recipient Account Input | `input-recipient-account` | input |
| Amount Input | `input-amount` | input |
| Description | `input-description` | textarea |
| Submit Transfer | `btn-submit-transfer` | button |

---

## 6. Top Up Page (`/top-up`)

| Element | data-testid | Tag |
|---------|------------|-----|
| Current Balance | `current-balance` | div |
| Amount Input | `input-amount` | input |
| Quick $50 | `btn-quick-50` | button |
| Quick $100 | `btn-quick-100` | button |
| Quick $250 | `btn-quick-250` | button |
| Quick $500 | `btn-quick-500` | button |
| Proceed Button | `btn-proceed` | button |

---

## 7. Bills Payment Page (`/bill-pay`)

| Element | data-testid | Tag |
|---------|------------|-----|
| Provider Select | `select-provider` | select |
| Amount Input | `input-amount` | input |
| Description Input | `input-description` | input |
| Payment Account Radio | `radio-payment-account` | input |
| Payment Card Radio | `radio-payment-card` | input |
| Submit Payment | `btn-submit-payment` | button |
| Bill History Items | `bill-history-item` | div |

---

## 8. Cards Page (`/cards`)

| Element | data-testid | Tag |
|---------|------------|-----|
| Card Items | `card-item` | div |
| Freeze Button | `btn-freeze` | button |
| Unfreeze Button | `btn-unfreeze` | button |
| Block Button | `btn-block` | button |
| Show PIN Button | `btn-show-pin` | button |

---

## 9. Loans Page (`/loans`)

### Step Indicators
| Element | data-testid |
|---------|------------|
| Step 1 | `step-1` |
| Step 2 | `step-2` |
| Step 3 | `step-3` |

### Loan Type Selection (Step 1)
| Element | data-testid |
|---------|------------|
| Personal Loan | `loan-type-loan_personal` |
| Home Loan | `loan-type-loan_home` |
| Next Button | `btn-next` |

### Loan Details (Step 2)
| Element | data-testid |
|---------|------------|
| Amount Input | `input-amount` |
| Term Input | `input-term` |
| Back Button | `btn-back` |
| Next Button | `btn-next` |

### Error/Status
| Element | data-testid |
|---------|------------|
| Error Alert | `alert-error` |
| Loan Application Status | `loan-application` |

---

## 10. Settings Page (`/settings`)

### Tab Navigation
| Element | data-testid |
|---------|------------|
| Profile Tab | `tab-profile` |
| Password Tab | `tab-password` |

### Profile Form
| Element | data-testid |
|---------|------------|
| Full Name | `input-fullname` |
| Date of Birth | `input-dob` |
| Email | `input-email` |
| Phone | `input-phone` |
| Passport | `input-passport` |
| License | `input-license` |
| Street | `input-street` |
| City | `input-city` |
| State | `input-state` |
| Zip | `input-zip` |
| Country | `input-country` |
| Save Profile | `btn-save-profile` |

---

## 11. Admin Dashboard (`/admin/dashboard`)

| Element | data-testid |
|---------|------------|
| Total Users Stat | `stat-total-users` |
| Total Balance Stat | `stat-total-balance` |
| Total Transactions Stat | `stat-total-transactions` |
| Total Deposits Stat | `stat-total-deposits` |
| Transaction Items | `admin-transaction-item-{0,1,2...}` |
| Top User Card | `top-user-card` |

---

## 12. Admin User Management (`/admin/users`)

| Element | data-testid |
|---------|------------|
| Search Users Input | `input-search-users` |
| User Rows | `user-row-{0,1,2}` |
| View Details Buttons | `btn-view-user-{0,1,2}` |

### User Details Modal
| Element | data-testid |
|---------|------------|
| Modal Container | `user-details-modal` |
| Close Modal Button | `btn-close-modal` |
| Modal Transactions | `modal-transaction-{0,1}` |

---

## 13. Page URLs Summary

| Page | URL |
|------|-----|
| Login | `/login` |
| Register | `/register` |
| User Dashboard | `/dashboard` |
| Transfer | `/transfer` |
| History | `/history` |
| Top Up | `/top-up` |
| Bill Pay | `/bill-pay` |
| Cards | `/cards` |
| Loans | `/loans` |
| Settings | `/settings` |
| Admin Dashboard | `/admin/dashboard` |
| Admin Users | `/admin/users` |

---

## 14. Required Framework Updates

### navigation.component.ts - CRITICAL UPDATES
```typescript
// CURRENT (WRONG)              // ACTUAL (CORRECT)
'nav-dashboard'           →     'nav-link-dashboard'
'nav-transfer'            →     'nav-link-transfer'
'nav-history'             →     'nav-link-history'
'nav-top-up'              →     'nav-link-top-up'
'nav-bill-pay'            →     'nav-link-bills-payment'
'nav-cards'               →     'nav-link-cards'
'nav-loan'                →     'nav-link-loans'
'nav-settings'            →     'nav-link-settings'
'nav-admin-dashboard'     →     'nav-link-dashboard'
'nav-admin-users'         →     'nav-link-user-management'
```

### history.page.ts - CRITICAL UPDATES
```typescript
// CURRENT (WRONG)              // ACTUAL (CORRECT)
'filter-all'              →     'filter-btn-all'
'filter-income'           →     'filter-btn-income'
'filter-expense'          →     'filter-btn-expense'
```

### dashboard.page.ts - UPDATES NEEDED
```typescript
// CURRENT (WRONG)              // ACTUAL (CORRECT)
'stat-deposits'           →     'stat-total-deposits'
'stat-transfers'          →     'stat-total-transfers-out'
'stat-transactions'       →     'stat-total-transactions'
```

---

## 15. Filter Behavior Verification

The History page filters work as follows:
- **All Filter**: Shows all 5 transactions
- **Income Filter**: Shows 2 transactions (deposits/transfers in)
- **Expense Filter**: Shows 3 transactions (withdrawals/transfers out)

This confirms the filters are functional and the selectors are correct.
