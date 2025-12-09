import { CustomJwtPayload } from '@hooks/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@store/apiService';
import { RootState } from '@store/store';
import { DataAPI } from '@store/types';
import { parseApiError } from '@utils/errorHandler';
import { jwtDecode } from 'jwt-decode';

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
