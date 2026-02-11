import type { FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createLogger } from './src/helpers/logger';

const log = createLogger('GlobalTeardown');

const LOG_DIR = path.resolve(process.cwd(), 'test-logs');
const EXECUTION_LOG = path.join(LOG_DIR, 'test-execution.jsonl');
const SUMMARY_FILE = path.join(LOG_DIR, 'run-summary.json');

interface RunSummary {
  timestamp: string;
  durationMs: number;
  environment: {
    baseURL: string;
    nodeVersion: string;
    platform: string;
    ci: boolean;
  };
  results: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    passRate: string;
  };
  failures: string[];
  slowTests: Array<{ title: string; durationMs: number }>;
}

/** Parse the JSONL log to extract run stats. */
function parseRunStats(): RunSummary['results'] & { failures: string[]; slowTests: Array<{ title: string; durationMs: number }> } {
  const defaults = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
    passRate: 'N/A',
    failures: [] as string[],
    slowTests: [] as Array<{ title: string; durationMs: number }>,
  };

  if (!fs.existsSync(EXECUTION_LOG)) return defaults;

  const lines = fs.readFileSync(EXECUTION_LOG, 'utf-8').split('\n').filter(Boolean);

  let total = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let flaky = 0;
  const failures: string[] = [];
  const durations: Array<{ title: string; durationMs: number }> = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.context !== 'Reporter') continue;

      // "Test run completed" has aggregate stats from the reporter
      if (entry.message === 'Test run completed' && entry.data) {
        // Count tests ourselves; suite.allTests() may include grep-filtered tests
        const actualRan = passed + failed + skipped;
        const resolvedTotal = actualRan > 0 ? actualRan : (entry.data.total ?? 0);
        const resolvedPassed = passed || (entry.data.passed ?? 0);

        return {
          total: resolvedTotal,
          passed: resolvedPassed,
          failed: failed || (entry.data.failed ?? 0),
          skipped: skipped || (entry.data.skipped ?? 0),
          flaky: flaky || (entry.data.flaky ?? 0),
          passRate: resolvedTotal
            ? `${((resolvedPassed / resolvedTotal) * 100).toFixed(1)}%`
            : 'N/A',
          failures,
          slowTests: durations
            .sort((a, b) => b.durationMs - a.durationMs)
            .slice(0, 5),
        };
      }

      // Collect per-test results
      if (entry.data?.status && entry.data?.title && entry.data?.durationMs !== undefined) {
        total++;
        const status = entry.data.status as string;
        if (status === 'passed') passed++;
        else if (status === 'failed' || status === 'timedOut') {
          failed++;
          failures.push(entry.data.title);
        } else if (status === 'skipped') skipped++;

        if (entry.data.retry > 0 && status === 'passed') flaky++;

        if (entry.data.durationMs) {
          durations.push({ title: entry.data.title, durationMs: entry.data.durationMs });
        }
      }
    } catch {
      // Ignore malformed lines
    }
  }

  return {
    total,
    passed,
    failed,
    skipped,
    flaky,
    passRate: total ? `${((passed / total) * 100).toFixed(1)}%` : 'N/A',
    failures,
    slowTests: durations
      .sort((a, b) => b.durationMs - a.durationMs)
      .slice(0, 5),
  };
}

export default async function globalTeardown(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL
    ?? process.env.BASE_URL
    ?? 'https://vb-bank-demo.vercel.app';

  const stats = parseRunStats();

  const summary: RunSummary = {
    timestamp: new Date().toISOString(),
    durationMs: 0, // will be filled from reporter data if available
    environment: {
      baseURL,
      nodeVersion: process.version,
      platform: process.platform,
      ci: !!process.env.CI,
    },
    results: {
      total: stats.total,
      passed: stats.passed,
      failed: stats.failed,
      skipped: stats.skipped,
      flaky: stats.flaky,
      passRate: stats.passRate,
    },
    failures: stats.failures,
    slowTests: stats.slowTests,
  };

  // Write summary JSON
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  fs.writeFileSync(SUMMARY_FILE, JSON.stringify(summary, null, 2), 'utf-8');

  // Log summary
  log.info('Test run summary', {
    total: summary.results.total,
    passed: summary.results.passed,
    failed: summary.results.failed,
    skipped: summary.results.skipped,
    flaky: summary.results.flaky,
    passRate: summary.results.passRate,
  });

  if (stats.failures.length > 0) {
    log.warn('Failed tests', { tests: stats.failures });
  }

  if (stats.slowTests.length > 0) {
    log.info('Slowest tests', {
      tests: stats.slowTests.map((t) => `${t.title} (${t.durationMs}ms)`),
    });
  }

  // Console summary for CI
  console.log('\n' + '═'.repeat(60));
  console.log('  TEST RUN SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  Total:   ${summary.results.total}`);
  console.log(`  Passed:  ${summary.results.passed}`);
  console.log(`  Failed:  ${summary.results.failed}`);
  console.log(`  Skipped: ${summary.results.skipped}`);
  console.log(`  Flaky:   ${summary.results.flaky}`);
  console.log(`  Pass Rate: ${summary.results.passRate}`);

  if (stats.failures.length > 0) {
    console.log('\n  ❌ FAILURES:');
    for (const name of stats.failures) {
      console.log(`     • ${name}`);
    }
  }

  if (stats.slowTests.length > 0) {
    console.log('\n  🐢 SLOWEST TESTS:');
    for (const t of stats.slowTests) {
      console.log(`     • ${t.title} — ${t.durationMs}ms`);
    }
  }

  console.log('\n  📄 Summary: test-logs/run-summary.json');
  console.log('═'.repeat(60) + '\n');

  log.info('Global teardown completed');
}
