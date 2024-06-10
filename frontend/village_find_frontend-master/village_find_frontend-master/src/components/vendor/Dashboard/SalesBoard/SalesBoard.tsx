import clsx from 'clsx';

import { Card } from '@/components/common';

import { ISales } from '@/stores';

import { formatNumber } from '@/utils';

import styles from './SalesBoard.module.scss';

interface ISalesBoardProps {
  sales: ISales;
}

export function SalesBoard({ sales }: ISalesBoardProps) {
  return (
    <Card title="Sales" className={styles.root}>
      <div className={styles.rows}>
        <div className={styles.row}>
          <p>Year to date</p>
          <p className={styles.price}>${formatNumber(sales.yearToDate)}</p>
        </div>
        <div className={styles.row}>
          <p>This month</p>
          <p className={styles.price}>${formatNumber(sales.thisMonth)}</p>
        </div>
        <div className={styles.row}>
          <p>This week</p>
          <p className={styles.price}>${formatNumber(sales.thisWeek)}</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <p>Transactions</p>
          <p>Average Order</p>
        </div>
        <div className={clsx(styles.row, styles.totalRow)}>
          <p>{formatNumber(sales.total.transaction)}</p>
          <p>${formatNumber(sales.total.averageOrder)}</p>
        </div>
      </div>
    </Card>
  );
}
