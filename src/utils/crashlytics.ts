import {
  getCrashlytics,
  log,
  recordError,
  setCrashlyticsCollectionEnabled,
} from '@react-native-firebase/crashlytics';

declare const global: {
  ErrorUtils: {
    setGlobalHandler: (
      callback: (error: Error, isFatal?: boolean) => void,
    ) => void;
    getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
  };
};

const crashlyticsInstance = getCrashlytics();

export const initializeCrashlytics = async () => {
  await setCrashlyticsCollectionEnabled(crashlyticsInstance, !__DEV__);

  const defaultHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    recordError(crashlyticsInstance, error);
    defaultHandler(error, isFatal);
  });
};

export const logCrashlyticsBreadcrumb = (message: string) => {
  log(crashlyticsInstance, message);
};

export const recordCrashlyticsError = (error: Error) => {
  recordError(crashlyticsInstance, error);
};
