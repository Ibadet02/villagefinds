import {
  DashPage,
  Products,
  GiftIdeas,
  VCommunities,
  AsortCategories,
  JoinCommunity,
} from '@/components/customer/Market';
import { DashPage as DeversePage } from '@/components/customer/VendorSales';

import styles from './Market.module.scss';

export function Market() {
  return (
    <div className={styles.root}>
      <DashPage />
      <Products />
      <GiftIdeas />
      <VCommunities />
      <AsortCategories />
      <JoinCommunity />
      <DeversePage />
    </div>
  );
}
