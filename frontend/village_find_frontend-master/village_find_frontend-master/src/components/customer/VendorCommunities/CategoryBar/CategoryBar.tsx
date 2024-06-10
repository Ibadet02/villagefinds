import { Input } from '@/components/forms';

import styles from './CategoryBar.module.scss';
interface ICategoryBarProps {
  isVendorPanel?: boolean;
  panel: boolean;
  category: string;
  categories: { name: string; value: string }[];
  changeCategory: (_: string) => void;
  vendor: string;
  changeVendor: (_: string) => void;
  minPrice: string;
  maxPrice: string;
  vendors: { name: string; value: string }[];
}

export function CategoryBar({
  isVendorPanel = true,
  panel = true,
  category = '',
  categories = [],
  changeCategory = () => { },
  vendor = '',
  changeVendor = () => { },
  minPrice = '',
  maxPrice = '',
  vendors,
}: ICategoryBarProps) {
  return (
    <div className={styles.root}>
      <div className={styles.categoryList}>
        <p>By Interest</p>
        <ul className={styles.categories}>
          {categories.map((_category: any, index: number) => (
            <li
              key={index}
              onClick={() => changeCategory(_category.value)}
              className={
                panel && category === _category.value ? styles.active : ''
              }
            >
              <span />
              <p>{_category.name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.priceBar}>
        <p>By Price</p>
        <div className={styles.container}>
          <div className={styles.control}>
            <p>Min Price</p>
            <Input bgcolor="primary" value={minPrice} />
          </div>
          <div className={styles.control}>
            <p>Max Price</p>
            <Input bgcolor="primary" value={maxPrice} />
          </div>
        </div>
      </div>
      {isVendorPanel && (
        <div className={styles.categoryList}>
          <p>By Vendor</p>
          <ul className={styles.categories}>
            {vendors.map((_vendor: any, index: number) => (
              <li
                key={`vendor-category-${index}`}
                onClick={() => changeVendor(_vendor.value)}
                className={
                  !panel && vendor === _vendor.value ? styles.active : ''
                }
              >
                <span />
                <p>{_vendor.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
