import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setLoader, setNotificationMessage } from './authSlice';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@hooks/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { DataAPI } from './types';

export const HOST = __DEV__
  ? Platform.OS === 'ios'
    ? 'http://localhost:3005'
    : 'http://10.0.2.2:3005'
  : 'https://auth-app-fo8j.onrender.com';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Refresh token validation
 * @param { token } data
 */

export const validateRefreshToken = createAsyncThunk(
  'users/validaterfreshtoken',
  async (data: DataAPI) => {
    try {
      const response = await axios.get(`${HOST}/users/validatetoken`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      if (response.status === 200) {
        __DEV__ &&
          console.log(
            'The user is authorized',
            Platform.OS === 'ios' ? 'in iOS' : 'in Android',
          );
        return {
          success: true,
          error: null,
          user: response.data.user,
          token: response.data.accessToken,
          messageType: 'success',
          notificationMessage: `Welcome back ${response.data.user.firstName}!`,
        };
      }
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:54 -> error :', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            return {
              success: false,
              error: error,
              messageType: 'warnign',
              notificationMessage: 'Expired credentials!',
            };
          case 404:
            return {
              success: false,
              error: error,
              messageType: 'error',
              notificationMessage: 'User not found!',
            };
          default:
            if (error.response.status >= 500 && error.response.status < 600) {
              return {
                success: false,
                error: error,
                messageType: 'error',
                notificationMessage: 'Network error! Try again, please.',
              };
            }
        }
      } else if (error.request) {
        return {
          success: false,
          error: error,
          messageType: 'error',
          notificationMessage: 'Server error! Try again, please.',
        };
      } else {
        return {
          success: false,
          error: error,
          messageType: 'error',
          notificationMessage: 'Internal error! Try again, please.',
        };
      }
    }
  },
);

/**
 * User login
 * @param { email, password } data
 */

export const loginUser = createAsyncThunk(
  'users/login',
  async (data: DataAPI) => {
    try {
      const response = await axios.post(`${HOST}/users/login`, {
        email: data.email,
        password: data.password,
      });
      if (response.status === 200) {
        const refreshToken = response.data.refreshToken;
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
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:135 -> error :', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            return {
              messageType: 'warnign',
              notificationMessage: 'Wrong credentials!',
              success: false,
              error: error,
            };
          case 404:
            return {
              messageType: 'error',
              notificationMessage: 'User not found!',
              success: false,
              error: error,
            };
          default:
            if (error.response.status >= 500 && error.response.status < 600) {
              return {
                messageType: 'error',
                notificationMessage: 'Network error! Try again, please.',
                success: false,
                error: error,
              };
            }
            break;
        }
      } else if (error.request) {
        return {
          messageType: 'error',
          notificationMessage: 'Server error! Try again, please.',
          success: false,
          error: error,
        };
      } else {
        return {
          messageType: 'error',
          notificationMessage: 'Internal error! Try again, please.',
          success: false,
          error: error,
        };
      }
    }
  },
);

/**
 * User edit profile
 * @param { userData, token } data
 */

export const editUser = createAsyncThunk(
  'users/edituser',
  async (data: DataAPI) => {
    const decodeToken = jwtDecode<CustomJwtPayload>(data.token as string);

    const editUserInstance = axios.create({
      baseURL: HOST,
      timeout: 8000, // in miliseconds
    });

    editUserInstance.interceptors.request.use(
      response => response,
      async error => {
        let isRefreshing = false;
        let failedRequestsQueue: ((token: string) => void)[] = [];
        const processQueue = (token: string | null) => {
          failedRequestsQueue.forEach(callback => callback(token as string));
          failedRequestsQueue = [];
        };
        if (error.response.status === 401 || !error.config._retry) {
          if (isRefreshing) {
            return new Promise(resolve => {
              failedRequestsQueue.push(token => {
                error.config.headers.Authorization = `Bearer ${token}`;
                resolve(editUserInstance(error.config));
              });
            });
          }
          isRefreshing = true;
          error.config._retry = true;

          try {
            const refreshToken = await Keychain.getGenericPassword({
              service: 'secret token',
            });
            if (!refreshToken) {
              await Keychain.resetGenericPassword({ service: 'secret token' });
              await Keychain.resetGenericPassword({
                service: 'secret remember me',
              });
              return Promise.reject(error);
            }

            const refreshTokenResponse = await axios.get(
              `${HOST}/users/validatetoken`,
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              },
            );
            if (refreshTokenResponse.status === 200) {
              editUserInstance.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${refreshTokenResponse.data.accessToken}`;
              processQueue(refreshTokenResponse.data.accessToken);
              editUserInstance(error.config);
              return {
                success: true,
                error: null,
                user: refreshTokenResponse.data.user,
                token: refreshTokenResponse.data.accessToken,
                messageType: 'success',
                notificationMessage: `Welcome back ${refreshTokenResponse.data.user.firstName}!`,
              };
            }
          } catch (error: any) {
            __DEV__ &&
              console.log(
                'XX -> authHook.ts:254 -> axios instance error :',
                error,
              );
            if (error.response) {
              await Keychain.resetGenericPassword({ service: 'secret token' });
              await Keychain.resetGenericPassword({
                service: 'secret remember me',
              });
              return {
                success: false,
                error: error,
                messageType: 'warnign',
                notificationMessage: 'Session expired.\nPlease log in again.',
              };
            }
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      },
    );

    try {
      const editUserResponse = await editUserInstance.put(
        `/users/edituser/${decodeToken._id}`,
        data.userData,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      if (editUserResponse.status === 201) {
        return {
          success: true,
          error: null,
          messageType: 'success',
          notificationMessage: 'Profile updated successfully!',
        };
      }
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:298 -> error :', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            return {
              messageType: 'warnign',
              notificationMessage: 'Session expired.\nLog in again, please.',
              success: false,
              error: error,
            };
          case 404:
            return {
              success: false,
              error: error,
              messageType: 'error',
              notificationMessage: 'User not found!',
            };
          default:
            if (error.response.status >= 500 && error.response.status < 600) {
              return {
                success: false,
                error: error,
                messageType: 'error',
                notificationMessage: 'Network error! Try again, please.',
              };
            }
        }
      } else if (error.request) {
        return {
          success: false,
          error: error,
          messageType: 'error',
          notificationMessage: 'Server error! Try again, please.',
        };
      } else {
        return {
          success: false,
          error: error,
          messageType: 'error',
          notificationMessage: 'Internal error! Try again, please.',
        };
      }
    }
  },
);

/**
 * User check email for validation
 * @param { email } data
 */

export const checkEmail = createAsyncThunk(
  'users/checkemail',
  async (data: DataAPI, { dispatch }) => {
    dispatch(setLoader(true));
    try {
      const response = await axios.post(`${HOST}/users/checkemail`, data);
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
      __DEV__ && console.log('XX -> authHook.ts:389 -> error :', error);
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
 * User create
 * @param { email, password, token } data
 */

export const createUser = createAsyncThunk(
  'users/create',
  async (data: DataAPI) => {
    try {
      const response = await axios.post(
        `${HOST}/users/create`,
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      if (response.status === 201) {
        return {
          success: true,
          error: null,
          messageType: 'success',
          notificationMessage:
            'User created successfully.\nPlase log in with credentials',
        };
      }
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:446 -> error :', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            return {
              messageType: 'warnign',
              notificationMessage: 'Expired token! Try again, plase.',
              success: false,
              error: error,
            };
          case 409:
            return {
              messageType: 'error',
              notificationMessage: 'User already exists!',
              success: false,
              error: error,
            };
          default:
            if (error.response.status >= 500 && error.response.status < 600) {
              return {
                messageType: 'error',
                notificationMessage: 'Network error! Try again, please.',
                success: false,
                error: error,
              };
            }
            break;
        }
      } else if (error.request) {
        return {
          success: false,
          error: error,
          messageType: 'error',
          notificationMessage: 'Server error! Try again, please.',
        };
      } else {
        return {
          success: false,
          error: error,
          messageType: 'error',
          notificationMessage: 'Internal error! Try again, please.',
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
      const response = await axios.post(`${HOST}/users/resetpassword`, data);
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
      const response = await axios.put(
        `${HOST}/users/updatepuser/${decodeToken._id}`,
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
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

/**
 * User logout
 * @param { email } data
 */

export const logoutUser = createAsyncThunk(
  'users/logout',
  async (data: DataAPI) => {
    try {
      const isGoogleSignin = GoogleSignin.hasPreviousSignIn();
      if (isGoogleSignin) {
        await GoogleSignin.signOut();
      }

      const response = await axios.post(`${HOST}/users/logout`, data);
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
    } catch (error: any) {
      __DEV__ && console.log('XX -> authHook.ts:682 -> error :', error);
      await Keychain.resetGenericPassword({ service: 'secret token' });
      await Keychain.resetGenericPassword({
        service: 'secret remember me',
      });
      return {
        success: true,
        error: error,
        messageType: 'success',
        notificationMessage: '** Log out with error! **',
      };
    }
  },
);
