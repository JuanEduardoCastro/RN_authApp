import { createAsyncThunk } from '@reduxjs/toolkit';
import { isErrorWithCode } from '@react-native-google-signin/google-signin';
import api from './apiService';
import { KeychainService, secureSetStorage } from '@utils/secureStorage';
import { parseApiError } from '@utils/errorHandler';

/**
 * User login with Google signin and persist in time
 * @param { google token } data
 */

export const googleLogin = createAsyncThunk(
  'users/googlesignin',
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

      if (googleResponse.status === 200) {
        const { sub, email, given_name, family_name, picture } =
          googleResponse.data;

        const checkEmailWithProvider = await api.post(`/users/check-provider`, {
          email: email,
          provider: 'google',
        });

        if (checkEmailWithProvider.status === 200) {
          const emailTokenResponse =
            checkEmailWithProvider.data.data.emailToken;
          const userData = {
            email: email,
            password: sub,
            provider: 'google',
            firstName: given_name,
            lastName: family_name,
            avatarURL: picture,
          };
          const createUserWithProvider = await api.post(
            `/users/create`,
            userData,
            {
              headers: {
                Authorization: `Bearer ${emailTokenResponse}`,
              },
            },
          );

          if (createUserWithProvider.status === 201) {
            const loginNewUser = await api.post(`/users/login`, {
              email: email,
              password: sub,
            });
            if (loginNewUser.status === 200) {
              await secureSetStorage(
                'refreshToken',
                loginNewUser.data.data.refreshToken,
                KeychainService.REFRESH_TOKEN,
              );

              await secureSetStorage(
                'remember',
                'true',
                KeychainService.REMEMBER_ME,
              );
              return {
                success: true,
                user: loginNewUser.data.data.user,
                token: loginNewUser.data.data.accessToken,
                messageType: 'success',
                notificationMessage: `${t('success-welcome')}${' '}${
                  loginNewUser.data.data.user.firstName
                }`,
              };
            }
          }
        } else if (checkEmailWithProvider.status === 204) {
          const loginUser = await api.post(`/users/login`, {
            email: email,
            password: sub,
          });
          if (loginUser.status === 200) {
            await secureSetStorage(
              'refreshToken',
              loginUser.data.data.refreshToken,
              KeychainService.REFRESH_TOKEN,
            );

            await secureSetStorage(
              'remember',
              'true',
              KeychainService.REMEMBER_ME,
            );

            return {
              success: true,
              user: loginUser.data.data.user,
              token: loginUser.data.data.accessToken,
              messageType: 'success',
              notificationMessage: `${t('success-welcome-back')}${' '}${
                loginUser.data.data.user.firstName
              }`,
            };
          }
        }
      }
      return rejectWithValue({
        messageType: 'error',
        notificationMessage: t('error-google-unknown'),
      });
    } catch (error: any) {
      __DEV__ && console.log('XX -> otherAuthHooks.ts:121 -> error :', error);
      if (isErrorWithCode(error)) {
        __DEV__ && console.log('XX -> otherAuthHooks.ts:123 -> error :', error);

        const parsedError = parseApiError(error, t, 'error-google-signin');
        return rejectWithValue({
          messageType: 'error',
          notificationMessage: parsedError.message,
        });
      }
    }
  },
);
