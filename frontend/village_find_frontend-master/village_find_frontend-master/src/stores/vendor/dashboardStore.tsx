import { create } from 'zustand';

import ProductImg from '/assets/vendor/backs/product.png';

export type FulfillmentType =
  | 'Shipping'
  | 'Safe Pickup'
  | 'Partnered Pickup Location';

export type StatusType = 'Pending' | 'Under Process';

export interface ISalesTotal {
  transaction: number;
  averageOrder: number;
}

export interface ICustomerSurvey {
  count: number;
  data: number[];
}

export interface IProductRow {
  image: React.ReactNode;
  product: string;
  inventory: number;
  sold: number;
  revenue: number;
}

export interface ITotalRevenue {
  goal: number;
  yearly: number;
  all: number;
}

export interface ITotalSurvey {
  customer: number;
  order: number;
  product: number;
  revenue: ITotalRevenue;
}

export interface ISales {
  yearToDate: number;
  thisMonth: number;
  thisWeek: number;
  total: ISalesTotal;
}

export interface IActivitySurvey {
  customers: ICustomerSurvey;
  popularItems: IProductRow[];
  totals: ITotalSurvey;
}

export interface IOrderRow {
  id: number;
  customer: string;
  type: FulfillmentType;
  date: Date;
  amount: number;
  status: StatusType;
}

export interface IDashStore {
  step: number;
  updateStep: (_step: number) => void;

  salesSurvey: ISales;
  updateSalesSurvey: (_survey: ISales) => void;

  activitySurvey: IActivitySurvey;
  updateActivitySurvey: (_survey: IActivitySurvey) => void;

  currentOrders: IOrderRow[];
  updateCurrentOrders: (_orders: IOrderRow[]) => void;
}

const initialSalesSurvey: ISales = {
  yearToDate: 0,
  thisMonth: 0,
  thisWeek: 0,
  total: {
    transaction: 0,
    averageOrder: 0,
  },
};

const initialActivitySurvey: IActivitySurvey = {
  customers: {
    count: 0,
    data: [0, 0, 0, 0, 0, 0, 0],
  },
  popularItems: [],
  totals: {
    customer: 0,
    order: 0,
    product: 0,
    revenue: {
      yearly: 0,
      goal: 0,
      all: 0,
    },
  },
};

const initialCurrentOrders: IOrderRow[] = [];

export const useDashStore = create<IDashStore>(set => ({
  step: 1,
  updateStep: (_step: number) => set(state => ({ ...state, step: _step })),

  salesSurvey: initialSalesSurvey,
  updateSalesSurvey: (_survey: ISales) =>
    set(state => ({ ...state, salesSurvey: _survey })),

  activitySurvey: initialActivitySurvey,
  updateActivitySurvey: (_survey: IActivitySurvey) =>
    set(state => ({ ...state, activitySurvey: _survey })),

  currentOrders: initialCurrentOrders,
  updateCurrentOrders: (_orders: IOrderRow[]) =>
    set(state => ({ ...state, currentOrders: _orders })),
}));
