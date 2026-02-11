# Update Docs Prompt

## Your Role

You are an AI technical writer updating project documentation to reflect newly tested features, test coverage, and testing patterns discovered during exploration.

## When to Use This Prompt

The user will say: **"Update docs for {feature}"**

Examples:
- "Update docs for transfer"
- "Update docs for admin user management"

## Prerequisites

- Completed test generation for the feature
- Exploration notes: `sessions/{date}-{feature}/exploration-notes.md`
- Test cases: `sessions/{date}-{feature}/test-cases.md`
- Generated tests in `src/tests/ui/` or `src/tests/api/`

## Steps to Follow

### 1. Read All Related Files

Read:
- Exploration notes
- Test cases document
- Generated test files
- Existing project documentation (README.md, docs/)

### 2. Identify Documentation Updates Needed

Determine what needs updating:

#### README.md
- Test coverage statistics
- New features tested
- Examples of test execution

#### Feature-Specific Docs
- Test scenarios covered
- Known limitations
- Usage examples
- API endpoints (if applicable)

#### Test Documentation
- Test organization
- Page object patterns
- Test data requirements

### 3. Update README.md

Update relevant sections:

#### Test Coverage Section

Add or update test counts:
```markdown
## Test Coverage

### UI Tests
- ✅ Authentication (8 tests)
- ✅ Dashboard (6 tests)
- ✅ Transfer (12 tests) ← NEW/UPDATED
- ✅ Top-up (8 tests)
- ✅ Loan (10 tests)
- ✅ Bill Pay (9 tests)
- ✅ History (7 tests)
- ✅ Settings (5 tests)
- ✅ Admin Dashboard (6 tests)
- ✅ Admin User Management (10 tests)

### API Tests
- ✅ Auth API (6 tests)
- ✅ Transfer API (8 tests) ← NEW/UPDATED
- ✅ Account API (7 tests)
- ✅ Loans API (6 tests)

**Total**: {X} UI tests, {Y} API tests
```

#### Feature List

If the feature is new to documentation:
```markdown
## Features Tested

- 🔐 **Authentication**: Login, registration, logout
- 📊 **Dashboard**: Account overview, quick actions, balance display
- 💸 **Transfer**: P2P transfers, validation, history ← NEW/UPDATED
- 💰 **Top-up**: Add funds, payment methods
- 🏦 **Loan**: Application, approval, repayment
- 📄 **Bill Pay**: Pay bills, schedule payments
- 📈 **History**: Transaction history, filtering
- ⚙️ **Settings**: Profile management, preferences
- 👨‍💼 **Admin**: User management, dashboard, analytics
```

### 4. Create/Update Feature Documentation

If feature documentation doesn't exist, create: `docs/{feature}-testing.md`

**Template**:
```markdown
# {Feature Name} Testing

## Overview

{Brief description of the feature and what it does}

## Test Coverage

### Test Suites
- **Happy Path** (@smoke): {X} tests
- **Validations** (@smoke): {Y} tests
- **Edge Cases** (@regression): {Z} tests
- **Error Handling** (@regression): {W} tests

Total: {N} tests

### Scenarios Covered
1. ✅ {Scenario description}
2. ✅ {Scenario description}
3. ✅ {Scenario description}

## Page Objects

### {Feature}Page
**Location**: `src/pages/{feature}.page.ts`

**Key Methods**:
- `goto()`: Navigate to {feature} page
- `{action}()`: {Description of action}
- `get{Property}()`: {Description of getter}

**Example Usage**:
```typescript
import { {Feature}Page } from '../../pages/{feature}.page';

const {feature}Page = new {Feature}Page(page);
await {feature}Page.goto();
await {feature}Page.{action}(data);
```

## Test Data

### Required Credentials
From `src/data/credentials.ts`:
- User: {username}
- Password: {password}

### Test Scenarios Data
{List any specific test data requirements}

## Running Tests

### All {Feature} Tests
```bash
npm test -- {feature}.spec
```

### Smoke Tests Only
```bash
npm run test:smoke -- {feature}.spec
```

### Regression Tests
```bash
npm run test:regression -- {feature}.spec
```

### Specific Test
```bash
npm test -- {feature}.spec -g "test name"
```

## Known Issues

{List any known issues, limitations, or bugs discovered during testing}

## Edge Cases Tested

- {Edge case 1}
- {Edge case 2}
- {Edge case 3}

## Future Test Coverage

{List any scenarios that should be tested but aren't yet}

## Related Documentation

- [Exploration Notes](../sessions/{date}-{feature}/exploration-notes.md)
- [Test Cases](../sessions/{date}-{feature}/test-cases.md)
- [API Guide](./api-guide.md) ← if applicable
```

### 5. Update API Documentation (if applicable)

If API tests were created, update `docs/api-guide.md`:

```markdown
## {Feature} API

### Endpoints

#### POST /api/{endpoint}
**Description**: {What the endpoint does}

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "123",
    "status": "completed"
  }
}
```

**Error Responses**:
- `400`: Invalid request data
- `401`: Unauthorized
- `403`: Insufficient funds / permissions
- `404`: Resource not found

**Test Coverage**: {X} tests
**Location**: `src/tests/api/{feature}.api.spec.ts`
```

### 6. Update Test Organization Docs

If `docs/test-organization.md` or similar exists, update it:

```markdown
## Test Structure

### UI Tests

```
src/tests/ui/
├── auth.spec.ts              (8 tests: @smoke, @regression)
├── dashboard.spec.ts         (6 tests: @smoke, @regression)
├── transfer.spec.ts          (12 tests: @smoke, @regression, @e2e) ← UPDATED
├── topup.spec.ts            (8 tests: @smoke, @regression)
├── loan.spec.ts             (10 tests: @smoke, @regression)
├── billpay.spec.ts          (9 tests: @regression)
├── history.spec.ts          (7 tests: @regression)
├── settings.spec.ts         (5 tests: @regression)
├── admin-dashboard.spec.ts  (6 tests: @admin, @smoke)
└── admin-user-management.spec.ts (10 tests: @admin, @regression)
```

### Test Tags Distribution
- `@smoke`: {X} tests (critical happy paths)
- `@regression`: {Y} tests (comprehensive coverage)
- `@e2e`: {Z} tests (end-to-end flows)
- `@admin`: {W} tests (admin features)
- `@api`: {V} tests (API tests)
```

### 7. Add Examples to Documentation

Include practical examples of:

#### Running New Tests
```markdown
## Examples

### Run Transfer Tests
```bash
# All transfer tests
npm test -- transfer.spec

# Only smoke tests
npm run test:smoke -- transfer.spec

# With UI mode for debugging
npm run test:ui -- transfer.spec
```
```

#### Using Page Objects
```markdown
### Transfer Page Object Example

```typescript
import { test } from '@playwright/test';
import { TransferPage } from '../../pages/transfer.page';
import { users } from '../../data/credentials';

test('example transfer', async ({ page }) => {
  const transferPage = new TransferPage(page);
  
  await transferPage.goto();
  await transferPage.enterRecipientAccount(users.janeSmith.accountNumber);
  await transferPage.enterAmount('100');
  await transferPage.enterDescription('Test transfer');
  await transferPage.clickTransfer();
  
  await expect(page.getByText('Transfer successful')).toBeVisible();
});
```
```

### 8. Update Changelog (if exists)

If the project has a CHANGELOG.md:

```markdown
## [Unreleased]

### Added
- Transfer feature test coverage (12 tests)
  - Happy path scenarios (@smoke)
  - Validation tests (@smoke)
  - Edge cases (@regression)
- Transfer page object with comprehensive methods
- Transfer test data helpers

### Changed
- Updated README with transfer test coverage
- Enhanced test organization documentation

### Fixed
- {Any bugs discovered and fixed during testing}
```

### 9. Document Test Patterns

If new testing patterns were discovered/used, document them:

```markdown
## Testing Patterns

### {Pattern Name}

**When to Use**: {Description of when this pattern applies}

**Example**:
```typescript
// Pattern code example
```

**Benefits**:
- {Benefit 1}
- {Benefit 2}
```

### 10. Cross-Link Documentation

Ensure documentation files reference each other:

```markdown
## Related Documentation

- [Main README](../README.md)
- [Test Organization](./test-organization.md)
- [API Guide](./api-guide.md)
- [Exploration Workflow](./ai-explorer.md)
- [Transfer Exploration](../sessions/2026-02-10-transfer/exploration-notes.md)
```

## Key Principles

1. **Accuracy**: Update statistics and examples to match actual code
2. **Completeness**: Document all new tests, page objects, and patterns
3. **Clarity**: Use clear language and examples
4. **Maintainability**: Keep documentation structure consistent
5. **Cross-referencing**: Link related documentation
6. **Timeliness**: Update docs immediately after test creation

## VB Bank Specific Guidelines

### Documentation Files to Update

- **README.md**: Main project documentation
- **docs/api-guide.md**: API endpoint documentation
- **docs/selector-discovery-report.md**: Selector patterns (if applicable)
- Feature-specific docs in `docs/`

### Test Count Format

Use this format for consistency:
- "8 tests" (not "8 test cases" or "8 scenarios")
- Include tags: "(8 tests: @smoke, @regression)"

### Feature Status Icons

Use these icons in documentation:
- ✅ Feature fully tested
- 🚧 Feature partially tested
- ⏳ Feature not yet tested
- 🐛 Known issues

### npm Script References

Always reference npm scripts (per copilot-instructions.md):
- ✅ `npm run test:smoke`
- ❌ `npx playwright test --grep @smoke`

## Example Documentation Update

### Before:
```markdown
## Test Coverage

### UI Tests
- ✅ Authentication (8 tests)
- ✅ Dashboard (6 tests)
- ⏳ Transfer (pending)
```

### After:
```markdown
## Test Coverage

### UI Tests
- ✅ Authentication (8 tests: @smoke, @regression)
- ✅ Dashboard (6 tests: @smoke, @regression)
- ✅ Transfer (12 tests: @smoke, @regression, @e2e)
  - Happy path transfers
  - Validation and error handling
  - Edge cases (insufficient funds, invalid accounts)
  - Transaction history verification
```

## Next Steps

After updating documentation:
1. Review all updated files for accuracy
2. Ensure all links work
3. Verify code examples are correct
4. Commit documentation changes
5. Consider updating project wiki or external docs if applicable
