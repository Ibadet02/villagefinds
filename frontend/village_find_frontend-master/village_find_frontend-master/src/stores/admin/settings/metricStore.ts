import { create } from 'zustand';

import { IMetric } from '@/interfaces';

interface IMetricStore {
  metrics: IMetric[];
  setMetrics: (_metrics: IMetric[]) => void;
  updateMetric: (id: string, metric: IMetric) => void;
  deleteMetric: (id: string) => void;
}

const initialMetrics: IMetric[] = [];

export const useMetricStore = create<IMetricStore>(set => ({
  metrics: initialMetrics,
  setMetrics: (_metrics: IMetric[]) => {
    set(state => ({
      ...state,
      metrics: _metrics,
    }));
  },
  updateMetric: (id: string, metric: IMetric) => {
    set(state => ({
      ...state,
      metrics: state.metrics.map((_metric: IMetric) =>
        _metric._id === id ? metric : _metric,
      ),
    }));
  },
  deleteMetric: (id: string) => {
    set(state => ({
      ...state,
      metrics: state.metrics.filter(({ _id }) => id !== _id),
    }));
  },
}));
