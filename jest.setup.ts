import '@testing-library/jest-native/extend-expect';
import { forwardRef } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

jest.mock(
  'react-native/Libraries/Components/RefreshControl/RefreshControl',
  () => ({
    __esModule: true,
    default: require('./__mocks__/RefreshControlMock'),
  }),
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-reanimated', () => {
  const reanimatedMock = require('react-native-reanimated/mock');
  reanimatedMock.default.call = () => {};
  return reanimatedMock;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue({
    password: 'mockPassword',
  }),
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [
    {
      countryCode: 'US',
      languageTag: 'en-US',
      languageCode: 'en',
      isRTL: false,
    },
    {
      countryCode: 'FR',
      languageTag: 'fr-FR',
      languageCode: 'fr',
      isRTL: false,
    },
  ],
  getCountry: () => 'US',
  getCurrencies: () => ['USD', 'EUR'],
  // Mock other functions as needed by your components
  findBestAvailableLanguage: () => ({ languageTag: 'en-US', isRTL: false }),
}));
