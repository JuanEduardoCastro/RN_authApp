import { configureStore } from '@reduxjs/toolkit';
import { TFunction } from 'i18next';

import api from '@store/apiService';
import authReducer from '@store/authSlice';
import { loginUser, logoutUser, validateRefreshToken } from '@store/thunks';

// Mock the API instance — responses are controlled per test
jest.mock('@store/apiService');
jest.mock('@utils/secureStorage', () => ({
  secureSetStorage: jest.fn(() => Promise.resolve({ success: true })),
  secureDelete: jest.fn(() => Promise.resolve()),
  secureGetStorage: jest.fn(),
  KeychainService: { REFRESH_TOKEN: 'refreshToken', REMEMBER_ME: 'rememberMe' },
}));
jest.mock('@utils/biometricAuth', () => ({
  disableBiometricLogin: jest.fn(() => Promise.resolve()),
}));
jest.mock('@utils/notifications/registerFCMToken', () => ({
  registerFCMToken: jest.fn(() => Promise.resolve()),
}));

const mockApi = api as jest.Mocked<typeof api>;
const t = ((key: string) => key) as unknown as TFunction;

const makeStore = () => configureStore({ reducer: { auth: authReducer } });

describe('validateRefreshToken', () => {
  it('fulfills and sets isAuthorized on 200', async () => {
    mockApi.post.mockResolvedValueOnce({
      status: 200,
      data: { data: { user: { firstName: 'Juan' }, accessToken: 'token123' } },
    });

    const store = makeStore();
    await store.dispatch(
      validateRefreshToken({ t, token: 'refresht-token' }) as any,
    );
    const { isAuthorized, token, user } = store.getState().auth;

    expect(isAuthorized).toBe(true);
    expect(token).toBe('token123');
    expect(user).toMatchObject({ firstName: 'Juan' });
  });

  it('rejects and clears auth on API error', async () => {
    mockApi.post.mockRejectedValueOnce({ response: { status: 401 } });

    const store = makeStore();
    await store.dispatch(
      validateRefreshToken({ t, token: 'bad-token' }) as any,
    );
    const { isAuthorized, token } = store.getState().auth;

    expect(isAuthorized).toBe(false);
    expect(token).toBeNull();
  });
});

describe('loginUser', () => {
  it('fulfills and authorizes on successful login', async () => {
    mockApi.post.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          user: { firstName: 'Juan' },
          accessToken: 'access123',
          refreshToken: 'refresh123',
        },
      },
    });

    const store = makeStore();
    await store.dispatch(
      loginUser({
        t,
        email: 'test@test.com',
        password: 'Pass1!',
        rememberMe: false,
      }) as any,
    );
    const { isAuthorized, token } = store.getState().auth;

    expect(isAuthorized).toBe(true);
    expect(token).toBe('access123');
  });

  it('rejects on 401 credentials error', async () => {
    const error = {
      response: {
        stats: 401,
        data: { notificationMessage: 'Invalid credentials' },
      },
    };
    mockApi.post.mockRejectedValueOnce(error);

    const store = makeStore();
    const result = await store.dispatch(
      loginUser({
        t,
        email: 'test@test.com',
        password: 'Wrong1!',
        rememberMe: false,
      }) as any,
    );

    expect(result.type).toBe('users/login/rejected');
    expect(store.getState().auth.isAuthorized).toBe(false);
  });
});

describe('logoutUser', () => {
  it('resets auth state on successful logout', async () => {
    mockApi.post.mockResolvedValueOnce({ status: 200 });
    mockApi.delete.mockResolvedValueOnce({ status: 200 });

    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          loader: false,
          token: 'access123',
          user: { firstName: 'Juan' } as any,
          isAuthorized: true,
          messageType: null,
          notificationMessage: null,
        },
      },
    });
    await store.dispatch(logoutUser({ t, email: 'test@test.com' }) as any);
    const { isAuthorized, token } = store.getState().auth;

    expect(isAuthorized).toBe(false);
    expect(token).toBeNull();
  });
});
