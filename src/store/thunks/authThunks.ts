import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@store/apiService';
import { RootState } from '@store/store';
import { DataAPI } from '@store/types';
import { parseApiError } from '@utils/errorHandler';
import { registerFCMToken } from '@utils/notifications/registerFCMToken';
import { loginRateLimiter } from '@utils/persistentRateLimiter';
import {
  KeychainService,
  secureDelete,
  secureSetStorage,
} from '@utils/secureStorage';
import DeviceInfo from 'react-native-device-info';

/**
 * Refresh token validation
 * @param { token } data
 */

export const validateRefreshToken = createAsyncThunk(
  'users/token/refresh',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = data;

    try {
      const response = await api.post(
        '/users/token/refresh',
        {},
        {
          headers: { Authorization: `Bearer ${data.token}` },
        },
      );
      if (response.status === 200) {
        return {
          success: true,
          user: response.data.data.user,
          token: response.data.data.accessToken,
          messageType: 'success',
          notificationMessage: `${t('success-welcome-back')}${
            response.data.data.user.firstName
          }!`,
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authThunks.ts:50 -> error :', error);
      const parsedError = parseApiError(error, t, 'error-session-val');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

/**
 * User login
 * @param { email, password } data
 */

export const loginUser = createAsyncThunk(
  'users/login',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = data;

    const rateLimit = await loginRateLimiter.checkRateLimit();

    if (rateLimit.isLocked) {
      __DEV__ &&
        console.log(
          'XX -> authThunks.ts:73 -> rateLimit :',
          `Login rate limited for ${rateLimit.remainingTime}s`,
        );

      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-rate-limit-login', {
          seconds: rateLimit.remainingTime,
        }),
      });
    }

    if (rateLimit.attemptsLeft <= 2 && rateLimit.attemptsLeft > 0) {
      __DEV__ &&
        console.log(
          'XX -> authThunks.ts:89 -> rateLimit :',
          `Login attempts remaining: ${rateLimit.attemptsLeft}`,
        );
    }

    try {
      const response = await api.post('/users/login', {
        email: data.email,
        password: data.password,
      });
      if (response.status === 200) {
        const { refreshToken } = response.data.data;

        const saveResult = await secureSetStorage(
          'refreshToken',
          refreshToken,
          KeychainService.REFRESH_TOKEN,
        );

        if (!saveResult.success) {
          __DEV__ && console.warn('Failed to save refresh token to Keychain.');
        }

        if (data.rememberMe) {
          const rememberResult = await secureSetStorage(
            'remember',
            'true',
            KeychainService.REMEMBER_ME,
          );

          if (!rememberResult.success) {
            __DEV__ && console.warn('Failed to save remember me flag.');
          }
        }

        await registerFCMToken(response.data.data.accessToken);
        await loginRateLimiter.recordSuccessfulAttempt();

        return {
          success: true,
          error: null,
          user: response.data.data.user,
          token: response.data.data.accessToken,
          messageType: 'success',
          notificationMessage: t('success-welcome'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authThunks.ts:142 -> error :', error);

      await loginRateLimiter.recordFailedAttempt();
      const parsedError = parseApiError(error, t, 'error-credentials');
      const newRateLimit = await loginRateLimiter.checkRateLimit();

      if (newRateLimit.isLocked) {
        return rejectWithValue({
          messageType: 'error',
          notificationMessage: t('error-rate-limit-login', {
            seconds: newRateLimit.remainingTime,
          }),
        });
      }

      const attemptsLeft = newRateLimit.attemptsLeft;
      const message =
        attemptsLeft > 0 && attemptsLeft <= 2
          ? `${parsedError.message} ${t('warning-attempts-left', {
              count: attemptsLeft,
            })}`
          : parsedError.message;

      return rejectWithValue({
        messageType: parsedError.type === 'timeout' ? 'warning' : 'error',
        notificationMessage: parsedError.message || message,
      });
    }
  },
);

/**
 * User logout
 * @param { email } data
 */

export const logoutUser = createAsyncThunk(
  'users/logout',
  async (data: DataAPI, { getState, rejectWithValue }) => {
    const { t, email } = data;
    const { auth } = getState() as RootState;
    try {
      const deviceId = await DeviceInfo.getUniqueId();

      const isGoogleSignin = GoogleSignin.hasPreviousSignIn();
      if (isGoogleSignin) {
        await GoogleSignin.signOut();
      }

      const response = await api.post(
        '/users/logout',
        { email: email },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );

      if (response.status === 200) {
        await api.delete(`/users/device-token/${deviceId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        await secureDelete(KeychainService.REFRESH_TOKEN);

        await secureDelete(KeychainService.REMEMBER_ME);

        return {
          success: true,
          error: null,
          messageType: 'success',
          notificationMessage: t('success-log-out'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authThunks.ts:219 -> error :', error);

      const parsedError = parseApiError(error, t, 'error-logout');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);
