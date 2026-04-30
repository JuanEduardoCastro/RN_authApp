import { useAppDispatch, useAppSelector } from '@store/hooks';
import { userAuth } from '@store/authSlice';
import { useTranslation } from 'react-i18next';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { logoutUser } from '@store/thunks';
import { LogoutUserPayload } from '@store/types';

const useLogoutUser = () => {
  const { user } = useAppSelector(userAuth);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      const res = await dispatch(
        logoutUser({ email: user?.email, t } as LogoutUserPayload),
      ).unwrap();

      if (res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log(
          'XX -> useLogoutUser.tsx:26 -> handleLogout -> error :',
          error,
        );
      navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
    }
  };

  return { handleLogout };
};

export default useLogoutUser;
