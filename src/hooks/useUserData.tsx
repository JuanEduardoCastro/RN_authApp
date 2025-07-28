import { countriesList } from '@constants/countriesList';
import { useEffect, useState } from 'react';
import { getLocales } from 'react-native-localize';
import { useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';

const useUserData = () => {
  const { user } = useAppSelector(userAuth);
  const [defaultCountryCode, setDefaultCountryCode] = useState<string | null>(
    null,
  );
  const [defaultDialCode, setDefaultDialCode] = useState<string | null>(null);
  const [phoneData, setPhoneData] = useState<{
    code: string | null;
    dialCode: string | null;
    number: string | null;
  } | null>(null);
  const [codeIndex, setCodeIndex] = useState<number | null>(null);
  const [indexToScroll, setIndexToScroll] = useState<number | null>(null);
  const [phoneLenght, setPhoneLenght] = useState<number | null>(null);

  const getIndexToScroll = () => {
    if (phoneData) {
      countriesList.map((item, index) => {
        if (item.dialCode === phoneData.dialCode) {
          setIndexToScroll(index);
        }
      });
    } else {
      setIndexToScroll(0);
    }
  };

  useEffect(() => {
    getIndexToScroll();
  }, [phoneData, codeIndex]);

  useEffect(() => {
    if (user) {
      if (!user.phoneNumber.number) {
        const getLocalsCodes = getLocales();
        countriesList.map((item, index) => {
          item.code === getLocalsCodes[0].countryCode &&
            setDefaultDialCode(item.dialCode ?? '00');
        });
        setDefaultCountryCode(getLocalsCodes[0].countryCode ?? '00');
      } else if (user.phoneNumber.number) {
        setPhoneData({
          dialCode: user.phoneNumber.dialCode,
          code: user.phoneNumber.code,
          number: user.phoneNumber.number,
        });
      }
    }
  }, []);

  useEffect(() => {
    getIndexToScroll();
    if (!codeIndex) {
      if (user) {
        if (!user.phoneNumber.number) {
          const getLocalsCodes = getLocales();
          countriesList.map((item, index) => {
            item.code === getLocalsCodes[0].countryCode &&
              setDefaultDialCode(item.dialCode);
          });
          setDefaultCountryCode(getLocalsCodes[0].countryCode);
        } else if (user.phoneNumber.number) {
          getIndexToScroll();
          setPhoneData({
            dialCode: user.phoneNumber.dialCode,
            code: user.phoneNumber.code,
            number: user.phoneNumber.number,
          });
        }
      }
    } else if (codeIndex) {
      getIndexToScroll();
      if (user) {
        countriesList.map((item, index) => {
          index === codeIndex &&
            setPhoneData({
              dialCode: item.dialCode,
              code: item.code,
              number: user.phoneNumber.number,
            });
        });
      }
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
