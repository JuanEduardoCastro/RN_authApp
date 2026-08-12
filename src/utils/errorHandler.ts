import axios, { AxiosError } from 'axios';
import { TFunction } from 'i18next';

import { ApiErrorResponse, ParsedError } from '@store/types';

import { recordCrashlyticsError } from '@utils/crashlytics';

export const parseApiError = (
  error: unknown,
  t: TFunction,
  fallbackMessage: string = 'error-unknown',
): ParsedError => {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      recordCrashlyticsError(error);
    }
    return {
      type: 'unknown',
      message: t(fallbackMessage),
    };
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (
    axiosError.code === 'ECONNABORTED' ||
    axiosError.message.includes('timeout')
  ) {
    recordCrashlyticsError(axiosError);
    return {
      type: 'timeout',
      message: t('error-request-timeout'),
      statusCode: 408,
    };
  }

  if (
    axiosError.code === 'ERR_NETWORK' ||
    axiosError.message === 'Network Error' ||
    !axiosError.response
  ) {
    recordCrashlyticsError(axiosError);
    return {
      type: 'network',
      message: t('error-network'),
      statusCode: 0,
    };
  }

  const statusCode = axiosError.response?.status;
  if (statusCode && statusCode >= 500) {
    recordCrashlyticsError(axiosError);
    return {
      type: 'server',
      message: t('error-server'),
      statusCode,
    };
  }

  if (statusCode && statusCode >= 400 && statusCode < 500) {
    const customMessage = axiosError.response?.data?.notificationMessage;

    return {
      type: 'client',
      message: customMessage || t(fallbackMessage),
      statusCode,
    };
  }

  recordCrashlyticsError(axiosError);
  return {
    type: 'unknown',
    message: t(fallbackMessage),
  };
};

export const isTimeoutError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  return error.code === 'ECONNABORTED' || error.message.includes('timeout');
};

export const isNetworkError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  return (
    error.code === 'ERR_NETWORK' ||
    error.message === 'Network Error' ||
    !error.response
  );
};
