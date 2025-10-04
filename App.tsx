/* Core libs & third parties libs */
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
/* Custom components */
import { SplashScreen } from '@components/splash/SplashScreen';
import Loader from '@components/shared/loader/Loader';
import NotificationBanner from '@components/shared/notifications/NotificationBanner';
import RootNavigator from '@navigation/RootNavigation';
/* Custom hooks */
/* Types */
import { RootStackParamList } from '@navigation/types';
/* Utilities & constants */
import { ModeProvider } from '@context/ModeContext';
import store from '@store/store';
import { useAppSelector } from '@store/authHook';
import { userAuth } from '@store/authSlice';
/* Assets */

if (__DEV__) {
  configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });
}

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['authapp://app'],
  config: {
    screens: {
      AuthNavigator: {
        screens: {
          NewPasswordScreen: 'new-password/:emailToken',
        },
      },
    },
  },
};

function App() {
  const { loader } = useAppSelector(userAuth);
  const [isAppReady, setIsAppReady] = useState(false);

  const handleAppIsReady = () => {
    setIsAppReady(true);
  };

  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <SplashScreen
          handleAppIsReady={handleAppIsReady}
          isAppReady={isAppReady}>
          <ModeProvider>
            {loader && <Loader />}
            <NotificationBanner />
            <NavigationContainer linking={linking}>
              <RootNavigator />
            </NavigationContainer>
          </ModeProvider>
        </SplashScreen>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}

export default AppWrapper;
