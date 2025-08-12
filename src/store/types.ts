export interface AuthState {
  loader: boolean;
  token: string | null;
  user: IUser | null;
  isAuthorized: boolean;
  messageType: 'error' | 'success' | 'warning' | 'information' | null;
  notificationMessage: string | null | unknown;
}

export interface UserCredentialsPayload {
  user: IUser | null;
  token: string;
}

export interface IUser {
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

export interface INotificationMessagePayload {
  messageType: 'error' | 'success' | 'warning' | 'information' | null;
  notificationMessage: string | null | unknown;
}

// export interface userCredentials {
//   email: string;
//   password: string;
// }
