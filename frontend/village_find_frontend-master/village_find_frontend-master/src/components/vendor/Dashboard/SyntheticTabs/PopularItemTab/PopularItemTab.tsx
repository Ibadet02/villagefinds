import { TableBody } from '@/components/common';

import { ITableColumn } from '@/interfaces';

import { IProductRow } from '@/stores/vendor/dashboardStore';

import styles from './PopularItemTab.module.scss';

const productTableColumns: ITableColumn[] = [
  {
    title: 'Image',
    name: 'image',
    width: 100,
  },
  {
    title: 'Product Name',
    name: 'product',
    width: 250,
  },
  {
    title: 'Custom Inventory',
    name: 'inventory',
    width: 250,
  },
  {
    title: 'Sold',
    name: 'sold',
    width: 100,
  },
  {
    title: 'Revenue',
    name: 'revenue',
    width: 100,
  },
];

export interface IPouplarItemTabProps {
  data: IProductRow[];
}

export function PopularItemTab({ data }: IPouplarItemTabProps) {
  return (
    <div className={styles.root}>
      <TableBody columns={productTableColumns} rows={data} />
    </div>
  );
}
