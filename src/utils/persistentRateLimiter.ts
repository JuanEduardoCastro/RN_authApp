import AsyncStorage from '@react-native-async-storage/async-storage';

interface RateLimiterConfig {
  maxAttempts: number;
  lockoutDuration: number;
  resetDuration: number;
}

interface AttemptRecord {
  count: number;
  lastAttemptTime: number;
  lockedUntil: number | null;
  lockoutCount: number;
}

const STORAGE_PREFIX = '@rate_limit_';
const MAX_LOCKOUT_DURATION = 15 * 60 * 1000;
const DEFAULT_CONFIG: Record<string, RateLimiterConfig> = {
  login: {
    maxAttempts: 5,
    lockoutDuration: 30000,
    resetDuration: 300000,
  },
  resetPassword: {
    maxAttempts: 3,
    lockoutDuration: 60000,
    resetDuration: 600000,
  },
  checkEmail: {
    maxAttempts: 5,
    lockoutDuration: 30000,
    resetDuration: 300000,
  },
};

class PersistentRateLimiter {
  private config: RateLimiterConfig;
  private endpoint: string;
  private storageKey: string;
  constructor(endpoint: string, customConfig?: Partial<RateLimiterConfig>) {
    this.endpoint = endpoint;
    this.storageKey = `${STORAGE_PREFIX}${endpoint}`;
    this.config = { ...DEFAULT_CONFIG[endpoint], ...customConfig };
  }

  private async getRecord(): Promise<AttemptRecord> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      __DEV__ && console.log('Failed to load rate limit record', error);
    }
    return {
      count: 0,
      lastAttemptTime: 0,
      lockedUntil: null,
      lockoutCount: 0,
    };
  }

  private async saveRecord(record: AttemptRecord): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(record));
    } catch (error) {
      __DEV__ && console.log('Failed to save rate limit record:', error);
    }
  }

  async checkRateLimit(): Promise<{
    isLocked: boolean;
    remainingTime: number;
    attemptsLeft: number;
  }> {
    const record = await this.getRecord();
    const now = Date.now();

    if (record.lockedUntil && record.lockedUntil > now) {
      return {
        isLocked: true,
        remainingTime: Math.ceil((record.lockedUntil - now) / 1000),
        attemptsLeft: 0,
      };
    }
    if (
      record.lastAttemptTime &&
      now - record.lastAttemptTime > this.config.resetDuration
    ) {
      record.count = 0;
      record.lockoutCount = 0;
      record.lockedUntil = null;
      await this.saveRecord(record);
    }
    return {
      isLocked: false,
      remainingTime: 0,
      attemptsLeft: Math.max(0, this.config.maxAttempts - record.count),
    };
  }

  async recordFailedAttempt(): Promise<void> {
    const record = await this.getRecord();
    const now = Date.now();

    record.count += 1;
    record.lastAttemptTime = now;

    if (record.count >= this.config.maxAttempts) {
      const exponentialMultiplier = Math.pow(2, record.lockoutCount);
      const lockoutDuration =
        this.config.lockoutDuration * exponentialMultiplier;
      const finalLockoutDuration = Math.min(
        lockoutDuration,
        MAX_LOCKOUT_DURATION,
      );
      record.lockedUntil = now + finalLockoutDuration;
      record.lockoutCount += 1;
      record.count = 0;
      __DEV__ &&
        console.log(
          `[PersistentRateLimiter] Locked for ${
            finalLockoutDuration / 1000
          }s (lockout#${record.lockoutCount})`,
        );
    }
    await this.saveRecord(record);
  }

  async recordSuccessfulAttempt(): Promise<void> {
    const record: AttemptRecord = {
      count: 0,
      lockedUntil: null,
      lockoutCount: 0,
      lastAttemptTime: 0,
    };
    await this.saveRecord(record);
    __DEV__ &&
      console.log(`[PersistentRateLimiter] Reset for: ${this.endpoint}`);
  }
  async reset(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
      __DEV__ &&
        console.log(`[PersistentRateLimiter] Manually reset: ${this.endpoint}`);
    } catch (error) {
      __DEV__ && console.log('Failed to reset rate limiter:', error);
    }
  }

  async getAttemptCount(): Promise<number> {
    const record = await this.getRecord();
    return record.count;
  }

  async getLockoutCount(): Promise<number> {
    const record = await this.getRecord();
    return record.lockoutCount;
  }
}

export const loginRateLimiter = new PersistentRateLimiter('login');
export const resetPasswordRateLimiter = new PersistentRateLimiter(
  'resetPassword',
);
export const checkEmailRateLimiter = new PersistentRateLimiter('checkEmail');
export default PersistentRateLimiter;
