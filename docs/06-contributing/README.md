# 06 - Contributing Guidelines

This directory contains contributing guidelines, coding standards, and development workflows.

## 📁 Coming Soon

### Contributing Guide
*Coming soon*

How to contribute to the framework:
- Code of conduct
- How to report bugs
- How to suggest features
- Pull request process
- Code review expectations
- Communication channels

### Code Review Checklist
*Coming soon*

PR review guidelines:
- Code quality checks
- Test coverage requirements
- Documentation updates
- Performance considerations
- Security review
- Approval process

### Test Writing Standards
*Coming soon*

Coding standards for tests:
- Naming conventions
- File organization
- Test structure (AAA pattern)
- Assertion best practices
- Error handling
- Code comments
- Test tagging strategy

### Git Workflow
*Coming soon*

Version control practices:
- Branch naming conventions
- Commit message format
- PR title format
- Merge strategies
- Release process
- Hotfix workflow

### Style Guide
*Coming soon*

Code style standards:
- TypeScript conventions
- Formatting rules (Prettier)
- Linting rules (ESLint)
- Import organization
- Variable naming

---

## 🎯 Quick Guidelines

### Test Naming

```typescript
// ✅ Good
test('should login successfully with valid credentials @smoke', async () => {});
test('should display error for invalid password', async () => {});

// ❌ Bad
test('test1', async () => {});
test('login', async () => {});
```

### Test Tags

Use consistent tags:
- `@smoke` - Critical smoke tests
- `@regression` - Full regression suite
- `@e2e` - End-to-end user journeys
- `@api` - API tests
- `@critical` - P0 tests
- `@flaky` - Known flaky tests

### Commit Messages

```bash
# ✅ Good
feat: add login error scenario tests
fix: resolve flaky dashboard test
docs: update API client reference

# ❌ Bad
update stuff
fixes
wip
```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass locally
- [ ] Added new tests for changes
- [ ] Updated documentation

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] No console.log statements
```

---

## 📋 Before Submitting PR

1. ✅ Run tests locally: `npm test`
2. ✅ Run linting: `npm run lint`
3. ✅ Update documentation
4. ✅ Add/update tests
5. ✅ Fill out PR template
6. ✅ Request review

---

*Last updated: February 2026*
