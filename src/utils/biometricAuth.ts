import * as Keychain from 'react-native-keychain';

import {
  KeychainService,
  secureDelete,
  secureGetStorage,
  secureSetStorage,
} from './secureStorage';

export const getBiometricType =
  async (): Promise<Keychain.BIOMETRY_TYPE | null> => {
    return await Keychain.getSupportedBiometryType();
  };

export const enableBiometricLogin = async (): Promise<boolean> => {
  const biometryType = await getBiometricType();
  if (!biometryType) return false;

  await secureSetStorage(
    'biometric',
    'enabled',
    KeychainService.BIOMETRIC_ENABLED,
  );

  await Keychain.setGenericPassword('biometric', 'authenticated', {
    service: KeychainService.BIOMETRIC_LOGIN,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return true;
};

export const isBiometricLoginEnabled = async (): Promise<boolean> => {
  const biometryType = await getBiometricType();
  if (!biometryType) return false;

  const flag = await secureGetStorage(KeychainService.BIOMETRIC_ENABLED);
  return flag.success && flag.data?.password === 'enabled';
};

export const authenticateWithBiometrics = async (
  promptTitle: string,
  cancelLabel: string,
): Promise<boolean> => {
  try {
    const result = await Keychain.getGenericPassword({
      service: KeychainService.BIOMETRIC_LOGIN,
      authenticationPrompt: {
        title: promptTitle,
        cancel: cancelLabel,
      },
    });
    return result !== false && result.password === 'authenticated';
  } catch (error) {
    __DEV__ &&
      console.log(
        'XX -> biometricAuth.ts:41 -> authenticateWithBiometrics -> error :',
        error,
      );
    return false;
  }
};

export const disableBiometricLogin = async (): Promise<void> => {
  await secureDelete(KeychainService.BIOMETRIC_LOGIN);
  await secureDelete(KeychainService.BIOMETRIC_ENABLED);
};

export const hasBiometricBeenDeclined = async (): Promise<boolean> => {
  const result = await secureGetStorage(KeychainService.BIOMETRIC_DECLINED);
  return result.success && !!result.data;
};

export const markBiometricDeclined = async (): Promise<void> => {
  await secureSetStorage(
    'biometric',
    'declined',
    KeychainService.BIOMETRIC_DECLINED,
  );
};
