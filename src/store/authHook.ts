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

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Refresh token validation
 * @param { token } data
 */

export const validateRefreshToken = createAsyncThunk(
  'users/validaterfreshtoken',
  async (data: DataAPI, { rejectWithValue }) => {
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
          notificationMessage: `Welcome back ${response.data.user.firstName}!`,
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: 'An unknown error occurred.',
      });
    } catch (error: any) {
      const message =
        error.response?.data?.notificationMessage ||
        'Session validation failed.';
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
          notificationMessage: 'Welcome!!',
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: 'An unknown error occurred.',
      });
    } catch (error: any) {
      const message =
        error.response?.data?.notificationMessage || 'Wrong credentials!';
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
          notificationMessage:
            'User created successfully.\nPlase log in with credentials',
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: 'An unknown error occurred.',
      });
    } catch (error: any) {
      const message =
        error.response?.data?.notificationMessage || 'Email check failed.';
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
    const { auth } = getState() as RootState;
    if (!auth.token) {
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: 'Not authenticated.',
      });
    }
    const decodeToken = jwtDecode<CustomJwtPayload>(data.token as string);

    try {
      const editUserResponse = await api.put(
        `/users/edituser/${decodeToken._id}`,
        data.userData,
        { headers: { Authorization: `Bearer ${auth.token}` } },
      );
      if (editUserResponse.status === 201) {
        return {
          success: true,
          messageType: 'success',
          notificationMessage: 'Profile updated successfully!',
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: 'An unknown error occurred.',
      });
    } catch (error: any) {
      const message =
        error.response?.data?.notificationMessage || 'Update failed.';
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
          notificationMessage: 'Log out successfully!\nSee you next time!',
        };
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: 'An unknown error occurred.',
      });
    } catch (error: any) {
      const message =
        error.response?.data?.notificationMessage || 'Email check failed.';
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
  async (data: DataAPI, { dispatch, rejectWithValue }) => {
    dispatch(setLoader(true));
    try {
      const response = await api.post('/users/checkemail', data);
      if (response.status === 200) {
        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA EL MAIL '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        dispatch(setLoader(false));
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: 'The email was sent.',
          }),
        );
        return { success: true };
      } else if (response.status === 204) {
        dispatch(setLoader(false));
        dispatch(
          setNotificationMessage({
            messageType: 'warning',
            notificationMessage:
              'This email is already in use.\nPlease try another one.',
          }),
        );
        return {
          success: false,
          error: null,
        };
      }
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:537 -> error :', error);
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 600) {
          dispatch(setLoader(false));
          dispatch(
            setNotificationMessage({
              messageType: 'error',
              notificationMessage: 'Network error! Try again, please.',
            }),
          );
          return {
            success: false,
            error: error,
          };
        }
      } else {
        dispatch(setLoader(false));
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: 'Internal error! Try again, please.',
          }),
        );
        return {
          success: false,
          error: error,
        };
      }
    }
  },
);

/**
 * User reset password
 * @param { email } data
 */

export const resetPassword = createAsyncThunk(
  'users/resetpassword',
  async (data: DataAPI, { dispatch }) => {
    dispatch(setLoader(true));
    try {
      const response = await api.post('/users/resetpassword', data);
      if (response.status === 200) {
        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA LA CONTRASEÑA '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        dispatch(setLoader(false));
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: 'The email was sent.',
          }),
        );
        return {
          success: true,
          error: null,
        };
      } else if (response.status === 204) {
        dispatch(setLoader(false));
        dispatch(
          setNotificationMessage({
            messageType: 'warning',
            notificationMessage: 'There is no email to reset password.',
          }),
        );
        return {
          success: false,
          error: null,
        };
      }
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:537 -> error :', error);
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 600) {
          dispatch(setLoader(false));
          dispatch(
            setNotificationMessage({
              messageType: 'error',
              notificationMessage: 'Network error! Try again, please.',
            }),
          );
          return {
            success: false,
            error: error,
          };
        }
      } else {
        dispatch(setLoader(false));
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: 'Internal error! Try again, please.',
          }),
        );
        return {
          success: false,
          error: error,
        };
      }
    }
  },
);

/**
 * User update password
 * @param { email, password, token } data
 */

export const updatePassword = createAsyncThunk(
  'users/updatepassword',
  async (data: DataAPI, { dispatch }) => {
    dispatch(setLoader(true));
    const decodeToken = jwtDecode<CustomJwtPayload>(data.token as string);
    try {
      const response = await api.put(
        `/users/updatepuser/${decodeToken._id}`,
        { email: data.email, password: data.password },
        { headers: { Authorization: `Bearer ${data.token}` } },
      );
      if (response.status === 201) {
        dispatch(setLoader(false));
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage:
              'Password updated successfully.\nPlease log in with new credentials',
          }),
        );
        return {
          success: true,
          error: null,
        };
      }
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:606 -> error :', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            dispatch(setLoader(false));
            dispatch(
              setNotificationMessage({
                messageType: 'warning',
                notificationMessage: 'Expired token! Try again, please.',
              }),
            );
            return {
              success: false,
              error: error,
            };
          case 409:
            dispatch(setLoader(false));
            setNotificationMessage({
              messageType: 'error',
              notificationMessage: 'User not found!',
            });
            return {
              success: false,
              error: error,
            };
          default:
            if (error.response.status >= 500 && error.response.status < 600) {
              dispatch(setLoader(false));
              setNotificationMessage({
                messageType: 'error',
                notificationMessage: 'Network error! Try again, please.',
              });
              return {
                success: false,
                error: error,
              };
            }
            break;
        }
      } else if (error.request) {
        dispatch(setLoader(false));
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Server error! Try again, please.',
        });
        return {
          success: false,
          error: error,
        };
      } else {
        dispatch(setLoader(false));
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Internal error! Try again, please.',
        });
        return {
          success: false,
          error: error,
        };
      }
    }
  },
);
