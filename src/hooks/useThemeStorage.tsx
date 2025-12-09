import { useEffect } from 'react';
import { useMode } from '@context/ModeContext';
import { KeychainService, secureSetStorage } from '@utils/secureStorage';

/**
 * A hook to persist the current theme to Local Storage.
 * It listens for changes in the ModeContext and saves the new theme name.
 */
const useThemeStorage = () => {
  const { themeName } = useMode();

  useEffect(() => {
    // When the themeName from the context changes, save it to storage.
    if (themeName) {
      secureSetStorage('theme', themeName, KeychainService.THEME);
    }
  }, [themeName]);
};

export default useThemeStorage;
