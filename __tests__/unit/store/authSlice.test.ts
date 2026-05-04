import authReducer, {
  setCredentials,
  setLoader,
  setNotificationMessage,
  setResetCredentials,
} from '@store/authSlice';
import { AuthState } from '@store/types';

const initialState: AuthState = {
  loader: false,
  token: null,
  user: null,
  isAuthorized: false,
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
