import { SplashScreen } from '@components/splash/SplashScreen';
import { ThemeProvider } from '@context/ThemeContext';
import HomeScreen from '@screens/home/HomeScreen';
import WelcomeScreen from '@screens/auth/WelcomeScreen';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from 'src/navigators/AuthNavigator';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 900);
  }, []);

  return (
    <SplashScreen isAppReady={isAppReady} checkLocalStorage={false}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <AuthNavigator />
            {/* <WelcomeScreen /> */}
          </NavigationContainer>
          {/* <HomeScreen /> */}
        </ThemeProvider>
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
