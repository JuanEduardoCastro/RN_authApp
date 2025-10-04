import { countriesList } from '@constants/countriesList';
import { useEffect, useMemo, useState } from 'react';
import { getLocales, Locale } from 'react-native-localize';
import { useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';

const useUserData = () => {
  const { user } = useAppSelector(userAuth);
  const [defaultCountryCode, setDefaultCountryCode] = useState<string | null>(
    null,
  );
  const [defaultDialCode, setDefaultDialCode] = useState<string | null>(null);
  const [codeIndex, setCodeIndex] = useState<number | null>(null);
  const [phoneData, setPhoneData] = useState<{
    code: string | null;
    dialCode: string | null;
    number: string | null;
  } | null>(null);

  // Effect for initializing phone data on mount, based on user profile or device locale.
  useEffect(() => {
    if (!user) return;

    // If user already has a phone number saved, use that.
    if (user.phoneNumber?.number) {
      setPhoneData({
        dialCode: user.phoneNumber.dialCode,
        code: user.phoneNumber.code,
        number: user.phoneNumber.number,
      });
      return;
    }

    // Otherwise, determine the default from the device's locale.
    const deviceLocale: Locale | undefined = getLocales()[0];
    const defaultCountry = countriesList.find(
      country => country.code === deviceLocale?.countryCode,
    );

    if (defaultCountry) {
      setDefaultCountryCode(defaultCountry.code);
      setDefaultDialCode(defaultCountry.dialCode);
    }
  }, []);

  // Memoize the index to scroll to, preventing re-calculation on every render.
  const indexToScroll = useMemo(() => {
    if (!phoneData?.dialCode) return 0;
    const index = countriesList.findIndex(
      country => country.dialCode === phoneData.dialCode,
    );
    return index > -1 ? index : 0;
  }, [phoneData]);

  // Effect to update phone data when a new country is selected from a picker.
  useEffect(() => {
    if (codeIndex !== null) {
      const selectedCountry = countriesList[codeIndex];
      setPhoneData(prevData => ({
        dialCode: selectedCountry.dialCode,
        code: selectedCountry.code,
        number: prevData?.number || null, // Keep existing number if available
      }));
    }
  }, [codeIndex]);

  return {
    phoneData,
    setPhoneData,
    codeIndex,
    setCodeIndex,
    indexToScroll,
    defaultCountryCode,
    defaultDialCode,
  };
};

export default useUserData;
