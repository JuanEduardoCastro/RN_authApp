import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@hooks/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { DataAPI } from './types';
import api from './apiService';

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
          user: response.data.user,
          token: response.data.accessToken,
          messageType: 'success',
          notificationMessage: `${t('success-welcome-back')}${
            response.data.user.firstName
          }!`,
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:51 -> error :', error);
      const message =
        error.response?.data?.notificationMessage || t('error-session-val');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
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
    try {
      const response = await api.post('/users/login', {
        email: data.email,
        password: data.password,
      });
      if (response.status === 200) {
        const { refreshToken } = response.data;
        await Keychain.setGenericPassword('refreshToken', refreshToken, {
          service: 'secret token',
          accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
        });
        if (data.rememberMe) {
          const rememberMeFlag = 'true';
          await Keychain.setGenericPassword('remember', rememberMeFlag, {
            service: 'secret remember me',
            accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
          });
        }
        return {
          success: true,
          error: null,
          user: response.data.user,
          token: response.data.accessToken,
          messageType: 'success',
          notificationMessage: t('success-welcome'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:102 -> error :', error);
      const message =
        error.response?.data?.notificationMessage || t('error-credentials');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
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
      __DEV__ && console.log('XX -> authHook.ts:141 -> error :', error);
      const message =
        error.response?.data?.notificationMessage || t('error-email-check');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
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
          user: editUserResponse.data.user,
          token: editUserResponse.data.accessToken,
          messageType: 'success',
          notificationMessage: t('success-profile-updated'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:187 -> error :', error);
      const message =
        error.response?.data?.notificationMessage || t('error-update');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
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
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = data;
    try {
      const isGoogleSignin = GoogleSignin.hasPreviousSignIn();
      if (isGoogleSignin) {
        await GoogleSignin.signOut();
      }

      const response = await api.post('/users/logout', data);
      if (response.status === 200) {
        await Keychain.resetGenericPassword({ service: 'secret token' });
        await Keychain.resetGenericPassword({
          service: 'secret remember me',
        });
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
      __DEV__ && console.log('XX -> authHook.ts:231 -> error :', error);
      const message =
        error.response?.data?.notificationMessage || t('error-email-check');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
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

    try {
      const response = await api.post('/users/check-email', data);
      // Status 200 means the email was sent successfully
      if (response.status === 200) {
        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA EL MAIL '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        return { success: true };
      }
      // Status 204 means the email is already in use
      if (response.status === 204) {
        return rejectWithValue({
          messageType: 'warning',
          notificationMessage: t('warning-email-in-use'),
        });
      }
      // Fallback for other unexpected success statuses
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:285 -> error :', error);
      const message =
        error.response?.data?.notificationMessage || t('error-email-check');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
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

    try {
      const response = await api.post('/users/reset-password', data);
      if (response.status === 200) {
        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA LA CONTRASEÑA '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        return {
          success: true,
          error: null,
        };
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
      __DEV__ && console.log('XX -> authHook.ts:336 -> error :', error);
      const message =
        error.response?.data?.notificationMessage || t('error-password-reset');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
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
      __DEV__ && console.log('XX -> authHook.ts:375 -> error :', error);
      const message =
        error.response?.data?.notificationMessage || t('error-password-update');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
      });
    }
  },
);
