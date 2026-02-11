import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { createLogger } from '../helpers/logger';

const log = createLogger('Reporter');

export default class JsonLogReporter implements Reporter {
  private startTime = 0;
  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;
  private flakyTests = 0;

  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    this.totalTests = suite.allTests().length;

    log.info('Test run started', {
      totalTests: this.totalTests,
      workers: config.workers,
      projects: config.projects.map((p) => p.name),
    });
  }

  onTestBegin(test: TestCase): void {
    log.info('Test started', {
      title: test.title,
      file: test.location.file,
      line: test.location.line,
      tags: test.tags,
      project: test.parent?.project()?.name,
    });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const durationMs = result.duration;
    const status = result.status;

    switch (status) {
      case 'passed':
        this.passedTests++;
        break;
      case 'failed':
      case 'timedOut':
        this.failedTests++;
        break;
      case 'skipped':
        this.skippedTests++;
        break;
    }

    if (result.status === 'passed' && result.retry > 0) {
      this.flakyTests++;
    }

    const logLevel = status === 'passed' ? 'info' : status === 'skipped' ? 'warn' : 'error';

    log[logLevel](`Test ${status}`, {
      title: test.title,
      status,
      durationMs,
      retry: result.retry,
      project: test.parent?.project()?.name,
      ...(result.errors.length > 0 && {
        errors: result.errors.map((e) => e.message?.slice(0, 500)),
      }),
    });
  }

  onEnd(result: FullResult): void {
    const totalDuration = Date.now() - this.startTime;
    // Count executed tests only (excludes grep-filtered tests)
    const actualRan = this.passedTests + this.failedTests + this.skippedTests;

    log.info('Test run completed', {
      status: result.status,
      totalDurationMs: totalDuration,
      total: actualRan,
      passed: this.passedTests,
      failed: this.failedTests,
      skipped: this.skippedTests,
      flaky: this.flakyTests,
      passRate: actualRan
        ? `${((this.passedTests / actualRan) * 100).toFixed(1)}%`
        : 'N/A',
    });
  }
}
