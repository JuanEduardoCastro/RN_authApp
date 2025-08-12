import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  INotificationMessagePayload,
  UserCredentialsPayload,
} from './types';
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
    setCredentials: (state, action: PayloadAction<UserCredentialsPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthorized = true;
      state.loader = false;
    },
    setResetCredentials: state => {
      state.token = null;
      state.user = null;
      state.isAuthorized = false;
      state.loader = false;
    },
    setIsAuthorized: state => {
      state.isAuthorized = true;
    },
    setNotificationMessage: (
      state,
      action: PayloadAction<INotificationMessagePayload>,
    ) => {
      state.notificationMessage = action.payload.notificationMessage;
      state.messageType = action.payload.messageType;
      state.loader = false;
    },
    // setMessageType: (state, action) => {
    //   state.messageType = action.payload;
    // },
  },
});

export default authSlice.reducer;
export const {
  startLoader,
  stopLoader,
  // setToken,
  // setUser,
  // setResetUser,
  setIsAuthorized,
  setCredentials,
  setResetCredentials,
  // setMessageType,
  setNotificationMessage,
} = authSlice.actions;
export const userAuth = (state: RootState) => state.auth;
