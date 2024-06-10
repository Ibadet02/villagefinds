import { createSlice, PayloadAction } from '@reduxjs/toolkit';

enum IRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
  COMMUNITY_ORGANIZER = 'community-organizer',
}

interface IAccount {
  role: IRole;
  profile: any;
}

export interface AuthState {
  isLogin: boolean;
  account?: IAccount;
  setIsLogin: (_: boolean) => void;
  setAccount: (_: IAccount) => void;
}

const initialState: AuthState = {
  isLogin: false,
  setIsLogin: () => {},
  setAccount: () => {},
};

export const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLogin: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIsLogin } = authReducer.actions;

export default authReducer.reducer;
