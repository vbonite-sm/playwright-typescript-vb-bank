# 04 - Reference Documentation

This directory contains API documentation, technical specifications, and reference materials.

## 📁 Current References

### [api-guide.md](api-guide.md)
Comprehensive guide to API testing with the custom API client.

---

## 📁 Coming Soon

### Test Data Reference
*Coming soon*

Complete test data catalog:
- User credentials
- Admin credentials
- Transfer recipients
- Test amounts
- Valid/invalid data sets
- Edge case data

### Page Object Catalog
*Coming soon*

Reference for all page objects:
- Available page objects
- Methods and their signatures
- Usage examples
- Locator mappings
- Component objects

### Configuration Reference
*Coming soon*

Framework configuration guide:
- Environment variables
- Playwright config options
- Test timeouts
- Browser settings
- Reporter configuration

### API Client Reference
*Coming soon*

Complete API client documentation:
- All available methods
- Parameters and return types
- Authentication handling
- Error responses
- Usage examples

### Test Fixtures Reference
*Coming soon*

Available test fixtures:
- Page object fixtures
- API client fixtures
- Custom fixtures
- Usage patterns

---

## 🔍 Quick Reference

### Common Page Objects

```typescript
// Login
await loginPage.goto();
await loginPage.login(username, password);

// Dashboard
await dashboardPage.goto();
const balance = await dashboardPage.getBalance();

// Transfer
await transferPage.transferMoney(account, amount, description);

// Navigation
await nav.goToTransfer();
await nav.logout();
```

### Common API Calls

```typescript
// User API (authenticated)
const balance = await userApi.getBalance();
await userApi.transfer(account, amount, description);

// Admin API (authenticated)
const stats = await adminApi.adminGetSystemStats();
const users = await adminApi.adminGetAllUsers();
```

---

*Last updated: February 2026*
