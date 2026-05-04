/* eslint-env jest */

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
  getSupportedBiometryType: jest.fn(() => Promise.resolve(null)),
  ACCESS_CONTROL: { BIOMETRY_CURRENT_SET: 'BiometryCurrentSet' },
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WhenUnlockedThisDeviceOnly',
    AFTER_FIRST_UNLOCK: 'AfterFirstUnlock',
  },
  BIOMETRY_TYPE: { FACE_ID: 'FaceID', TOUCH_ID: 'TouchID' },
}));

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(() => ({})),
}));
jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({
    requestPermission: jest.fn(() => Promise.resolve(1)),
    getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
    onMessage: jest.fn(() => jest.fn()),
    onTokenRefresh: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(),
    signOut: jest.fn(),
    hasPreviousSignIn: jest.fn(() => false),
    signInSilently: jest.fn(),
    getTokens: jest.fn(() => Promise.resolve({ idToken: 'mock-token' })),
  },
}));

jest.mock('@invertase/react-native-apple-authentication', () => ({
  default: {
    performRequest: jest.fn(),
    Operation: { LOGIN: 'LOGIN' },
    Scope: { EMAIL: 'email', FULL_NAME: 'fullName' },
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-device-info', () => ({
  default: { getUniqueId: jest.fn(() => Promise.resolve('mock-device-id')) },
  getUniqueId: jest.fn(() => Promise.resolve('mock-device-id')),
}));

jest.mock('react-native-ssl-public-key-pinning', () => ({
  initializeSslPinning: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    default: {},
    View: RN.View,
    Text: RN.Text,
    Image: RN.Image,
    ScrollView: RN.ScrollView,
    FlatList: RN.FlatList,
    createAnimatedComponent: component => component,
    Easing: {
      linear: t => t,
      ease: t => t,
      quad: t => t,
      cubic: t => t,
      sin: t => t,
      circle: t => t,
      exp: t => t,
      bounce: t => t,
      in: e => e,
      out: e => e,
      inOut: e => e,
      bezier: () => t => t,
      poly: () => t => t,
      elastic: () => t => t,
      back: () => t => t,
    },
    useSharedValue: value => ({ value }),
    useAnimatedStyle: fn => {
      try {
        return fn();
      } catch {
        return {};
      }
    },
    useDerivedValue: fn => ({ value: fn() }),
    useAnimatedRef: () => ({ current: null }),
    useAnimatedScrollHandler: () => jest.fn(),
    useAnimatedGestureHandler: () => jest.fn(),
    useAnimatedProps: fn => fn(),
    useFrameCallback: jest.fn(),
    withTiming: value => value,
    withSpring: value => value,
    withRepeat: value => value,
    withSequence: (...values) => values[values.length - 1],
    withDelay: (_, value) => value,
    withDecay: () => 0,
    runOnJS: fn => fn,
    runOnUI: fn => fn,
    cancelAnimation: jest.fn(),
    interpolate: (_value, _input, output) => output[0],
    interpolateColor: (_value, _input, output) => output[0],
    measure: jest.fn(),
    scrollTo: jest.fn(),
    makeMutable: value => ({ value }),
    makeShareable: value => value,
    FadeIn: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
    },
    FadeOut: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
    },
    FadeInDown: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
    },
    FadeInUp: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
    },
    SlideInRight: { duration: jest.fn().mockReturnThis() },
    SlideOutRight: { duration: jest.fn().mockReturnThis() },
    ZoomIn: { duration: jest.fn().mockReturnThis() },
    ZoomOut: { duration: jest.fn().mockReturnThis() },
    Layout: { duration: jest.fn().mockReturnThis() },
    ReduceMotion: { Never: 'never', Always: 'always', System: 'system' },
    SharedTransition: { custom: jest.fn() },
  };
});

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(() => [
    {
      countryCode: 'US',
      languageCode: 'en',
      languageTag: 'en-US',
      isRTL: false,
    },
  ]),
  getNumberFormatSettings: jest.fn(() => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  })),
}));

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

jest.mock('react-native-keyboard-controller', () => ({
  KeyboardProvider: ({ children }) => children,
  KeyboardAwareScrollView: ({ children }) => children,
  useKeyboardHandler: jest.fn(),
  useKeyboardState: jest.fn(() => ({
    height: { value: 0 },
    progress: { value: 0 },
  })),
}));

jest.mock('react-native-worklets', () => ({
  createSerializable: jest.fn(val => val),
  isSerializableRef: jest.fn(() => false),
  createSynchronizable: jest.fn(val => val),
  makeShareableCloneRecursive: jest.fn(val => val),
  WorkletsModule: {},
  isSynchronizable: jest.fn(() => false),
  getStaticFeatureFlag: jest.fn(() => false),
  setDynamicFeatureFlag: jest.fn(),
  getRuntimeKind: jest.fn(() => 'JS'),
  RuntimeKind: { UI: 'UI', JS: 'JS' },
  isWorkletFunction: jest.fn(() => false),
  serializableMappingCache: {
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(() => false),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
    i18n: { changeLanguage: jest.fn(), language: 'en' },
  }),
  Trans: ({ children }) => children,
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('react-native-image-crop-picker', () => ({
  default: {
    openPicker: jest.fn(() => Promise.resolve({ path: 'mock-image-path' })),
    openCamera: jest.fn(() => Promise.resolve({ path: 'mock-image-path' })),
    clean: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('react-native-linear-gradient', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(insets),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { insets, frame },
  };
});
