import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface LoaderState {
  isLoading: boolean;
}

const initialState: LoaderState = {
  isLoading: false,
};

export const loadingReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoadingSpinner: (state: LoaderState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoadingSpinner } = loadingReducer.actions;

export default loadingReducer.reducer;
