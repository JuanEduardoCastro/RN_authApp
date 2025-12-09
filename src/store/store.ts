import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { setupInterceptors } from './apiInterceptor';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // serializableCheck: false,
      serializableCheck: {
        ignoredActions: [
          'users/token/refresh',
          'users/login',
          'users/create',
          'users/:id',
          'users/logout',
          'users/check-email',
          'users/reset-password',
          'users/password',
        ],
        ignoredActionPaths: ['payload.t', 'meta.arg.t'],
      },
    }),
});

setupInterceptors(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
