import { DeviceInfo } from 'react-native-device-info';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import api from '@store/apiService';
import { RootState } from '@store/store';
import {
  CreateUserPayload,
  DeleteAccountPayload,
  EditUserPayload,
} from '@store/types';

import { CustomJwtPayload } from '@hooks/types';

import { disableBiometricLogin } from '@utils/biometricAuth';
import { cleanUserData } from '@utils/cleanUserData';
import { parseApiError } from '@utils/errorHandler';
import { KeychainService, secureDelete } from '@utils/secureStorage';

export const createUser = createAsyncThunk(
  'users/create',
  async (data: CreateUserPayload, { rejectWithValue }) => {
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
      __DEV__ && console.log('XX -> userThunks.ts:36 -> error :', error);
      const parsedError = parseApiError(error, t, 'error-email-check');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

export const editUser = createAsyncThunk(
  'users/:id',
  async (data: EditUserPayload, { getState, rejectWithValue }) => {
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
      const sanitizedData = cleanUserData(userData || {});
      const editUserResponse = await api.patch(
        `/users/${decodeToken._id}`,
        sanitizedData,
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
      __DEV__ && console.log('XX -> userThunks.ts:87 -> error :', error);

      const parsedError = parseApiError(error, t, 'error-update');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (data: DeleteAccountPayload, { getState, rejectWithValue }) => {
    const { t } = data;
    const { auth } = getState() as RootState;
    try {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        await api.delete(`/users/device-token/${deviceId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
      } catch {
        // non-critical error, we can ignore it
      }

      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut();
      }

      const response = await api.delete('users/deleteAccount', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.status === 200) {
        await secureDelete(KeychainService.REFRESH_TOKEN);
        await secureDelete(KeychainService.REMEMBER_ME);
        await disableBiometricLogin();

        return {
          success: true,
          messageType: 'success',
          notificationMessage: t('success-account-deleted'),
        };
      }

      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-account-delete'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> userThunks.ts:139 -> error :', error);

      const parsedError = parseApiError(error, t, 'error-account-delete');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);
