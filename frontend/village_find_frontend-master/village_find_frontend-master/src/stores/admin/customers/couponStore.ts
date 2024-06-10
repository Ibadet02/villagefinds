import { create } from 'zustand';

import { ICoupon } from '@/interfaces';

interface ICouponStore {
  coupons: ICoupon[];
  setCoupons: (_coupons: ICoupon[]) => void;
  updateCoupon: (id: string, coupon: ICoupon) => void;
  deleteCoupon: (id: string) => void;
}

const initialCoupons: ICoupon[] = [];

export const useCouponStore = create<ICouponStore>(set => ({
  coupons: initialCoupons,
  setCoupons: (_coupons: ICoupon[]) => {
    set(state => ({
      ...state,
      coupons: _coupons,
    }));
  },
  updateCoupon: (id: string, coupon: ICoupon) => {
    set(state => ({
      ...state,
      coupons: state.coupons.map((_coupon: ICoupon) =>
        _coupon._id === id ? coupon : _coupon,
      ),
    }));
  },
  deleteCoupon: (id: string) => {
    set(state => ({
      ...state,
      coupons: state.coupons.filter((coupon: ICoupon) => coupon._id !== id),
    }));
  },
}));
