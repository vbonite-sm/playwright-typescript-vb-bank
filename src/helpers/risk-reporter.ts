/**
 * Risk Reporter
 * 
 * Generate risk-based testing reports and dashboards
 */

import {
  testRiskRegistry,
  featureRiskProfiles,
  getRiskSummary,
  getCriticalPathTests,
  getDeploymentGateTests,
  getTestsByRiskLevel,
  getTestsByFeature,
  TestRiskMetadata,
  RiskLevel,
} from '../config/risk-registry';
import {
  TestExecutionRecord,
  DefectRecord,
  analyzeExecutionHistory,
  getRecommendedRiskLevel,
  generateRiskHeatmap,
  prioritizeTests,
} from './risk-calculator';

export interface RiskReportOptions {
  includeExecutionData?: boolean;
  includeDefectData?: boolean;
  includeRecommendations?: boolean;
  format?: 'console' | 'json' | 'html' | 'markdown';
}

/**
 * Generate comprehensive risk report
 */
export function generateRiskReport(
  executions: TestExecutionRecord[] = [],
  defects: DefectRecord[] = [],
  options: RiskReportOptions = {}
): string {
  const opts: Required<RiskReportOptions> = {
    includeExecutionData: options.includeExecutionData ?? true,
    includeDefectData: options.includeDefectData ?? true,
   includeRecommendations: options.includeRecommendations ?? true,
    format: options.format ?? 'markdown',
  };

  if (opts.format === 'markdown') {
    return generateMarkdownReport(executions, defects, opts);
  } else if (opts.format === 'json') {
    return generateJsonReport(executions, defects, opts);
  } else if (opts.format === 'html') {
    return generateHtmlReport(executions, defects, opts);
  } else {
    return generateConsoleReport(executions, defects, opts);
  }
}

/**
 * Generate Markdown format report
 */
function generateMarkdownReport(
  executions: TestExecutionRecord[],
  defects: DefectRecord[],
  options: Required<RiskReportOptions>
): string {
  const summary = getRiskSummary();
  const criticalPath = getCriticalPathTests();
  const deploymentGate = getDeploymentGateTests();

  let report = `# Risk-Based Testing Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;

  // Executive Summary
  report += `## Executive Summary\n\n`;
  report += `- **Total Tests:** ${summary.total}\n`;
  report += `- **Critical Tests:** ${summary.critical.count} (${summary.critical.percentage}%) - Est. ${formatTime(summary.critical.executionTime)}\n`;
  report += `- **High Risk Tests:** ${summary.high.count} (${summary.high.percentage}%) - Est. ${formatTime(summary.high.executionTime)}\n`;
  report += `- **Medium Risk Tests:** ${summary.medium.count} (${summary.medium.percentage}%) - Est. ${formatTime(summary.medium.executionTime)}\n`;
  report += `- **Low Risk Tests:** ${summary.low.count} (${summary.low.percentage}%) - Est. ${formatTime(summary.low.executionTime)}\n\n`;

  // Deployment Gate Tests
  report += `## 🚨 Deployment Gate Tests (Must Pass)\n\n`;
  report += `These ${deploymentGate.length} critical tests MUST pass before any deployment:\n\n`;
  report += `| Test | Feature | Est. Time | Tags |\n`;
  report += `|------|---------|-----------|------|\n`;
  deploymentGate.forEach((test) => {
    report += `| ${test.testName} | ${test.feature} | ${formatTime(test.executionTime || 0)} | ${test.tags.join(', ')} |\n`;
  });
  report += `\n**Total Execution Time:** ${formatTime(deploymentGate.reduce((sum, t) => sum + (t.executionTime || 0), 0))}\n\n`;

  // Critical Path Tests
  report += `## ⚡ Critical Path Tests\n\n`;
  report += `These ${criticalPath.length} tests represent the critical user journeys:\n\n`;
  report += `| Test | Feature | Risk Level | Est. Time |\n`;
  report += `|------|---------|------------|----------|\n`;
  criticalPath.forEach((test) => {
    report += `| ${test.testName} | ${test.feature} | ${test.riskLevel} | ${formatTime(test.executionTime || 0)} |\n`;
  });
  report += `\n**Total Execution Time:** ${formatTime(criticalPath.reduce((sum, t) => sum + (t.executionTime || 0), 0))}\n\n`;

  // Feature Risk Breakdown
  report += `## 📊 Feature Risk Breakdown\n\n`;
  Object.values(featureRiskProfiles).forEach((profile) => {
    const featureTests = getTestsByFeature(profile.feature.toLowerCase());
    report += `### ${profile.feature} (${profile.riskLevel})\n\n`;
    report += `${profile.description}\n\n`;
    report += `- **Business Impact:** ${profile.businessImpact}/5\n`;
    report += `- **Security Impact:** ${profile.securityImpact}/5\n`;
    report += `- **Regulatory Impact:** ${profile.regulatoryImpact}/5\n`;
    report += `- **Total Tests:** ${featureTests.length}\n`;
    report += `- **Owner:** ${profile.owner}\n\n`;
  });

  // Execution Data Analysis
  if (options.includeExecutionData && executions.length > 0) {
    report += `## 📈 Execution Analysis\n\n`;
    const allTests = Object.values(testRiskRegistry);
    allTests.forEach((test) => {
      const analysis = analyzeExecutionHistory(test.testId, executions);
      if (analysis.passRate < 100) {
        report += `### ⚠️ ${test.testName}\n`;
        report += `- **Pass Rate:** ${analysis.passRate}%\n`;
        report += `- **Flakiness:** ${(analysis.flakiness * 100).toFixed(1)}%\n`;
        report += `- **Recent Failures:** ${analysis.recentFailures}/10\n`;
        report += `- **Trending:** ${analysis.trendsUp ? '📈 Failures increasing' : '📉 Stable'}\n\n`;
      }
    });
  }

  // Defect Analysis
  if (options.includeDefectData && defects.length > 0) {
    report += `## 🐛 Defect Analysis\n\n`;
    const unresolvedDefects = defects.filter((d) => !d.dateResolved);
    report += `- **Total Defects:** ${defects.length}\n`;
    report += `- **Unresolved:** ${unresolvedDefects.length}\n`;
    report += `- **Critical:** ${unresolvedDefects.filter((d) => d.severity === 'critical').length}\n`;
    report += `- **High:** ${unresolvedDefects.filter((d) => d.severity === 'high').length}\n\n`;

    if (unresolvedDefects.length > 0) {
      report += `### Unresolved Defects\n\n`;
      report += `| Test | Severity | Found | Description |\n`;
      report += `|------|----------|-------|-------------|\n`;
      unresolvedDefects.forEach((defect) => {
        report += `| ${defect.testId} | ${defect.severity} | ${defect.dateFound} | ${defect.description} |\n`;
      });
      report += `\n`;
    }
  }

  // Recommendations
  if (options.includeRecommendations) {
    report += `## 💡 Recommendations\n\n`;

    if (executions.length > 0) {
      const allTests = Object.values(testRiskRegistry);
      const recommendations = allTests
        .map((test) => getRecommendedRiskLevel(test, executions, defects))
        .filter((rec) => rec.currentLevel !== rec.recommendedLevel);

      if (recommendations.length > 0) {
        report += `### Risk Level Adjustments\n\n`;
        recommendations.forEach((rec) => {
          report += `- **${rec.currentLevel} → ${rec.recommendedLevel}:** ${rec.reasons.join('; ')}\n`;
        });
        report += `\n`;
      }
    }

    report += `### Execution Strategy\n\n`;
    report += `1. **Pre-commit:** Run ${deploymentGate.length} CRITICAL tests (Est. ${formatTime(summary.critical.executionTime)})\n`;
    report += `2. **Pre-deploy:** Run CRITICAL + HIGH tests (Est. ${formatTime(summary.critical.executionTime + summary.high.executionTime)})\n`;
    report += `3. **Nightly:** Run full regression (Est. ${formatTime(summary.critical.executionTime + summary.high.executionTime + summary.medium.executionTime)})\n`;
    report += `4. **Weekly:** Include LOW priority tests for complete coverage\n\n`;
  }

  // Test Suite Health
  report += `## 🏥 Test Suite Health\n\n`;
  if (executions.length > 0) {
    const allTests = Object.values(testRiskRegistry);
    const testedTests = allTests.filter((test) =>
      executions.some((e) => e.testId === test.testId)
    );
    const coverage = Math.round((testedTests.length / allTests.length) * 100);
    report += `- **Test Execution Coverage:** ${coverage}% (${testedTests.length}/${allTests.length} tests have run data)\n`;

    const flakyTests = allTests.filter((test) => {
      const analysis = analyzeExecutionHistory(test.testId, executions);
      return analysis.flakiness > 0.1; // >10% flaky
    });
    report += `- **Flaky Tests:** ${flakyTests.length} tests with >10% flakiness\n`;

    const failingTests = allTests.filter((test) => {
      const analysis = analyzeExecutionHistory(test.testId, executions);
      return analysis.passRate < 90;
    });
    report += `- **Unstable Tests:** ${failingTests.length} tests with <90% pass rate\n`;
  } else {
    report += `- No execution data available yet\n`;
  }

  report += `\n---\n\n`;
  report += `*This report is generated from the risk registry and historical test data.*\n`;

  return report;
}

/**
 * Generate JSON format report
 */
function generateJsonReport(
  executions: TestExecutionRecord[],
  defects: DefectRecord[],
  options: Required<RiskReportOptions>
): string {
  const summary = getRiskSummary();
  const criticalPath = getCriticalPathTests();
  const deploymentGate = getDeploymentGateTests();
  const heatmap = generateRiskHeatmap(Object.values(testRiskRegistry), executions, defects);

  const report = {
    generated: new Date().toISOString(),
    summary,
    deploymentGateTests: deploymentGate.map((t) => ({
      testId: t.testId,
      testName: t.testName,
      feature: t.feature,
      riskLevel: t.riskLevel,
      tags: t.tags,
      executionTime: t.executionTime,
    })),
    criticalPathTests: criticalPath.map((t) => ({
      testId: t.testId,
      testName: t.testName,
      feature: t.feature,
      riskLevel: t.riskLevel,
      tags: t.tags,
      executionTime: t.executionTime,
    })),
    featureProfiles: featureRiskProfiles,
    riskHeatmap: heatmap,
    defectSummary: {
      total: defects.length,
      unresolved: defects.filter((d) => !d.dateResolved).length,
      bySeverity: {
        critical: defects.filter((d) => d.severity === 'critical' && !d.dateResolved).length,
        high: defects.filter((d) => d.severity === 'high' && !d.dateResolved).length,
        medium: defects.filter((d) => d.severity === 'medium' && !d.dateResolved).length,
        low: defects.filter((d) => d.severity === 'low' && !d.dateResolved).length,
      },
    },
  };

  return JSON.stringify(report, null, 2);
}

/**
 * Generate HTML format report
 */
function generateHtmlReport(
  executions: TestExecutionRecord[],
  defects: DefectRecord[],
  options: Required<RiskReportOptions>
): string {
  const mdReport = generateMarkdownReport(executions, defects, options);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Risk-Based Testing Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; border-bottom: 2px solid #ecf0f1; padding-bottom: 8px; margin-top: 30px; }
        h3 { color: #7f8c8d; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
        }
        th {
            background: #3498db;
            color: white;
            font-weight: 600;
        }
        tr:hover { background: #f8f9fa; }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-critical { background: #e74c3c; color: white; }
        .badge-high { background: #f39c12; color: white; }
        .badge-medium { background: #3498db; color: white; }
        .badge-low { background: #95a5a6; color: white; }
        .metric {
            display: inline-block;
            margin: 10px 20px 10px 0;
            padding: 15px 20px;
            background: #ecf0f1;
            border-radius: 6px;
            border-left: 4px solid #3498db;
        }
        .metric-label { font-size: 12px; color: #7f8c8d; text-transform: uppercase; }
        .metric-value { font-size: 24px; font-weight: 700; color: #2c3e50; }
    </style>
</head>
<body>
    <div class="container">
`;

  // Convert markdown to simple HTML (simplified version)
  html += mdReport
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^- (.+)$/gm, '<li>$1</li>');

  html += `
    </div>
</body>
</html>`;

  return html;
}

/**
 * Generate console format report
 */
function generateConsoleReport(
  executions: TestExecutionRecord[],
  defects: DefectRecord[],
  options: Required<RiskReportOptions>
): string {
  const summary = getRiskSummary();
  const deploymentGate = getDeploymentGateTests();

  let report = `\n${'='.repeat(60)}\n`;
  report += `  RISK-BASED TESTING REPORT\n`;
  report += `${'='.repeat(60)}\n\n`;

  report += `📊 TEST SUMMARY:\n`;
  report += `  Total: ${summary.total} tests\n`;
  report += `  🚨 CRITICAL: ${summary.critical.count} (${summary.critical.percentage}%)\n`;
  report += `  ⚠️  HIGH: ${summary.high.count} (${summary.high.percentage}%)\n`;
  report += `  📋 MEDIUM: ${summary.medium.count} (${summary.medium.percentage}%)\n`;
  report += `  📝 LOW: ${summary.low.count} (${summary.low.percentage}%)\n\n`;

  report += `🚨 DEPLOYMENT GATE: ${deploymentGate.length} critical tests\n`;
  report += `   Est. Time: ${formatTime(summary.critical.executionTime)}\n\n`;

  report += `⚡ EXECUTION STRATEGY:\n`;
  report += `  Pre-commit:  ${deploymentGate.length} tests (~${formatTime(summary.critical.executionTime)})\n`;
  report += `  Pre-deploy:  ${summary.critical.count + summary.high.count} tests (~${formatTime(summary.critical.executionTime + summary.high.executionTime)})\n`;
  report += `  Full Regression: ${summary.total} tests (~${formatTime(summary.critical.executionTime + summary.high.executionTime + summary.medium.executionTime + summary.low.executionTime)})\n\n`;

  if (defects.length > 0) {
    const unresolved = defects.filter((d) => !d.dateResolved);
    report += `🐛 DEFECTS:\n`;
    report += `  Total: ${defects.length}\n`;
    report += `  Unresolved: ${unresolved.length}\n\n`;
  }

  report += `${'='.repeat(60)}\n\n`;

  return report;
}

/**
 * Format milliseconds to human-readable time
 */
function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

/**
 * Generate risk dashboard data for visualization
 */
export function generateDashboardData(
  executions: TestExecutionRecord[] = [],
  defects: DefectRecord[] = []
) {
  const summary = getRiskSummary();
  const allTests = Object.values(testRiskRegistry);
  const heatmap = generateRiskHeatmap(allTests, executions, defects);

  return {
    summary,
    deploymentGate: getDeploymentGateTests(),
    criticalPath: getCriticalPathTests(),
    featureBreakdown: Object.entries(featureRiskProfiles).map(([key, profile]) => ({
      feature: profile.feature,
      riskLevel: profile.riskLevel,
      testCount: getTestsByFeature(key).length,
      owner: profile.owner,
    })),
    riskHeatmap: heatmap,
    testHealth: {
      total: allTests.length,
      withExecutionData: allTests.filter((test) =>
        executions.some((e) => e.testId === test.testId)
      ).length,
      flaky: heatmap.filter((h) => h.flakiness > 0.1).length,
      unstable: heatmap.filter((h) => h.passRate < 90).length,
    },
  };
}

/**
 * Print risk report to console
 */
export function printRiskReport(
  executions: TestExecutionRecord[] = [],
  defects: DefectRecord[] = []
): void {
  const report = generateRiskReport(executions, defects, { format: 'console' });
  console.log(report);
}

/**
 * Save risk report to file
 */
export function saveRiskReport(
  filePath: string,
  executions: TestExecutionRecord[] = [],
  defects: DefectRecord[] = [],
  format: 'json' | 'html' | 'markdown' = 'markdown'
): void {
  const report = generateRiskReport(executions, defects, { format });
  const fs = require('fs');
  fs.writeFileSync(filePath, report, 'utf-8');
}
