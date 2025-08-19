import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  INotificationMessagePayload,
  UserCredentialsPayload,
} from './types';
import { RootState } from './store';
import {
  createUser,
  editUser,
  loginUser,
  logoutUser,
  validateRefreshToken,
} from './authHook';
import { googleLogin } from './otherAuthHooks';

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
    setLoader: (state, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
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
  },
  extraReducers(builder) {
    builder
      .addCase(validateRefreshToken.pending, state => {
        state.loader = true;
      })
      .addCase(validateRefreshToken.fulfilled, (state, action) => {
        state.loader = false;
        state.isAuthorized = true;
        state.token = (action.payload as UserCredentialsPayload).token;
        state.user = (action.payload as UserCredentialsPayload).user;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })
      .addCase(validateRefreshToken.rejected, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })

      /* login user */
      .addCase(loginUser.pending, state => {
        state.loader = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loader = false;
        state.token = action.payload?.token;
        state.user = action.payload?.user;
        state.isAuthorized = true;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        ).notificationMessage;
      })

      /* create user */
      .addCase(createUser.pending, state => {
        state.loader = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loader = false;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loader = false;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })

      /* logout user */
      .addCase(logoutUser.pending, state => {
        state.loader = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })

      /* edit user */
      .addCase(editUser.pending, state => {
        state.loader = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loader = false;
        state.token =
          (action.payload as UserCredentialsPayload)?.token || state.token;
        state.user =
          (action.payload as UserCredentialsPayload)?.user || state.user;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })

      /* googlesignin user  */
      .addCase(googleLogin.pending, state => {
        state.loader = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loader = false;
        state.token = action.payload?.token;
        state.user = action.payload?.user;
        state.isAuthorized = true;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        state.messageType = (
          action.payload as UserCredentialsPayload
        )?.messageType;
        state.notificationMessage = (
          action.payload as UserCredentialsPayload
        )?.notificationMessage;
      });
  },
});

export default authSlice.reducer;
export const {
  setLoader,
  setIsAuthorized,
  setCredentials,
  setResetCredentials,
  setNotificationMessage,
} = authSlice.actions;
export const userAuth = (state: RootState) => state.auth;
