/**
 * Risk-Based Testing Registry
 * 
 * Defines risk levels and metadata for each test in the suite.
 * Risk scores are calculated based on multiple factors:
 * - Business Impact (1-5): Financial/reputational cost of failure
 * - Failure Probability (1-5): Historical defect rate and complexity
 * - Usage Frequency (1-5): How often feature is used
 * - Security Impact (1-5): Authentication, authorization, data sensitivity
 * - Regulatory Impact (1-5): Compliance requirements (PCI-DSS, SOX, etc.)
 * 
 * Risk Score = (Business Impact × 0.4) + (Failure Probability × 0.25) + 
 *              (Usage Frequency × 0.2) + (Security Impact × 0.15)
 */

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface TestRiskMetadata {
  testId: string;
  testName: string;
  feature: string;
  riskLevel: RiskLevel;
  businessImpact: number; // 1-5
  failureProbability: number; // 1-5
  usageFrequency: number; // 1-5
  securityImpact: number; // 1-5
  regulatoryImpact: number; // 1-5
  totalScore: number; // Calculated weighted score
  owner?: string;
  lastFailureDate?: string;
  defectHistory?: number;
  tags: string[];
  executionTime?: number; // Expected execution time in ms
  flakiness?: number; // 0-1, higher = more flaky
}

export interface FeatureRiskProfile {
  feature: string;
  riskLevel: RiskLevel;
  description: string;
  businessImpact: number;
  securityImpact: number;
  regulatoryImpact: number;
  criticalTests: string[];
  owner: string;
}

/**
 * Calculate risk score based on weighted factors
 */
export function calculateRiskScore(metadata: {
  businessImpact: number;
  failureProbability: number;
  usageFrequency: number;
  securityImpact: number;
}): number {
  const score =
    metadata.businessImpact * 0.4 +
    metadata.failureProbability * 0.25 +
    metadata.usageFrequency * 0.2 +
    metadata.securityImpact * 0.15;

  return Math.round(score * 100) / 100;
}

/**
 * Determine risk level from score
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 4.0) return 'CRITICAL';
  if (score >= 3.0) return 'HIGH';
  if (score >= 2.0) return 'MEDIUM';
  return 'LOW';
}

/**
 * Feature Risk Profiles
 */
export const featureRiskProfiles: Record<string, FeatureRiskProfile> = {
  authentication: {
    feature: 'Authentication',
    riskLevel: 'CRITICAL',
    description: 'User login, logout, session management',
    businessImpact: 5,
    securityImpact: 5,
    regulatoryImpact: 5,
    criticalTests: ['auth-login-success', 'auth-logout', 'auth-invalid-credentials'],
    owner: 'security-team',
  },
  transfer: {
    feature: 'Money Transfer',
    riskLevel: 'CRITICAL',
    description: 'Peer-to-peer money transfers between accounts',
    businessImpact: 5,
    securityImpact: 4,
    regulatoryImpact: 5,
    criticalTests: ['transfer-success', 'transfer-insufficient-balance', 'transfer-invalid-account'],
    owner: 'payment-team',
  },
  billpay: {
    feature: 'Bill Payment',
    riskLevel: 'CRITICAL',
    description: 'Pay bills to external vendors',
    businessImpact: 5,
    securityImpact: 4,
    regulatoryImpact: 4,
    criticalTests: ['billpay-successful-payment'],
    owner: 'payment-team',
  },
  loan: {
    feature: 'Loan Application',
    riskLevel: 'HIGH',
    description: 'Apply for personal, home, or auto loans',
    businessImpact: 4,
    securityImpact: 3,
    regulatoryImpact: 5,
    criticalTests: ['loan-wizard-navigation', 'loan-application-submit'],
    owner: 'lending-team',
  },
  topup: {
    feature: 'Account Top-Up',
    riskLevel: 'HIGH',
    description: 'Add funds to account via card or bank',
    businessImpact: 4,
    securityImpact: 4,
    regulatoryImpact: 4,
    criticalTests: ['topup-page-load'],
    owner: 'payment-team',
  },
  admin: {
    feature: 'User Management',
    riskLevel: 'HIGH',
    description: 'Admin dashboard and user management',
    businessImpact: 4,
    securityImpact: 5,
    regulatoryImpact: 3,
    criticalTests: ['admin-dashboard-access', 'admin-user-list', 'admin-user-search'],
    owner: 'platform-team',
  },
  history: {
    feature: 'Transaction History',
    riskLevel: 'MEDIUM',
    description: 'View transaction history and audit trail',
    businessImpact: 3,
    securityImpact: 2,
    regulatoryImpact: 4,
    criticalTests: ['history-display'],
    owner: 'reporting-team',
  },
  dashboard: {
    feature: 'User Dashboard',
    riskLevel: 'MEDIUM',
    description: 'Main dashboard with account overview',
    businessImpact: 3,
    securityImpact: 2,
    regulatoryImpact: 2,
    criticalTests: ['dashboard-balance-display'],
    owner: 'frontend-team',
  },
  settings: {
    feature: 'User Settings',
    riskLevel: 'LOW',
    description: 'User preferences and profile settings',
    businessImpact: 2,
    securityImpact: 2,
    regulatoryImpact: 1,
    criticalTests: [],
    owner: 'frontend-team',
  },
  navigation: {
    feature: 'Navigation',
    riskLevel: 'LOW',
    description: 'UI navigation and menu structure',
    businessImpact: 2,
    securityImpact: 1,
    regulatoryImpact: 1,
    criticalTests: [],
    owner: 'frontend-team',
  },
};

/**
 * Test Risk Registry
 * Maps individual tests to their risk metadata
 */
export const testRiskRegistry: Record<string, TestRiskMetadata> = {
  // ============================================================================
  // AUTHENTICATION TESTS - CRITICAL
  // ============================================================================
  'auth-login-success': {
    testId: 'auth-login-success',
    testName: 'should login successfully with valid user credentials',
    feature: 'authentication',
    riskLevel: 'CRITICAL',
    businessImpact: 5,
    failureProbability: 2,
    usageFrequency: 5,
    securityImpact: 5,
    regulatoryImpact: 5,
    totalScore: 4.05,
    owner: 'security-team',
    tags: ['@smoke', '@e2e', '@critical', '@security'],
    executionTime: 3000,
  },
  'auth-invalid-credentials': {
    testId: 'auth-invalid-credentials',
    testName: 'should show error message with invalid credentials',
    feature: 'authentication',
    riskLevel: 'CRITICAL',
    businessImpact: 5,
    failureProbability: 2,
    usageFrequency: 4,
    securityImpact: 5,
    regulatoryImpact: 5,
    totalScore: 3.95,
    owner: 'security-team',
    tags: ['@regression', '@critical', '@security'],
    executionTime: 2000,
  },
  'auth-logout': {
    testId: 'auth-logout',
    testName: 'should logout user successfully',
    feature: 'authentication',
    riskLevel: 'CRITICAL',
    businessImpact: 4,
    failureProbability: 2,
    usageFrequency: 5,
    securityImpact: 5,
    regulatoryImpact: 4,
    totalScore: 3.65,
    owner: 'security-team',
    tags: ['@regression', '@critical', '@security'],
    executionTime: 2000,
  },

  // ============================================================================
  // TRANSFER TESTS - CRITICAL
  // ============================================================================
  'transfer-success-ui': {
    testId: 'transfer-success-ui',
    testName: 'should transfer money successfully',
    feature: 'transfer',
    riskLevel: 'CRITICAL',
    businessImpact: 5,
    failureProbability: 3,
    usageFrequency: 5,
    securityImpact: 4,
    regulatoryImpact: 5,
    totalScore: 4.35,
    owner: 'payment-team',
    tags: ['@smoke', '@e2e', '@critical', '@financial'],
    executionTime: 5000,
  },
  'transfer-success-api': {
    testId: 'transfer-success-api',
    testName: 'should transfer money to another user',
    feature: 'transfer',
    riskLevel: 'CRITICAL',
    businessImpact: 5,
    failureProbability: 3,
    usageFrequency: 5,
    securityImpact: 4,
    regulatoryImpact: 5,
    totalScore: 4.35,
    owner: 'payment-team',
    tags: ['@smoke', '@e2e', '@api', '@critical', '@financial'],
    executionTime: 2000,
  },
  'transfer-insufficient-balance': {
    testId: 'transfer-insufficient-balance',
    testName: 'should fail transfer with insufficient balance',
    feature: 'transfer',
    riskLevel: 'CRITICAL',
    businessImpact: 5,
    failureProbability: 2,
    usageFrequency: 4,
    securityImpact: 4,
    regulatoryImpact: 5,
    totalScore: 4.05,
    owner: 'payment-team',
    tags: ['@regression', '@api', '@critical', '@financial'],
    executionTime: 2000,
  },
  'transfer-invalid-account': {
    testId: 'transfer-invalid-account',
    testName: 'should fail transfer to invalid account',
    feature: 'transfer',
    riskLevel: 'CRITICAL',
    businessImpact: 5,
    failureProbability: 2,
    usageFrequency: 3,
    securityImpact: 4,
    regulatoryImpact: 5,
    totalScore: 3.95,
    owner: 'payment-team',
    tags: ['@regression', '@api', '@critical', '@financial'],
    executionTime: 2000,
  },
  'transfer-page-load': {
    testId: 'transfer-page-load',
    testName: 'should load transfer page with all form elements',
    feature: 'transfer',
    riskLevel: 'HIGH',
    businessImpact: 4,
    failureProbability: 2,
    usageFrequency: 5,
    securityImpact: 3,
    regulatoryImpact: 3,
    totalScore: 3.3,
    owner: 'payment-team',
    tags: ['@smoke', '@high'],
    executionTime: 2000,
  },
  'transfer-form-fill': {
    testId: 'transfer-form-fill',
    testName: 'should fill transfer form with recipient details',
    feature: 'transfer',
    riskLevel: 'MEDIUM',
    businessImpact: 3,
    failureProbability: 2,
    usageFrequency: 4,
    securityImpact: 2,
    regulatoryImpact: 2,
    totalScore: 2.65,
    owner: 'payment-team',
    tags: ['@e2e', '@medium'],
    executionTime: 3000,
  },
  'transfer-large-amount': {
    testId: 'transfer-large-amount',
    testName: 'should handle large transfer amounts',
    feature: 'transfer',
    riskLevel: 'HIGH',
    businessImpact: 5,
    failureProbability: 3,
    usageFrequency: 2,
    securityImpact: 4,
    regulatoryImpact: 5,
    totalScore: 3.95,
    owner: 'payment-team',
    tags: ['@regression', '@high', '@financial'],
    executionTime: 5000,
  },

  // ============================================================================
  // LOAN TESTS - HIGH
  // ============================================================================
  'loan-wizard-load': {
    testId: 'loan-wizard-load',
    testName: 'should load loan application wizard',
    feature: 'loan',
    riskLevel: 'HIGH',
    businessImpact: 4,
    failureProbability: 2,
    usageFrequency: 3,
    securityImpact: 3,
    regulatoryImpact: 5,
    totalScore: 3.3,
    owner: 'lending-team',
    tags: ['@smoke', '@high', '@compliance'],
    executionTime: 2000,
  },
  'loan-type-selection': {
    testId: 'loan-type-selection',
    testName: 'should select loan type and advance to step 2',
    feature: 'loan',
    riskLevel: 'HIGH',
    businessImpact: 4,
    failureProbability: 3,
    usageFrequency: 3,
    securityImpact: 3,
    regulatoryImpact: 5,
    totalScore: 3.5,
    owner: 'lending-team',
    tags: ['@e2e', '@high', '@compliance'],
    executionTime: 3000,
  },

  // ============================================================================
  // TOP-UP TESTS - HIGH
  // ============================================================================
  'topup-page-load': {
    testId: 'topup-page-load',
    testName: 'should load top up page',
    feature: 'topup',
    riskLevel: 'HIGH',
    businessImpact: 4,
    failureProbability: 2,
    usageFrequency: 4,
    securityImpact: 4,
    regulatoryImpact: 4,
    totalScore: 3.5,
    owner: 'payment-team',
    tags: ['@smoke', '@high', '@financial'],
    executionTime: 2000,
  },

  // ============================================================================
  // ADMIN TESTS - HIGH
  // ============================================================================
  'admin-dashboard-load': {
    testId: 'admin-dashboard-load',
    testName: 'should load admin dashboard',
    feature: 'admin',
    riskLevel: 'HIGH',
    businessImpact: 4,
    failureProbability: 2,
    usageFrequency: 3,
    securityImpact: 5,
    regulatoryImpact: 3,
    totalScore: 3.45,
    owner: 'platform-team',
    tags: ['@smoke', '@admin', '@high', '@security'],
    executionTime: 2000,
  },
  'admin-user-list': {
    testId: 'admin-user-list',
    testName: 'should display users table',
    feature: 'admin',
    riskLevel: 'HIGH',
    businessImpact: 4,
    failureProbability: 2,
    usageFrequency: 3,
    securityImpact: 5,
    regulatoryImpact: 3,
    totalScore: 3.45,
    owner: 'platform-team',
    tags: ['@regression', '@admin', '@high', '@security'],
    executionTime: 3000,
  },
  'admin-user-search': {
    testId: 'admin-user-search',
    testName: 'should search and filter users',
    feature: 'admin',
    riskLevel: 'HIGH',
    businessImpact: 3,
    failureProbability: 2,
    usageFrequency: 3,
    securityImpact: 4,
    regulatoryImpact: 3,
    totalScore: 3.0,
    owner: 'platform-team',
    tags: ['@regression', '@admin', '@high'],
    executionTime: 3000,
  },

  // ============================================================================
  // DASHBOARD TESTS - MEDIUM
  // ============================================================================
  'dashboard-balance-display': {
    testId: 'dashboard-balance-display',
    testName: 'should display account balance and account number',
    feature: 'dashboard',
    riskLevel: 'MEDIUM',
    businessImpact: 3,
    failureProbability: 2,
    usageFrequency: 5,
    securityImpact: 2,
    regulatoryImpact: 2,
    totalScore: 2.65,
    owner: 'frontend-team',
    tags: ['@smoke', '@e2e', '@medium'],
    executionTime: 2000,
  },
  'dashboard-statistics': {
    testId: 'dashboard-statistics',
    testName: 'should display financial statistics',
    feature: 'dashboard',
    riskLevel: 'MEDIUM',
    businessImpact: 2,
    failureProbability: 2,
    usageFrequency: 4,
    securityImpact: 1,
    regulatoryImpact: 1,
    totalScore: 2.05,
    owner: 'frontend-team',
    tags: ['@e2e', '@medium'],
    executionTime: 2000,
  },

  // ============================================================================
  // HISTORY TESTS - MEDIUM
  // ============================================================================
  'history-page-load': {
    testId: 'history-page-load',
    testName: 'should load history page with filter controls',
    feature: 'history',
    riskLevel: 'MEDIUM',
    businessImpact: 3,
    failureProbability: 2,
    usageFrequency: 4,
    securityImpact: 2,
    regulatoryImpact: 4,
    totalScore: 2.75,
    owner: 'reporting-team',
    tags: ['@smoke', '@medium', '@compliance'],
    executionTime: 2000,
  },
  'history-display': {
    testId: 'history-display',
    testName: 'should display transaction history',
    feature: 'history',
    riskLevel: 'MEDIUM',
    businessImpact: 3,
    failureProbability: 2,
    usageFrequency: 4,
    securityImpact: 2,
    regulatoryImpact: 4,
    totalScore: 2.75,
    owner: 'reporting-team',
    tags: ['@e2e', '@medium', '@compliance'],
    executionTime: 3000,
  },

  // ============================================================================
  // NAVIGATION TESTS - LOW
  // ============================================================================
  'navigation-user-links': {
    testId: 'navigation-user-links',
    testName: 'should display all user navigation links',
    feature: 'navigation',
    riskLevel: 'LOW',
    businessImpact: 2,
    failureProbability: 1,
    usageFrequency: 3,
    securityImpact: 1,
    regulatoryImpact: 1,
    totalScore: 1.65,
    owner: 'frontend-team',
    tags: ['@smoke', '@low'],
    executionTime: 1000,
  },
};

/**
 * Get tests by risk level
 */
export function getTestsByRiskLevel(level: RiskLevel): TestRiskMetadata[] {
  return Object.values(testRiskRegistry).filter((test) => test.riskLevel === level);
}

/**
 * Get tests by feature
 */
export function getTestsByFeature(feature: string): TestRiskMetadata[] {
  return Object.values(testRiskRegistry).filter((test) => test.feature === feature);
}

/**
 * Get critical path tests (CRITICAL + HIGH with @smoke or @e2e)
 */
export function getCriticalPathTests(): TestRiskMetadata[] {
  return Object.values(testRiskRegistry).filter(
    (test) =>
      (test.riskLevel === 'CRITICAL' || test.riskLevel === 'HIGH') &&
      (test.tags.includes('@smoke') || test.tags.includes('@e2e'))
  );
}

/**
 * Calculate total execution time for tests
 */
export function calculateExecutionTime(tests: TestRiskMetadata[]): number {
  return tests.reduce((total, test) => total + (test.executionTime || 0), 0);
}

/**
 * Get deployment gate tests (must pass before deployment)
 */
export function getDeploymentGateTests(): TestRiskMetadata[] {
  return Object.values(testRiskRegistry).filter((test) => test.riskLevel === 'CRITICAL');
}

/**
 * Risk summary statistics
 */
export function getRiskSummary() {
  const allTests = Object.values(testRiskRegistry);
  const critical = allTests.filter((t) => t.riskLevel === 'CRITICAL');
  const high = allTests.filter((t) => t.riskLevel === 'HIGH');
  const medium = allTests.filter((t) => t.riskLevel === 'MEDIUM');
  const low = allTests.filter((t) => t.riskLevel === 'LOW');

  return {
    total: allTests.length,
    critical: {
      count: critical.length,
      percentage: Math.round((critical.length / allTests.length) * 100),
      executionTime: calculateExecutionTime(critical),
    },
    high: {
      count: high.length,
      percentage: Math.round((high.length / allTests.length) * 100),
      executionTime: calculateExecutionTime(high),
    },
    medium: {
      count: medium.length,
      percentage: Math.round((medium.length / allTests.length) * 100),
      executionTime: calculateExecutionTime(medium),
    },
    low: {
      count: low.length,
      percentage: Math.round((low.length / allTests.length) * 100),
      executionTime: calculateExecutionTime(low),
    },
  };
}
