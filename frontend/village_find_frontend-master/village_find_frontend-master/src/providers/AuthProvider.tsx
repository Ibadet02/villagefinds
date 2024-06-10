import React, { useState } from 'react';

export type RoleType = 'admin' | 'vendor' | 'customer' | 'community-organizer';

interface IAccount {
  role: RoleType;
  profile: any;
}

interface IAuthContext {
  isLogin: boolean;
  account?: IAccount;
  setIsLogin: (_: boolean) => void;
  setAccount: (_: IAccount) => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  isLogin: false,
  setIsLogin: () => { },
  setAccount: () => { },
});

interface IAuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [account, setAccount] = useState<IAccount>({} as IAccount);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, account, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
