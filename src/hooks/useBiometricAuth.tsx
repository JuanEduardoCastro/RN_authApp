import { isBiometricLoginEnabled } from '@utils/biometricAuth';
import { useCallback, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';

interface BiometricAuthState {
  isAvailable: boolean;
  isEnabled: boolean;
  biometricType: Keychain.BIOMETRY_TYPE | null;
  recheck: () => Promise<void>;
}

const useBiometricAuth = (): BiometricAuthState => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnable, setIsEnable] = useState(false);
  const [biometricType, setBiometricType] =
    useState<Keychain.BIOMETRY_TYPE | null>(null);

  const check = useCallback(async () => {
    const type = await Keychain.getSupportedBiometryType();
    if (!type) {
      setIsAvailable(false);
      setIsEnable(false);
      setBiometricType(null);
      return;
    }
    const enabled = await isBiometricLoginEnabled();
    setIsAvailable(true);
    setIsEnable(enabled);
    setBiometricType(type);
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { isAvailable, isEnabled: isEnable, biometricType, recheck: check };
};

export default useBiometricAuth;
