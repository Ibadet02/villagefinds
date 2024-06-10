import { Card } from '@/components/common';

import { formatNumber } from '@/utils';

import { ITotalSurvey } from '@/stores';

import styles from './TotalTab.module.scss';

export function TotalTab({ customer, order, product, revenue }: ITotalSurvey) {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.total}>
          <Card className={styles.count}>
            <p>Customers</p>
            <span>{customer}</span>
          </Card>
          <Card className={styles.count}>
            <p>Orders</p>
            <span>{order}</span>
          </Card>
          <Card className={styles.count}>
            <p>All Revenue</p>
            <span>${formatNumber(revenue.all)}</span>
          </Card>
          <Card className={styles.count}>
            <p>Products</p>
            <span>{product}</span>
          </Card>
        </div>
        <div className={styles.revenue}>
          <p>My yearly revenue goals</p>
          <p>
            <span>${formatNumber(revenue.yearly)}</span> of{' '}
            <span>${formatNumber(revenue.goal)}</span>
          </p>
          <p className={styles.percent}>
            {(revenue.yearly / revenue.goal) * 100}%
          </p>
        </div>
      </div>
    </div>
  );
}
