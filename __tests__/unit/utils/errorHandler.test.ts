import axios from 'axios';
import { TFunction } from 'i18next';

import {
  isNetworkError,
  isTimeoutError,
  parseApiError,
} from '@utils/errorHandler';

const t = ((key: string) => key) as unknown as TFunction;

const makeAxiosError = (overrides: object) =>
  Object.assign(new axios.AxiosError('mock error'), overrides);

describe('parseApiError', () => {
  it('returns unknown typ for non-axios errors', () => {
    const result = parseApiError(new Error('boom'), t);

    expect(result).toEqual({ type: 'unknown', message: 'error-unknown' });
  });

  it('returns timeout type for ECONNABORTED', () => {
    const error = makeAxiosError({ code: 'ECONNABORTED', message: 'timeout' });
    const result = parseApiError(error, t);

    expect(result).toEqual({
      type: 'timeout',
      message: 'error-request-timeout',
      statusCode: 408,
    });
  });

  it('returns network type for ERR_NETWORK', () => {
    const error = makeAxiosError({
      code: 'ERR_NETWORK',
      message: 'Network Error',
    });
    const result = parseApiError(error, t);

    expect(result).toEqual({
      type: 'network',
      message: 'error-network',
      statusCode: 0,
    });
  });

  it('returns server type for 500', () => {
    const error = makeAxiosError({
      response: { status: 500 },
    });
    const result = parseApiError(error, t);

    expect(result).toEqual({
      type: 'server',
      message: 'error-server',
      statusCode: 500,
    });
  });

  it('returns client type for 401 with backend message', () => {
    const error = makeAxiosError({
      response: { status: 401, data: { notificationMessage: 'Unauthorized' } },
    });
    const result = parseApiError(error, t);

    expect(result).toEqual({
      type: 'client',
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('falls back to fallbackMessage for 422 with no backend message', () => {
    const error = makeAxiosError({
      response: { status: 422, data: {} },
    });
    const result = parseApiError(error, t, 'error-credentials');

    expect(result.message).toBe('error-credentials');
  });

  it('uses custom fallbackMessage for unknown non-axios error', () => {
    const result = parseApiError('not an error', t, 'my-fallback');

    expect(result.message).toBe('my-fallback');
  });
});

describe('isTimeoutError', () => {
  it('returns true for ECONNABORTED', () => {
    expect(
      isTimeoutError(makeAxiosError({ code: 'ECONNABORTED', message: '' })),
    ).toBe(true);
  });

  it('returns false for non-axios errors', () => {
    expect(isTimeoutError(new Error('timeout'))).toBe(false);
  });
});

describe('isNetworkError', () => {
  it('returns true for ERR_NETWORK', () => {
    expect(
      isNetworkError(
        makeAxiosError({
          code: 'ERR_NETWORK',
          message: '',
          response: undefined,
        }),
      ),
    ).toBe(true);
  });

  it('returns false for non-axios errors', () => {
    expect(isNetworkError(new Error('Network Error'))).toBe(false);
  });
});
