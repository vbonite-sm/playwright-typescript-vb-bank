# GitHub Copilot Instructions

## Testing Guidelines

When running tests, always prefer using the npm scripts defined in `package.json` instead of running Playwright commands directly:

### Available Test Scripts

- `npm test` - Run all tests
- `npm run test:smoke` - Run smoke tests only
- `npm run test:regression` - Run regression tests only
- `npm run test:e2e` - Run end-to-end tests only
- `npm run test:api-only` - Run API tests only
- `npm run test:ui-only` - Run UI tests only
- `npm run test:headed` - Run tests in headed mode
- `npm run test:ui` - Run tests with UI mode
- `npm run test:debug` - Run tests in debug mode
- `npm run report` - Show test report

### Project-Specific Scripts

- `npm run test:auth` - Run auth setup project
- `npm run test:user` - Run user (chromium) project
- `npm run test:admin` - Run admin project
- `npm run test:api` - Run API project

### CI Scripts

- `npm run test:ci` - Run all tests with dot reporter (for CI)
- `npm run test:ci:smoke` - Run smoke tests for CI
- `npm run test:ci:regression` - Run regression tests for CI

## Why Use npm Scripts?

1. **Consistency** - Ensures commands work across different environments
2. **Maintainability** - Updates to commands only need to be made in one place
3. **Documentation** - Scripts serve as living documentation of available commands
4. **Cross-platform** - Handles platform differences (Windows/Mac/Linux)
5. **Proper escaping** - Scripts have proper quote escaping for grep patterns

## Examples

**❌ Don't do this:**
```bash
npx playwright test --grep @smoke
```

**✅ Do this instead:**
```bash
npm run test:smoke
```

---

## Coding Style

### Comments and Communication

- **No emojis**: Never use emojis in code, comments, commit messages, or documentation
- **Concise comments**: Keep comments brief and to the point. Focus on "why" not "what"
- **Avoid verbose explanations**: Don't over-explain obvious code. Trust the developer's understanding
- **Self-documenting code**: Prefer clear naming over excessive comments

**Examples:**

**❌ Don't do this:**
```typescript
// 🎉 This function calculates the total amount! It takes all the items 
// in the array and adds them up one by one using a loop
// Returns the sum of all items 🚀
function calculateTotal(items: number[]): number {
  // Initialize a variable to store our running total
  let total = 0;
  // Loop through each item in the items array
  for (const item of items) {
    // Add the current item to our total
    total += item;
  }
  // Return the final calculated total
  return total;
}
```

**✅ Do this instead:**
```typescript
// Sums array values
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}
```

---

## AI Explorer Workflow

This project uses a structured AI exploration workflow to systematically discover, document, and test features. The workflow has five stages, each triggered by a specific command.

### Workflow Stages

| Stage | Command | Prompt File | Purpose |
|-------|---------|-------------|---------|
| **Explore** | "Explore {feature}" | `.github/prompts/explore.prompt.md` | Navigate UI, document structure, capture flows |
| **Draft** | "Draft test cases for {feature}" | `.github/prompts/draft-test-cases.prompt.md` | Transform notes into structured test scenarios |
| **Generate** | "Generate tests for {feature}" | `.github/prompts/generate-tests.prompt.md` | Create executable Playwright tests |
| **Update** | "Update docs for {feature}" | `.github/prompts/update-docs.prompt.md` | Update project documentation |
| **Heal** | "Fix the failing test" | `.github/prompts/heal-tests.prompt.md` | Repair broken tests |

### How It Works

1. **Explore a feature**: Say "Explore {feature}" (e.g., "Explore transfer")
   - Creates session folder in `sessions/YYYY-MM-DD-{feature}/`
   - Navigates the UI using browser automation
   - Documents findings incrementally in `exploration-notes.md`
   - Captures raw Playwright code for later use

2. **Draft test cases**: Say "Draft test cases for {feature}"
   - Reads exploration notes
   - Creates `test-cases.md` with structured scenarios
   - Includes steps, expected results, and tags

3. **Generate tests**: Say "Generate tests for {feature}"
   - Reads test cases and exploration notes
   - Creates/updates page objects in `src/pages/`
   - Generates test files in `src/tests/ui/` or `src/tests/api/`

4. **Update documentation**: Say "Update docs for {feature}"
   - Updates README with test counts
   - Creates/updates feature documentation
   - Documents test patterns

5. **Heal failing tests**: Say "Fix the failing test"
   - Inspects current UI with browser tools
   - Identifies why test is failing
   - Updates selectors or test logic

### Key Features

- **Incremental note-writing**: Notes updated every 2-3 actions to prevent data loss
- **Session continuity**: Browser stays open across chat sessions
- **Context management**: Start fresh chats when needed; notes file is durable memory
- **Prefer snapshots**: Use accessibility snapshots over screenshots

### Session Data

All exploration data lives in `sessions/` (gitignored):
```
sessions/
└── 2026-02-10-transfer/
    ├── metadata.json
    ├── exploration-notes.md
    ├── test-cases.md
    └── screenshots/
```

### VB Bank Specifics

**Application**: `https://vb-bank-demo.vercel.app`

**Credentials** (from `src/data/credentials.ts`):
- Regular users: john.doe, jane.smith, mike.wilson (password: user123)
- Admin: admin (password: admin123)

**Features to Explore**:
- Login/Register
- Dashboard
- Transfer
- Top-up
- Loan
- Bill Pay
- History
- Settings
- Admin Dashboard
- User Management

**Test Organization**:
- UI tests: `src/tests/ui/{feature}.spec.ts`
- API tests: `src/tests/api/{feature}.api.spec.ts`
- Page objects: `src/pages/{feature}.page.ts`

**Test Tags**:
- `@smoke` - Critical happy path
- `@regression` - Comprehensive scenarios
- `@e2e` - End-to-end flows
- `@admin` - Admin features
- `@api` - API tests

### Best Practices

1. **Read the prompt file**: Each stage has detailed instructions in `.github/prompts/`
2. **Update notes continuously**: Don't accumulate findings in chat memory
3. **Use browser tools**: Always inspect live UI, don't guess at selectors
4. **Follow project conventions**: Use npm scripts, existing patterns, page objects
5. **Start fresh if needed**: Context limits can be hit; start new chat pointing to notes file

For complete workflow documentation, see [docs/ai-explorer.md](../docs/ai-explorer.md).
