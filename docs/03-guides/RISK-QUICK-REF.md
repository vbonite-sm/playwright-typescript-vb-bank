# Risk-Based Testing - Quick Reference

## 🎯 What is Risk-Based Testing?

Risk-based testing prioritizes test execution based on **business impact**, **failure probability**, and **security/compliance requirements** rather than running all tests equally.

## 🏷️ Risk Tags

| Tag | Priority | When to Run | Examples |
|-----|----------|-------------|----------|
| `@critical` | P0 | Every commit | Auth, Transfer, Bill Pay |
| `@high` | P1 | Pre-deploy | Loans, Top-up, Admin |
| `@medium` | P2 | Nightly | History, Dashboard |
| `@low` | P3 | Weekly | Navigation, Settings |

**Domain Tags:**
- `@financial` - Money movement
- `@security` - Auth/authorization
- `@compliance` - Regulatory requirements

## ⚡ Quick Commands

```bash
# Run by risk level
npm run test:critical          # 10 tests, ~35s (Deployment gate)
npm run test:high              # 8 tests, ~20s
npm run test:medium            # 8 tests, ~18s
npm run test:low               # 4 tests, ~5s

# Combined runs
npm run test:pre-commit        # CRITICAL tests only
npm run test:pre-deploy        # CRITICAL + HIGH
npm run test:deployment-gate   # Same as critical

# Domain-specific
npm run test:financial         # All financial tests
npm run test:security          # All security tests
npm run test:compliance        # All compliance tests

# Using Playwright projects
npm run test:risk:critical     # Run via critical project
npm run test:risk:high         # Run via high-risk project
```

## 📊 Generate Reports

```bash
# Console output
npm run risk:report

# JSON format
npm run risk:report:json

# Markdown format
npm run risk:report:md
```

Sample output:
```
============================================================
  RISK-BASED TESTING REPORT
============================================================

📊 TEST SUMMARY:
  Total: 30 tests
  🚨 CRITICAL: 10 (33%)
  ⚠️  HIGH: 8 (27%)
  📋 MEDIUM: 8 (27%)
  📝 LOW: 4 (13%)

🚨 DEPLOYMENT GATE: 10 critical tests
   Est. Time: 35.0s
```

## 🚀 Execution Strategy

### 1. Pre-Commit Hook (Fast)
```bash
npm run test:critical
```
- **Duration:** ~35 seconds
- **Tests:** 10 critical tests
- **Action:** Block commit if fails

### 2. Pull Request / CI
```bash
npm run test:pre-deploy
```
- **Duration:** ~55 seconds  
- **Tests:** 18 tests (CRITICAL + HIGH)
- **Action:** Block merge if fails

### 3. Nightly Regression
```bash
npm test
```
- **Duration:** ~1 minute 18 seconds
- **Tests:** 26 tests (excluding LOW)
- **Action:** Investigate failures within 24h

### 4. Weekly Full Suite
```bash
npm run test:regression
```
- **Duration:** ~1 minute 30 seconds
- **Tests:** All 30 tests
- **Action:** Triage and prioritize fixes

## 🎨 Feature Risk Matrix

| Feature | Risk | Tests | Owner |
|---------|------|-------|-------|
| 🚨 Authentication | CRITICAL | 3 | security-team |
| 🚨 Money Transfer | CRITICAL | 7 | payment-team |
| ⚠️ Loan Application | HIGH | 2 | lending-team |
| ⚠️ Account Top-Up | HIGH | 1 | payment-team |
| ⚠️ User Management | HIGH | 5 | platform-team |
| 📋 Dashboard | MEDIUM | 5 | frontend-team |
| 📋 Transaction History | MEDIUM | 3 | reporting-team |
| 📝 Navigation | LOW | 4 | frontend-team |

## 💡 Usage Examples

### Writing a Risk-Tagged Test

```typescript
test('should transfer money successfully @smoke @e2e @critical @financial', 
  async ({ transferPage }) => {
    // Test implementation
  }
);
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
jobs:
  critical:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:critical
      
  pre-deploy:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:pre-deploy
```

### Running Specific Combinations

```bash
# Critical financial tests only
npx playwright test --grep "@critical.*@financial"

# High + Medium security tests
npx playwright test --grep "@high|@medium" --grep "@security"

# All non-low tests
npx playwright test --grep-invert "@low"
```

## 📈 Risk Score Calculation

```
Risk Score = (Business Impact × 0.40) + 
             (Failure Probability × 0.25) + 
             (Usage Frequency × 0.20) + 
             (Security Impact × 0.15)

Risk Level:
  ≥ 4.0 = CRITICAL
  ≥ 3.0 = HIGH
  ≥ 2.0 = MEDIUM
  < 2.0 = LOW
```

## 📚 Advanced Features

### Dynamic Risk Adjustment
```typescript
import { getRecommendedRiskLevel } from '@/helpers';

// Adjust risk based on test history
const recommendation = getRecommendedRiskLevel(
  testMetadata,
  executionHistory,
  defects
);
```

### Test Prioritization
```typescript
import { prioritizeTests } from '@/helpers';

// Prioritize tests within 2-minute budget
const { selectedTests } = prioritizeTests(
  allTests,
  executions,
  defects,
  120000 // 2 minutes in ms
);
```

### Execution History Analysis
```typescript
import { analyzeExecutionHistory } from '@/helpers';

const analysis = analyzeExecutionHistory(testId, executions);
// Returns: passRate, flakiness, avgDuration, recentFailures
```

## 🔧 Configuration Files

- **Risk Registry:** [src/config/risk-registry.ts](../src/config/risk-registry.ts)
- **Risk Calculator:** [src/helpers/risk-calculator.ts](../src/helpers/risk-calculator.ts)
- **Risk Reporter:** [src/helpers/risk-reporter.ts](../src/helpers/risk-reporter.ts)
- **Playwright Config:** [playwright.config.ts](../playwright.config.ts)
- **Package Scripts:** [package.json](../package.json)

## 📖 Full Documentation

See [docs/03-guides/risk-based-testing.md](risk-based-testing.md) for complete documentation.

## 🆘 Troubleshooting

**Q: Tests not filtering by risk tag?**  
Ensure tag is in test name: `test('name @critical', ...)`

**Q: Want to run multiple tags?**  
Use: `--grep "@critical|@high"`

**Q: How to update risk scores?**  
Edit `src/config/risk-registry.ts`

**Q: Generate report after test run?**  
Run: `npm run risk:report`

---

**Last Updated:** February 12, 2026  
**Version:** 1.0.0
