import { useEffect, useState } from 'react';

import {
  AboutCommunity,
  DashPage,
  FeaturedItems,
  HowItWorks,
  ShopIntention,
} from '@/components/customer';

import {
  IDashPageProps,
  IFeaturedItem,
  IHowItWorksProps,
  IShopIntentionProps,
  ICommunityProps,
  IReadyToShopProps,
} from '@/components/customer';

import {
  initialDashPageData,
  initialFeaturedItems,
  initialHowData,
  initialShopIntention,
  initialCommunityImages,
  initialReadyImages,
} from '@/components/customer';

import { HttpService } from '@/services';

import styles from './Dashboard.module.scss';

interface IDashboard {
  slider: IDashPageProps;
  how: IHowItWorksProps;
  shop: IShopIntentionProps;
  community: ICommunityProps;
  ready: IReadyToShopProps;
}

const initialDashboardData = {
  slider: initialDashPageData,
  how: initialHowData,
  shop: initialShopIntention,
  community: {
    images: initialCommunityImages,
  },
  ready: {
    images: initialReadyImages,
  },
};

export function Dashboard() {
  const [data, setData] = useState<IDashboard>(initialDashboardData);
  const [products, setProducts] =
    useState<IFeaturedItem[]>(initialFeaturedItems);

  useEffect(() => {
    HttpService.get('/settings/marketplace/home').then(response => {
      if (response) {
        setData(response);
      }
    });
    HttpService.get('/products/public', { featured: true }).then(response => {
      setProducts(response || []);
    });
  }, []);

  return (
    <div className={styles.root}>
      <DashPage {...data.slider} />
      <FeaturedItems items={products} />
      <HowItWorks {...data.how} />
      <ShopIntention {...data.shop} />
      <AboutCommunity community={data.community} ready={data.ready} />
    </div>
  );
}