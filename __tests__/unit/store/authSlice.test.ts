import authReducer, {
  clearBiometricOffer,
  setCredentials,
  setLoader,
  setNotificationMessage,
  setResetCredentials,
} from '@store/authSlice';
import { editUser, loginUser } from '@store/thunks';
import { AuthState } from '@store/types';

const initialState: AuthState = {
  loader: false,
  token: null,
  user: null,
  isAuthorized: false,
  pendingBiometricOffer: false,
  messageType: null,
  notificationMessage: null,
};

describe('authSlice reducers', () => {
  it('returns initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setLoader sets loader to true', () => {
    const state = authReducer(initialState, setLoader(true));
    expect(state.loader).toBe(true);
  });

  it('setLoader sets loader to false', () => {
    const state = authReducer(
      { ...initialState, loader: true },
      setLoader(false),
    );
    expect(state.loader).toBe(false);
  });

  it('setCredentials authorizes user and stores token and user', () => {
    const state = authReducer(
      initialState,
      setCredentials({
        token: 'abc123',
        user: { id: '1', firstName: 'Juan' } as any,
      }),
    );
    expect(state.isAuthorized).toBe(true);
    expect(state.token).toBe('abc123');
    expect(state.user).toMatchObject({ firstName: 'Juan' });
    expect(state.loader).toBe(false);
  });

  it('setCredentials sets token and user to null if omitted', () => {
    const state = authReducer(initialState, setCredentials({}));
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthorized).toBe(true);
  });

  it('setResetCredentials clears auth state', () => {
    const loggedIn: AuthState = {
      ...initialState,
      token: 'abc',
      user: { firstName: 'Juan' } as any,
      isAuthorized: true,
    };
    const state = authReducer(loggedIn, setResetCredentials());
    expect(state.isAuthorized).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('setNotificationMessage sets message and type and stops loader', () => {
    const state = authReducer(
      { ...initialState, loader: true },
      setNotificationMessage({
        notificationMessage: 'Done',
        messageType: 'success',
      }),
    );
    expect(state.notificationMessage).toBe('Done');
    expect(state.messageType).toBe('success');
    expect(state.loader).toBe(false);
  });
});

describe('authSlice - clearBiometricOffer', () => {
  it('sets pendingBiometricOffer to false', () => {
    const state = authReducer(
      { ...initialState, pendingBiometricOffer: true },
      clearBiometricOffer(),
    );

    expect(state.pendingBiometricOffer).toBe(false);
  });
});

describe('authSlice - loginUser.fullfilled', () => {
  it('sets pendingBiometricOffer to true', () => {
    const payload = {
      success: true,
      error: null,
      user: { firstName: 'Juan' } as any,
      token: 'tok',
      messageType: 'success' as const,
      notificationMessage: 'success-welcome',
    };
    const state = authReducer(
      initialState,
      loginUser.fulfilled(payload, '', {
        t: (k: string) => k,
        email: 'a@b.com',
        password: 'P1!',
        rememberMe: false,
      } as any),
    );
    expect(state.pendingBiometricOffer).toBe(true);
    expect(state.isAuthorized).toBe(true);
  });
});

describe('authSlice - editUser.rejected', () => {
  it('clears loader and sets error notification', () => {
    const state = authReducer(
      { ...initialState, loader: true },
      editUser.rejected(
        new Error(),
        '',
        { t: (k: string) => k, userData: {} } as any,
        { messageType: 'error', notificationMessage: 'error-network' },
      ),
    );
    expect(state.loader).toBe(false);
    expect(state.messageType).toBe('error');
    expect(state.notificationMessage).toBe('error-network');
  });

  it('falls back to default message when payload is empty', () => {
    const state = authReducer(
      { ...initialState, loader: true },
      editUser.rejected(
        new Error(),
        '',
        { t: (k: string) => k, userData: {} } as any,
        {},
      ),
    );
    expect(state.loader).toBe(false);
    expect(state.messageType).toBe('error');
    expect(state.notificationMessage).toBe('An error occurred');
  });
});
