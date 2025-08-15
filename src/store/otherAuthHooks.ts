import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import {
  setCredentials,
  setNotificationMessage,
  setResetCredentials,
  startLoader,
  stopLoader,
} from './authSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { HOST } from './authHook';
import { isErrorWithCode } from '@react-native-google-signin/google-signin';

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
          const createUser = await axios.post(
            `${HOST}/users/create`,
            userData,
            {
              headers: {
                Authorization: `Bearer ${checkEmail.data.emailToken}`,
              },
            },
          );

          if (createUser.status === 201) {
            const loginUser = await axios.post(`${HOST}/users/login`, {
              email: email,
              password: sub,
            });

            if (loginUser.status === 200) {
              await Keychain.setGenericPassword('remember', 'true', {
                service: 'secret remember me',
                accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
              });
              await Keychain.setGenericPassword(
                'refreshToken',
                loginUser.data.refreshToken,
                {
                  service: 'secret token',
                  accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
                },
              );
              dispatch(
                setCredentials({
                  user: loginUser.data.user,
                  token: loginUser.data.accessToken,
                }),
              );
              dispatch(
                setNotificationMessage({
                  messageType: 'success',
                  notificationMessage: `Welcome ${loginUser.data.user.firstName}`,
                }),
              );
              return {
                success: true,
                error: null,
              };
            }
          }
        } else if (checkEmail.status === 204) {
          const loginUser = await axios.post(`${HOST}/users/login`, {
            email: email,
            password: sub,
          });
          if (loginUser.status === 200) {
            await Keychain.setGenericPassword('remember', 'true', {
              service: 'secret remember me',
              accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
            });
            await Keychain.setGenericPassword(
              'refreshToken',
              loginUser.data.refreshToken,
              {
                service: 'secret token',
                accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
              },
            );
            dispatch(
              setCredentials({
                user: loginUser.data.user,
                token: loginUser.data.accessToken,
              }),
            );
            dispatch(
              setNotificationMessage({
                messageType: 'success',
                notificationMessage: `Welcome back ${loginUser.data.user.firstName}`,
              }),
            );
            return {
              success: true,
              error: null,
            };
          }
        }
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        __DEV__ &&
          console.log(
            'XX -> otherAuthHooks.ts:146 -> return -> error :',
            error.code,
          );
      }
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          dispatch(setResetCredentials());
          dispatch(
            setNotificationMessage({
              messageType: 'warning',
              notificationMessage: 'Somthing went wrong. Please, try again.',
            }),
          );
          return {
            success: false,
            error: error,
          };
        } else if (error.response.status === 404) {
          dispatch(setResetCredentials());
          dispatch(
            setNotificationMessage({
              messageType: 'error',
              notificationMessage: 'User not found!',
            }),
          );
          return {
            success: false,
            error: error,
          };
        } else {
          /* STATUS CODES 5XX ?? */

          // dispatch(setResetCredentials());
          dispatch(stopLoader());
          // dispatch(
          //   setNotificationMessage({
          //     messageType: 'error',
          //     notificationMessage: 'THIS Network error! Try again.',
          //   }),
          // );
          return {
            success: false,
            error: error,
          };
        }
      } else if (error.request) {
        /* REQUEST MADE. NOT RESPONSE */

        // dispatch(setResetCredentials());
        __DEV__ &&
          console.log(
            'XX -> authHook.ts:107 -> error.response :',
            error.message,
          );
        dispatch(stopLoader());
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: 'Server error! Try again',
          }),
        );
        return { success: false, error: error };
      } else {
        /* REQUEST ERROR */

        __DEV__ &&
          console.log(
            'XX -> authHook.ts:123 -> return -> error :',
            error.message,
          );
        dispatch(stopLoader());
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: 'Internal error!',
          }),
        );
        return { success: false, error: error };
      }
    }
  };
};

/* Persist google login in */

/* NOT IN USE */
// export const persistGoogleLogin = (data: any) => {
//   return async (dispatch: Dispatch) => {
//     dispatch(startLoader());
//     try {
//       const checkEmail = await axios.post(`${HOST}/users/checkemail`, {
//         email: data.email,
//         isGoogleLogin: true,
//       });
//       if (checkEmail.status === 204) {
//         const loginUser = await axios.post(`${HOST}/users/login`, {
//           email: data.email,
//           password: data.sub,
//         });
//         if (loginUser.status === 200) {
//           await Keychain.setGenericPassword(
//             'refreshToken',
//             loginUser.data.refreshToken,
//             {
//               service: 'secret token',
//               accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
//             },
//           );
//           dispatch(
//             setCredentials({
//               user: loginUser.data.user,
//               token: loginUser.data.accessToken,
//             }),
//           );
//           dispatch(
//             setNotificationMessage({
//               messageType: 'success',
//               notificationMessage: `Welcome again ${loginUser.data.user.firstName}`,
//             }),
//           );
//           return {
//             success: true,
//             error: null,
//           };
//         }
//       }
//       return {
//         success: false,
//         message: 'Not google login',
//         error: null,
//       };
//     } catch (error) {
//       __DEV__ && console.log('XX -> otherAuthHooks.ts:208 -> error :', error);
//       dispatch(setResetCredentials());
//       dispatch(
//         setNotificationMessage({
//           messageType: 'error',
//           notificationMessage: 'Network error',
//         }),
//       );
//       return { success: false, error: error };
//     }
//   };
// };
