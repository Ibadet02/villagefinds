import { VendorCard } from '@/components/customer/common';

import styles from './ShopList.module.scss';

interface IShopListProps {
  shops: any[];
}

function ShopList({ shops }: IShopListProps) {
  return (
    <div className={styles.vendors}>
      {shops.map((vendor: any, index: number) => (
        <VendorCard
          key={`vendor-${index}`}
          vendorId={vendor._id}
          backImage={vendor.images.finderUrl}
          logoImage={vendor.images.logoUrl}
          title={vendor.shopName}
          description={vendor.store.shortDesc}
          interests={vendor.store.tags}
        />
      ))}
    </div>
  );
}

export { ShopList };
