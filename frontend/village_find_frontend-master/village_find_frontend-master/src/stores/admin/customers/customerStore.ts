import { create } from 'zustand';

import { ICustomer } from '@/interfaces';

interface ICustomerStore {
  customers: ICustomer[];
  setCustomers: (_customers: ICustomer[]) => void;
  deleteCustomer: (id: string) => void;
}

const initialCustomers: ICustomer[] = [];

export const useCustomerStore = create<ICustomerStore>(set => ({
  customers: initialCustomers,
  setCustomers: (_customers: ICustomer[]) => {
    set(state => ({
      ...state,
      customers: _customers,
    }));
  },
  updateCustomer: (id: string, customer: ICustomer) => {
    set(state => ({
      ...state,
      customers: state.customers.map((_customer: ICustomer) =>
        _customer._id === id ? customer : _customer,
      ),
    }));
  },
  deleteCustomer: (id: string) => {
    set(state => ({
      ...state,
      customers: state.customers.filter(
        (customer: ICustomer) => customer._id !== id,
      ),
    }));
  },
}));
