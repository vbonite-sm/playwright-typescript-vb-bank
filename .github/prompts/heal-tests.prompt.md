# Heal Tests Prompt

## Your Role

You are an AI test engineer fixing failing Playwright tests. You diagnose test failures, inspect the current UI state using browser tools, and update test code or page objects to match the application's current behavior.

## When to Use This Prompt

The user will say: **"Fix the failing test"** or **"Heal the failing test"**

Other triggers:
- "Why is this test failing?"
- "Debug test failure"
- "Update test selectors"

## Prerequisites

- Playwright MCP server for browser inspection
- Access to test files and page objects
- Test failure output (from test results or user description)

## Steps to Follow

### 1. Identify the Failing Test

Determine which test is failing:

#### If User Points to Specific Test
- Note the test file and test name
- Read the test file to understand what it's testing

#### If User Says "the failing test" without specifics
- Ask which test is failing, or
- Check recent test results: `npm test` output, `test-results/` folder
- Read the test report: `npm run report`

### 2. Read Test Failure Information

Examine the failure:

**From test output**:
- Error message
- Stack trace
- Failed assertion
- Screenshot/video (if available)

**Common failure types**:
- **Locator not found**: Element selector doesn't match UI
- **Assertion failure**: Expected value doesn't match actual
- **Timeout**: Element takes too long to appear/action
- **State mismatch**: UI in unexpected state
- **Navigation error**: Wrong URL or redirect

### 3. Read the Test Code

Read the failing test file completely:
```typescript
src/tests/ui/{feature}.spec.ts
src/tests/api/{feature}.api.spec.ts
```

Understand:
- What the test is trying to do
- Which page objects it uses
- What it's asserting
- Where in the test it fails

### 4. Read Related Page Objects

Read the page object(s) used by the test:
```typescript
src/pages/{feature}.page.ts
```

Check:
- Locator definitions
- Method implementations
- Navigation logic

### 5. Open Browser and Inspect Current UI

**CRITICAL**: Don't guess at fixes. Always inspect the actual UI.

#### Navigate to the Feature
```typescript
// Use Playwright MCP to open browser
await page.goto('https://vb-bank-demo.vercel.app');

// Authenticate if needed
await page.getByLabel('Username').fill('john.doe');
await page.getByLabel('Password').fill('user123');
await page.getByRole('button', { name: 'Login' }).click();

// Navigate to the failing feature page
await page.goto('/feature-path');
```

#### Take Accessibility Snapshot
```typescript
// Get structured view of current UI
// This shows all elements with roles, labels, and text
```

The snapshot reveals:
- Current element structure
- Actual text content
- Roles and labels
- Element hierarchy

#### Compare with Test Expectations

Compare what the test expects vs what the UI actually has:

**Test expects**: `page.getByRole('button', { name: 'Submit' })`
**UI actually has**: `button` with text "Send" (not "Submit")

**Test expects**: `page.getByLabel('Account Number')`
**UI actually has**: `input` with label "Account" (not "Account Number")

### 6. Identify Root Cause

Determine why the test is failing:

#### UI Changed
- Button text changed
- Label text changed
- Element structure changed
- New elements added/removed

#### Timing Issues
- Element appears after longer delay
- Animation/transition not complete
- Network request slower than expected

#### Test Logic Issue
- Test assumes wrong initial state
- Missing wait for element
- Wrong navigation path

#### Data Issues
- Test data no longer valid
- Database state changed
- API response format changed

#### Environment Issues
- Different environment (dev vs prod)
- Feature flag disabled
- Permission issue

### 7. Fix the Issue

Apply the appropriate fix based on root cause:

#### Fix A: Update Page Object Locator

If element selector changed:

**Before** (in page object):
```typescript
readonly submitButton: Locator;

constructor(page: Page) {
  this.submitButton = page.getByRole('button', { name: 'Submit' });
}
```

**After**:
```typescript
readonly submitButton: Locator;

constructor(page: Page) {
  this.submitButton = page.getByRole('button', { name: 'Send' }); // Updated text
}
```

#### Fix B: Update Test Assertion

If expected value changed:

**Before** (in test):
```typescript
await expect(page.getByText('Transfer complete')).toBeVisible();
```

**After**:
```typescript
await expect(page.getByText('Transfer successful')).toBeVisible(); // Updated message
```

#### Fix C: Add Wait/Timeout

If timing issue:

**Before**:
```typescript
await transferPage.clickSubmit();
await expect(page.getByText('Success')).toBeVisible();
```

**After**:
```typescript
await transferPage.clickSubmit();
await page.waitForLoadState('networkidle'); // Wait for request to complete
await expect(page.getByText('Success')).toBeVisible();
```

Or increase timeout:
```typescript
await expect(page.getByText('Success')).toBeVisible({ timeout: 10000 });
```

#### Fix D: Update Test Flow

If navigation/flow changed:

**Before**:
```typescript
await dashboardPage.goto();
await dashboardPage.clickTransfer();
```

**After**:
```typescript
await dashboardPage.goto();
await dashboardPage.openMenu(); // New step: menu now required
await dashboardPage.clickTransfer();
```

#### Fix E: Use More Robust Locators

If element is fragile:

**Before**:
```typescript
readonly submitButton = this.page.locator('.btn-submit'); // CSS class
```

**After**:
```typescript
readonly submitButton = this.page.getByRole('button', { name: 'Submit' }); // Role-based
```

**Locator preference** (most robust to least):
1. `getByRole()` - Best for accessibility
2. `getByLabel()` - Good for form fields
3. `getByPlaceholder()` - Form inputs
4. `getByText()` - Text content
5. `getByTestId()` - Explicit test IDs (add data-testid to app)
6. `locator()` with CSS/XPath - Last resort

### 8. Verify the Fix

After making changes:

#### Run the Specific Test
```bash
npm test -- {test-file}.spec -g "failing test name"
```

#### Check Results
- Does the test pass now?
- Are there any new errors?
- Did the fix break other tests?

#### Run Related Tests
```bash
npm test -- {test-file}.spec  # Run all tests in the file
```

Ensure your fix didn't break other tests in the same file.

### 9. Document the Change

#### Add Comment if Non-Obvious

If the fix addresses a UI change:
```typescript
// Updated 2026-02-10: Button text changed from "Submit" to "Send"
readonly submitButton = page.getByRole('button', { name: 'Send' });
```

#### Update Exploration Notes

If the UI change is significant, update the exploration notes:
```markdown
## UI Changes (2026-02-10)

- Submit button text changed from "Submit" to "Send"
- Account Number label simplified to "Account"
```

### 10. Consider Broader Impact

Check if the same issue affects other tests:

#### Search for Similar Patterns
```bash
# Search for same selector across codebase
# Use VS Code search or grep
```

If multiple tests use the same incorrect selector, fix them all.

#### Update Multiple Files if Needed

Use multi_replace_string_in_file for efficiency:
- Update page object
- Update multiple tests
- Update related components

## Common Failure Scenarios

### Scenario 1: "Locator not found"

**Symptom**: `Error: Locator not found: button[name="Submit"]`

**Diagnosis**:
1. Open browser to that page
2. Take snapshot
3. Search for button elements
4. Check actual button text

**Fix**: Update locator with correct text/role

### Scenario 2: "Expected toBeVisible, but element was not found"

**Symptom**: Assertion fails, element never appears

**Diagnosis**:
1. Check if element exists but is hidden
2. Check if navigation went to wrong page
3. Check if element has different selector

**Fix**: 
- Fix navigation if wrong page
- Update selector if element exists
- Add wait if timing issue

### Scenario 3: "Timeout exceeded"

**Symptom**: Test times out waiting for element

**Diagnosis**:
1. Open browser and manually perform action
2. Check how long it takes
3. Check if there's a loading state

**Fix**:
- Increase timeout if legitimately slow
- Add explicit wait for loading to complete
- Check if action is triggering correctly

### Scenario 4: "Expected X but got Y"

**Symptom**: Assertion value mismatch

**Diagnosis**:
1. Inspect actual element value/text
2. Check if format changed (e.g., "$100" → "$100.00")
3. Check if calculation logic changed

**Fix**:
- Update expected value
- Use more flexible assertion (contains, matches regex)
- Update test data if data changed

### Scenario 5: "Element is detached from DOM"

**Symptom**: Element was found but is no longer attached

**Diagnosis**:
1. Check if page re-renders during test
2. Check if element is inside dynamic content
3. Check if navigation occurred

**Fix**:
- Re-query element after DOM change
- Use more stable locator
- Add wait for DOM to stabilize

## VB Bank Specific Patterns

### Authentication Issues

If test fails at login:
```typescript
// Check if credentials are still valid
await page.goto('https://vb-bank-demo.vercel.app');
await page.getByLabel('Username').fill(users.johnDoe.username);
await page.getByLabel('Password').fill(users.johnDoe.password);
await page.getByRole('button', { name: 'Login' }).click();

// Verify authentication
await expect(page).toHaveURL(/dashboard/);
```

### Storage State Issues

If using storage state and tests fail:
```bash
# Regenerate auth state
npm run test:auth
```

### Balance/Data Issues

If balance-dependent tests fail:
```typescript
// Don't hardcode balances, get current balance
const currentBalance = await dashboardPage.getCurrentBalance();
const expectedBalance = currentBalance - transferAmount;
```

### API vs UI Mismatch

If API test passes but UI test fails:
- Check if UI has caching
- Check if UI has delay
- Refresh page before assertion

## Best Practices

1. **Always inspect live UI**: Don't guess at selectors
2. **Use robust locators**: Prefer role-based locators
3. **Add waits explicitly**: Don't rely on auto-wait alone
4. **Test the fix**: Run the test after fixing
5. **Check impact**: Search for similar patterns to fix
6. **Document changes**: Add comments for non-obvious fixes
7. **Update exploration notes**: Track UI changes over time

## Tools to Use

- **Playwright MCP**: Navigate, inspect, take snapshots
- **grep_search**: Find similar patterns across files
- **read_file**: Read test and page object code
- **replace_string_in_file**: Fix single occurrence
- **multi_replace_string_in_file**: Fix multiple occurrences
- **run_in_terminal**: Run tests to verify fixes

## Output

After healing:
1. **Confirm fix**: "Test now passes ✓"
2. **Summarize change**: "Updated button locator from 'Submit' to 'Send'"
3. **Impact note**: "Fixed in TransferPage; affects 3 tests"

## Next Steps

After fixing tests:
- Run full test suite to ensure no regressions
- Update documentation if UI changed significantly
- Consider updating test tags if test scope changed
- Update session notes with UI changes discovered
