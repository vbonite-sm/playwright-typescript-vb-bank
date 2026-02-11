import fs from 'node:fs';
import path from 'node:path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  durationMs?: number;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_DIR = path.resolve(process.cwd(), 'test-logs');
const LOG_FILE = path.join(LOG_DIR, 'test-execution.jsonl');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'errors.jsonl');

function getMinLevel(): LogLevel {
  return (process.env.LOG_LEVEL as LogLevel) || 'info';
}

function ensureLogDir(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function writeLine(file: string, entry: LogEntry): void {
  ensureLogDir();
  const line = JSON.stringify(entry) + '\n';
  fs.appendFileSync(file, line, 'utf-8');
}

/** Create a logger scoped to a named context (e.g. test name, fixture). */
export function createLogger(context: string) {
  function write(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    if (LOG_LEVELS[level] < LOG_LEVELS[getMinLevel()]) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...(data && { data }),
    };

    writeLine(LOG_FILE, entry);

    if (level === 'error') {
      writeLine(ERROR_LOG_FILE, entry);
    }
  }

  return {
    debug: (msg: string, data?: Record<string, unknown>) => write('debug', msg, data),
    info: (msg: string, data?: Record<string, unknown>) => write('info', msg, data),
    warn: (msg: string, data?: Record<string, unknown>) => write('warn', msg, data),
    error: (msg: string, data?: Record<string, unknown>) => write('error', msg, data),

    /** Measure the duration of an async operation. */
    async step<T>(label: string, fn: () => Promise<T>, data?: Record<string, unknown>): Promise<T> {
      const start = Date.now();
      write('info', `▶ ${label}`, data);
      try {
        const result = await fn();
        write('info', `✔ ${label}`, { ...data, durationMs: Date.now() - start });
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        write('error', `✘ ${label}`, { ...data, durationMs: Date.now() - start, error: errorMsg });
        throw err;
      }
    },
  };
}

/**
 * Clear all log files. Intended for global-setup.
 */
export function clearLogs(): void {
  ensureLogDir();
  for (const file of [LOG_FILE, ERROR_LOG_FILE]) {
    if (fs.existsSync(file)) {
      fs.truncateSync(file, 0);
    }
  }
}
