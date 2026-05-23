import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '@store/apiService';
import { RootState } from '@store/store';
import {
  FetchMessagesPayload,
  FetchUnreadCountPayload,
  FetchUsersPayload,
  MarkMessageReadPayload,
  SendAdminMessagePayload,
} from '@store/types';

import { parseApiError } from '@utils/errorHandler';

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (data: FetchUsersPayload, { rejectWithValue, getState }) => {
    const { t, page = 1, search = '' } = data;
    const { auth } = getState() as RootState;

    try {
      const response = await api.get('/users', {
        params: {
          page,
          search,
        },
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (response.status === 200) {
        return {
          users: response.data.data,
          page: response.data.pagination.page,
          hasMore: response.data.pagination.hasMore,
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> adminThunks.ts:30 -> error :', error);
      const parsedError = parseApiError(error, t, 'error-fetch-users');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

export const sendAdminMessage = createAsyncThunk(
  'admin/sendMessage',
  async (data: SendAdminMessagePayload, { rejectWithValue, getState }) => {
    const { t, recipientIds, title, body, type } = data;
    const { auth } = getState() as RootState;
    try {
      const response = await api.post(
        '/messages/send',
        {
          recipientIds,
          title,
          body,
          type,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } },
      );

      if (response.status === 201) {
        return {
          success: true,
          messageType: 'success',
          notificationMessage: t('success-message-sent'),
        };
      }

      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> adminThunks.ts:66 -> error :', error);
      const parsedError = parseApiError(error, t, 'error-send-message');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

export const fetchMessages = createAsyncThunk(
  'admin/fetchMyMessages',
  async (data: FetchMessagesPayload, { rejectWithValue, getState }) => {
    const { t, unreadOnly = false } = data;
    const { auth } = getState() as RootState;
    try {
      const response = await api.get('/messages', {
        params: {
          unreadOnly,
        },
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (response.status === 200) {
        return {
          messages: response.data.data,
          page: response.data.pagination.page,
          hasMore: response.data.pagination.hasMore,
        };
      }

      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> adminThunks.ts:81 -> error :', error);
      const parsedError = parseApiError(error, t, 'error-fetch-messages');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

export const fetchUnreadCount = createAsyncThunk(
  'admin/unreadCount',
  async (data: FetchUnreadCountPayload, { rejectWithValue, getState }) => {
    const { t } = data;
    const { auth } = getState() as RootState;

    try {
      const response = await api.get('/messages/unread-count', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (response.status === 200) {
        return {
          count: response.data.data.count as number,
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> adminThunks.ts:130 -> error :', error);
      const parsedError = parseApiError(error, t, 'error-fetch-count');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);

export const markMessageRead = createAsyncThunk(
  'admin/markRead',
  async (data: MarkMessageReadPayload, { rejectWithValue, getState }) => {
    const { t, messageId } = data;
    const { auth } = getState() as RootState;

    try {
      const response = await api.patch(
        `/messages/${messageId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
      if (response.status === 200) {
        return { messageId };
      }

      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> adminThunks.ts:155 -> error :', error);
      const parsedError = parseApiError(error, t, 'error-mark-read');
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: parsedError.message,
      });
    }
  },
);
