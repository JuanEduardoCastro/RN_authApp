import AsyncStorage from '@react-native-async-storage/async-storage';

import PersistentRateLimiter from '@utils/persistentRateLimiter';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('PersistentRateLimiter', () => {
  it('starts unlock with full attempts', async () => {
    const limiter = new PersistentRateLimiter('login');
    const result = await limiter.checkRateLimit();

    expect(result.isLocked).toBe(false);
    expect(result.attemptsLeft).toBe(5);
  });

  it('decrements attemptsLeft after failed attempts', async () => {
    const limiter = new PersistentRateLimiter('login');
    await limiter.recordFailedAttempt();
    await limiter.recordFailedAttempt();
    const result = await limiter.checkRateLimit();
    expect(result.attemptsLeft).toBe(3);
  });

  it('locks after maxAttempts failed attempts', async () => {
    const limiter = new PersistentRateLimiter('login');
    for (let i = 0; i < 5; i++) {
      await limiter.recordFailedAttempt();
    }
    const result = await limiter.checkRateLimit();
    expect(result.isLocked).toBe(true);
    expect(result.remainingTime).toBeGreaterThan(0);
  });

  it('resets after successful attempt', async () => {
    const limiter = new PersistentRateLimiter('login');
    await limiter.recordFailedAttempt();
    await limiter.recordSuccessfulAttempt();
    const result = await limiter.checkRateLimit();
    expect(result.isLocked).toBe(false);
    expect(result.attemptsLeft).toBe(5);
  });

  it('applies exponential backoff on second lockout', async () => {
    const limiter = new PersistentRateLimiter('login');
    // First lockout
    for (let i = 0; i < 5; i++) await limiter.recordFailedAttempt();
    const firstLockout = await limiter.checkRateLimit();

    await limiter.reset();
    // Manually set lockoutCount to 1 by forcing a second lockout cycle
    const limiter2 = new PersistentRateLimiter('login');
    await AsyncStorage.setItem(
      '@rate_limit_login',
      JSON.stringify({
        count: 0,
        lastAttemptTime: 0,
        lockedUntil: null,
        lockoutCount: 1,
      }),
    );
    for (let i = 0; i < 5; i++) await limiter2.recordFailedAttempt();
    const secondLockout = await limiter2.checkRateLimit();

    expect(secondLockout.remainingTime).toBeGreaterThan(
      firstLockout.remainingTime,
    );
  });

  it('resetPassword limiter locks after 3 attempts', async () => {
    const limiter = new PersistentRateLimiter('resetPassword');
    for (let i = 0; i < 3; i++) await limiter.recordFailedAttempt();
    const result = await limiter.checkRateLimit();
    expect(result.isLocked).toBe(true);
  });
});
