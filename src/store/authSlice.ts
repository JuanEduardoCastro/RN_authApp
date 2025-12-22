import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  NotificationMessagePayload,
  UserCredentialsPayload,
} from './types';
import {
  createUser,
  editUser,
  loginUser,
  logoutUser,
  validateRefreshToken,
} from './thunks';
import { RootState } from './store';
import { githubLogin, googleLogin } from './otherAuthHooks';

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
    setCredentials: (
      state,
      action: PayloadAction<Partial<UserCredentialsPayload>>,
    ) => {
      state.token = action.payload.token || null;
      state.user = action.payload.user || null;
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
      action: PayloadAction<NotificationMessagePayload>,
    ) => {
      state.notificationMessage = action.payload.notificationMessage;
      state.messageType = action.payload.messageType;
      state.loader = false;
    },
  },
  extraReducers(builder) {
    builder

      /* validate refresh token */
      .addCase(validateRefreshToken.pending, state => {
        state.loader = true;
      })
      .addCase(validateRefreshToken.fulfilled, (state, action) => {
        state.loader = false;
        state.isAuthorized = action.payload.success;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.messageType = action.payload
          .messageType as NotificationMessagePayload['messageType'];
        state.notificationMessage = action.payload.notificationMessage;
      })
      .addCase(validateRefreshToken.rejected, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        const payload = action.payload as Partial<NotificationMessagePayload>;
        state.messageType = payload.messageType ?? 'error';
        state.notificationMessage =
          payload.notificationMessage ?? 'An error occurred';
      })

      /* login user */
      .addCase(loginUser.pending, state => {
        state.loader = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loader = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthorized = true;
        state.messageType = action.payload
          .messageType as NotificationMessagePayload['messageType'];
        state.notificationMessage = action.payload.notificationMessage;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        const payload = action.payload as Partial<NotificationMessagePayload>;
        state.messageType = payload.messageType ?? 'error';
        state.notificationMessage =
          payload.notificationMessage ?? 'An error occurred';
      })

      /* create user */
      .addCase(createUser.pending, state => {
        state.loader = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loader = false;
        state.messageType = action.payload
          .messageType as NotificationMessagePayload['messageType'];
        state.notificationMessage = action.payload.notificationMessage;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loader = false;
        const payload = action.payload as Partial<NotificationMessagePayload>;
        state.messageType = payload.messageType ?? 'error';
        state.notificationMessage =
          payload.notificationMessage ?? 'An error occurred';
      })

      /* edit user */
      .addCase(editUser.pending, state => {
        state.loader = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loader = false;
        const payload = action.payload as Partial<UserCredentialsPayload>;
        state.token = payload.token || state.token;
        state.user = payload.user || state.user;
        state.messageType = action.payload
          .messageType as NotificationMessagePayload['messageType'];
        state.notificationMessage = action.payload.notificationMessage;
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
        state.messageType = action.payload
          .messageType as NotificationMessagePayload['messageType'];
        state.notificationMessage = action.payload.notificationMessage;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loader = false;
        const payload = action.payload as Partial<NotificationMessagePayload>;
        state.messageType = payload.messageType ?? 'error';
        state.notificationMessage =
          payload.notificationMessage ?? 'An error occurred';
      })

      /* googlesignin user  */
      .addCase(googleLogin.pending, state => {
        state.loader = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loader = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthorized = true;
        state.messageType = action.payload
          .messageType as NotificationMessagePayload['messageType'];
        state.notificationMessage = action.payload.notificationMessage;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        const payload = action.payload as Partial<NotificationMessagePayload>;
        state.messageType = payload.messageType ?? 'error';
        state.notificationMessage =
          payload.notificationMessage ?? 'An error occurred';
      })

      /* githubsignin user  */
      .addCase(githubLogin.pending, state => {
        state.loader = true;
      })
      .addCase(githubLogin.fulfilled, (state, action) => {
        state.loader = false;
        (state.token = action.payload.token),
          (state.user = action.payload.user),
          (state.isAuthorized = true);
        state.messageType = action.payload
          .messageType as NotificationMessagePayload['messageType'];
        state.notificationMessage = action.payload.notificationMessage;
      })
      .addCase(githubLogin.rejected, (state, action) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthorized = false;
        const payload = action.payload as Partial<NotificationMessagePayload>;
        state.messageType = payload.messageType ?? 'error';
        state.notificationMessage =
          payload.notificationMessage ?? 'An error occurred';
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
