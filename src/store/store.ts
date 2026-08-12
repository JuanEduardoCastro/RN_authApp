import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import adminReducer from './adminSlice';
import { setupInterceptors } from './apiInterceptor';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
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
