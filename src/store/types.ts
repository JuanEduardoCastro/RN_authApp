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
  error: any;
}

export interface UserCredentials {
  email: string | null;
  password: string | null;
  rememberMe: boolean;
}

export interface User {
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
  createdAt: any;
  updatedAt: any;
}

export interface NotificationMessagePayload {
  messageType: 'error' | 'success' | 'warning' | 'information' | null;
  notificationMessage: string | null | unknown;
}

export interface DataAPI {
  email: string | null;
  password: string | null;
  rememberMe: boolean;
  token: string | null;
  userData: Record<string, string>;
}
