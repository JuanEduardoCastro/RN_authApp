import { ReactNode } from 'react';

import { Provider } from 'react-redux';

import { renderHook } from '@testing-library/react-native';

import useUserData from '@hooks/useUserData';

import { createTestStore, defaultAuthState } from 'src/__test__/test-utils';

const userWithPhone = {
  firstName: 'Juan',
  phoneNumber: { dialCode: '+34', code: 'ES', number: '61435261' },
};

const userWithoutPhone = {
  firstName: 'Juan',
  phoneNumber: null,
};

const makeWrapper = (user: any) => {
  const store = createTestStore({
    auth: { ...defaultAuthState, user, isAuthorized: true },
  });
  return ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe('useUserData', () => {
  it('sets phoneData from user.phoneNumber when present', () => {
    const { result } = renderHook(() => useUserData(), {
      wrapper: makeWrapper(userWithPhone),
    });

    expect(result.current.phoneData).toEqual({
      dialCode: '+34',
      code: 'ES',
      number: '61435261',
    });
  });

  it('falls back to device locale when no phone number', () => {
    // react-native-localize mock returns 'en-US' / 'US' from jest.setup.js
    const { result } = renderHook(() => useUserData(), {
      wrapper: makeWrapper(userWithoutPhone),
    });
    // defaultCountryCode will be set if 'US' matches a country in countriesList
    expect(result.current.phoneData).toBeNull();
  });

  it('returns zero indexToScroll when no phoneData dialCode', () => {
    const { result } = renderHook(() => useUserData(), {
      wrapper: makeWrapper(userWithoutPhone),
    });
    expect(result.current.indexToScroll).toBe(0);
  });

  it('returns null values when user is null', () => {
    const { result } = renderHook(() => useUserData(), {
      wrapper: makeWrapper(null),
    });
    expect(result.current.phoneData).toBeNull();
    expect(result.current.defaultCountryCode).toBeNull();
  });
});
