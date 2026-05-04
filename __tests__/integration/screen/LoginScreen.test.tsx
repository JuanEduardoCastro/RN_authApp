import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import LoginScreen from '@screens/auth/LoginScreen';

import { renderWithProviders } from 'src/__test__/test-utils';

jest.mock('@store/apiService');
jest.mock('@utils/secureStorage', () => ({
  secureSetStorage: jest.fn(() => Promise.resolve({ success: true })),
  secureDelete: jest.fn(),
  secureGetStorage: jest.fn(),
  KeychainService: { REFRESH_TOKEN: 'refreshToken', REMEMBER_ME: 'rememberMe' },
}));

describe('LoginScreen', () => {
  it('renders email and password inputs', () => {
    renderWithProviders(<LoginScreen {...({} as any)} />, {
      withNavigation: true,
    });

    expect(screen.getByPlaceholderText(/email/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/password/i)).toBeTruthy();
  });

  it('shows validation error when submitting empty form', async () => {
    renderWithProviders(<LoginScreen {...({} as any)} />, {
      withNavigation: true,
    });
    fireEvent.press(screen.getByText('login-button'));

    const errors = await screen.findAllByText(/required/i);

    expect(errors.length).toBeGreaterThan(0);
  });
});
