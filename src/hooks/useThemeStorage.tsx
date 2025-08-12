import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMode } from '@context/ModeContext';

const useThemeStorage = () => {
  const { themeName } = useMode();
  const [theme, setTheme] = useState('luxury');

  useEffect(() => {
    const checkThemeStoraged = async () => {
      const themeStoraged = await AsyncStorage.getItem('theme');
      themeStoraged && setTheme(themeStoraged);
    };
    checkThemeStoraged();
  }, [themeName]);

  return { theme };

  /* USE MEMO HERE !!!!!!!!!!!!!!!!!!!! */
};

export default useThemeStorage;
