interface RateLimitConfig {
  maxAttempts: number; // Max attempts before lockout
  lockoutDuration: number; // Initial lockout duration in ms
  resetDuration: number; // Time to reset attempt counter in ms
}

interface AttemptRecord {
  count: number; // Number of failed attempts
  lastAttemptTime: number; // Timestamp of last attempt
  lockedUntil: number | null; // Timestamp when lockout ends
  lockoutCount: number; // Number of times user has been locked out
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: {
    maxAttempts: 5, // 5 failed attempts
    lockoutDuration: 30000, // 30 seconds initial lockout
    resetDuration: 300000, // 5 minutes to reset counter
  },
  resetPassword: {
    maxAttempts: 3, // 3 failed attempts
    lockoutDuration: 60000, // 1 minute initial lockout
    resetDuration: 600000, // 10 minutes to reset counter
  },
  checkEmail: {
    maxAttempts: 5, // 5 failed attempts
    lockoutDuration: 30000, // 30 seconds initial lockout
    resetDuration: 300000, // 5 minutes to reset counter
  },
};

const attemptRecords: Map<string, AttemptRecord> = new Map();

class RateLimiter {
  private config: RateLimitConfig;
  private endpoint: string;

  constructor(endpoint: string, customConfig?: Partial<RateLimitConfig>) {
    this.endpoint = endpoint;
    this.config = { ...DEFAULT_CONFIGS[endpoint], ...customConfig };
  }

  private getRecord(): AttemptRecord {
    if (!attemptRecords.has(this.endpoint)) {
      attemptRecords.set(this.endpoint, {
        count: 0,
        lastAttemptTime: 0,
        lockedUntil: null,
        lockoutCount: 0,
      });
    }
    return attemptRecords.get(this.endpoint) as AttemptRecord;
  }

  checkRateLimit(): {
    isLocked: boolean;
    remainingTime: number;
    attemptsLeft: number;
  } {
    const record = this.getRecord();
    const now = Date.now();

    if (record.lockedUntil && record.lockedUntil > now) {
      return {
        isLocked: true,
        remainingTime: Math.ceil(record.lockedUntil - now) / 1000,
        attemptsLeft: 0,
      };
    }
    if (
      record.lastAttemptTime &&
      now - record.lastAttemptTime > this.config.resetDuration
    ) {
      record.count = 0;
      record.lockoutCount = 0;
    }

    if (record.lockedUntil && record.lockedUntil <= now) {
      record.lockedUntil = null;
    }

    return {
      isLocked: false,
      remainingTime: 0,
      attemptsLeft: Math.max(0, this.config.maxAttempts - record.count),
    };
  }

  recordFailedAttempt(): void {
    const record = this.getRecord();
    const now = Date.now();
    const MAX_LOCKOUT_DURATION = 15 * 60 * 1000;

    record.count += 1;
    record.lastAttemptTime = now;

    if (record.count >= this.config.maxAttempts) {
      const exponentialMultiplier = Math.pow(2, record.lockoutCount);
      const lockoutDuration =
        this.config.lockoutDuration * exponentialMultiplier;

      const maxLocout = MAX_LOCKOUT_DURATION;
      const finalLockoutDuration = Math.min(lockoutDuration, maxLocout);

      record.lockedUntil = now + finalLockoutDuration;
      record.lockoutCount += 1;
      record.count = 0;

      __DEV__ &&
        console.log(
          'XX -> rateLimiter.ts:108 -> RateLimiter -> recordFailedAttempt -> lockoutCount :',
          `[RateLimiter] Locked out for ${
            finalLockoutDuration / 1000
          }s (lockout #${record.lockoutCount})`,
        );
    }
  }

  recordSuccessfulAttempt(): void {
    const record = this.getRecord();
    record.count = 0;
    record.lockedUntil = null;
    record.lockoutCount = 0;
    record.lastAttemptTime = 0;

    __DEV__ &&
      console.log(
        'XX -> rateLimiter.ts:125 -> RateLimiter -> endpoint :',
        `[RateLimiter] Reset for endpoint: ${this.endpoint}`,
      );
  }

  reset(): void {
    attemptRecords.delete(this.endpoint);
    __DEV__ &&
      console.log(
        'XX -> rateLimiter.ts:134 -> RateLimiter -> endpoint :',
        `[RateLimiter] Manually reset for: ${this.endpoint}`,
      );
  }

  getAttemptCount(): number {
    return this.getRecord().count;
  }

  getLockoutCount(): number {
    return this.getRecord().lockoutCount;
  }
}

export const loginRateLimiter = new RateLimiter('login');
export const resetPasswordRateLimiter = new RateLimiter('resetPassword');
export const checkEmailRateLimiter = new RateLimiter('checkEmail');

export default RateLimiter;
