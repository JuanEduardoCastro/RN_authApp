import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ColorMode, TColors } from '@constants/types';
import { darkMode, lightMode, sharedColors } from '@constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  mode: ColorMode;
  colors: TColors;
  toggleMode: () => void;
}

type Props = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: Props) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ColorMode>(systemColorScheme || 'light');

  useEffect(() => {
    const checkLocalStorage = async () => {
      const isInMode = await AsyncStorage.getItem('mode');
      console.log(
        'XX -> ThemeContext.tsx:32 -> checkLocalStorage -> isInMode :',
        isInMode,
      );
      if (isInMode) {
        if (isInMode === 'light') {
          setMode('light');
        } else if (isInMode === 'dark') {
          setMode('dark');
        } else {
          setMode(systemColorScheme || 'light');
        }
      }
    };

    checkLocalStorage();
    // Check if Mode is in local storage to persist in time
  }, []);

  // useEffect(() => {
  //   // To update Mode if the system mode change
  //   setMode(systemColorScheme || 'light');

  // }, [systemColorScheme]);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    if (mode === 'light') {
      AsyncStorage.setItem('mode', 'dark');
    } else if (mode === 'dark') {
      AsyncStorage.setItem('mode', 'light');
    } else {
      AsyncStorage.removeItem('mode');
    }
    // Save new mode in local storage
  };

  const colors =
    mode === 'light'
      ? { ...lightMode, ...sharedColors }
      : { ...darkMode, ...sharedColors };

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must used whitin the ThemeProvider ');
  }
  return context;
};
