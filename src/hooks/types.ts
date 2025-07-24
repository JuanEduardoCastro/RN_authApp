import { TColors } from '@constants/types';
import { JwtPayload } from 'jwt-decode';
import { StyleSheet } from 'react-native';

export interface Styles<T extends StyleSheet.NamedStyles<T>> {
  colors: TColors;
  styles: T;
}

export interface UseCheckTokenReturn {
  userId: string | null;
  isExpired: boolean;
  checkCompleted: boolean;
}

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  isNew?: boolean;
}
