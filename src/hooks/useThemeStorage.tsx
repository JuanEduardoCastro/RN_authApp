import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMode } from '@context/ModeContext';

/**
 * A hook to persist the current theme to AsyncStorage.
 * It listens for changes in the ModeContext and saves the new theme name.
 */
const useThemeStorage = () => {
  const { themeName } = useMode();

  useEffect(() => {
    // When the themeName from the context changes, save it to storage.
    if (themeName) {
      AsyncStorage.setItem('theme', themeName);
    }
  }, [themeName]);
};

export default useThemeStorage;
