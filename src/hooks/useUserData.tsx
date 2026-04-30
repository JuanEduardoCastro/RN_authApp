import { useEffect, useMemo, useState } from 'react';

import { getLocales, Locale } from 'react-native-localize';

import { useAppSelector } from '@store/hooks';

import { countriesList } from '@constants/countriesList';

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

  useEffect(() => {
    if (!user) return;

    if (user.phoneNumber?.number) {
      setPhoneData({
        dialCode: user.phoneNumber.dialCode,
        code: user.phoneNumber.code,
        number: user.phoneNumber.number,
      });
      return;
    }

    const deviceLocale: Locale | undefined = getLocales()[0];
    const defaultCountry = countriesList.find(
      country => country.code === deviceLocale?.countryCode,
    );

    if (defaultCountry) {
      setDefaultCountryCode(defaultCountry.code);
      setDefaultDialCode(defaultCountry.dialCode);
    }
  }, [user]);

  const indexToScroll = useMemo(() => {
    if (!phoneData?.dialCode) return 0;
    const index = countriesList.findIndex(
      country => country.dialCode === phoneData.dialCode,
    );
    return index > -1 ? index : 0;
  }, [phoneData]);

  useEffect(() => {
    if (codeIndex !== null) {
      const selectedCountry = countriesList[codeIndex];
      setPhoneData(prevData => ({
        dialCode: selectedCountry.dialCode,
        code: selectedCountry.code,
        number: prevData?.number || null,
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
