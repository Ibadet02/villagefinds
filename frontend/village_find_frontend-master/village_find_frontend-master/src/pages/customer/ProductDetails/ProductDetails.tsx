import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Container } from '@/components/layout/customer';
import {
  ProductInfo,
  ProductMoreDetail,
  AuthenticReviews,
  ProductsAndCommunities,
} from '@/components/customer/ProductDetails';
import { HttpService } from '@/services';

import styles from './ProductDetails.module.scss';

export interface IMoreDetail {
  category?: string;
  shortDesc: string;
  longDesc: string;
  disclaimer: string;
  specifications: {
    _id: string;
    name: string;
    value: string;
  }[];
  vendorStory?: string;
}

export interface IOrderDetail {
  _id?: string;
  name: string;
  price: number;
  image: string;
  vendor: {
    _id: string;
    shopName: string;
  };
  community: {
    _id: string;
    name: string;
    slug: string;
    images: {
      logoUrl: string;
    };
  };
  styles: {
    _id: string;
    name: string;
    attributes: {
      _id: string;
      name: string;
      values: string[];
    }[];
    discount?: number;
  }[];
  inventories: {
    _id: string;
    attrs: string[];
    image: string;
    price: number;
    styleId: string;
  }[];
  iscustomizable: boolean;
  customization?: {
    customText: string;
    fee: number;
  };
  subscription?: {
    iscsa: boolean;
    frequencies: string[];
    discount: number;
    csa?: {
      frequency: string;
      duration: number;
      startDate?: string;
      endDate?: string;
    }
  };
  soldByUnit: string;
  deliveryTypes: string[];
}

const initialMoreDetail: IMoreDetail = {
  shortDesc: '',
  longDesc: '',
  disclaimer: '',
  specifications: [],
};

const initialOrderDetail: IOrderDetail = {
  name: '',
  price: 0,
  image: '',
  vendor: {
    _id: '',
    shopName: '',
  },
  community: {
    _id: '',
    name: '',
    slug: '',
    images: {
      logoUrl: '',
    },
  },
  iscustomizable: false,
  styles: [],
  inventories: [],
  soldByUnit: '',
  deliveryTypes: [],
};

export function ProductDetails() {
  const { id: productId } = useParams();

  const [moreDetail, setMoreDetail] = useState<IMoreDetail>(initialMoreDetail);
  const [orderDetail, setOrderDetail] =
    useState<IOrderDetail>(initialOrderDetail);

  useEffect(() => {
    HttpService.get(`/products/customer/${productId}`).then(response => {
      const { status, product } = response;
      if (status === 200) {
        const { more, order } = product;
        setMoreDetail(more);
        setOrderDetail(order);
      }
    });
  }, []);

  return (
    <Container className={styles.root}>
      <ProductInfo {...orderDetail} />
      <ProductMoreDetail {...moreDetail} />
      <AuthenticReviews />
      <ProductsAndCommunities />
    </Container>
  );
}
