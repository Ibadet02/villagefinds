import { createSlice } from '@reduxjs/toolkit';
import { v4 as UUID } from 'uuid';

export interface GuestState {
  guestID: string;
}

const initialState: GuestState = {
  guestID: '',
};

export const guestReducer = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    setGuestID: (state: GuestState) => {
      let guestID = localStorage.getItem('guest_id') as string;
      if (!guestID) guestID = UUID();
      state.guestID = guestID;
      localStorage.setItem('guest_id', guestID);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGuestID } = guestReducer.actions;

export default guestReducer.reducer;
