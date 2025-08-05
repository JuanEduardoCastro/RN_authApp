import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { SplashScreen } from '@components/splash/SplashScreen';
import { ThemeProvider } from '@context/ThemeContext';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from 'src/store/store';
import { useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';
import Loader from '@components/shared/loader/Loader';
import RootNavigator from 'src/navigators/RootNavigator';
import { RootStackParamList } from 'src/navigators/types';
import NotificationBanner from '@components/shared/notifications/NotificationBanner';
import { KeyboardProvider } from 'react-native-keyboard-controller';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

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
      <SplashScreen handleAppIsReady={handleAppIsReady} isAppReady={isAppReady}>
        <SafeAreaProvider>
          <ThemeProvider>
            {loader && <Loader />}
            <NotificationBanner />
            <NavigationContainer linking={linking}>
              <RootNavigator />
              {/* <AuthNavigator /> */}
              {/* <WelcomeScreen /> */}
            </NavigationContainer>
          </ThemeProvider>
        </SafeAreaProvider>
      </SplashScreen>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({});

export default AppWrapper;
function auth(state: unknown): unknown {
  throw new Error('Function not implemented.');
}
