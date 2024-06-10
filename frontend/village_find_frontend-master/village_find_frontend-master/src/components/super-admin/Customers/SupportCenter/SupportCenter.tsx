import React, { useState, ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';

import { Card, TableToolbar, TableBody } from '@/components/common';

import { IRange, ITableColumn } from '@/interfaces';

import styles from './SupportCenter.module.scss';
import { HttpService } from '@/services';

const initialTableData = [
  {
    name: 'John Pollock',
    spent: '$230.03',
    method: 'Shipping',
    date: '02/23/2023',
  },
  {
    name: 'John Pollock',
    spent: '$323.34',
    method: 'Pickup',
    date: '02/23/2023',
  },
];

export function SupportCenter() {
  const [filter, setFilter] = useState('');
  const [range, setRange] = useState<IRange>({ from: '', to: '' });
  const [tableData, setTableData] = useState(initialTableData);

  const columns: ITableColumn[] = [
    {
      title: 'Vendor Name',
      name: 'name',
      width: 200,
    },
    {
      title: 'Spent',
      name: 'spent',
      width: 200,
    },
    {
      title: 'Delivery Method',
      name: 'method',
      width: 200,
    },
    {
      title: 'Purchase Date',
      name: 'date',
      width: 200,
    },
  ];

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const onRangeChange =
    (which: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setRange({ ...range, [which]: new Date(e.target.value) });
    };

  useEffect(() => {
    HttpService.get('/settings/general/support').then(response => {
      setTableData(response || []);
    });
  }, []);

  return (
    <Card title="Support Center" className={styles.root}>
      <div className={styles.container}>
        <TableToolbar
          searchTitle="Vendor Name"
          search={filter}
          updateSearch={onFilterChange}
          rangable={true}
          range={range}
          updateRange={onRangeChange}
          downloadable={true}
          selectable={false}
          className={styles.tableToolbar}
          actions={
            <div className={styles.actions}>
              <div>
                <p>Submit</p>
                <button className={clsx(styles.button, styles.submit)}>
                  Submit
                </button>
              </div>
              <div>
                <p>Reset</p>
                <button className={clsx(styles.button, styles.reset)}>
                  Reset
                </button>
              </div>
            </div>
          }
        />
        <TableBody
          columns={columns}
          rows={tableData}
          className={styles.tableBody}
        />
      </div>
    </Card>
  );
}
