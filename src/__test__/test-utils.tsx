import React from 'react';
import { ReactNode } from 'react';

import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react-native';

import authReducer from '@store/authSlice';
import { RootState } from '@store/store';
import { AuthState } from '@store/types';

import { ModeProvider } from '@context/ModeContext';

export const defaultAuthState: AuthState = {
  loader: false,
  token: null,
  user: null,
  isAuthorized: false,
  messageType: null,
  notificationMessage: null,
};

const rootReducer = combineReducers({ auth: authReducer });

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

type RenderWithProvidersOptions = RenderOptions & {
  preloadedState?: Partial<RootState>;
  withNavigation?: boolean;
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    withNavigation = false,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: ReactNode }) {
    const content = (
      <ModeProvider>
        <Provider store={store}>{children}</Provider>;
      </ModeProvider>
    );
    return withNavigation ? (
      <NavigationContainer>{content}</NavigationContainer>
    ) : (
      content
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
