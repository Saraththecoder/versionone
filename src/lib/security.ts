const LOCKOUT_PREFIX = 'aits_lockout_';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000; // 60 seconds

interface LockoutRecord {
  count: number;
  lockedUntil: number;
}

const memoryLockouts = new Map<string, LockoutRecord>();

/**
 * Demo shortcuts and self-serve driver signup are enabled in local development
 * or when explicitly opted in via NEXT_PUBLIC_ENABLE_DEMO="true".
 */
export function isDemoModeEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_DEMO === 'true') return true;
  if (process.env.NEXT_PUBLIC_ENABLE_DEMO === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

export function isDemoUid(uid?: string | null): boolean {
  return Boolean(uid && uid.startsWith('demo-'));
}

function readLockoutRecord(key: string): LockoutRecord {
  const mem = memoryLockouts.get(key);
  if (mem) return mem;

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`${LOCKOUT_PREFIX}${key}`);
      if (raw) {
        const parsed = JSON.parse(raw) as LockoutRecord;
        memoryLockouts.set(key, parsed);
        return parsed;
      }
    } catch {
      // Ignore storage errors
    }
  }
  return { count: 0, lockedUntil: 0 };
}

function writeLockoutRecord(key: string, record: LockoutRecord): void {
  memoryLockouts.set(key, record);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${LOCKOUT_PREFIX}${key}`, JSON.stringify(record));
    } catch {
      // Ignore storage errors
    }
  }
}

export function assertNotLockedOut(key: string): void {
  const record = readLockoutRecord(key);
  const now = Date.now();
  if (record.lockedUntil > now) {
    const secs = Math.ceil((record.lockedUntil - now) / 1000);
    throw new Error(`Too many failed attempts. Try again in ${secs}s.`);
  }
}

export function recordFailedAttempt(key: string): number {
  const now = Date.now();
  const prev = readLockoutRecord(key);
  const count = prev.lockedUntil > now ? prev.count : prev.lockedUntil > 0 ? 1 : prev.count + 1;
  const lockedUntil = count >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;
  writeLockoutRecord(key, { count, lockedUntil });
  return Math.max(0, MAX_FAILED_ATTEMPTS - count);
}

export function clearFailedAttempts(key: string): void {
  memoryLockouts.delete(key);
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(`${LOCKOUT_PREFIX}${key}`);
    } catch {
      // Ignore storage errors
    }
  }
}
