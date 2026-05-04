import React from 'react';

import { screen } from '@testing-library/react-native';

import WelcomeScreen from '@screens/auth/WelcomeScreen';

import { renderWithProviders } from 'src/__test__/test-utils';

jest.mock('@utils/biometricAuth', () => ({
  isBiometricLoginEnabled: jest.fn(),
  getBiometricType: jest.fn(),
  useBiometricAuth: jest.fn(() => ({
    isAvailable: true,
    isEnabled: true,
    biometricType: 'FaceID',
  })),
}));

describe('WelcomeScreen', () => {
  it('renders sign-in options', () => {
    renderWithProviders(<WelcomeScreen {...({} as any)} />, {
      withNavigation: true,
    });

    expect(screen.getByText(/google/i)).toBeTruthy();
  });
});
