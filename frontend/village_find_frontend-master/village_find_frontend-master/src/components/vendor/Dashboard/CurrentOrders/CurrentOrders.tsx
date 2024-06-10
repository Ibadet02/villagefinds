import clsx from 'clsx';

import { Card, TableBody } from '@/components/common';

import { ITableColumn } from '@/interfaces';

import { formatDate, formatNumber } from '@/utils';

import { IOrderRow } from '@/stores';

import styles from './CurrentOrders.module.scss';

const orderTableColumns: ITableColumn[] = [
  {
    title: 'ID',
    name: 'id',
    width: 100,
  },
  {
    title: 'Customer Name',
    name: 'customer',
    width: 250,
  },
  {
    title: 'Fulfillment Type',
    name: 'type',
    width: 250,
  },
  {
    title: 'Fulfillment Date',
    name: 'date',
    width: 250,
    cell: (row: IOrderRow) => <span>{formatDate(row.date)}</span>,
  },
  {
    title: 'Amount',
    name: 'amount',
    width: 200,
    cell: (row: IOrderRow) => <span>${formatNumber(row.amount)}</span>,
  },
  {
    title: 'Status',
    name: 'status',
    width: 200,
    cell: (row: IOrderRow) => (
      <span
        className={clsx(
          styles.status,
          row.status === 'Pending' ? styles.pending : styles.under,
        )}
      >
        {row.status}
      </span>
    ),
  },
];

export interface ICurrentOrdersProps {
  data: IOrderRow[];
  title?: boolean;
}

export function CurrentOrders({ title = false, data }: ICurrentOrdersProps) {
  return (
    <Card className={styles.root}>
      {title && <h1>Current Orders</h1>}
      <TableBody columns={orderTableColumns} rows={data} />
    </Card>
  );
}
