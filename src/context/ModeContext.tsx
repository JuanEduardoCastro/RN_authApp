import { useColorScheme } from 'react-native';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  ColorModeProps,
  ColorNameProps,
  ColorThemeProps,
  TColors,
} from '@constants/types';
import { sharedColors, luxury, calm, gold, passion } from '@constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ModeContextProps {
  mode: ColorModeProps;
  colors: TColors;
  toggleMode: () => void;
  setColorTheme: (themeName: ColorThemeProps) => void;
  themeName: string;
}

type ThemeProviderProps = {
  children: ReactNode;
};

const ModeContext = createContext<ModeContextProps | undefined>(undefined);

export const ModeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ColorModeProps>(
    systemColorScheme || 'light',
  );
  const [theme, setTheme] = useState<ColorNameProps>(luxury);

  useEffect(() => {
    const checkLocalStorage = async () => {
      const isInMode = await AsyncStorage.getItem('mode');
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

    const checkThemeStorage = async () => {
      const themeStorage = await AsyncStorage.getItem('theme');
      if (themeStorage) {
        switch (themeStorage) {
          case 'luxury':
            setTheme(luxury);
            return;
          case 'calm':
            setTheme(calm);
            return;
          case 'gold':
            setTheme(gold);
            return;
          case 'passion':
            setTheme(passion);
            return;

          default:
            setTheme(luxury);
            AsyncStorage.setItem('theme', 'luxury');
            break;
        }
      }
    };

    checkLocalStorage();
    checkThemeStorage();
  }, []);

  const setColorTheme = (themeName: ColorThemeProps) => {
    switch (themeName) {
      case 'luxury':
        setTheme(luxury);
        AsyncStorage.setItem('theme', 'luxury');
        return;
      case 'calm':
        setTheme(calm);
        AsyncStorage.setItem('theme', 'calm');
        return;
      case 'gold':
        setTheme(gold);
        AsyncStorage.setItem('theme', 'gold');
        return;
      case 'passion':
        setTheme(passion);
        AsyncStorage.setItem('theme', 'passion');
        return;

      default:
        setTheme(luxury);
        AsyncStorage.setItem('theme', 'luxury');
        break;
    }
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    if (mode === 'light') {
      AsyncStorage.setItem('mode', 'dark');
    } else if (mode === 'dark') {
      AsyncStorage.setItem('mode', 'light');
    } else {
      AsyncStorage.removeItem('mode');
    }
  };

  const colors =
    mode === 'light'
      ? { ...theme.lightMode, ...sharedColors }
      : { ...theme.darkMode, ...sharedColors };

  const themeName = JSON.stringify(theme);
  return (
    <ModeContext.Provider
      value={{ mode, colors, toggleMode, setColorTheme, themeName }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useTheme must used whitin the ThemeProvider ');
  }
  return context;
};
