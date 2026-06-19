import { configureStore } from '@reduxjs/toolkit';
import { TFunction } from 'i18next';

import adminReducer from '@store/adminSlice';
import api from '@store/apiService';
import authReducer from '@store/authSlice';
import { deleteMessage, markMessageRead } from '@store/thunks/adminThunks';

jest.mock('@store/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

const mockApi = api as jest.Mocked<typeof api>;
const t = ((key: string) => key) as unknown as TFunction;

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, admin: adminReducer },
    preloadedState: {
      auth: {
        loader: false,
        token: 'test-token',
        user: null,
        isAuthorized: true,
        pendingBiometricOffer: false,
        messageType: null,
        notificationMessage: null,
      },
    },
  });

describe('markMessageRead thunk', () => {
  it('fulfills with messageId on 200', async () => {
    mockApi.patch.mockResolvedValueOnce({ status: 200 });

    const store = makeStore();
    const result = await store.dispatch(
      markMessageRead({ t, messageId: 'msg1' }) as any,
    );

    expect(result.type).toBe('admin/markRead/fulfilled');
    expect(result.payload).toEqual({ messageId: 'msg1' });
  });

  it('rejects on API error', async () => {
    mockApi.patch.mockRejectedValueOnce({ response: { status: 500 } });

    const store = makeStore();
    const result = await store.dispatch(
      markMessageRead({ t, messageId: 'msg1' }) as any,
    );

    expect(result.type).toBe('admin/markRead/rejected');
  });

  it('rejects when API returns non-200 status', async () => {
    mockApi.patch.mockResolvedValueOnce({ status: 204 });

    const store = makeStore();
    const result = await store.dispatch(
      markMessageRead({ t, messageId: 'msg1' }) as any,
    );

    expect(result.type).toBe('admin/markRead/rejected');
  });
});

describe('deleteMessage thunk', () => {
  it('fulfills with messageId on 200', async () => {
    mockApi.delete.mockResolvedValueOnce({ status: 200 });

    const store = makeStore();
    const result = await store.dispatch(
      deleteMessage({ t, messageId: 'msg42' }) as any,
    );

    expect(result.type).toBe('admin/deleteMessage/fulfilled');
    expect(result.payload).toEqual({ messageId: 'msg42' });
  });

  it('rejects on API error', async () => {
    mockApi.delete.mockRejectedValueOnce({ response: { status: 404 } });

    const store = makeStore();
    const result = await store.dispatch(
      deleteMessage({ t, messageId: 'msg42' }) as any,
    );

    expect(result.type).toBe('admin/deleteMessage/rejected');
  });

  it('rejects when API returns non-200 status', async () => {
    mockApi.delete.mockResolvedValueOnce({ status: 204 });

    const store = makeStore();
    const result = await store.dispatch(
      deleteMessage({ t, messageId: 'msg42' }) as any,
    );

    expect(result.type).toBe('admin/deleteMessage/rejected');
  });
});
