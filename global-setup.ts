import type { FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createLogger, clearLogs } from './src/helpers/logger';

const log = createLogger('GlobalSetup');

const ARTIFACT_DIRS = ['test-results', 'playwright-report'] as const;

/** Recursively remove a directory's contents while keeping the directory. */
function cleanDir(dir: string): void {
  const abs = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(abs)) return;
  for (const entry of fs.readdirSync(abs)) {
    const full = path.join(abs, entry);
    fs.rmSync(full, { recursive: true, force: true });
  }
}

/** Probe a URL and return HTTP status (or -1 on network error). */
async function probe(url: string, timeoutMs = 15_000): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });
    return res.status;
  } catch {
    return -1;
  } finally {
    clearTimeout(timer);
  }
}

export default async function globalSetup(config: FullConfig): Promise<void> {
  const startMs = Date.now();
  const baseURL = config.projects[0]?.use?.baseURL
    ?? process.env.BASE_URL
    ?? 'https://vb-bank-demo.vercel.app';

  // Clear previous logs
  clearLogs();
  log.info('Global setup started', {
    baseURL,
    workers: config.workers,
    projects: config.projects.map((p) => p.name),
    nodeVersion: process.version,
    platform: process.platform,
    ci: !!process.env.CI,
  });

  // Environment health check
  log.info('Checking environment health');
  const status = await probe(baseURL);

  if (status === -1) {
    const msg = `❌ Application unreachable at ${baseURL}. Aborting test run.`;
    log.error(msg, { baseURL });
    throw new Error(msg);
  }

  if (status >= 400) {
    const msg = `❌ Application returned HTTP ${status} at ${baseURL}. Aborting test run.`;
    log.error(msg, { baseURL, status });
    throw new Error(msg);
  }

  log.info('Environment healthy', { baseURL, status });

  // Clean stale artifacts
  for (const dir of ARTIFACT_DIRS) {
    cleanDir(dir);
  }
  log.info('Stale artifacts cleaned', {
    directories: [...ARTIFACT_DIRS],
  });

  // Ensure required directories exist
  for (const dir of ['storage-state', 'test-logs', 'test-results']) {
    const abs = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(abs)) {
      fs.mkdirSync(abs, { recursive: true });
    }
  }

  log.info('Global setup completed', {
    durationMs: Date.now() - startMs,
  });
}
