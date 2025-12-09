import { AxiosRequestConfig } from 'axios';
import { TFunction } from 'i18next';

export interface AuthState {
  loader: boolean;
  token: string | null;
  user: User | null;
  isAuthorized: boolean;
  messageType: 'error' | 'success' | 'warning' | 'information' | null;
  notificationMessage: string | null | unknown;
}

export interface UserCredentialsPayload extends AuthState {
  success: boolean;
  error: Error;
}

export interface UserCredentials {
  email: string | null;
  password: string | null;
  rememberMe: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  email: string;
  lastName: string;
  phoneNumber: {
    code: string;
    dialCode: string;
    number: string;
  };
  occupation: string;
  isGoogleLogin: boolean;
  isGitHubLogin: boolean;
  isAppleLogin: boolean;
  avatarURL: string;
  avatarBuffer: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface NotificationMessagePayload {
  messageType: 'error' | 'success' | 'warning' | 'information' | null;
  notificationMessage: string | null | unknown;
}

export interface DataAPI {
  t: TFunction;
  email: string | null;
  password: string | null;
  rememberMe: boolean;
  token: string | null;
  userData: Record<string, string>;
}

export type ErrorType = 'timeout' | 'network' | 'unknown' | 'server' | 'client';

export interface ParsedError {
  type: ErrorType;
  message: string;
  statusCode?: number;
}

export interface ApiErrorResponse {
  notificationMessage?: string;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
