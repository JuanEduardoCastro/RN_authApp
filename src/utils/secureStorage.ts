import * as Keychain from 'react-native-keychain';

export enum KeychainService {
  REFRESH_TOKEN = 'com.authdemoapp.refreshToken',
  REMEMBER_ME = 'com.authdemoapp.rememberMe',
  MODE = 'com.authdemoapp.mode',
  THEME = 'com.authdemoapp.theme',
  LANGUAGE = 'com.authdemoapp.lng',
}

export interface KeychainResult {
  success: boolean;
  data?: Keychain.UserCredentials;
  error?: string;
}

export const secureSetStorage = async (
  username: string,
  password: string,
  service: KeychainService,
  options?: Keychain.SetOptions,
): Promise<KeychainResult> => {
  try {
    const accessibility =
      service === KeychainService.REFRESH_TOKEN
        ? Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
        : Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK;

    await Keychain.setGenericPassword(username, password, {
      service,
      accessible: accessibility,
      ...options,
    });

    __DEV__ &&
      console.log(
        'XX -> secureStorage.ts:27 -> secureSetStorage -> service :',
        `[secureSetStorage] ✅ Saved to: ${service}`,
      );

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    __DEV__ &&
      console.log(
        'XX -> secureStorage.ts:35 -> secureSetStorage -> error :',
        `[secureSetStorage] ❌ Failed to save to ${service}:`,
        errorMessage,
      );

    if (errorMessage.includes('User canceled')) {
      __DEV__ &&
        console.log(
          'XX -> secureStorage.ts:45 -> secureSetStorage -> error :',
          '[secureSetStorage] User canceled biometric authentication',
          errorMessage,
        );
    } else if (errorMessage.includes('locked')) {
      __DEV__ &&
        console.log(
          'XX -> secureStorage.ts:52 -> secureSetStorage -> error :',
          '[secureSetStorage] Device is locked',
        );
    } else if (errorMessage.includes('permission')) {
      __DEV__ &&
        console.log(
          'XX -> secureStorage.ts:58 -> secureSetStorage -> error :',
          '[secureSetStorage] Keychain permission denied',
        );
    }

    return { success: false, error: errorMessage };
  }
};

export const secureGetStorage = async (
  service: KeychainService,
  options?: Keychain.GetOptions,
): Promise<KeychainResult> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service,
      ...options,
    });

    if (credentials === false) {
      __DEV__ &&
        console.log(
          'XX -> secureStorage.ts:80 -> secureGetStorage -> credentials :',
          `[SecureGetStorage] ℹ️ No credentials found in: ${service}`,
        );
      return { success: false, data: undefined };
    }

    __DEV__ &&
      console.log(
        'XX -> secureStorage.ts:89 -> secureGetStorage -> credentials :',
        `[SecureGetStorage] ✅ Retrieved from: ${service}`,
      );
    return { success: true, data: credentials };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    __DEV__ &&
      console.log(
        'XX -> secureStorage.ts:96 -> secureGetStorage -> error :',
        `[SecureGetStorage] ❌ Failed to retrieve from ${service}:`,
        errorMessage,
      );

    if (errorMessage.includes('locked')) {
      __DEV__ &&
        console.log(
          'XX -> secureStorage.ts:106 -> secureGetStorage -> error :',
          '[SecureGetStorage] Device is locked - cannot access keychain',
        );
    } else if (errorMessage.includes('User canceled')) {
      __DEV__ &&
        console.log(
          'XX -> secureStorage.ts:112 -> secureGetStorage -> error :',
          '[SecureGetStorage] User canceled biometric authentication',
        );
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const secureDelete = async (
  service: KeychainService,
  options?: Keychain.GetOptions,
): Promise<KeychainResult> => {
  try {
    await Keychain.resetGenericPassword({
      service,
      ...options,
    });

    __DEV__ &&
      console.log(
        'XX -> secureStorage.ts:137 -> secureDelete -> service :',
        `[SecureDelete] ✅ Deleted from: ${service}`,
      );
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    __DEV__ &&
      console.log(
        'XX -> secureStorage.ts:143 -> secureDelete -> service :',
        `[SecureDelete] ⚠️ Failed to delete from ${service}:`,
        errorMessage,
      );

    return {
      success: false,
      error: errorMessage,
    };
  }
};
