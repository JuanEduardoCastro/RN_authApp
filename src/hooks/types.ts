import { TColors } from '@constants/types';
import { JwtPayload } from 'jwt-decode';
import { StyleSheet } from 'react-native';

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
  accessTokenTimer: any | null;
  refreshTokenTimer: any | null;
}

export interface UseWhenToScroll {
  leyoutHeight: number;
}
