import { useState, useMemo } from 'react';

import { FaMagnifyingGlass } from 'react-icons/fa6';
import { TbListDetails } from 'react-icons/tb';

import { Input } from '@/components/forms';
import { ShopList, ProductList } from '..';
import { useWindowWidth } from '@/utils';

import styles from './CommunityContent.module.scss';

interface IVendor {
  shopName: string;
}

interface IProduct {
  vendor?: IVendor;
  name: string;
}

interface ICommunityContentProps {
  panel: boolean;
  title: string;
  subtitle: string;
  zipcode?: string;
  products: IProduct[];
  vendors: IVendor[];
  openFindProductDialog: () => void;
  openFilterSortDialog: () => void;
  openMobileSettingDialog: () => void;
}

export function CommunityContent({
  panel = true,
  title = '',
  subtitle = '',
  zipcode = '',
  products,
  vendors,
  openFindProductDialog,
  openFilterSortDialog,
  openMobileSettingDialog,
}: ICommunityContentProps) {
  const minBreakLists = ['none', 'xs'];

  const [_, breakpoint] = useWindowWidth();
  const isMobile = useMemo(() => {
    return minBreakLists.includes(breakpoint as string);
  }, [breakpoint]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>
          <p>{title}</p>
          <span>{subtitle}</span>
        </div>
        <div className={styles.settings}>
          <p>Find items near you!</p>
          <Input
            borderColor="success"
            placeholder="Enter Zipcode"
            adornment={{
              position: 'right',
              content: <FaMagnifyingGlass fill="#3F3F3F" />,
            }}
            className={styles.zipcode}
            value={zipcode}
            onClick={openFindProductDialog}
          />
          <div className={styles.filter} onClick={openFilterSortDialog}>
            <p>Filter and sort</p>
            <span>
              <TbListDetails />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.mobileHeader}>
        <div className={styles.filter}>
          <Input
            rounded="full"
            border="solid"
            borderColor="primary"
            placeholder="Search For item or Vendor"
            adornment={{
              position: 'right',
              content: <FaMagnifyingGlass fill="white" />,
            }}
            className={styles.search}
          />
          <div className={styles.filterIcon} onClick={openMobileSettingDialog}>
            <div className={styles.container}>
              {Array(9)
                .fill(0)
                .map((_: any, index: number) => (
                  <span
                    key={`filter-icon-span-${index}`}
                    className={styles.iconGrid}
                  />
                ))}
            </div>
          </div>
        </div>
        <p>All Categories</p>
      </div>
      {panel ? (
        <ProductList isMobile={isMobile} products={products} />
      ) : (
        <ShopList shops={vendors} />
      )}
    </div>
  );
}
