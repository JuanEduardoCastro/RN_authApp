import { StyleSheet } from 'react-native';

import { JwtPayload } from 'jwt-decode';

import { TColors } from '@constants/types';

export interface Styles<T extends StyleSheet.NamedStyles<T>> {
  colors: TColors;
  styles: T;
}

export interface UseCheckTokenReturn {
  refreshTokenSaved: boolean;
  isExpired: boolean;
  checkCompleted: boolean;
}

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  isNew?: boolean;
}

export interface UseTimeExpiredReturn {
  accessTokenTimer: number | null;
  refreshTokenTimer: number | null;
}

export interface UseWhenToScroll {
  layoutHeight: number;
}
