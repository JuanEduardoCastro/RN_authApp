import React from 'react';
import { render, screen } from '@testing-library/react-native';
import AppWrapper from '../App';

// Mock Redux hooks
const mockDispatch = jest.fn();
let mockLoaderState = false;
jest.mock('../src/store/authHook', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (callback: (state: any) => any) =>
    callback({
      auth: {
        loader: mockLoaderState,
        // ... other initial auth states
      },
    }),
}));

// Mock child components to simplify the test
jest.mock('../src/components/splash/SplashScreen', () => {
  const React = require('react');
  const { act } = require('@testing-library/react-native');
  // Mock SplashScreen to immediately call handleAppIsReady and render children
  return ({ children, handleAppIsReady }: any) => {
    React.useEffect(() => {
      act(() => {
        handleAppIsReady();
      });
    }, [handleAppIsReady]);
    return <>{children}</>;
  };
});

// Mock native modules that Jest can't handle
jest.mock('react-native-keyboard-controller', () => {
  const React = require('react');
  // Mock KeyboardProvider to just render its children, bypassing native code
  return {
    KeyboardProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

jest.mock('../src/navigation/RootNavigation', () => () => {
  const { View } = require('react-native');
  return <View testID="root-navigator" />;
});

jest.mock('../src/components/shared/loader/Loader', () => () => {
  const { View } = require('react-native');
  return <View testID="loader" />;
});

jest.mock(
  '../src/components/shared/notifications/NotificationBanner',
  () => () => {
    const { View } = require('react-native');
    return <View testID="notification-banner" />;
  },
);

describe('<App />', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockLoaderState = false;
    jest.clearAllMocks();
  });

  it('renders the main application components after splash', () => {
    render(<AppWrapper />);

    // Check that the main navigator is rendered
    expect(screen.getByTestId('root-navigator')).toBeTruthy();

    // Check that the notification banner is always present
    expect(screen.getByTestId('notification-banner')).toBeTruthy();
  });

  it('does not show the loader when loader state is false', () => {
    mockLoaderState = false;

    render(<AppWrapper />);

    // The queryByTestId will return null if the element is not found
    expect(screen.queryByTestId('loader')).toBeNull();
  });

  it('shows the loader when loader state is true', () => {
    // Set the mock state for this specific test
    mockLoaderState = true;

    render(<AppWrapper />);

    // The getByTestId will throw an error if the element is not found
    expect(screen.getByTestId('loader')).toBeTruthy();
  });
});
