import clsx from 'clsx';

import styles from './ProductMoreDetail.module.scss';

interface IProductMoreDetailProps {
  category?: string;
  shortDesc: string;
  longDesc: string;
  specifications: {
    _id?: string;
    name: string;
    value: string;
  }[];
  disclaimer: string;
  vendorStory?: string;
}

const SPEC_KEYS = [
  'SKU',
  'UPC',
  'Weight',
  'Height',
  'Width',
  'Length',
  'Package Quantity',
];

const getSpecName = (value: string) => {
  const specification = SPEC_KEYS.find(item => item.toLowerCase() === value.toLowerCase());
  return specification || '';
}

export function ProductMoreDetail({
  category = '',
  shortDesc,
  longDesc,
  specifications,
  disclaimer,
  vendorStory = '',
}: IProductMoreDetailProps) {
  return (
    <div className={styles.root}>
      <p className={styles.head}>About this item</p>
      <div className={styles.navItem}>
        <p>More Details</p>
        <div />
      </div>
      <div className={clsx(styles.card, styles.glance)}>
        <p className={styles.head}>At a glance</p>
        <span className={styles.variant}>{category}</span>
        <p className={styles.body}>{shortDesc}</p>
      </div>
      <div className={clsx(styles.card, styles.description)}>
        <p className={styles.head}>Description</p>
        <p className={styles.body}>{longDesc}</p>
      </div>
      <div className={clsx(styles.card, styles.extra)}>
        <div className={styles.secondaryCard}>
          <div className={styles.specifications}>
            <p className={styles.head}>Specifications</p>
            <div className={styles.body}>
              {specifications.map(
                (
                  item: { _id?: string; name: string; value: string },
                  index: number,
                ) => (
                  <div key={`detail-item-${index}`} className={styles.detItem}>
                    <p className={styles.head}>{getSpecName(item.name)}</p>
                    <p className={styles.body}>{item.value}</p>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className={styles.disclaimers}>
            <p className={styles.head}>Disclaimers</p>
            <p className={styles.body}>{disclaimer}</p>
          </div>
        </div>
        <div className={styles.story}>
          <p className={styles.head}>Vendor Story</p>
          <p className={styles.body}>{vendorStory}</p>
        </div>
      </div>
    </div>
  );
}
