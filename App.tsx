/* Core libs & third parties libs */
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
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
import i18n from 'src/locale/i18next';
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

  console.log('que viene aca --->', linking);

  const handleAppIsReady = () => {
    setIsAppReady(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <I18nextProvider i18n={i18n}>
            <SplashScreen
              handleAppIsReady={handleAppIsReady}
              isAppReady={isAppReady}>
              <ModeProvider>
                {loader && <Loader />}
                <NotificationBanner />
                {/* <NavigationContainer> */}
                <NavigationContainer linking={linking}>
                  <RootNavigator />
                </NavigationContainer>
              </ModeProvider>
            </SplashScreen>
          </I18nextProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default AppWrapper;
