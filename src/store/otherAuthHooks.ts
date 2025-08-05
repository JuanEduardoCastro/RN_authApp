

import * as Keychain from 'react-native-keychain';
import axios from "axios";
import { setMessageType, setNotificationMessage, setToken, setUser, startLoader, stopLoader } from "./authSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { HOST } from "./authHook";
import { isErrorWithCode } from '@react-native-google-signin/google-signin';


/* Creat and loging with other methods */

export const googleLogin = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {

      /* --> To signin new user, create new user in DB and login that user */

      const googleResponse = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${data}`,
      );
      /* google sigin and data */
      if (googleResponse.status === 200) {
        const { sub, email, given_name, family_name, picture } =
          googleResponse.data;

        const checkEmail = await axios.post(`${HOST}/users/checkemail`, {
          email: email,
          isGoogleLogin: true,
        });

        if (checkEmail.status === 200) {
          const userData = {
            email: email,
            password: sub,
            isGoogleLogin: true,
            firstName: given_name,
            lastName: family_name,
            avatarURL: picture,
          };

          /* Create new user in DB */
          const createUser = await axios.post(
            `${HOST}/users/create`,
            userData,
            {
              headers: {
                Authorization: `Bearer ${checkEmail.data.emailToken}`,
              },
            },
          );

          /* Login that user and recieve tokens */
          if (createUser.status === 201) {
            const loginUser = await axios.post(`${HOST}/users/login`, {
              email: email,
              password: sub,
            });

            if (loginUser.status === 200) {
              await Keychain.setGenericPassword(
                'refreshToken',
                loginUser.data.refreshToken,
                {
                  service: 'secret token',
                  accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
                },
              );

              dispatch(setToken(loginUser.data.accesToken));
              dispatch(setUser(loginUser.data.user));
              dispatch(stopLoader());
              return {
                success: true,
                message: `Welcome ${loginUser.data.user.firstName}`,
                error: null,
              };
            } else if (loginUser.status === 401) {
              dispatch(setToken(null));
              dispatch(setUser(null));
              return {
                success: false,
                message: 'Somthing went wrong. Please, try again.',
                error: null,
              };
            }
          }
          /* create new credentials */
        } else if (checkEmail.status === 204) {
          const loginUser = await axios.post(`${HOST}/users/login`, {
            email: email,
            password: sub,
          });
          if (loginUser.status === 200) {
            // guardar el localstorage
            await Keychain.setGenericPassword(
              'refreshToken',
              loginUser.data.refreshToken,
              {
                service: 'secret token',
                accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
              },
            );

            dispatch(setToken(loginUser.data.accessToken));
            dispatch(setUser(loginUser.data.user));
            dispatch(stopLoader());
            return {
              success: true,
              message: `Welcome back ${loginUser.data.user.firstName}`,
              error: null,
            };
          } else if (loginUser.status === 401) {
            dispatch(setToken(null));
            dispatch(setUser(null));
            return {
              success: false,
              message: 'Somthing went wrong. Please, try again.',
              error: null,
            };
          }
        }
      }
    } catch (error) {
      // __DEV__ &&
      if (isErrorWithCode(error)) {
        console.log('XX -> authHook.ts:55 -> return -> error :', error.code);
      }
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Persist google login in - NOT IN USE */

export const persistGoogleLogin = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      // const googleSigninAgain = await GoogleSignin.signInSilently();
      const checkEmail = await axios.post(`${HOST}/users/checkemail`, {
        email: data.email,
        isGoogleLogin: true,
      });
      if (checkEmail.status === 204) {
        const loginUser = await axios.post(`${HOST}/users/login`, {
          email: data.email,
          password: data.sub,
        });
        if (loginUser.status === 200) {
          await Keychain.setGenericPassword(
            'refreshToken',
            loginUser.data.refreshToken,
            {
              service: 'secret token',
              accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
            },
          );

          dispatch(setToken(loginUser.data.accesToken));
          dispatch(setUser(loginUser.data.user));
          dispatch(stopLoader());
          return {
            success: true,
            message: `Welcome again ${loginUser.data.user.firstName}`,
            error: null,
          };
        }
      }
      return {
        success: false,
        message: 'Not google login',
        error: null,
      };
    } catch (error) {
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};
