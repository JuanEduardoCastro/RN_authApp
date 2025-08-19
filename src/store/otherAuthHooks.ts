import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HOST } from './authHook';
import { isErrorWithCode } from '@react-native-google-signin/google-signin';

/**
 * User login with Google signin and persist in time
 * @param { google token } data
 */

export const googleLogin = createAsyncThunk(
  'users/googlelogin',
  async (data: any) => {
    try {
      const googleResponse = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${data}`,
      );

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
          const createUSer = await axios.post(
            `${HOST}/users/create`,
            userData,
            {
              headers: {
                Authorization: `Bearer ${checkEmail.data.emailToken}`,
              },
            },
          );
          if (createUSer.status === 201) {
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
              await Keychain.setGenericPassword('remember', 'true', {
                service: 'secret remember me',
                accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
              });
              return {
                success: true,
                error: null,
                user: loginUser.data.user,
                token: loginUser.data.accessToken,
                messageType: 'success',
                notificationMessage: `Welcome ${loginUser.data.user.firstName}`,
              };
            }
          }
        } else if (checkEmail.status === 204) {
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
            await Keychain.setGenericPassword('remember', 'true', {
              service: 'secret remember me',
              accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
            });
            return {
              success: true,
              error: null,
              user: loginUser.data.user,
              token: loginUser.data.accessToken,
              messageType: 'success',
              notificationMessage: `Welcome back ${loginUser.data.user.firstName}`,
            };
          }
        }
      }
    } catch (error: any) {
      __DEV__ && console.log('XX -> otherAuthHooks.ts:108 -> error :', error);
      if (isErrorWithCode(error)) {
        __DEV__ &&
          console.log(
            'XX -> isErrorWithCode -> otherAuthHooks.ts:146 -> return -> error :',
            error.code,
          );
      }
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            return {
              success: false,
              error: error,
              messageType: 'warning',
              notificationMessage: 'Somthing went wrong. Try again, please',
            };
          case 404:
            return {
              success: false,
              error: error,
              messageType: 'error',
              notificationMessage: 'User not found.',
            };
          default:
            if (error.response.status >= 500 && error.response.status < 600) {
              return {
                success: false,
                error: error,
                messageType: 'error',
                notificationMessage: 'Somthing went wrong. Try again, please',
              };
            }
        }
      } else if (error.request) {
        return {
          success: false,
          error: error,
          messageType: 'error',
          notificationMessage: 'Server error! Try again',
        };
      } else {
        return {
          success: false,
          error: error,
          messageType: 'error',
          notificationMessage: 'Internal error!',
        };
      }
    }
  },
);
