import { useColorScheme } from 'react-native';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
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
  themeName: ColorThemeProps;
}

type ThemeProviderProps = {
  children: ReactNode;
};

const ModeContext = createContext<ModeContextProps | undefined>(undefined);

const themes: Record<ColorThemeProps, ColorNameProps> = {
  luxury,
  calm,
  gold,
  passion,
};

export const ModeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ColorModeProps>(
    systemColorScheme || 'light',
  );
  const [themeName, setThemeName] = useState<ColorThemeProps>('luxury');

  useEffect(() => {
    const initialize = async () => {
      const storedMode = (await AsyncStorage.getItem('mode')) as ColorModeProps;
      const storedTheme = (await AsyncStorage.getItem(
        'theme',
      )) as ColorThemeProps;

      setMode(storedMode || systemColorScheme || 'light');
      setThemeName(storedTheme || 'luxury');
    };
    initialize();
  }, []);

  const setColorTheme = (themeName: ColorThemeProps) => {
    setThemeName(themeName);
    AsyncStorage.setItem('theme', themeName);
  };

  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('mode', newMode);
      return newMode;
    });
  };

  const colors = useMemo(() => {
    const currentTheme = themes[themeName];
    return mode === 'light'
      ? { ...currentTheme.lightMode, ...sharedColors }
      : { ...currentTheme.darkMode, ...sharedColors };
  }, [mode, themeName]);

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
