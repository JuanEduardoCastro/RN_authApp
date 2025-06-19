/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SplashScreen } from '@components/splash/SplashScreen';
import { NewAppScreen } from '@react-native/new-app-screen';
import HomeScreen from '@screens/HomeScreen';
import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // setTimeout(() => {
    //   setIsAppReady(true);
    // }, 900);
  }, []);

  return (
    <SplashScreen isAppReady={isAppReady} checkLocalStorage={false}>
      {/* <NewAppScreen templateFileName="App.tsx" /> */}

      <SafeAreaProvider>
        <HomeScreen />
      </SafeAreaProvider>
    </SplashScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
