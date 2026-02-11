# AI Explorer Quick Start - VB Bank

A practical guide to using the AI Explorer workflow with the VB Bank Playwright project.

## What is AI Explorer?

AI Explorer is a structured workflow for using AI agents to systematically explore, document, and test web applications through browser automation. It transforms exploration into executable tests.

## Prerequisites

✅ GitHub Copilot (Agent mode) in VS Code  
✅ Playwright MCP server (for browser automation)  
✅ VB Bank project set up and running

## The Five-Stage Workflow

```
Explore → Draft → Generate → Update → Heal
   ↓         ↓        ↓         ↓       ↓
 Notes    Test     Actual    Updated  Fixed
         Cases     Tests      Docs    Tests
```

---

## Stage 1: Explore

**Command**: `"Explore {feature}"`

### Example
```
Explore transfer
```

### What Happens
1. Creates `sessions/2026-02-10-transfer/` folder
2. Opens browser to `https://vb-bank-demo.vercel.app`
3. Logs in as john.doe
4. Navigates the transfer feature
5. Documents everything in `exploration-notes.md`
6. Captures raw Playwright code

### What You Get
- **exploration-notes.md**: Complete UI documentation
  - Pages visited
  - UI components
  - User flows
  - Edge cases
  - Raw Playwright code

### Tips
- Let the agent explore thoroughly
- It will update notes every 2-3 actions
- Browser stays open across chat sessions
- If context gets heavy, start fresh chat and say:
  ```
  Continue exploring transfer. Read sessions/2026-02-10-transfer/exploration-notes.md for context.
  ```

---

## Stage 2: Draft Test Cases

**Command**: `"Draft test cases for {feature}"`

### Example
```
Draft test cases for transfer
```

### What Happens
1. Reads exploration notes
2. Identifies test scenarios
3. Creates structured test case document
4. Adds test IDs, steps, expected results, tags

### What You Get
- **test-cases.md**: Organized test scenarios
  - TC-001, TC-002, etc.
  - Preconditions
  - Test steps with expected results
  - Tags (@smoke, @regression, @e2e)
  - Postconditions

### Tips
- Review test cases before generating code
- Suggest additional scenarios if needed
- Verify test tags are appropriate

---

## Stage 3: Generate Tests

**Command**: `"Generate tests for {feature}"`

### Example
```
Generate tests for transfer
```

### What Happens
1. Reads test cases and exploration notes
2. Creates/updates page object: `src/pages/transfer.page.ts`
3. Generates test file: `src/tests/ui/transfer.spec.ts`
4. Uses raw Playwright code from exploration
5. Follows VB Bank project conventions

### What You Get
- **Page Object**: `src/pages/{feature}.page.ts`
  - Locators as readonly properties
  - Navigation methods
  - Action methods
  - Getter methods
- **Test File**: `src/tests/ui/{feature}.spec.ts`
  - Organized test suites
  - Tests with proper tags
  - AAA pattern (Arrange, Act, Assert)

### Tips
- Run tests immediately: `npm test -- {feature}.spec`
- Review page object methods for reusability
- Check test tags are applied correctly

---

## Stage 4: Update Docs

**Command**: `"Update docs for {feature}"`

### Example
```
Update docs for transfer
```

### What Happens
1. Reads generated tests
2. Updates README.md with test counts
3. Creates/updates feature documentation
4. Documents test patterns

### What You Get
- Updated README.md
- Feature-specific documentation
- Test coverage statistics
- Usage examples

---

## Stage 5: Heal Tests

**Command**: `"Fix the failing test"`

### Example
```
Fix the failing test
```

or be specific:

```
Fix the transfer validation test
```

### What Happens
1. Identifies failing test
2. Opens browser and inspects current UI
3. Compares expected vs actual
4. Updates selectors or test logic
5. Verifies fix works

### What You Get
- Fixed test code
- Updated page objects
- Working tests

### Tips
- The agent will inspect live UI (don't guess)
- Prefer role-based locators
- Run test after fix: `npm test -- {feature}.spec -g "test name"`

---

## Quick Examples

### Explore the Dashboard
```
Explore dashboard
```

### Explore Admin User Management
```
Explore admin user management
```

### Complete End-to-End Flow
```
Explore loan application
Draft test cases for loan application
Generate tests for loan application
Update docs for loan application
```

### Fix a Broken Test
```
Fix the failing test in transfer.spec.ts
```

---

## VB Bank Specifics

### Application URL
```
https://vb-bank-demo.vercel.app
```

### Available Users
From `src/data/credentials.ts`:

**Regular Users**:
- john.doe / user123 (balance: $15,000)
- jane.smith / user123 (balance: $25,000.50)
- mike.wilson / user123 (balance: $8,500.75)

**Admin**:
- admin / admin123

### Features to Explore

**User Features**:
- Login/Register
- Dashboard
- Transfer (money between accounts)
- Top-up (add funds)
- Loan (application & management)
- Bill Pay (pay bills)
- History (transaction history)
- Settings (profile management)

**Admin Features**:
- Admin Dashboard
- User Management (CRUD operations)

### Project Structure

**Tests**:
- `src/tests/ui/{feature}.spec.ts` - UI tests
- `src/tests/api/{feature}.api.spec.ts` - API tests

**Page Objects**:
- `src/pages/{feature}.page.ts`

**Test Data**:
- `src/data/credentials.ts` - User credentials
- `src/data/test-data.ts` - Test data

### Test Tags

- `@smoke` - Critical happy paths (run before release)
- `@regression` - Comprehensive scenarios
- `@e2e` - End-to-end user journeys
- `@admin` - Admin-specific features
- `@api` - API tests

### Running Tests

Always use npm scripts (per project convention):

```bash
# Run all tests
npm test

# Run specific feature
npm test -- transfer.spec

# Run by tag
npm run test:smoke
npm run test:regression
npm run test:admin

# Run with UI mode (for debugging)
npm run test:ui -- transfer.spec

# Generate report
npm run report
```

---

## Common Patterns

### Start Exploration
```
Explore {feature}
```

### Continue After Context Limit
```
Continue exploring {feature}. Read sessions/{date}-{feature}/exploration-notes.md for context. The browser is still open.
```

### Complete Feature Testing
```
1. Explore {feature}
2. Draft test cases for {feature}
3. Generate tests for {feature}
4. Update docs for {feature}
```

### Debug Failing Test
```
Fix the failing test
```

---

## Troubleshooting

### "413 Request Entity Too Large"
**Problem**: Too many screenshots inflated context

**Solution**:
1. Start fresh chat
2. Say: "Continue exploring {feature}. Read sessions/{date}-{feature}/exploration-notes.md"
3. The browser is still open, exploration continues

### "Test is failing"
**Solution**:
```
Fix the failing test in {feature}.spec.ts
```
The agent will inspect the live UI and update selectors.

### "Browser session expired"
**Solution**:
```
Re-authenticate and continue exploring {feature}
```

### "Context lost after many interactions"
**Solution**: Start fresh chat, reference the notes file:
```
Continue from sessions/{date}-{feature}/exploration-notes.md
```

---

## Best Practices

### During Exploration
✅ Let agent update notes every 2-3 actions  
✅ Prefer accessibility snapshots over screenshots  
✅ Test edge cases (empty states, validations, errors)  
✅ Try different user roles (user vs admin)

### During Test Generation
✅ Review page object methods for clarity  
✅ Check test tags are appropriate  
✅ Run tests immediately after generation  
✅ Use existing test data from credentials.ts

### During Healing
✅ Let agent inspect live UI (don't guess)  
✅ Prefer role-based locators  
✅ Run test after fix to verify  
✅ Check if other tests need same fix

---

## Session Data Location

All exploration data is saved in:
```
sessions/
└── YYYY-MM-DD-{feature}/
    ├── metadata.json
    ├── exploration-notes.md
    ├── test-cases.md
    └── screenshots/
```

**Note**: `sessions/` is gitignored (ephemeral workspace data)

---

## Detailed Documentation

For complete workflow documentation, see:
- [AI Explorer Overview](./ai-explorer.md)
- Prompt files in `.github/prompts/`
- [GitHub Copilot Instructions](../.github/copilot-instructions.md)

---

## Quick Reference Card

| Want to... | Say this... |
|------------|-------------|
| Explore a feature | "Explore {feature}" |
| Create test cases | "Draft test cases for {feature}" |
| Generate test code | "Generate tests for {feature}" |
| Update documentation | "Update docs for {feature}" |
| Fix broken test | "Fix the failing test" |
| Continue exploration | "Continue exploring {feature}. Read sessions/{date}-{feature}/exploration-notes.md" |
| Run tests | `npm test -- {feature}.spec` |
| Run smoke tests | `npm run test:smoke` |
| Debug test | `npm run test:ui -- {feature}.spec` |

---

## Example Session

Here's what a complete feature exploration looks like:

```
You: Explore transfer

Agent: [Creates sessions/2026-02-10-transfer/ folder]
        [Opens browser, logs in, navigates UI]
        [Documents in exploration-notes.md]
        [Captures flows and edge cases]
        ✓ Exploration complete

You: Draft test cases for transfer

Agent: [Reads exploration-notes.md]
        [Creates test-cases.md with scenarios]
        ✓ 12 test cases drafted

You: Generate tests for transfer

Agent: [Creates src/pages/transfer.page.ts]
        [Generates src/tests/ui/transfer.spec.ts]
        ✓ Tests generated

You: npm test -- transfer.spec

Agent: [Runs tests]
        ✓ 12 tests pass

You: Update docs for transfer

Agent: [Updates README.md]
        [Creates docs/transfer-testing.md]
        ✓ Documentation updated
```

---

**Ready to explore?** Try: `Explore dashboard` or `Explore transfer`
