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
  setIsAuthorized,
  setMessageType,
  setNotificationMessage,
} from './authSlice';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@hooks/types';
import { newNotificationMessage } from '@utils/newNotificationMessage';

const HOST =
  Platform.OS === 'ios' ? 'http://localhost:3005' : 'http://10.0.2.2:3005';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/* Validate user email */
/* OK checked */

export const checkEmail = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/checkemail`, data);
      if (response.status === 200) {
        dispatch(stopLoader());
        dispatch(setMessageType(null));
        console.log('--> --> --> --> --> --> --> --> --> --> ');
        console.log('--> --> EL TOKEN PARA EL MAIL ');
        console.log(response.data.data);
        console.log('--> --> --> --> --> --> --> --> --> --> ');
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
      console.log('XX -> authHook.ts:34 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Create user */
/* OK checked */

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
      console.log('XX -> authHook.ts:58 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Login user */
/* OK checked */

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
        // console.log('lo qeu regresa del DB', response.data);
        const refreshToken = response.data.refreshToken;
        await Keychain.setGenericPassword('refreshToken', refreshToken, {
          service: 'secret token',
          accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
        });
        if (data.rememberMe) {
          const rememberMeFlag = 'true';
          await Keychain.setGenericPassword('remember', rememberMeFlag, {
            service: 'secret remeber me',
            accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
          });
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
        dispatch(setToken(null));
        dispatch(setUser(null));
        return {
          success: false,
          message: 'There is something wrong with your password',
          error: null,
        };
      }
    } catch (error) {
      console.log('XX -> authHook.ts:98 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Reset password */
/* OK checked */

export const resetPassword = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
      const response = await axios.post(`${HOST}/users/resetpassword`, data);
      if (response.status === 200) {
        dispatch(stopLoader());
        dispatch(setMessageType(null));
        console.log('--> --> --> --> --> --> --> --> --> --> ');
        console.log('--> --> EL TOKEN PARA LA CONTRASEÑA ');
        console.log(response.data.data);
        console.log('--> --> --> --> --> --> --> --> --> --> ');
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
      console.log('XX -> authHook.ts:34 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Update new password */
/* OK checked */

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
      const response = await axios.put(
        `${HOST}/users/edit/${decodeToken._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('entro acá ? ? ? ?');
      if (response.status === 201) {
        dispatch(setUser(response.data.user));
        dispatch(stopLoader());
        return {
          success: true,
          message: 'User updated successfully.',
          error: null,
        };
      } else if (response.status === 401) {
        console.log('hay prbolemas acá');
        // pegarle al refresh API y mandar el refresh
        // si esta OK, mandar de vuelta un access valido para volver a repetir este hjook
      }
    } catch (error) {
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};

/* Logout user */
/* OK checked */

export const logoutUser = (data: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoader());
    try {
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
          await Keychain.resetGenericPassword();
          dispatch(stopLoader());
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
        }
      }
    } catch (error) {
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error. Please, try again.'));
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

/* Validate token to get the useer in time */

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
        dispatch(setToken(null));
        dispatch(setUser(null));
        await Keychain.resetGenericPassword();
        return {
          success: false,
          message: 'Your session expired. Please, log in again.',
          error: null,
        };
      }
    } catch (error) {
      console.log('XX -> authHook.ts:172 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
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
        console.log('lo que viene de google', googleResponse.data);

        const checkEmail = await axios.post(`${HOST}/users/checkemail`, {
          email: email,
          isGoogleLogin: true,
        });

        if (checkEmail.status === 200) {
          const createUser = await axios.post(`${HOST}/users/create`, {
            email: email,
            password: sub,
            isGoogleLogin: true,
            firstName: given_name,
            lastName: family_name,
            avatarURL: picture,
          });

          if (createUser.status === 201) {
            const loginUser = await axios.post(`${HOST}/users/login`, {
              email: email,
              password: sub,
            });

            if (loginUser.status === 200) {
              await Keychain.setGenericPassword(
                'userToken',
                loginUser.data.token,
                {
                  service: process.env.KEY_SERVICES,
                  accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
                },
              );
              dispatch(setToken(loginUser.data.token));
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
              'userToken',
              loginUser.data.token,
              {
                service: process.env.KEY_SERVICES,
                accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
              },
            );
            dispatch(setToken(loginUser.data.token));
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
      console.log('XX -> authHook.ts:55 -> return -> error :', error);
      dispatch(setMessageType('error'));
      dispatch(setNotificationMessage('Network error'));
      dispatch(stopLoader());
      return { success: false, error: error };
    }
  };
};
