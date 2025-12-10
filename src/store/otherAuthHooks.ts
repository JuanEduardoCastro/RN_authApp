import { createAsyncThunk } from '@reduxjs/toolkit';
import { isErrorWithCode } from '@react-native-google-signin/google-signin';
import api from './apiService';
import { KeychainService, secureSetStorage } from '@utils/secureStorage';
import { parseApiError } from '@utils/errorHandler';
import { registerFCMToken } from '@utils/notifications/registerFCMToken';
import { loginRateLimiter } from '@utils/rateLimiter';

/**
 * User login with Google signin and persist in time
 * @param { google token } data
 */

export const googleLogin = createAsyncThunk(
  'users/googlesignin',
  async (data: any, { rejectWithValue }) => {
    const { idToken, t } = data;

    const rateLimit = loginRateLimiter.checkRateLimit();

    if (rateLimit.isLocked) {
      __DEV__ &&
        console.log(
          'XX -> authHook.ts:81 -> rateLimit :',
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
          'XX -> authHook.ts:97 -> rateLimit :',
          `Login attempts remaining: ${rateLimit.attemptsLeft}`,
        );
    }

    if (!idToken) {
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-google-unknown'),
      });
    }

    try {
      const validateGoogleResponse = await api.post(
        '/users/google-login',
        {},
        {
          headers: { Authorization: `Bearer ${idToken}` },
        },
      );
      console.log(
        'XX -> otherAuthHooks.ts:30 -> validateGoogleResponse :',
        validateGoogleResponse.status,
        validateGoogleResponse.data,
      );

      if (validateGoogleResponse.status === 200) {
        const { refreshToken } = validateGoogleResponse.data.data;

        const saveResult = await secureSetStorage(
          'refreshToken',
          refreshToken,
          KeychainService.REFRESH_TOKEN,
        );

        if (!saveResult.success) {
          __DEV__ && console.warn('Failed to save refresh token to Keychain.');
        }

        const rememberResult = await secureSetStorage(
          'remember',
          'true',
          KeychainService.REMEMBER_ME,
        );

        if (!rememberResult.success) {
          __DEV__ && console.warn('Failed to save remember me flag.');
        }

        await registerFCMToken(validateGoogleResponse.data.data.accessToken);
        loginRateLimiter.recordSuccessfulAttempt();

        return {
          success: true,
          error: null,
          user: validateGoogleResponse.data.data.user,
          token: validateGoogleResponse.data.data.accessToken,
          messageType: 'success',
          notificationMessage: t('success-welcome'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> otherAuthHooks.ts:121 -> error :', error);
      if (isErrorWithCode(error)) {
        __DEV__ && console.log('XX -> otherAuthHooks.ts:123 -> error :', error);

        const parsedError = parseApiError(error, t, 'error-google-signin');
        return rejectWithValue({
          messageType: 'error',
          notificationMessage: parsedError.message,
        });
      }
    }
  },
);
