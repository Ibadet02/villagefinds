import { useEffect, useState } from 'react';
import { Card, TableBody } from '@/components/common';

import { Input } from '@/components/forms';
import { MagnifierIcon } from '@/components/icons';
import { ChangeInputEvent, ITableColumn } from '@/interfaces';
import { formatDate, formatNumber } from '@/utils';

import styles from './Customers.module.scss';

export function Customers() {
  const customers = 0;
  const customerTableColumns: ITableColumn[] = [
    {
      title: 'Customer Name',
      name: 'name',
      width: 200,
    },
    {
      title: 'Phone Number',
      name: 'phone',
      width: 200,
    },
    {
      title: 'Email',
      name: 'email',
      width: 300,
    },
    {
      title: 'Signup Date',
      name: 'date',
      width: 200,
      cell: (row: any) => <span>{formatDate(row.date)}</span>,
    },
    {
      title: 'Address',
      name: 'address',
      width: 200,
    },
    {
      title: 'Spend',
      name: 'spend',
      width: 250,
      cell: (row: any) => <span>${formatNumber(row.spend)}</span>,
    },
  ];
  const [filter, setFilter] = useState('');
  // const customerTableRows = [
  //   {
  //     name: 'Brandon Monti',
  //     phone: '203-228-8814',
  //     email: 'brandon@fresherchoice.com',
  //     date: new Date('02/28/2024'),
  //     address: '122 Park St. Bristol Ct, 06705',
  //     spend: 2007.95,
  //   },
  // ];

  return (
    <div className={styles.root}>
      <Card className={styles.customCount}>
        <p>Customers</p>
        <span>{customers}</span>
      </Card>
      <div className={styles.customerTable}>
        <div className={styles.toolbar}>
          <Input
            name='search'
            placeholder='Search'
            bgcolor='primary'
            border='none'
            rounded='full'
            value={filter}
            updateValue={(e: ChangeInputEvent) => setFilter(e.target.value)}
            className={styles.input}
            adornment={{
              position: 'right',
              content: <MagnifierIcon />
            }}
          />
        </div>
        <Card>
          <TableBody columns={customerTableColumns} rows={[]} />
        </Card>
      </div>
    </div>
  );
}
