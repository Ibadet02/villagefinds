import React, { useContext, useEffect, useState } from 'react';

import {
  IRecipient,
  IDelivery
} from '@/components/customer/Checkout';
import { useAppSelector } from '@/redux/store';
import { HttpService } from '@/services';
import { AuthContext } from './AuthProvider';

export interface ICartItem {
  _id: string;
  orderId: number;
  vendorId: {
    stripeAccountID: string;
    images: {
      logoUrl: string;
    };
    fulfillment: {
      delivery: {
        leadTime: number;
        days: {
          weekday: number;
          from: string;
          to: string;
        }[];
      };
      pickup: {
        leadTime: number;
        days: {
          weekday: number;
          from: string;
          to: string;
        }[];
      };
      locations: {
        name: string;
        address: string;
        eventDate?: string;
        pickupWeekday?: number;
        pickupTime: {
          from: string;
          to: string;
        };
        instruction: string;
        charge: number;
      }[];
    };
    business: {
      name: string;
      phone: string;
    }
  };
  productId: {
    name: string;
    image: string;
    soldByUnit: string;
    subscription?: any;
    personalization?: {
      message: string;
    };
    attrs: object;
    deliveryTypes: string[];
  };
  inventoryId: {
    attrs: any;
    image: string;
    styleId: {
      attributes: {
        _id: string;
        name: string;
      }[];
    };
  };
  price: number;
  quantity: number;
  image: string;
  deliveryType?: string;
  delivery: IDelivery;
  recipient: IRecipient;
  personalization: {
    fee: number;
    message: string;
  };
  buymode: string;
  subscription: {
    iscsa: boolean;
    subscribe?: string;
    frequencies: string[];
    discount: number;
    csa: {
      frequency: string;
      duration: number;
      startDate?: string;
      endDate?: string;
    }
  };
  pickuplocation: {
    name: string;
    address: string;
    charge: number;
    instruction: string;
    pickupDate: string;
    pickupTime: {
      from: string;
      to: string;
    };
  };
  fulfillday: {
    day: string;
    from: string;
    to: string;
  };
  gift: any;
}

export interface ISummary {
  subTotal: number;
  orderTotal: number;
  pickupLocationFee: number;
  safePickupFee: number;
  deliveryFee: number;
  shippingFee: string;
  giftShippingFee: string;
}

interface ICartContext {
  cartItems: ICartItem[];
  cartItemCount: number;
  summary: ISummary;
  setCartItems: (_: ICartItem[]) => void;
}

const initialSummary: ISummary = {
  subTotal: 0,
  orderTotal: 0,
  pickupLocationFee: 0,
  safePickupFee: 0,
  deliveryFee: 0,
  shippingFee: 'Calculated on next page',
  giftShippingFee: 'Calculated on next page',
};

export const CartContext = React.createContext<ICartContext>({
  cartItems: [],
  cartItemCount: 0,
  summary: initialSummary,
  setCartItems: () => { },
});

interface ICartProviderProps {
  children: React.ReactNode;
}

const getCsaCycle = (csa: { frequency: string; duration: number; }) => {
  const values = csa.frequency.split('-');
  const period = Number(values[0]) || 1;
  return Math.floor(csa.duration / period);
}

export function CartProvider({ children }: ICartProviderProps) {
  const guestID = useAppSelector(state => state.guest.guestID);
  const { isLogin, account } = useContext(AuthContext);

  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [summary, setSummary] = useState<ISummary>(initialSummary);

  useEffect(() => {
    const params: any = {};
    if (isLogin) {
      params.mode = 'customer';
      params.buyerID = account?.profile._id;
    } else {
      params.mode = 'guest';
      params.buyerID = guestID;
    }
    HttpService.get('/cart', params).then(response => {
      const { status } = response;
      if (!status) {
        setCartItems(response || []);
      }
    });
  }, [isLogin, account, guestID]);

  useEffect(() => {
    setCartItemCount(cartItems.reduce(
      (tot: number, cartItem: ICartItem) => tot + cartItem.quantity, 0
    ));

    const subTotal = cartItems.reduce((tot: number, item: ICartItem) => {
      if (item.subscription.iscsa) {
        return (
          tot +
          (item.price *
            item.quantity *
            getCsaCycle(item.productId.subscription.csa))
        );
      }
      return tot + item.price * item.quantity;
    }, 0);

    const pickupLocationFee = cartItems
      .filter((item: ICartItem) => item.deliveryType === 'Pickup Location')
      .reduce(
        (tot: number, item: ICartItem) =>
          tot + (item.pickuplocation?.charge || 0),
        0,
      );

    const orderTotal = subTotal + pickupLocationFee;

    setSummary({
      ...summary,
      subTotal,
      pickupLocationFee,
      safePickupFee: 0,
      deliveryFee: 0,
      orderTotal,
    });
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, cartItemCount, summary, setCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
}
