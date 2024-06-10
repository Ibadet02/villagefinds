import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface IMetric {
  _id: string;
  name: string;
  status: string;
}

export interface MetricState {
  metrics: IMetric[];
}

const initialState: MetricState = {
  metrics: [],
};

export const metricReducer = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    loadMetrics: (state: MetricState, action: PayloadAction<IMetric[]>) => {
      state.metrics = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loadMetrics } = metricReducer.actions;

export default metricReducer.reducer;
