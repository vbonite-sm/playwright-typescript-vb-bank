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
