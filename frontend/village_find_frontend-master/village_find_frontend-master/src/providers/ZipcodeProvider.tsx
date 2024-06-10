import React, { useEffect, useState } from 'react';

interface IZipcodeContext {
  zipcode: string;
  cityName: string;
  changeZipcode: (code: string) => void;
  changeCityName: (name: string) => void;
}

export const ZipcodeContext = React.createContext<IZipcodeContext>({
  zipcode: '',
  cityName: '',
  changeZipcode: () => {},
  changeCityName: () => {},
});

interface ISearchbarContextProps {
  children: React.ReactNode;
}

export function ZipcodeProvider({ children }: ISearchbarContextProps) {
  const [zipcode, setZipcode] = useState('');
  const [cityName, setCityName] = useState('');

  return (
    <ZipcodeContext.Provider
      value={{
        zipcode,
        changeZipcode: setZipcode,
        cityName,
        changeCityName: setCityName,
      }}
    >
      {children}
    </ZipcodeContext.Provider>
  );
}
