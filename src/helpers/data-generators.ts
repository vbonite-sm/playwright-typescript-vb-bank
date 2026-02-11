import { randomUUID, randomInt } from 'node:crypto';

/** Unique 8-char ID from crypto. Parallel-safe replacement for `Date.now()`. */
export function uniqueId(): string {
  return randomUUID().slice(0, 8);
}

/** Random username like `testuser_a1b2c3d4`. */
export function randomUsername(prefix = 'testuser'): string {
  return `${prefix}_${uniqueId()}`;
}

/** Random email like `testuser_a1b2c3d4@test.example.com`. */
export function randomEmail(prefix = 'testuser'): string {
  return `${prefix}_${uniqueId()}@test.example.com`;
}

const FIRST_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Edward',
  'Fiona', 'George', 'Helen', 'Ivan', 'Julia',
];

const LAST_NAMES = [
  'Anderson', 'Brown', 'Clark', 'Davis', 'Evans',
  'Foster', 'Garcia', 'Harris', 'Irving', 'Johnson',
];

/** Random full name from predefined pools. */
export function randomFullName(): string {
  const first = FIRST_NAMES[randomInt(FIRST_NAMES.length)];
  const last = LAST_NAMES[randomInt(LAST_NAMES.length)];
  return `${first} ${last}`;
}

/** Random 10-digit account number string. */
export function randomAccountNumber(): string {
  return String(randomInt(1_000_000_000, 10_000_000_000));
}

/** Random monetary amount with 2 decimal places. */
export function randomAmount(min = 1, max = 10000): number {
  const raw = Math.random() * (max - min) + min;
  return Math.round(raw * 100) / 100;
}

/** Random US phone number like `+1-555-482-7163`. */
export function randomPhone(): string {
  const area = randomInt(100, 999);
  const prefix = randomInt(100, 999);
  const line = randomInt(1000, 9999);
  return `+1-${area}-${prefix}-${line}`;
}

/** Random transaction description like `Test payment a1b2c3d4`. */
export function randomDescription(prefix = 'Test'): string {
  const actions = ['payment', 'transfer', 'deposit', 'withdrawal', 'refund'];
  const action = actions[randomInt(actions.length)];
  return `${prefix} ${action} ${uniqueId()}`;
}

/** Random password with uppercase, lowercase, digit, and special char. */
export function randomPassword(): string {
  return `Test${uniqueId()}@${randomInt(100, 999)}`;
}

/** Complete registration form data with unique fields. Parallel-safe. */
export function randomRegistrationData() {
  const id = uniqueId();
  const password = randomPassword();
  return {
    fullName: randomFullName(),
    username: `testuser_${id}`,
    email: `testuser_${id}@test.example.com`,
    password,
    confirmPassword: password,
  };
}
