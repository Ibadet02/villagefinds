import { create } from 'zustand';

import { WeekdayType } from '@/interfaces';

interface ITimeRange {
  start: string;
  end: string;
}

export interface IPickupInfo {
  day: WeekdayType;
  range: ITimeRange;
}

export interface IPickupLocation {
  name: string;
  address: string;
  status: string;
}

export interface IFulfillStore {
  pickup: IPickupInfo;
  setPickupDay: (_day: WeekdayType) => void;
  pickupLocation: IPickupLocation[];
}

const initialPickupInfo: IPickupInfo = {
  day: 'Monday',
  range: {
    start: '05:30 AM',
    end: '12:30 PM',
  },
};

const initialLocations: IPickupLocation[] = [
  {
    name: `Bill's Boom House`,
    address: '313 Capitol Avenue, Waterbury, Ct 06705',
    status: 'Active',
  },
  {
    name: 'Bottles North',
    address: '69 Prospect Rd Waterbury, Ct 06076',
    status: 'Active',
  },
];

export const useFulfillStore = create<IFulfillStore>(set => ({
  pickup: initialPickupInfo,
  setPickupDay: (_day: WeekdayType) => {
    set(state => ({
      ...state,
      pickup: {
        day: _day,
        range: state.pickup.range,
      },
    }));
  },
  pickupLocation: initialLocations,
}));
