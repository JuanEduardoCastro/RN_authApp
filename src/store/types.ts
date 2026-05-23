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
  provider: 'google' | 'github' | 'apple' | null;
  avatarURL: string;
  avatarBuffer: string;
  roles: 'user' | 'admin' | 'superadmin';
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface NotificationMessagePayload {
  messageType: 'error' | 'success' | 'warning' | 'information' | null;
  notificationMessage: string | null | unknown;
}

export interface ValidateRefreshTokenPayload {
  t: TFunction;
  token: string | null;
}

export interface LoginUserPayload {
  t: TFunction;
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LogoutUserPayload {
  t: TFunction;
  email: string;
}

export interface CreateUserPayload {
  t: TFunction;
  email: string;
  password: string;
  token: string;
}

export interface EditUserPayload {
  t: TFunction;
  userData: Record<string, any>;
}

export interface CheckEmailPayload {
  t: TFunction;
  email: string;
}

export interface ResetPasswordPayload {
  t: TFunction;
  email: string;
}

export interface UpdatePasswordPayload {
  t: TFunction;
  email: string;
  password: string;
  token: string;
}

export interface FetchUsersPayload {
  t: TFunction;
  page?: number;
  search?: string;
}

export interface SendAdminMessagePayload {
  t: TFunction;
  recipientIds: string[];
  title: string;
  body: string;
  type: 'push' | 'in_app' | 'both';
}

export interface FetchMessagesPayload {
  t: TFunction;
  unreadOnly?: boolean;
}
export interface FetchUnreadCountPayload {
  t: TFunction;
}

export interface MarkMessageReadPayload {
  t: TFunction;
  messageId: string;
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

export interface AdminState {
  users: UserSummary[];
  messages: InboxMessage[];
  unreadCount: number;
  loader: boolean;
  usersPage: number;
  usersHasMore: boolean;
}

export interface UserSummary {
  _id: string;
  firstName: string;
  email: string;
  lastName: string;
  avatarURL: string | null;
  roles: 'user' | 'admin' | 'superadmin';
}

export interface InboxMessage {
  _id: string;
  sender: UserSummary | null;
  title: string;
  body: string;
  type: 'push' | 'in_app' | 'both';
  isRead: boolean;
  isSystemMessage: boolean;
  createdAt: string;
}
