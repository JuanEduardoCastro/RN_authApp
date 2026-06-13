import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from './store';
import {
  deleteMessage,
  fetchMessages,
  fetchUnreadCount,
  fetchUsers,
  markMessageRead,
  sendAdminMessage,
} from './thunks/adminThunks';
import { AdminState } from './types';

const initialState: AdminState = {
  users: [],
  messages: [],
  unreadCount: 0,
  loader: false,
  usersPage: 1,
  usersHasMore: true,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminLoader: (state, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
    resetUsers: state => {
      state.users = [];
      state.usersPage = 1;
      state.usersHasMore = true;
    },
  },
  extraReducers(builder) {
    builder

      /* fetch user */
      .addCase(fetchUsers.pending, state => {
        state.loader = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loader = false;
        state.users = [...state.users, ...action.payload.users];
        state.usersPage = action.payload.page;
        state.usersHasMore = action.payload.hasMore;
      })
      .addCase(fetchUsers.rejected, state => {
        state.loader = false;
      })

      /* send admin message */
      .addCase(sendAdminMessage.pending, state => {
        state.loader = true;
      })
      .addCase(sendAdminMessage.fulfilled, state => {
        state.loader = false;
      })
      .addCase(sendAdminMessage.rejected, state => {
        state.loader = false;
      })

      /* fetch messages (inbox) */
      .addCase(fetchMessages.pending, state => {
        state.loader = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loader = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, state => {
        state.loader = false;
      })

      /* fetch unread count - silent, no loader */
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })

      /* mar message read - optimistic, no loader */
      .addCase(markMessageRead.fulfilled, (state, action) => {
        const msg = state.messages.find(
          m => m._id === action.payload.messageId,
        );
        if (msg && !msg.isRead) {
          msg.isRead = true;
          if (state.unreadCount > 0) state.unreadCount -= 1;
        }
      })

      /* delete message - optimistic, no loader */
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const msg = state.messages.find(
          m => m._id === action.payload.messageId,
        );
        if (msg && !msg.isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
        state.messages = state.messages.filter(
          m => m._id !== action.payload.messageId,
        );
      });
  },
});

export default adminSlice.reducer;
export const { setAdminLoader, resetUsers } = adminSlice.actions;
export const userAdmin = (state: RootState) => state.admin;
