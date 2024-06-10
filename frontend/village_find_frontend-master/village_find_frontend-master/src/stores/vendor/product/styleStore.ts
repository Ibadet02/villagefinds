import { create } from 'zustand';

type StatusType = 'Active' | 'Inactive';

export interface IStyle {
  id: string;
  name: string;
  discount: number;
  status: StatusType;
  attribute: IAttribute;
}

export interface IAttribute {
  size: string[];
  color: string[];
}

export interface IStyleStore {
  styles: IStyle[];
}

const initialStyles: IStyle[] = [
  {
    id: '1',
    name: 'Beeded',
    discount: 0,
    status: 'Active',
    attribute: {
      size: ['Small', 'Medium'],
      color: ['Red', 'Green', 'Blue'],
    },
  },
];

export const useStyleStore = create<IStyleStore>(set => ({
  styles: initialStyles,
}));
