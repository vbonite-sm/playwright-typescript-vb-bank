# Risk-Based Testing Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RISK-BASED TESTING SYSTEM                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Risk Registry   │────▶│ Risk Calculator  │────▶│  Risk Reporter   │
│                  │     │                  │     │                  │
│ • Test metadata  │     │ • Dynamic scores │     │ • Console report │
│ • Risk scores    │     │ • History analysis│     │ • JSON export   │
│ • Feature profiles│     │ • Prioritization │     │ • HTML report   │
│ • Ownership      │     │ • Heatmaps       │     │ • Dashboard data│
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                        │                         │
         └────────────────────────┼─────────────────────────┘
                                  ▼
                    ┌──────────────────────────┐
                    │   Playwright Config      │
                    │                          │
                    │ • critical project       │
                    │ • high-risk project      │
                    │ • medium-risk project    │
                    │ • low-risk project       │
                    │ • financial project      │
                    │ • security project       │
                    └──────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │      Test Execution      │
                    └──────────────────────────┘
```

## Risk Levels & Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         RISK PYRAMID                             │
└─────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │  CRITICAL   │  10 tests (~35s)
                         │             │  Every commit
                         │   🚨 P0     │  Blocks deployment
                         └─────────────┘
                      ┌──────────────────┐
                      │      HIGH        │  8 tests (~20s)
                      │                  │  Pre-staging/prod
                      │     ⚠️  P1       │  Investigation required
                      └──────────────────┘
                 ┌──────────────────────────┐
                 │        MEDIUM            │  8 tests (~18s)
                 │                          │  Nightly regression
                 │         📋 P2            │  24hr investigation
                 └──────────────────────────┘
            ┌───────────────────────────────────┐
            │            LOW                    │  4 tests (~5s)
            │                                   │  Weekly/major releases
            │            📝 P3                  │  No blocker
            └───────────────────────────────────┘
```

## Execution Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHEN TO RUN WHAT                              │
└─────────────────────────────────────────────────────────────────┘

PRE-COMMIT (Developer Machine)
├─ npm run test:critical
├─ Duration: ~35 seconds
├─ Tests: 10 CRITICAL
└─ Action: Block commit if fails
    │
    ▼
PULL REQUEST / CI (GitHub Actions)
├─ npm run test:pre-deploy
├─ Duration: ~55 seconds
├─ Tests: 18 (CRITICAL + HIGH)
└─ Action: Block merge if fails
    │
    ▼
NIGHTLY REGRESSION (Scheduled)
├─ npm test
├─ Duration: ~1m 18s
├─ Tests: 26 (exclude LOW)
└─ Action: Investigate within 24h
    │
    ▼
WEEKLY FULL SUITE (Scheduled)
├─ npm run test:regression
├─ Duration: ~1m 30s
├─ Tests: 30 (all tests)
└─ Action: Triage and prioritize
```

## Feature Risk Map

```
┌─────────────────────────────────────────────────────────────────┐
│                  FEATURE RISK DISTRIBUTION                       │
└─────────────────────────────────────────────────────────────────┘

Feature                   Risk Level      Tests   Owner
═══════════════════════════════════════════════════════════════════
🚨 Authentication         CRITICAL         3      security-team
   └─ Login, Logout, Invalid credentials

🚨 Money Transfer         CRITICAL         7      payment-team
   └─ Transfer success, validation, limits

🚨 Bill Payment           CRITICAL         1      payment-team
   └─ Payment processing

⚠️  Loan Application      HIGH             2      lending-team
   └─ Wizard navigation, submission

⚠️  Account Top-Up        HIGH             1      payment-team
   └─ Add funds

⚠️  User Management       HIGH             5      platform-team
   └─ Admin CRUD, search, permissions

📋 Transaction History    MEDIUM           3      reporting-team
   └─ Display, filters, export

📋 Dashboard              MEDIUM           5      frontend-team
   └─ Balance, stats, widgets

📝 Navigation             LOW              4      frontend-team
   └─ Menu, links, routing
```

## Risk Score Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│                   RISK SCORING FORMULA                           │
└─────────────────────────────────────────────────────────────────┘

Risk Score = (Business Impact      × 0.40) +
             (Failure Probability   × 0.25) +
             (Usage Frequency       × 0.20) +
             (Security Impact       × 0.15)

Each factor: 1-5 scale (5 = highest)

Risk Level Mapping:
├─ Score ≥ 4.0  →  CRITICAL
├─ Score ≥ 3.0  →  HIGH
├─ Score ≥ 2.0  →  MEDIUM
└─ Score < 2.0  →  LOW

Example: Money Transfer
├─ Business Impact: 5/5      (Financial loss potential)
├─ Failure Prob:    3/5      (Moderate complexity)
├─ Usage Frequency: 5/5      (High usage)
└─ Security Impact: 4/5      (Authorization required)

  Score = (5 × 0.4) + (3 × 0.25) + (5 × 0.2) + (4 × 0.15)
        = 2.0 + 0.75 + 1.0 + 0.6
        = 4.35  →  CRITICAL ✅
```

## Dynamic Risk Adjustment

```
┌─────────────────────────────────────────────────────────────────┐
│              DYNAMIC RISK FACTORS                                │
└─────────────────────────────────────────────────────────────────┘

Base Risk Score × Adjustment Multipliers = Adjusted Risk Score

Multipliers:
├─ Recent Failures        (1.0 - 1.5x)
│  └─ 0 failures: 1.0x
│  └─ 1-2 failures: 1.1x
│  └─ 3-5 failures: 1.25x
│  └─ 6+ failures: 1.5x
│
├─ Defect Density         (1.0 - 2.0x)
│  └─ No defects: 1.0x
│  └─ 1 high defect: +0.25x
│  └─ 1 critical defect: +0.5x
│
├─ Flakiness Rate         (1.0 - 1.5x)
│  └─ < 5% flaky: 1.0x
│  └─ 5-15% flaky: 1.1x
│  └─ 15-30% flaky: 1.25x
│  └─ > 30% flaky: 1.5x
│
├─ Code Churn            (1.0 - 1.3x)
│  └─ Based on recent file changes
│
└─ Production Incidents   (1.0 - 2.5x)
   └─ P0 incident: +0.8x
   └─ P1 incident: +0.5x
```

## NPM Command Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    AVAILABLE COMMANDS                            │
└─────────────────────────────────────────────────────────────────┘

Risk Level Commands:
├─ npm run test:critical          # 10 CRITICAL tests
├─ npm run test:high              # 8 HIGH tests
├─ npm run test:medium            # 8 MEDIUM tests
└─ npm run test:low               # 4 LOW tests

Combined Strategies:
├─ npm run test:pre-commit        # Same as critical
├─ npm run test:pre-deploy        # CRITICAL + HIGH
└─ npm run test:deployment-gate   # Same as critical

Domain-Specific:
├─ npm run test:financial         # All money operations
├─ npm run test:security          # All auth/authz tests
└─ npm run test:compliance        # All regulatory tests

Risk Reporting:
├─ npm run risk:report            # Console output
├─ npm run risk:report:json       # JSON file
└─ npm run risk:report:md         # Markdown file

Playwright Projects:
├─ npm run test:risk:critical     # Via critical project
├─ npm run test:risk:high         # Via high-risk project
├─ npm run test:risk:medium       # Via medium-risk project
└─ npm run test:risk:low          # Via low-risk project
```

## CI/CD Integration Example

```yaml
name: Risk-Based Testing

on: [push, pull_request]

jobs:
  critical:
    name: Critical Tests (Deployment Gate)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:critical
      # ▲ Blocks deployment if fails

  pre-deploy:
    name: Pre-Deploy Validation
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:pre-deploy
      # ▲ Blocks PR merge if fails

  nightly:
    name: Nightly Regression
    if: github.event.schedule
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run risk:report:html
      - uses: actions/upload-artifact@v3
        with:
          name: risk-report
          path: risk-report.html
```

## File Organization

```
playwright-typescript-vb-bank/
├── src/
│   ├── config/
│   │   ├── risk-registry.ts           ← Risk metadata & profiles
│   │   └── index.ts
│   ├── helpers/
│   │   ├── risk-calculator.ts         ← Dynamic risk calculations
│   │   ├── risk-reporter.ts           ← Report generation
│   │   └── index.ts
│   └── tests/                         ← Tests with risk tags
│       ├── ui/
│       │   ├── auth.spec.ts           @critical @security
│       │   ├── transfer.spec.ts       @critical @financial
│       │   ├── loan.spec.ts           @high @compliance
│       │   └── ...
│       └── api/
│           └── ...
├── docs/
│   └── 03-guides/
│       ├── risk-based-testing.md      ← Full documentation
│       └── RISK-QUICK-REF.md          ← Quick reference
├── generate-risk-report.js            ← Report generator script
├── risk-examples.ts                   ← Usage examples
├── playwright.config.ts               ← Risk-based projects
├── package.json                       ← Risk npm scripts
└── RISK-IMPLEMENTATION-SUMMARY.md     ← This summary
```

## Quick Start Checklist

```
□ Read:  docs/03-guides/RISK-QUICK-REF.md
□ Run:   npm run risk:report
□ Test:  npm run test:critical
□ CI/CD: Add test:pre-deploy to pipeline
□ Hook:  Add test:critical as pre-commit hook
```

---

**Status:** ✅ PRODUCTION READY  
**Version:** 1.0.0  
**Date:** February 12, 2026
