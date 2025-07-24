import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';
import { RootState } from './store';

const initialState: AuthState = {
  loader: false,
  token: null,
  user: null,
  isAuthorized: false,
  messageType: null,
  notificationMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoader: state => {
      state.loader = true;
    },
    stopLoader: state => {
      state.loader = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthorized = true;
    },
    setResetUser: state => {
      state.token = null;
      state.user = null;
      state.isAuthorized = false;
    },
    setIsAuthorized: state => {
      state.isAuthorized = true;
    },
    setNotificationMessage: (
      state,
      action: PayloadAction<string | null | unknown>,
    ) => {
      state.notificationMessage = action.payload;
    },
    setMessageType: (state, action) => {
      state.messageType = action.payload;
    },
  },
});

export default authSlice.reducer;
export const {
  startLoader,
  stopLoader,
  setToken,
  setUser,
  setResetUser,
  setIsAuthorized,
  setMessageType,
  setNotificationMessage,
} = authSlice.actions;
export const userAuth = (state: RootState) => state.auth;
