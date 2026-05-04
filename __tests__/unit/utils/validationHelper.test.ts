import { TFunction } from 'i18next';

import {
  validateEmailToken,
  validatePasswordInput,
} from '@utils/validationHelper';

const t = ((key: string) => key) as unknown as TFunction;

describe('validateEmailToken', () => {
  it('returns null for a valid JWT', () => {
    const validateJWT =
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    expect(validateEmailToken(validateJWT)).toBeNull();
  });

  it('returns error for null', () => {
    expect(validateEmailToken(null)).toBe('Token is null or undefined');
  });

  it('returns error for empty string', () => {
    expect(validateEmailToken('   ')).toBe(
      'Token is empty or contains only whitespace characters',
    );
  });

  it('returns error for token without 3 parts', () => {
    expect(validateEmailToken('only.two')).toBe('Invalid token format');
  });

  it('returns error for parts that are too short', () => {
    expect(validateEmailToken('abc.abc.abc')).toBe('Invalid token format');
  });

  it('returns error for token exceeding 2000 chars', () => {
    const long = 'a'.repeat(667);
    expect(validateEmailToken(`${long}.${long}.${long}`)).toBe(
      'Token is too long',
    );
  });

  it('returns error for XSS injection attempt', () => {
    const xss = 'onsubmit=BBBBB.CCCCCCCC.DDDDDDDD';
    expect(validateEmailToken(xss)).toBe('Token contains suspicious patterns');
  });

  it('returns error for invalid base64url characters', () => {
    expect(validateEmailToken('abc!.defgh.ghijk')).toBe(
      'Token contains invalid characters',
    );
  });
});

describe('validatePasswordInput', () => {
  it('returns true for a valid password', () => {
    expect(validatePasswordInput('ValidPass1!', t)).toBe(true);
  });

  it('returns error for password under 8 chars', () => {
    expect(validatePasswordInput('Ab1!', t)).toBe('info-password-min');
  });

  it('returns error for password over 128 chars', () => {
    expect(validatePasswordInput('A1!' + 'a'.repeat(130), t)).toBe(
      'info-password-max',
    );
  });

  it('returns error when missing uppercase', () => {
    expect(validatePasswordInput('validpass1!', t)).toBe(
      'info-password-uppercase',
    );
  });

  it('returns error when missing lowercase', () => {
    expect(validatePasswordInput('VALIDPASS1!', t)).toBe(
      'info-password-lowercase',
    );
  });

  it('returns error when missing number', () => {
    expect(validatePasswordInput('ValidPass!!', t)).toBe(
      'info-password-number',
    );
  });

  it('returns error when missing symbol', () => {
    expect(validatePasswordInput('ValidPass1', t)).toBe('info-password-symbol');
  });
});
