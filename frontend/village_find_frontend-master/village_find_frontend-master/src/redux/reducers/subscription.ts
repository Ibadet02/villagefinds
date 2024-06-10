import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ISubscription {
  _id: string;
  name: string;
  monthInvest: number;
}

export interface SubscriptionState {
  subscriptions: ISubscription[];
}

const initialState: SubscriptionState = {
  subscriptions: [],
};

export const subscriptionReducer = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    loadSubscriptions: (
      state: SubscriptionState,
      action: PayloadAction<ISubscription[]>,
    ) => {
      state.subscriptions = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loadSubscriptions } = subscriptionReducer.actions;

export default subscriptionReducer.reducer;
