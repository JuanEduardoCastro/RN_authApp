import * as Keychain from 'react-native-keychain';
import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { isErrorWithCode } from '@react-native-google-signin/google-signin';
import api from './apiService';
import { useTranslation } from 'react-i18next';

/**
 * User login with Google signin and persist in time
 * @param { google token } data
 */

export const googleLogin = createAsyncThunk(
  'users/googlelogin',
  async (data: any, { rejectWithValue }) => {
    const { idToken, t } = data;

    if (!idToken) {
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-google-unknown'),
      });
    }

    try {
      const googleResponse = await api.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      );

      const { sub, email, given_name, family_name, picture } =
        googleResponse.data;

      if (googleResponse.status === 200) {
        const checkEmail = await api.post(`/users/checkemail`, {
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
          await api.post(`/users/create`, userData, {
            headers: {
              Authorization: `Bearer ${checkEmail.data.emailToken}`,
            },
          });

          const loginUser = await api.post(`/users/login`, {
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
              user: loginUser.data.user,
              token: loginUser.data.accessToken,
              messageType: 'success',
              notificationMessage: `${t('success-welcome')} ${
                loginUser.data.user.firstName
              }`,
            };
          }

          // if (loginUser.status === 200) {
          //   await Keychain.setGenericPassword(
          //     'refreshToken',
          //     loginUser.data.refreshToken,
          //     {
          //       service: 'secret token',
          //       accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
          //     },
          //   );
          //   await Keychain.setGenericPassword('remember', 'true', {
          //     service: 'secret remember me',
          //     accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
          //   });
          //   return {
          //     success: true,
          //     error: null,
          //     user: loginUser.data.user,
          //     token: loginUser.data.accessToken,
          //     messageType: 'success',
          //     notificationMessage: ` ${t("success-welcome-back")} ${loginUser.data.user.firstName}`,
          //   };
          // }
          // if (createUSer.status === 201) {

          // }
        } else if (checkEmail.status === 204) {
          //TODO check when the user already exist and login successfully
          // return {
          //   success: true,
          //   error: null,
          // user: loginUser.data.user,
          // token: loginUser.data.accessToken,
          // messageType: 'success',
          // notificationMessage: `${t("success-welcome-back")} ${loginUser.data.user.firstName}`,
          // };
        }
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-google-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> otherAuthHooks.ts:108 -> error :', error);
      if (isErrorWithCode(error)) {
        __DEV__ &&
          console.log(
            'XX -> isErrorWithCode -> otherAuthHooks.ts:146 -> return -> error :',
            error.code,
          );

        return rejectWithValue({
          messageType: 'error',
          notificationMessage: `${t('error-google-signin')} ${error.code}`,
        });
      }
    }
  },
);
