import { CustomJwtPayload } from '@hooks/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@store/apiService';
import { DataAPI } from '@store/types';
import { parseApiError } from '@utils/errorHandler';
import {
  checkEmailRateLimiter,
  resetPasswordRateLimiter,
} from '@utils/rateLimiter';
import { jwtDecode } from 'jwt-decode';

/**
 * User check email for validation
 * @param { email } data
 */

export const checkEmail = createAsyncThunk(
  'users/check-email',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = data;

    const rateLimit = checkEmailRateLimiter.checkRateLimit();
    if (rateLimit.isLocked) {
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-rate-limit-email', {
          seconds: rateLimit.remainingTime,
        }),
      });
    }

    try {
      const response = await api.post('/users/check-email', data);
      // Status 200 means the email was sent successfully
      if (response.status === 200) {
        checkEmailRateLimiter.recordSuccessfulAttempt();
        return { success: true, error: null };
      }

      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:359 -> error :', error);

      checkEmailRateLimiter.recordFailedAttempt();

      const parsedError = parseApiError(error, t, 'error-email-check');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

/**
 * User reset password
 * @param { email } data
 */

export const resetPassword = createAsyncThunk(
  'users/reset-password',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = data;

    const rateLimit = resetPasswordRateLimiter.checkRateLimit();
    if (rateLimit.isLocked) {
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-rate-limit-reset', {
          seconds: rateLimit.remainingTime,
        }),
      });
    }

    try {
      const response = await api.post('/users/reset-password', data);
      if (response.status === 200) {
        resetPasswordRateLimiter.recordSuccessfulAttempt();
        return { success: true, error: null };
      } else if (response.status === 204) {
        return rejectWithValue({
          messageType: 'warning',
          notificationMessage: t('warning-email-not-registered'),
        });
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:408 -> error :', error);
      resetPasswordRateLimiter.recordFailedAttempt();

      const parsedError = parseApiError(error, t, 'error-password-reset');

      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

/**
 * User update password
 * @param { email, password, token } data
 */

export const updatePassword = createAsyncThunk(
  'users/password',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = data;
    try {
      const decodeToken = jwtDecode<CustomJwtPayload>(data.token as string);
      const response = await api.put(
        `/users/${decodeToken._id}/password`,
        { email: data.email, password: data.password },
        { headers: { Authorization: `Bearer ${data.token}` } },
      );
      if (response.status === 201) {
        return {
          success: true,
          messageType: 'success',
          notificationMessage: t('success-password-updated'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:449 -> error :', error);

      const parsedError = parseApiError(error, t, 'error-password-update');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);
