import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  startLoader,
  stopLoader,
  setNotificationMessage,
  setCredentials,
  setResetCredentials,
} from './authSlice';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@hooks/types';
import {
  GoogleSignin,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';

export const HOST = __DEV__
  ? Platform.OS === 'ios'
    ? 'http://localhost:3005'
    : 'http://10.0.2.2:3005'
  : 'https://auth-app-fo8j.onrender.com';

// const HOST = 'https://auth-app-fo8j.onrender.com';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/* Validate token to get the user in time */

export const validateRefreshToken = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.get(`${HOST}/users/validatetoken`, {
        headers: {
          Authorization: `Bearer ${data}`,
        },
      });
      if (response.status === 200) {
        __DEV__ &&
          console.log(
            'The user is authorized',
            Platform.OS === 'ios' ? 'in iOS' : 'in Android',
          );
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.accessToken,
          }),
        );
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: `Welcome back ${response.data.user.firstName}!`,
          }),
        );
        return {
          success: true,
          error: null,
        };
      } else {
        dispatch(setResetCredentials());
        await Keychain.resetGenericPassword({ service: 'secret token' });
        await Keychain.resetGenericPassword({ service: 'secret remember me' });
        dispatch(
          setNotificationMessage({
            messageType: 'warning',
            notificationMessage: 'Your session expired. Please, log in again.',
          }),
        );
        return {
          success: false,
          error: null,
        };
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:82 -> return -> error :', error);
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );

      return { success: false, error: error };
    }
  };
};

/* Login user */

export const loginUser = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
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
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.accessToken,
          }),
        );
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: 'Welcome!\nEnjoy the app!!',
          }),
        );
        return {
          success: true,
          error: null,
        };
      } else if (response.status === 401) {
        dispatch(setResetCredentials());
        dispatch(
          setNotificationMessage({
            messageType: 'warning',
            notificationMessage: 'There is something wrong with your password',
          }),
        );
        return {
          success: false,
          error: null,
        };
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:150 -> return -> error :', error);
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );
      return { success: false, error: error };
    }
  };
};

/* Validate access token when expires with refresh token  */

export const validateAccessToken = () => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const refreshToken = await Keychain.getGenericPassword({
        service: 'secret token',
      });
      if (refreshToken) {
        const response = await axios.get(`${HOST}/users/validatetoken`, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        if (response.status === 200) {
          dispatch(
            setCredentials({
              user: response.data.user,
              token: response.data.accessToken,
            }),
          );
          return {
            success: true,
            error: null,
          };
        } else if (response.status === 401) {
          await Keychain.resetGenericPassword({ service: 'secret token' });
          await Keychain.resetGenericPassword({
            service: 'secret remember me',
          });
          dispatch(
            setNotificationMessage({
              messageType: 'warning',
              notificationMessage:
                'Your session expired. Please, log in again.',
            }),
          );
          dispatch(setResetCredentials());
          return {
            success: false,
            error: null,
          };
        }
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:205 -> return -> error :', error);
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );
      return { success: false, error: error };
    }
  };
};

/* Edit user info */

export const editUser = (data: any, token: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    const decodeToken = jwtDecode<CustomJwtPayload>(token);
    const editUserInstance = axios.create({
      baseURL: HOST,
      timeout: 10000, // in miliseconds
    });
    editUserInstance.interceptors.response.use(
      response => response,
      async error => {
        let isRefreshing = false;
        let failedRequestsQueue: ((token: string) => void)[] = [];
        const processQueue = (
          error: any | null,
          token: string | null = null,
        ) => {
          failedRequestsQueue.forEach(prom => prom(token as string));
          failedRequestsQueue = [];
        };
        if (error.response.status === 401 || !error.config._retry) {
          if (isRefreshing) {
            console.log(' >>>>>>>>>>>> ENTRO ACA');
            return new Promise(resolve => {
              failedRequestsQueue.push(token => {
                error.config.headers.Authorization = `Bearer ${token}`;
                resolve(axios(error.config));
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
              dispatch(setResetCredentials());
              await Keychain.resetGenericPassword({ service: 'secret token' });
              await Keychain.resetGenericPassword({
                service: 'secret remember me',
              });
              dispatch(
                setNotificationMessage({
                  messageType: 'warning',
                  notificationMessage: 'Session expired.\nPlease log in again.',
                }),
              );
              return Promise.reject(error);
            }
            const refreshTokenResponse = await axios.get(
              `${HOST}/users/validatetoken`,
              {
                headers: {
                  Authorization: `Bearer ${refreshToken.password}`,
                },
              },
            );
            if (refreshTokenResponse) {
              dispatch(
                setCredentials({
                  user: refreshTokenResponse.data.user,
                  token: refreshTokenResponse.data.token,
                }),
              );
              editUserInstance.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${refreshTokenResponse.data.token}`;

              processQueue(null, refreshTokenResponse.data.token);
              return editUserInstance(error.config);
            }
          } catch (error) {
            dispatch(setResetCredentials());
            await Keychain.resetGenericPassword({ service: 'secret token' });
            await Keychain.resetGenericPassword({
              service: 'secret remember me',
            });
            dispatch(
              setNotificationMessage({
                messageType: 'warning',
                notificationMessage: 'Session expired.\nPlease log in again.',
              }),
            );
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      },
    );

    try {
      const editUserResponse = await editUserInstance.put(
        `/users/edit/${decodeToken._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (editUserResponse.status === 201) {
        dispatch(
          setCredentials({
            user: editUserResponse.data.user,
            token: editUserResponse.data.accessToken,
          }),
        );
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: 'Profile updated successfully!',
          }),
        );
        return {
          success: true,
          error: null,
        };
      }
      dispatch(
        setNotificationMessage({
          messageType: 'warning',
          notificationMessage: 'Session expired.\nPlease log in again.',
        }),
      );
      return {
        success: false,
        error: null,
      };
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:351 -> return -> error :', error);
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );
      return { success: false, error: error };
    }
  };
};

/* Logout user */

export const logoutUser = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const isGoogleSignin = GoogleSignin.hasPreviousSignIn();
      if (isGoogleSignin) {
        await GoogleSignin.signOut();
      }
      const refreshToken = await Keychain.getGenericPassword({
        service: 'secret token',
      });
      if (refreshToken) {
        const response = await axios.post(`${HOST}/users/logout`, data, {
          headers: {
            Authorization: `Bearer ${refreshToken.password}`,
          },
        });
        if (response.status === 200) {
          await Keychain.resetGenericPassword({ service: 'secret token' });
          await Keychain.resetGenericPassword({
            service: 'secret remember me',
          });
          dispatch(setResetCredentials());
          dispatch(
            setNotificationMessage({
              messageType: 'success',
              notificationMessage: 'Log out your session!\nSee you next time!',
            }),
          );
          return {
            success: true,
            error: null,
          };
        } else {
          await Keychain.resetGenericPassword({ service: 'secret token' });
          await Keychain.resetGenericPassword({
            service: 'secret remember me',
          });
          dispatch(setResetCredentials());
          dispatch(
            setNotificationMessage({
              messageType: 'success',
              notificationMessage: 'Log out your session!\nSee you next time!',
            }),
          );
          return {
            success: true,
            error: null,
          };
        }
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:417 -> return -> error :', error);
      await Keychain.resetGenericPassword({ service: 'secret token' });
      await Keychain.resetGenericPassword({ service: 'secret remember me' });
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );
      return { success: false, error: error };
    }
  };
};

/* Validate user email */

export const checkEmail = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/checkemail`, data);

      if (response.status === 200) {
        dispatch(stopLoader());
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: 'The email was sent.',
          }),
        );

        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA EL MAIL '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        return {
          success: true,
          error: null,
        };
      } else if (response.status === 204) {
        dispatch(stopLoader());
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
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:482 -> return -> error :', error);
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );
      return { success: false, error: error };
    }
  };
};

/* Create user */

export const createUser = (data: any, emailToken: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/create`, data, {
        headers: {
          Authorization: `Bearer ${emailToken}`,
        },
      });
      if (response.status === 201) {
        dispatch(stopLoader());
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage:
              'User created successfully.\nPlase log in with credentials',
          }),
        );
        return {
          success: true,
          error: null,
        };
      } else {
        dispatch(stopLoader());
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: 'Something went wrong. Try again, please!',
          }),
        );
        return {
          success: false,
          error: null,
        };
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:534 -> return -> error :', error);
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );
      return { success: false, error: error };
    }
  };
};

/* Reset password */

export const resetPassword = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/resetpassword`, data);
      if (response.status === 200) {
        dispatch(stopLoader());
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: 'The email was sent.',
          }),
        );

        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA LA CONTRASEÑA '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        return {
          success: true,
          error: null,
        };
      } else if (response.status === 204) {
        dispatch(stopLoader());
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
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:588 -> return -> error :', error);
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );
      return { success: false, error: error };
    }
  };
};

/* Update new password */

export const updatePassword = (data: any, emailToken: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    const decodeToken = jwtDecode<CustomJwtPayload>(emailToken);
    try {
      const response = await axios.put(
        `${HOST}/users/updatepuser/${decodeToken._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${emailToken}`,
          },
        },
      );
      if (response.status === 201) {
        dispatch(stopLoader());
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage:
              'Password updated successfully.\nPlease log in with new credentias',
          }),
        );
        return {
          success: true,
          error: null,
        };
      } else {
        dispatch(stopLoader());
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: 'Something went wrong. Try again, please!',
          }),
        );
        return {
          success: false,
          error: null,
        };
      }
    } catch (error) {
      __DEV__ && console.log('XX -> authHook.ts:644 -> error :', error);
      dispatch(setResetCredentials());
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: 'Network error',
        }),
      );
      return { success: false, error: error };
    }
  };
};

/* -------------------------------------------------------------------------- */
