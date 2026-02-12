/**
 * Risk Calculator
 * 
 * Utilities for calculating and adjusting risk scores dynamically based on:
 * - Test execution history
 * - Defect density
 * - Code churn
 * - Flakiness rates
 * - Production incidents
 */

import { RiskLevel, TestRiskMetadata, getRiskLevel } from '../config/risk-registry';

export interface TestExecutionRecord {
  testId: string;
  timestamp: string;
  passed: boolean;
  duration: number;
  retries: number;
}

export interface DefectRecord {
  testId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  dateFound: string;
  dateResolved?: string;
  description: string;
}

export interface RiskAdjustmentFactors {
  recentFailureMultiplier: number; // Recent failures increase risk
  defectDensityMultiplier: number; // More defects = higher risk
  flakinessMultiplier: number; // Flaky tests need attention
  codeChurnMultiplier: number; // Recent changes = higher risk
  incidentImpactMultiplier: number; // Production incidents increase priority
}

/**
 * Calculate dynamic risk score with adjustment factors
 */
export function calculateDynamicRiskScore(
  baseMetadata: TestRiskMetadata,
  adjustmentFactors: Partial<RiskAdjustmentFactors>
): number {
  const factors: RiskAdjustmentFactors = {
    recentFailureMultiplier: adjustmentFactors.recentFailureMultiplier ?? 1.0,
    defectDensityMultiplier: adjustmentFactors.defectDensityMultiplier ?? 1.0,
    flakinessMultiplier: adjustmentFactors.flakinessMultiplier ?? 1.0,
    codeChurnMultiplier: adjustmentFactors.codeChurnMultiplier ?? 1.0,
    incidentImpactMultiplier: adjustmentFactors.incidentImpactMultiplier ?? 1.0,
  };

  // Calculate base score
  const baseScore =
    baseMetadata.businessImpact * 0.4 +
    baseMetadata.failureProbability * 0.25 +
    baseMetadata.usageFrequency * 0.2 +
    baseMetadata.securityImpact * 0.15;

  // Apply multipliers
  const adjustedScore =
    baseScore *
    factors.recentFailureMultiplier *
    factors.defectDensityMultiplier *
    factors.flakinessMultiplier *
    factors.codeChurnMultiplier *
    factors.incidentImpactMultiplier;

  // Cap at 5.0
  return Math.min(Math.round(adjustedScore * 100) / 100, 5.0);
}

/**
 * Analyze test execution history to detect patterns
 */
export function analyzeExecutionHistory(
  testId: string,
  executions: TestExecutionRecord[]
): {
  passRate: number;
  flakiness: number;
  avgDuration: number;
  recentFailures: number;
  trendsUp: boolean; // Failure rate increasing
} {
  const testExecutions = executions.filter((e) => e.testId === testId);

  if (testExecutions.length === 0) {
    return {
      passRate: 100,
      flakiness: 0,
      avgDuration: 0,
      recentFailures: 0,
      trendsUp: false,
    };
  }

  const totalExecutions = testExecutions.length;
  const passed = testExecutions.filter((e) => e.passed).length;
  const passRate = Math.round((passed / totalExecutions) * 100);

  // Calculate flakiness (tests that pass on retry)
  const flakyRuns = testExecutions.filter((e) => e.passed && e.retries > 0).length;
  const flakiness = Math.round((flakyRuns / totalExecutions) * 100) / 100;

  // Average duration
  const avgDuration = Math.round(
    testExecutions.reduce((sum, e) => sum + e.duration, 0) / totalExecutions
  );

  // Recent failures (last 10 runs)
  const recent = testExecutions.slice(-10);
  const recentFailures = recent.filter((e) => !e.passed).length;

  // Trend analysis (comparing recent vs older runs)
  const older = testExecutions.slice(0, Math.floor(totalExecutions / 2));
  const newer = testExecutions.slice(Math.floor(totalExecutions / 2));
  const olderPassRate = older.filter((e) => e.passed).length / (older.length || 1);
  const newerPassRate = newer.filter((e) => e.passed).length / (newer.length || 1);
  const trendsUp = newerPassRate < olderPassRate - 0.1; // 10% degradation

  return {
    passRate,
    flakiness,
    avgDuration,
    recentFailures,
    trendsUp,
  };
}

/**
 * Calculate defect density impact
 */
export function calculateDefectDensityMultiplier(
  testId: string,
  defects: DefectRecord[]
): number {
  const testDefects = defects.filter((d) => d.testId === testId);

  if (testDefects.length === 0) return 1.0;

  // Recent unresolved defects have highest impact
  const unresolvedCritical = testDefects.filter(
    (d) => !d.dateResolved && d.severity === 'critical'
  ).length;
  const unresolvedHigh = testDefects.filter(
    (d) => !d.dateResolved && d.severity === 'high'
  ).length;

  // Calculate multiplier based on severity
  let multiplier = 1.0;
  multiplier += unresolvedCritical * 0.5; // Critical defects add 50%
  multiplier += unresolvedHigh * 0.25; // High defects add 25%

  return Math.min(multiplier, 2.0); // Cap at 2x
}

/**
 * Calculate recent failure impact
 */
export function calculateRecentFailureMultiplier(recentFailures: number): number {
  // 0 failures: 1.0x
  // 1-2 failures: 1.1x
  // 3-5 failures: 1.25x
  // 6+ failures: 1.5x
  if (recentFailures === 0) return 1.0;
  if (recentFailures <= 2) return 1.1;
  if (recentFailures <= 5) return 1.25;
  return 1.5;
}

/**
 * Calculate flakiness impact
 */
export function calculateFlakinessMultiplier(flakinessRate: number): number {
  // Flakiness rate 0-1 (0% - 100%)
  // 0-5%: Normal (1.0x)
  // 5-15%: Moderate concern (1.1x)
  // 15-30%: High concern (1.25x)
  // 30%+: Critical concern (1.5x)
  if (flakinessRate < 0.05) return 1.0;
  if (flakinessRate < 0.15) return 1.1;
  if (flakinessRate < 0.3) return 1.25;
  return 1.5;
}

/**
 * Estimate code churn impact (simplified - in real scenario, integrate with Git)
 */
export function calculateCodeChurnMultiplier(
  filesChanged: number,
  daysAgo: number
): number {
  // Recent changes to many files indicate higher risk
  if (daysAgo > 30) return 1.0; // Old changes, no impact

  const recencyFactor = 1 - daysAgo / 30; // 1.0 for today, 0.0 for 30 days ago
  const churnFactor = Math.min(filesChanged / 10, 1.0); // Cap at 10 files

  return 1.0 + recencyFactor * churnFactor * 0.3; // Max 1.3x for very recent, large changes
}

/**
 * Production incident impact
 */
export function calculateIncidentImpactMultiplier(
  relatedIncidents: number,
  highestSeverity: 'P0' | 'P1' | 'P2' | 'P3' | 'none'
): number {
  if (relatedIncidents === 0) return 1.0;

  let multiplier = 1.0;

  // Base multiplier from incident count
  multiplier += Math.min(relatedIncidents * 0.2, 0.6); // Max 0.6 from count

  // Severity boost
  const severityMultipliers = {
    P0: 0.8, // Critical production incidents
    P1: 0.5,
    P2: 0.3,
    P3: 0.1,
    none: 0,
  };

  multiplier += severityMultipliers[highestSeverity];

  return Math.min(multiplier, 2.5); // Cap at 2.5x
}

/**
 * Get recommended risk level based on dynamic factors
 */
export function getRecommendedRiskLevel(
  baseMetadata: TestRiskMetadata,
  executions: TestExecutionRecord[],
  defects: DefectRecord[]
): {
  currentLevel: RiskLevel;
  recommendedLevel: RiskLevel;
  adjustedScore: number;
  reasons: string[];
} {
  const analysis = analyzeExecutionHistory(baseMetadata.testId, executions);
  const defectMultiplier = calculateDefectDensityMultiplier(baseMetadata.testId, defects);
  const failureMultiplier = calculateRecentFailureMultiplier(analysis.recentFailures);
  const flakinessMultiplier = calculateFlakinessMultiplier(analysis.flakiness);

  const adjustedScore = calculateDynamicRiskScore(baseMetadata, {
    recentFailureMultiplier: failureMultiplier,
    defectDensityMultiplier: defectMultiplier,
    flakinessMultiplier: flakinessMultiplier,
  });

  const recommendedLevel = getRiskLevel(adjustedScore);
  const reasons: string[] = [];

  // Explain why risk level changed
  if (failureMultiplier > 1.0) {
    reasons.push(`Recent failures detected (${analysis.recentFailures} in last 10 runs)`);
  }
  if (defectMultiplier > 1.0) {
    reasons.push(`Unresolved defects in test area`);
  }
  if (flakinessMultiplier > 1.0) {
    reasons.push(`Test shows flakiness (${(analysis.flakiness * 100).toFixed(1)}% flaky rate)`);
  }
  if (analysis.trendsUp) {
    reasons.push(`Failure rate trending upward`);
  }
  if (recommendedLevel !== baseMetadata.riskLevel) {
    reasons.push(
      `Risk level adjusted from ${baseMetadata.riskLevel} to ${recommendedLevel}`
    );
  }

  return {
    currentLevel: baseMetadata.riskLevel,
    recommendedLevel,
    adjustedScore,
    reasons,
  };
}

/**
 * Generate risk heatmap data for visualization
 */
export function generateRiskHeatmap(
  metadata: TestRiskMetadata[],
  executions: TestExecutionRecord[],
  defects: DefectRecord[]
): Array<{
  testId: string;
  feature: string;
  riskLevel: RiskLevel;
  adjustedScore: number;
  passRate: number;
  flakiness: number;
  defectCount: number;
}> {
  return metadata.map((test) => {
    const analysis = analyzeExecutionHistory(test.testId, executions);
    const testDefects = defects.filter((d) => d.testId === test.testId && !d.dateResolved);

    const defectMultiplier = calculateDefectDensityMultiplier(test.testId, defects);
    const failureMultiplier = calculateRecentFailureMultiplier(analysis.recentFailures);
    const flakinessMultiplier = calculateFlakinessMultiplier(analysis.flakiness);

    const adjustedScore = calculateDynamicRiskScore(test, {
      recentFailureMultiplier: failureMultiplier,
      defectDensityMultiplier: defectMultiplier,
      flakinessMultiplier: flakinessMultiplier,
    });

    return {
      testId: test.testId,
      feature: test.feature,
      riskLevel: getRiskLevel(adjustedScore),
      adjustedScore,
      passRate: analysis.passRate,
      flakiness: analysis.flakiness,
      defectCount: testDefects.length,
    };
  });
}

/**
 * Prioritize tests for execution based on risk
 */
export function prioritizeTests(
  metadata: TestRiskMetadata[],
  executions: TestExecutionRecord[],
  defects: DefectRecord[],
  maxExecutionTime?: number
): {
  selectedTests: TestRiskMetadata[];
  totalExecutionTime: number;
  coverageSummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
} {
  // Calculate adjusted scores for all tests
  const scoredTests = metadata
    .map((test) => {
      const analysis = analyzeExecutionHistory(test.testId, executions);
      const defectMultiplier = calculateDefectDensityMultiplier(test.testId, defects);
      const failureMultiplier = calculateRecentFailureMultiplier(analysis.recentFailures);
      const flakinessMultiplier = calculateFlakinessMultiplier(analysis.flakiness);

      const adjustedScore = calculateDynamicRiskScore(test, {
        recentFailureMultiplier: failureMultiplier,
        defectDensityMultiplier: defectMultiplier,
        flakinessMultiplier: flakinessMultiplier,
      });

      return { ...test, adjustedScore };
    })
    .sort((a, b) => b.adjustedScore - a.adjustedScore); // Highest risk first

  // If no time limit, return all tests
  if (!maxExecutionTime) {
    const coverageSummary = {
      critical: scoredTests.filter((t) => t.riskLevel === 'CRITICAL').length,
      high: scoredTests.filter((t) => t.riskLevel === 'HIGH').length,
      medium: scoredTests.filter((t) => t.riskLevel === 'MEDIUM').length,
      low: scoredTests.filter((t) => t.riskLevel === 'LOW').length,
    };

    return {
      selectedTests: scoredTests,
      totalExecutionTime: scoredTests.reduce((sum, t) => sum + (t.executionTime || 0), 0),
      coverageSummary,
    };
  }

  // Select tests within time budget, prioritizing highest risk
  const selectedTests: TestRiskMetadata[] = [];
  let totalTime = 0;

  for (const test of scoredTests) {
    const testTime = test.executionTime || 0;
    if (totalTime + testTime <= maxExecutionTime) {
      selectedTests.push(test);
      totalTime += testTime;
    }
  }

  const coverageSummary = {
    critical: selectedTests.filter((t) => t.riskLevel === 'CRITICAL').length,
    high: selectedTests.filter((t) => t.riskLevel === 'HIGH').length,
    medium: selectedTests.filter((t) => t.riskLevel === 'MEDIUM').length,
    low: selectedTests.filter((t) => t.riskLevel === 'LOW').length,
  };

  return {
    selectedTests,
    totalExecutionTime: totalTime,
    coverageSummary,
  };
}
