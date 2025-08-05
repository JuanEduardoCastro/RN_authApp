import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  setUser,
  setToken,
  startLoader,
  stopLoader,
  setMessageType,
  setNotificationMessage,
  setResetUser,
} from './authSlice';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@hooks/types';
import { newNotificationMessage } from '@utils/newNotificationMessage';
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

/* Validate user email */

export const checkEmail = (data: any) => {

  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      /* CHECK MAIL end point */
      const response = await axios.post(`${HOST}/users/checkemail`, data);

      if (response.status === 200) {
        dispatch(stopLoader());
        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA EL MAIL '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        return {
          success: true,
          message: 'This email is available to use.',
          error: null,
        };
      } else if (response.status === 204) {
        dispatch(stopLoader());
        return {
          success: false,
          message: 'This email is already in use. Please try another.',
          error: null,
        };
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:34 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
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
        dispatch(setMessageType(null));
        return {
          success: true,
          message:
            'The user was created successfully. Please, enter with your user credentials.',
          error: null,
        };
      } else {
        dispatch(stopLoader());
        return {
          success: false,
          message: 'Something went wrong. Try again, please!',
          error: null,
        };
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:58 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Login user */

export const loginUser = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    /* This is to reset Keychain storage */
    // await Keychain.resetGenericPassword();

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
          // const paraImprimirKeychainbAndroid = await Keychain.getGenericPassword({ service: 'remember'})

          // console.log(Platform.OS === 'ios' ? 'iOS' : 'Android', 'XX -> authHook.ts:142 -> paraImprimirKeychainbAndroid :', paraImprimirKeychainbAndroid)
        }
        dispatch(setToken(response.data.accessToken));
        dispatch(setUser(response.data.user));
        dispatch(stopLoader());

        return {
          success: true,
          message: `Welcome ${
            response.data.user.firstName || response.data.user.email
          }`,
          error: null,
        };
      } else if (response.status === 401) {
        dispatch(setResetUser());
        return {
          success: false,
          message: 'There is something wrong with your password',
          error: null,
        };
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:98 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      dispatch(setResetUser());
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
        dispatch(setMessageType(null));
        __DEV__ &&
          (console.log('--> --> --> --> --> --> --> --> --> --> '),
          console.log('--> --> EL TOKEN PARA LA CONTRASEÑA '),
          console.log(response.data.data),
          console.log('--> --> --> --> --> --> --> --> --> --> '));
        return {
          success: true,
          message: 'The email is OK to reset password.',
          error: null,
        };
      } else if (response.status === 204) {
        dispatch(stopLoader());
        return {
          success: false,
          message: 'There is no email to reset password.',
          error: null,
        };
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:34 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
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
        dispatch(setUser(response.data.user));
        dispatch(stopLoader());
        return {
          success: true,
          message: 'User updated successfully.',
          error: null,
        };
      }
    } catch (error) {
      __DEV__ && console.log('XX -> authHook.ts:204 -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Edit user info */

export const editUser = (data: any, token: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    const decodeToken = jwtDecode<CustomJwtPayload>(token);
    try {
      const editResponse = await axios.put(
        `${HOST}/users/edit/${decodeToken._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (editResponse.status === 201) {
        dispatch(setUser(editResponse.data.user));
        dispatch(setToken(editResponse.data.accessToken));
        dispatch(stopLoader());
        return {
          success: true,
          message: 'User updated successfully.',
          error: null,
        };
      } else if (editResponse.status === 205) {
        const refreshToken = await Keychain.getGenericPassword({
          service: 'secret token',
        });
        if (!refreshToken) {
          dispatch(stopLoader());
          dispatch(setResetUser());
          newNotificationMessage(dispatch, {
            messageType: 'error',
            notificationMessage: 'Session expired. Please log in again.',
          });
        } else if (refreshToken) {
          const refreshTokenResponse = await axios.get(
            `${HOST}/users/validatetoken`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken.password}`,
              },
            },
          );
          if (refreshTokenResponse.status === 200) {
            const editAgainResponse = await axios.put(
              `${HOST}/users/edit/${decodeToken._id}`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${refreshTokenResponse.data.accessToken}`,
                },
              },
            );
            if (editAgainResponse.status === 201) {
              dispatch(setUser(editAgainResponse.data.user));
              dispatch(setToken(editAgainResponse.data.accessToken));
              dispatch(stopLoader());
              return {
                success: true,
                message: 'User updated successfully.',
                error: null,
              };
            } else {
              dispatch(stopLoader());
              dispatch(setResetUser());
              newNotificationMessage(dispatch, {
                messageType: 'error',
                notificationMessage: 'Session expired. Please log in again.',
              });
            }
          } else {
            dispatch(stopLoader());
            dispatch(setResetUser());
            newNotificationMessage(dispatch, {
              messageType: 'error',
              notificationMessage: 'Session expired. Please log in again.',
            });
          }
        }
        // pegarle al refresh API y mandar el refresh
        // si esta OK, mandar de vuelta un access valido para volver a repetir este hjook
      }
    } catch (error) {
      __DEV__ && console.log('XX -> authHook.ts:238 -> error :', error);

      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Logout user */

export const logoutUser = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const isGoogleSignin = await GoogleSignin.hasPreviousSignIn();
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
          dispatch(stopLoader());
          dispatch(setResetUser());
          newNotificationMessage(dispatch, {
            messageType: 'success',
            notificationMessage:
              'You log out your session!\nSee you next time!',
          });
          return {
            success: true,
            message: 'User logged out succssesfully.',
            error: null,
          };
        } else {
          await Keychain.resetGenericPassword({ service: 'secret token' });
          await Keychain.resetGenericPassword({
            service: 'secret remember me',
          });
          dispatch(stopLoader());
          dispatch(setResetUser());
          newNotificationMessage(dispatch, {
            messageType: 'success',
            notificationMessage:
              'You log out your session!\nSee you next time!',
          });
        }
      }
    } catch (error) {
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error. Please, try again.'));
      await Keychain.resetGenericPassword({ service: 'secret token' });
      await Keychain.resetGenericPassword({ service: 'secret remember me' });
      dispatch(setResetUser());
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Validate access token when expires with refresh token  */

export const validateRefreshToken = () => {
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
          dispatch(setToken(response.data.accessToken));
          dispatch(setUser(response.data.user));
          return {
            success: true,
            message: `Welcome ${
              response.data.user.firstName || response.data.user.email
            }`,
            error: null,
          };
        } else if (response.status === 401) {
          dispatch(setToken(null));
          dispatch(setUser(null));
          await Keychain.resetGenericPassword();
          return {
            success: false,
            message: 'Your session expired. Please, log in again.',
            error: null,
          };
        }
      }
    } catch (error) {
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Validate token to get the user in time */

export const validateToken = (data: any) => {
  return async (dispatch: Dispatch) => {
    // await Keychain.resetGenericPassword({ service: process.env.KEY_SERVICES });

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
        dispatch(setToken(response.data.accessToken));
        dispatch(setUser(response.data.user));
        dispatch(stopLoader());
        return {
          success: true,

          error: null,
        };
      } else {
        dispatch(setResetUser());
        await Keychain.resetGenericPassword({ service: 'secret token' });
        await Keychain.resetGenericPassword({ service: 'secret remember me' });
        return {
          success: false,
          message: 'Your session expired. Please, log in again.',
          error: null,
        };
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> authHook.ts:172 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(setResetUser());
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};
