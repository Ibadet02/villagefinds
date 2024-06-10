import { create } from 'zustand';

interface ISize {
  length: number;
  width: number;
  height: number;
}

interface IParcel {
  name: string;
  size: ISize;
  thickness: number;
  weight: number;
}

export interface IParcelStore {
  parcels: IParcel[];
}

const initialParcels: IParcel[] = [
  {
    name: 'CLUB',
    size: {
      length: 11.5,
      width: 9.0,
      height: 1.75,
    },
    thickness: 3.18,
    weight: 15.0,
  },
  {
    name: 'CLUB',
    size: {
      length: 11.5,
      width: 9.0,
      height: 1.75,
    },
    thickness: 3.18,
    weight: 15.0,
  },
  {
    name: 'CLUB',
    size: {
      length: 11.5,
      width: 9.0,
      height: 1.75,
    },
    thickness: 3.18,
    weight: 15.0,
  },
];

export const useParcelStore = create<IParcelStore>(set => ({
  parcels: initialParcels,
}));
