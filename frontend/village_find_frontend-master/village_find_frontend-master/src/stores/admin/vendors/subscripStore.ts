import { create } from 'zustand';
import { ISubscription } from '@/interfaces';

interface ISubscripStore {
  subscrips: ISubscription[];
  setSubscrips: (_subscrips: ISubscription[]) => void;
  updateSubscrip: (id: string, subscrip: ISubscription) => void;
  deleteSubscrip: (id: string) => void;
}

const initialSubscrips: ISubscription[] = [];

export const subscripStore = create<ISubscripStore>(set => ({
  subscrips: initialSubscrips,
  setSubscrips: (_subscrips: ISubscription[]) => {
    set(state => ({
      ...state,
      subscrips: _subscrips,
    }));
  },
  updateSubscrip: (id: string, subscrip: ISubscription) => {
    set(state => ({
      ...state,
      subscrips: state.subscrips.map((_subscrip: ISubscription) =>
        _subscrip._id === id ? subscrip : _subscrip,
      ),
    }));
  },
  deleteSubscrip: (id: string) => {
    set(state => ({
      ...state,
      subscrips: state.subscrips.filter(
        (subscrip: ISubscription) => subscrip._id !== id,
      ),
    }));
  },
}));
