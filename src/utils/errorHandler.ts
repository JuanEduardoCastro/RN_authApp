import { ApiErrorResponse, ParsedError } from '@store/types';
import axios, { AxiosError } from 'axios';
import { TFunction } from 'i18next';

export const parseApiError = (
  error: unknown,
  t: TFunction,
  fallbackMessage: string = 'error-unknown',
): ParsedError => {
  if (!axios.isAxiosError(error)) {
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
    return {
      type: 'timeout',
      message: t('error-timeout'),
      statusCode: 408,
    };
  }

  if (
    axiosError.code === 'ERR_NETWORK' ||
    axiosError.message === 'Network Error' ||
    !axiosError.response
  ) {
    return {
      type: 'network',
      message: t('error-network'),
      statusCode: 0,
    };
  }

  const statusCode = axiosError.response?.status;
  if (statusCode && statusCode >= 500) {
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
