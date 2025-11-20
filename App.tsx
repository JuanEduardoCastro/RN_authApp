/* Core libs & third parties libs */
import { useEffect, useState } from 'react';
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
import { Linking } from 'react-native';
import {
  requestPermissionForNotification,
  setupMessageListener,
} from '@utils/notifications/pushNotificationService';

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
  prefixes: [
    'authapp://',
    'https://d2wi1nboge7qqt.cloudfront.net',
    'https://app.authdemoapp-jec.com',
  ],
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => {
      __DEV__ && console.log('ESTO ES EL URL -----> ', url);
      listener(url);
    };

    const suscription = Linking.addEventListener('url', onReceiveURL);

    return () => {
      suscription.remove();
    };
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) {
      __DEV__ && console.log('COLD START -------> ', url);
    } else {
      __DEV__ && console.log('NO HAY URL ');
    }
  },
  config: {
    screens: {
      AuthNavigator: {
        screens: {
          NewPasswordScreen: 'app/new-password/:emailToken',
        },
      },
    },
  },
};

function App() {
  const { loader } = useAppSelector(userAuth);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    requestPermissionForNotification();
    const unsubscribe = setupMessageListener();

    return () => {
      unsubscribe();
    };
  }, []);

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
