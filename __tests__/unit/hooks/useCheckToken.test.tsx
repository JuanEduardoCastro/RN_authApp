import React from 'react';

import { Provider } from 'react-redux';

import { renderHook, waitFor } from '@testing-library/react-native';

import { useCheckToken } from '@hooks/useCheckToken';

import { createTestStore } from 'src/__test__/test-utils';

jest.mock('@utils/biometricAuth', () => ({
  isBiometricLoginEnabled: jest.fn(),
  authenticateWithBiometrics: jest.fn(),
  disableBiometricLogin: jest.fn(),
}));
jest.mock('@utils/secureStorage', () => ({
  secureGetStorage: jest.fn(),
  secureDelete: jest.fn(() => Promise.resolve()),
  KeychainService: { REFRESH_TOKEN: 'refreshToken', REMEMBER_ME: 'rememberMe' },
}));

import {
  authenticateWithBiometrics,
  isBiometricLoginEnabled,
} from '@utils/biometricAuth';
import { secureGetStorage } from '@utils/secureStorage';

const mockBiometricEnabled = isBiometricLoginEnabled as jest.Mock;
const mockAuthenticate = authenticateWithBiometrics as jest.Mock;
const mockSecureGet = secureGetStorage as jest.Mock;

const store = createTestStore();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useCheckToken', () => {
  beforeEach(() => jest.clearAllMocks());

  it('completes check with no biometric and no remember-me', async () => {
    mockBiometricEnabled.mockResolvedValue(false);
    mockSecureGet.mockResolvedValue({ success: false, data: null });

    const { result } = renderHook(() => useCheckToken(), { wrapper });
    await waitFor(() => expect(result.current.checkCompleted).toBe(true));

    expect(result.current.refreshTokenSaved).toBe(false);
    expect(result.current.isExpired).toBe(true);
  });

  it('skips auto-login when biometric auth fails', async () => {
    mockBiometricEnabled.mockResolvedValue(true);
    mockAuthenticate.mockResolvedValue(false);

    const { result } = renderHook(() => useCheckToken(), { wrapper });
    await waitFor(() => expect(result.current.checkCompleted).toBe(true));

    expect(result.current.refreshTokenSaved).toBe(false);
  });
});
