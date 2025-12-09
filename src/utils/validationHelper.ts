import { t } from 'i18next';

/**
 * Validates email token format and length
 * @param token - The token string to validate
 * @returns Error message or null if valid
 */
export const validateEmailToken = (token: string | null): string | null => {
  if (!token) {
    return 'Token is null or undefined';
  }

  if (typeof token !== 'string') {
    return 'Token is not a string';
  }

  if (token.trim().length === 0) {
    return 'Token is empty or contains only whitespace characters';
  }

  if (token.trim().split('.').length !== 3) {
    return 'Invalid token format';
  }

  if (
    token.trim().split('.')[0].length < 4 ||
    token.trim().split('.')[1].length < 4 ||
    token.trim().split('.')[2].length < 4
  ) {
    return 'Invalid token format';
  }

  if (token.trim().length > 2000) {
    return 'Token is too long';
  }

  const base64UrlRegex = /^[A-Za-z0-9\-_=]+$/;
  if (
    !token
      .trim()
      .split('.')
      .every(part => base64UrlRegex.test(part))
  ) {
    return 'Token contains invalid characters';
  }

  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /\.\.[\\/]/,
    /<iframe/i,
    /eval\(/i,
    /document\./i,
    /window\./i,
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(token))) {
    return 'Token contains suspicious patterns';
  }

  return null;
};

export const validatePasswordInput = (value: string): string | boolean => {
  if (!/[A-Z]/.test(value)) {
    return t('info-password-uppercase');
  }
  if (!/[a-z]/.test(value)) {
    return t('info-password-lowercase');
  }
  if (!/[0-9]/.test(value)) {
    return t('info-password-number');
  }
  if (!/[^a-zA-Z0-9]/.test(value)) {
    return t('info-password-symbol');
  }
  return true;
};
