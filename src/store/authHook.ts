import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  setUser,
  setError,
  setToken,
  startLoader,
  stopLoader,
  setIsAuthorized,
} from './authSlice';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HOST =
  Platform.OS === 'ios' ? 'http://localhost:3005' : 'http://10.0.2.2:3005';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const checkEmail = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/checkemail`, data);
      if (response.status === 200) {
        dispatch(stopLoader());
        dispatch(setError(null));
        return {
          success: true,
          message: 'This email is NOT in use',
          error: null,
        };
      } else if (response.status === 204) {
        dispatch(stopLoader());
        dispatch(setError('This email is already in use'));
        return {
          success: false,
          message: 'This email is already in use',
          error: null,
        };
      }
    } catch (error) {
      console.log('XX -> authHook.ts:34 -> return -> error :', error);
      dispatch(setError('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

export const createUser = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/create`, data);
      if (response.status === 201) {
        // dispatch(setUser(response.data));
        dispatch(stopLoader());
        dispatch(setError(null));
        return {
          success: true,
          error: null,
        };
      } else {
        dispatch(setError('Something went wrong. Try again, please!'));
        dispatch(stopLoader());
      }
    } catch (error) {
      console.log('XX -> authHook.ts:58 -> return -> error :', error);
      dispatch(setError('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

export const loginUser = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/login`, {
        email: data.email,
        password: data.password,
      });
      if (response.status === 200) {
        if (data.rememberMe) {
          const password = response.data.token;
          await Keychain.setGenericPassword('userToken', password, {
            service: process.env.KEY_SERVICES,
            accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
          });
        }
        dispatch(setToken(response.data.token));
        dispatch(setUser(response.data.user));
        dispatch(stopLoader());
        return {
          success: true,
          message: 'User created successfully.',
          error: null,
        };
      } else if (response.status === 401) {
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(setError('There is something wrong with your password'));
      }
    } catch (error) {
      console.log('XX -> authHook.ts:98 -> return -> error :', error);
      dispatch(setError('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

export const logoutUser = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/logout`, data);
      if (response.status === 200) {
        await Keychain.resetGenericPassword({
          service: process.env.KEY_SERVICES,
        });
        dispatch(stopLoader());
        return {
          success: true,
          message: 'User logged out succssesfully.',
          error: null,
        };
      }
    } catch (error) {
      dispatch(setError('Network error. Please, try again.'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Validate token to get the use in time */

export const validateToken = (data: any) => {
  return async (dispatch: Dispatch) => {
    await Keychain.resetGenericPassword({ service: process.env.KEY_SERVICES });
    dispatch(startLoader());
    try {
      const response = await axios.get(`${HOST}/users/validate-token`, {
        headers: {
          Authorization: `Bearer ${data}`,
        },
      });
      if (response.status === 200) {
        console.log(
          'The user is authorized',
          Platform.OS === 'ios' ? 'in iOS' : 'in Android',
        );
        const password = response.data.token;
        await Keychain.setGenericPassword('userToken', password, {
          service: process.env.KEY_SERVICES,
          accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
        });
        dispatch(setToken(response.data.token));
        dispatch(setUser(response.data.user));
        dispatch(setIsAuthorized());
        dispatch(stopLoader());
        return {
          success: true,
          message: 'User created successfully.',
          error: null,
        };
      } else {
        dispatch(setError('Something went wrong. Try again, please!'));
        dispatch(stopLoader());
      }
    } catch (error) {
      console.log('XX -> authHook.ts:172 -> return -> error :', error);
      dispatch(setError('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Creat and loging with other methods */

export const googleLogin = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const googleResponse = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${data}`,
      );
      if (googleResponse.status === 200) {
        const { sub, email, given_name, family_name, picture } =
          googleResponse.data;
        /* check if email exists in DB */
        const checkEmail = await axios.post(`${HOST}/users/checkemail`, {
          email: email,
          isGoogleLogin: true,
        });
        /* create a new user if the email is not in the DB */
        if (checkEmail.status === 200) {
          const createUser = await axios.post(`${HOST}/users/create`, {
            email: email,
            password: sub,
            isGoogleLogin: true,
            firstName: given_name,
            lastName: family_name,
            avatarURL: picture,
          });
          /* if the user was created, then login user session */
          if (createUser.status === 201) {
            const loginUser = await axios.post(`${HOST}/users/login`, {
              email: email,
              password: sub,
            });
            if (loginUser.status === 200) {
              dispatch(setToken(loginUser.data.token));
              dispatch(setUser(loginUser.data.user));
              dispatch(stopLoader());
              return {
                success: true,
                message: 'User created successfully.',
                error: null,
              };
            } else if (loginUser.status === 401) {
              dispatch(setToken(null));
              dispatch(setUser(null));
              dispatch(setError('There is something wrong with your password'));
            }
          }
          /* create new credentials */
        } else if (checkEmail.status === 204) {
          const loginUser = await axios.post(`${HOST}/users/login`, {
            email: email,
            password: sub,
          });
          if (loginUser.status === 200) {
            dispatch(setToken(loginUser.data.token));
            dispatch(setUser(loginUser.data.user));
            dispatch(stopLoader());
            return {
              success: true,
              message: 'User logged in succssesfully.',
              error: null,
            };
          } else if (loginUser.status === 401) {
            dispatch(setToken(null));
            dispatch(setUser(null));
            dispatch(setError('There is something wrong with your password'));
          }
        }
      }
    } catch (error) {
      console.log('XX -> authHook.ts:55 -> return -> error :', error);
      dispatch(setError('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};
