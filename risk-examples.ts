/**
 * Risk-Based Testing Usage Examples
 * 
 * This file demonstrates how to use the risk-based testing utilities
 * in your test suite and CI/CD pipelines.
 */

import {
  testRiskRegistry,
  featureRiskProfiles,
  getRiskSummary,
  getCriticalPathTests,
  getDeploymentGateTests,
  getTestsByRiskLevel,
  getTestsByFeature,
} from './src/config/risk-registry';

import {
  analyzeExecutionHistory,
  calculateDynamicRiskScore,
  getRecommendedRiskLevel,
  prioritizeTests,
  generateRiskHeatmap,
} from './src/helpers/risk-calculator';

import {
  generateRiskReport,
  printRiskReport,
  saveRiskReport,
  generateDashboardData,
} from './src/helpers/risk-reporter';

// ============================================================================
// Example 1: Get Risk Summary
// ============================================================================

console.log('\n=== EXAMPLE 1: Risk Summary ===\n');

const summary = getRiskSummary();
console.log('Total Tests:', summary.total);
console.log('Critical Tests:', summary.critical.count, `(${summary.critical.percentage}%)`);
console.log('High Risk Tests:', summary.high.count, `(${summary.high.percentage}%)`);
console.log('Estimated Critical Test Time:', summary.critical.executionTime, 'ms');

// ============================================================================
// Example 2: Get Deployment Gate Tests
// ============================================================================

console.log('\n=== EXAMPLE 2: Deployment Gate Tests ===\n');

const deploymentGate = getDeploymentGateTests();
console.log(`Found ${deploymentGate.length} deployment gate tests:\n`);

deploymentGate.forEach((test) => {
  console.log(`- ${test.testName}`);
  console.log(`  Feature: ${test.feature}`);
  console.log(`  Risk Score: ${test.totalScore}`);
  console.log(`  Tags: ${test.tags.join(', ')}`);
  console.log(`  Est. Time: ${test.executionTime}ms\n`);
});

// ============================================================================
// Example 3: Get Tests by Feature
// ============================================================================

console.log('\n=== EXAMPLE 3: Tests by Feature ===\n');

const transferTests = getTestsByFeature('transfer');
console.log(`Transfer feature has ${transferTests.length} tests:`);

transferTests.forEach((test) => {
  console.log(`- [${test.riskLevel}] ${test.testName}`);
});

// ============================================================================
// Example 4: Generate Risk Report (Console)
// ============================================================================

console.log('\n=== EXAMPLE 4: Risk Report ===\n');

// Simple report without execution data
printRiskReport();

// ============================================================================
// Example 5: Save Risk Report to Files
// ============================================================================

console.log('\n=== EXAMPLE 5: Saving Reports ===\n');

// Save as Markdown
saveRiskReport('./risk-report.md', [], [], 'markdown');
console.log('✓ Saved risk-report.md');

// Save as JSON
saveRiskReport('./risk-report.json', [], [], 'json');
console.log('✓ Saved risk-report.json');

// Save as HTML
saveRiskReport('./risk-report.html', [], [], 'html');
console.log('✓ Saved risk-report.html');

// ============================================================================
// Example 6: Analyze Test Execution History (with sample data)
// ============================================================================

console.log('\n=== EXAMPLE 6: Execution History Analysis ===\n');

// Sample execution data (in real scenario, load from test logs)
const sampleExecutions = [
  { testId: 'transfer-success-ui', timestamp: '2026-02-10T10:00:00Z', passed: true, duration: 5200, retries: 0 },
  { testId: 'transfer-success-ui', timestamp: '2026-02-11T10:00:00Z', passed: true, duration: 4800, retries: 0 },
  { testId: 'transfer-success-ui', timestamp: '2026-02-12T10:00:00Z', passed: false, duration: 5500, retries: 1 },
  { testId: 'auth-login-success', timestamp: '2026-02-10T10:00:00Z', passed: true, duration: 3000, retries: 0 },
  { testId: 'auth-login-success', timestamp: '2026-02-11T10:00:00Z', passed: true, duration: 2800, retries: 0 },
];

const analysis = analyzeExecutionHistory('transfer-success-ui', sampleExecutions);
console.log('Transfer Success Test Analysis:');
console.log(`- Pass Rate: ${analysis.passRate}%`);
console.log(`- Flakiness: ${(analysis.flakiness * 100).toFixed(1)}%`);
console.log(`- Avg Duration: ${analysis.avgDuration}ms`);
console.log(`- Recent Failures: ${analysis.recentFailures}/10`);
console.log(`- Trending Up: ${analysis.trendsUp ? 'Yes ⚠️' : 'No ✓'}`);

// ============================================================================
// Example 7: Dynamic Risk Score Adjustment
// ============================================================================

console.log('\n=== EXAMPLE 7: Dynamic Risk Adjustment ===\n');

const transferTest = testRiskRegistry['transfer-success-ui'];

// Calculate adjusted risk based on recent failures
const adjustedScore = calculateDynamicRiskScore(transferTest, {
  recentFailureMultiplier: 1.25, // 25% increase due to recent failures
  flakinessMultiplier: 1.1,      // 10% increase due to flakiness
  defectDensityMultiplier: 1.0,  // No unresolved defects
  codeChurnMultiplier: 1.0,      // No recent code changes
  incidentImpactMultiplier: 1.0, // No production incidents
});

console.log(`Original Risk Score: ${transferTest.totalScore}`);
console.log(`Adjusted Risk Score: ${adjustedScore}`);
console.log(`Adjustment: +${((adjustedScore - transferTest.totalScore) / transferTest.totalScore * 100).toFixed(1)}%`);

// ============================================================================
// Example 8: Get Recommended Risk Level Changes
// ============================================================================

console.log('\n=== EXAMPLE 8: Risk Level Recommendations ===\n');

// Sample defect data
const sampleDefects = [
  {
    testId: 'transfer-success-ui',
    severity: 'high' as const,
    dateFound: '2026-02-05',
    description: 'Transfer validation fails for certain edge cases',
  },
];

const recommendation = getRecommendedRiskLevel(
  transferTest,
  sampleExecutions,
  sampleDefects
);

console.log(`Current Level: ${recommendation.currentLevel}`);
console.log(`Recommended Level: ${recommendation.recommendedLevel}`);
console.log(`Adjusted Score: ${recommendation.adjustedScore}`);
if (recommendation.reasons.length > 0) {
  console.log('Reasons:');
  recommendation.reasons.forEach((reason) => console.log(`  - ${reason}`));
}

// ============================================================================
// Example 9: Prioritize Tests Within Time Budget
// ============================================================================

console.log('\n=== EXAMPLE 9: Test Prioritization ===\n');

const allTests = Object.values(testRiskRegistry);
const maxTime = 120000; // 2 minutes

const prioritized = prioritizeTests(
  allTests,
  sampleExecutions,
  sampleDefects,
  maxTime
);

console.log(`Selected ${prioritized.selectedTests.length} tests within ${maxTime / 1000}s budget:`);
console.log(`Total Execution Time: ${(prioritized.totalExecutionTime / 1000).toFixed(1)}s`);
console.log('\nCoverage:');
console.log(`  CRITICAL: ${prioritized.coverageSummary.critical} tests`);
console.log(`  HIGH: ${prioritized.coverageSummary.high} tests`);
console.log(`  MEDIUM: ${prioritized.coverageSummary.medium} tests`);
console.log(`  LOW: ${prioritized.coverageSummary.low} tests`);

console.log('\nTop Priority Tests:');
prioritized.selectedTests.slice(0, 5).forEach((test, i) => {
  console.log(`${i + 1}. [${test.riskLevel}] ${test.testName} (${test.executionTime}ms)`);
});

// ============================================================================
// Example 10: Generate Risk Heatmap
// ============================================================================

console.log('\n=== EXAMPLE 10: Risk Heatmap ===\n');

const heatmap = generateRiskHeatmap(allTests, sampleExecutions, sampleDefects);

console.log('Risk Heatmap (Top 10 by risk):');
const topRisks = heatmap
  .sort((a, b) => b.adjustedScore - a.adjustedScore)
  .slice(0, 10);

topRisks.forEach((item, i) => {
  console.log(`${i + 1}. ${item.testId}`);
  console.log(`   Level: ${item.riskLevel} | Score: ${item.adjustedScore.toFixed(2)}`);
  console.log(`   Pass Rate: ${item.passRate}% | Flakiness: ${(item.flakiness * 100).toFixed(1)}%`);
  console.log(`   Defects: ${item.defectCount}\n`);
});

// ============================================================================
// Example 11: Feature Risk Overview
// ============================================================================

console.log('\n=== EXAMPLE 11: Feature Risk Overview ===\n');

Object.entries(featureRiskProfiles).forEach(([key, profile]) => {
  const featureTests = getTestsByFeature(key);
  const criticalTests = featureTests.filter((t) => t.riskLevel === 'CRITICAL').length;

  console.log(`${profile.feature} (${profile.riskLevel}):`);
  console.log(`  Tests: ${featureTests.length} (${criticalTests} critical)`);
  console.log(`  Business Impact: ${profile.businessImpact}/5`);
  console.log(`  Security Impact: ${profile.securityImpact}/5`);
  console.log(`  Owner: ${profile.owner}\n`);
});

// ============================================================================
// Example 12: Critical Path Tests
// ============================================================================

console.log('\n=== EXAMPLE 12: Critical Path Tests ===\n');

const criticalPath = getCriticalPathTests();
const totalPathTime = criticalPath.reduce((sum, t) => sum + (t.executionTime || 0), 0);

console.log(`Critical Path: ${criticalPath.length} tests`);
console.log(`Total Execution Time: ${(totalPathTime / 1000).toFixed(1)}s\n`);

const pathByFeature = criticalPath.reduce((acc, test) => {
  acc[test.feature] = (acc[test.feature] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('Distribution by Feature:');
Object.entries(pathByFeature).forEach(([feature, count]) => {
  console.log(`  ${feature}: ${count} tests`);
});

// ============================================================================
// Example 13: Dashboard Data for Visualization
// ============================================================================

console.log('\n=== EXAMPLE 13: Dashboard Data ===\n');

const dashboardData = generateDashboardData(sampleExecutions, sampleDefects);

console.log('Dashboard Summary:');
console.log(`- Total Tests: ${dashboardData.summary.total}`);
console.log(`- Deployment Gate: ${dashboardData.deploymentGate.length} tests`);
console.log(`- Critical Path: ${dashboardData.criticalPath.length} tests`);
console.log(`- Test Health:`);
console.log(`  - With Execution Data: ${dashboardData.testHealth.withExecutionData}/${dashboardData.testHealth.total}`);
console.log(`  - Flaky Tests: ${dashboardData.testHealth.flaky}`);
console.log(`  - Unstable Tests: ${dashboardData.testHealth.unstable}`);

console.log('\n=== Examples Complete ===\n');
