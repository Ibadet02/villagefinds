import clsx from 'clsx';

import { Container } from '@/components/layout/customer';

import styles from './Comparison.module.scss';

const initialComparisons = [
  {
    title: 'Etsy',
    transFee: '6.5%',
    referFee: {
      fee: '12% - 15%',
      msg: 'Required after $10k in Sales',
    },
    listFee: '.20',
    stockFee: '.20',
    monthFee: '$0',
    shipping: true,
    pickup: false,
    pLoc: false,
    delivery: false,
  },
  {
    title: 'Village Finds',
    transFee: '8.5% - 10%',
    referFee: 'Free',
    listFee: 'Free up to 25 items',
    stockFee: 'Free',
    monthFee: {
      fee: '$4.99 - $9.99',
      msg: 'When you list more than 25 items',
    },
    shipping: true,
    pickup: true,
    pLoc: true,
    delivery: true,
    active: true,
  },
  {
    title: 'Amazon Handmade',
    transFee: '15%',
    referFee: '12% - 15%',
    listFee: 'Free',
    stockFee: '.99',
    monthFee: {
      fee: '$39.99',
      msg: 'When you sell 40+ items per month',
    },
    shipping: true,
    pickup: false,
    pLoc: false,
    delivery: false,
  },
];

const comparisonNames = {
  transFee: 'Transaction Fee',
  referFee: 'Referral Fee',
  listFee: 'Listing Fee',
  stockFee: 'Restocking Fee',
  monthFee: 'Monthly Fees',
  shipping: 'Shipping',
  pickup: 'Pickup',
  pLoc: 'Pickup Locations',
  delivery: 'Delivery',
};

export function Comparison() {
  return (
    <div id="comparison" className={styles.root}>
      <img src="/assets/customer/sales/pattern.png" />
      <Container className={styles.container}>
        <h1>How do we compare?</h1>
        <div className={styles.list}>
          {initialComparisons.map((comparison: any, index: number) => (
            <div
              key={`comparison-${index}`}
              className={clsx(
                styles.comparison,
                comparison.active ? styles.active : '',
              )}
            >
              <div className={styles.compWrapper}>
                <div className={styles.headWrapper}>
                  <span>{comparison.title}</span>
                </div>
                <ul className={styles.controls}>
                  {Object.keys(comparison)
                    .filter(
                      (item: string) => item !== 'title' && item !== 'active',
                    )
                    .map((key: string, index: number) => (
                      <li key={`comparison-control-${index}`}>
                        <div className={styles.firstline}>
                          <p className={styles.title}>
                            {(comparisonNames as any)[key]}
                          </p>
                          <p className={styles.pricing}>
                            {typeof comparison[key] === 'object'
                              ? comparison[key].fee
                              : typeof comparison[key] === 'boolean'
                              ? comparison[key]
                                ? 'Yes'
                                : 'No'
                              : comparison[key]}
                          </p>
                        </div>
                        {comparison[key].msg && (
                          <span>{comparison[key].msg}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
