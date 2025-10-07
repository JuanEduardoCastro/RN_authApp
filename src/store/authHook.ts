import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { setLoader, setNotificationMessage } from './authSlice';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@hooks/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { DataAPI, UserCredentialsPayload } from './types';
import { Platform } from 'react-native';
import api from './apiService';
import { useTranslation } from 'react-i18next';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Refresh token validation
 * @param { token } data
 */

export const validateRefreshToken = createAsyncThunk(
  'users/validaterfreshtoken',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = useTranslation();
    try {
      const response = await api.get('/users/validatetoken', {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (response.status === 200) {
        __DEV__ &&
          console.log(
            'The user is authorized',
            Platform.OS === 'ios' ? 'in iOS' : 'in Android',
          );
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
    const { t } = useTranslation();
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
    const { t } = useTranslation();
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
  'users/edituser',
  async (data: DataAPI, { getState, rejectWithValue }) => {
    const { t } = useTranslation();
    const { auth } = getState() as RootState;
    if (!auth.token || !auth.user?._id) {
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-authenticated'),
      });
    }

    try {
      const editUserResponse = await api.put(
        `/users/edituser/${auth.user._id}`,
        data.userData,
        { headers: { Authorization: `Bearer ${auth.token}` } },
      );
      if (editUserResponse.status === 201) {
        return {
          success: true,
          messageType: 'success',
          notificationMessage: t('success-profile-updated'),
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
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
    const { t } = useTranslation();
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
  'users/checkemail',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = useTranslation();

    try {
      const response = await api.post('/users/checkemail', data);
      // Status 200 means the email was sent successfully
      if (response.status === 200) {
        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA EL MAIL '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        // dispatch(setLoader(false));
        // dispatch(
        //   setNotificationMessage({
        //     messageType: 'success',
        //     notificationMessage: t("success-email-sent"),
        //   }),
        // );
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
  'users/resetpassword',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = useTranslation();

    try {
      const response = await api.post('/users/resetpassword', data);
      if (response.status === 200) {
        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA LA CONTRASEÑA '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        // dispatch(setLoader(false));
        // dispatch(
        //   setNotificationMessage({
        //     messageType: 'success',
        //     notificationMessage: t("success-email-sent"),
        //   }),
        // );
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
  'users/updatepassword',
  async (data: DataAPI, { rejectWithValue }) => {
    const { t } = useTranslation();
    try {
      const decodeToken = jwtDecode<CustomJwtPayload>(data.token as string);
      const response = await api.put(
        `/users/updatepuser/${decodeToken._id}`,
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
      const message =
        error.response?.data?.notificationMessage || t('error-password-update');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: message,
      });
    }
  },
);
