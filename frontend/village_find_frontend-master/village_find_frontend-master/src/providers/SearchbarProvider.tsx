import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ISearchbarContext {
  isSearchbar: boolean;
  showSearchbar: (_: boolean) => void;
}

export const SearchbarContext = React.createContext<ISearchbarContext>({
  isSearchbar: false,
  showSearchbar: () => {},
});

interface ISearchbarContextProps {
  children: React.ReactNode;
}

export function SearchbarProvider({ children }: ISearchbarContextProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const [isSearchbar, setSearchbar] = useState(false);

  useEffect(() => {
    if (window.scrollY < 200 && pathname.startsWith('/dashboard')) {
      setSearchbar(true);
    } else {
      setSearchbar(false);
    }
  }, [window.scrollY, pathname]);

  return (
    <SearchbarContext.Provider
      value={{
        isSearchbar,
        showSearchbar: (shown: boolean) => setSearchbar(shown),
      }}
    >
      {children}
    </SearchbarContext.Provider>
  );
}
