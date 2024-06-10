import { create } from 'zustand';

import OrderImg from '/assets/admin/backs/order.png';

interface IProductItem {
  image: React.ReactNode;
  name: string;
  sku: string;
  inventory: number;
  status: string;
}

export interface IProductStore {
  products: IProductItem[];
}

const initialProducts: IProductItem[] = [
  {
    image: <img src={OrderImg} />,
    name: 'Black Polish Radish',
    sku: 'XA11UK',
    inventory: 0,
    status: 'Active',
  },
];

export const useProductStore = create<IProductStore>(set => ({
  products: initialProducts,
}));
