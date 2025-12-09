import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@hooks/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { DataAPI } from './types';
import api from './apiService';
import DeviceInfo from 'react-native-device-info';
import { registerFCMToken } from '@utils/notifications/registerFCMToken';
import { parseApiError } from '@utils/errorHandler';
import {
  checkEmailRateLimiter,
  loginRateLimiter,
  resetPasswordRateLimiter,
} from '@utils/rateLimiter';
import {
  KeychainService,
  secureDelete,
  secureSetStorage,
} from '@utils/secureStorage';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

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
      __DEV__ && console.log('XX -> authHook.ts:59 -> error :', error);
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
          __DEV__ && console.warn('Failed to save refresh token to Keychain');
        }

        if (data.rememberMe) {
          const rememberResult = await secureSetStorage(
            'remember',
            'true',
            KeychainService.REMEMBER_ME,
          );

          if (!rememberResult.success) {
            __DEV__ && console.warn('Failed to save remember me flag');
          }
        }

        await registerFCMToken(response.data.data.accessToken);
        loginRateLimiter.recordSuccessfulAttempt();

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
      __DEV__ && console.log('XX -> authHook.ts:152 -> error :', error);

      loginRateLimiter.recordFailedAttempt();
      const parsedError = parseApiError(error, t, 'error-credentials');
      const newRateLimit = loginRateLimiter.checkRateLimit();

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
 * User create
 * @param { email, password, token } data
 */

export const createUser = createAsyncThunk(
  'users/create',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = data;
    try {
      const response = await api.post(
        `/users/create`,
        { email: data.email, password: data.password },
        { headers: { Authorization: `Bearer ${data.token}` } },
      );
      if (response.status === 201) {
        return {
          success: true,
          messageType: 'success',
          notificationMessage: t('success-log-in'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:209 -> error :', error);
      const parsedError = parseApiError(error, t, 'error-email-check');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

/**
 * User edit profile
 * @param { userData, token } data
 */

export const editUser = createAsyncThunk(
  'users/:id',
  async (data: DataAPI, { getState, rejectWithValue }) => {
    const { t, userData } = data;
    const { auth } = getState() as RootState;

    const decodeToken = jwtDecode<CustomJwtPayload>(auth.token as string);

    if (!auth.token || !decodeToken._id) {
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-authenticated'),
      });
    }

    try {
      const editUserResponse = await api.patch(
        `/users/${decodeToken._id}`,
        userData,
        { headers: { Authorization: `Bearer ${auth.token}` } },
      );

      if (editUserResponse.status === 200) {
        return {
          success: true,
          user: editUserResponse.data.data.user,
          token: editUserResponse.data.data.accessToken,
          messageType: 'success',
          notificationMessage: t('success-profile-updated'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:260 -> error :', error);

      const parsedError = parseApiError(error, t, 'error-update');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
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

      const response = await api.post('/users/logout', { email: email });
      console.log('XX -> authHook.ts:290 -> response :', response.status);

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
      __DEV__ && console.log('XX -> authHook.ts:307 -> error :', error);

      const parsedError = parseApiError(error, t, 'error-logout');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

/* -------------------------------------------- */

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
