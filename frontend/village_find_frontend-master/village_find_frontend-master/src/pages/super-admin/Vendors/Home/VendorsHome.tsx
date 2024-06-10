import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Card, TableBody, TableToolbar } from '@/components';
import { Select } from '@/components/forms';
import { HttpService } from '@/services';
import { IRange, ITableColumn } from '@/interfaces';
import { formatNumber } from '@/utils';
import { useAppSelector } from '@/redux/store';

import styles from './VendorsHome.module.scss';
import { enqueueSnackbar } from 'notistack';

const sortOpts = [
  { name: 'Alphabetical Order', value: 'alphabeta' },
  { name: 'Recently Added', value: 'recent' },
  { name: 'Highest Revenue', value: 'highest' },
  { name: 'Lowest Revenue', value: 'lowest' },
];

const statusOpts = ['Active', 'Blocked', 'Paused', 'Inactive'];

const initialRange = {
  from: '',
  to: '',
};

const statusValues = statusOpts.map(item => item.toLowerCase());
type Status = typeof statusValues[number];

interface IVendor {
  _id: string;
  business?: {
    name: string;
    owner: string;
    address: string;
  };
  revenue?: number;
  status: Status;
}

const formatMonthlyFee = (price: any) => {
  return !price ? 'Free' : `$${price.toFixed(2)}`;
};

export function VendorsHome() {
  const navigate = useNavigate();

  const subscriptions = useAppSelector(state => state.subscription.subscriptions);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [range, setRange] = useState<IRange>(initialRange);
  const [vendors, setVendors] = useState<IVendor[]>([]);

  const columns: ITableColumn[] = [
    {
      title: 'Vendor Name',
      name: 'shopName',
      width: 180,
      cell: (row: any) => (
        <p>{row.business?.name}</p>
      )
    },
    {
      title: 'Shop Owner',
      name: 'owner',
      width: 200,
      cell: (row: any) => (
        <div className={styles.cell}>{row.business?.owner}</div>
      ),
    },
    {
      title: 'Address',
      name: 'address',
      width: 200,
      cell: (row: any) => <div className={styles.cell}>{row.business?.address}</div>,
    },
    {
      title: 'Subscription',
      name: 'subscription',
      width: 150,
      cell: (row: any) => (
        <div className={styles.subscription}>
          {
            getSubscription(row.subscription) && <>
              <p>{getSubscription(row.subscription)?.name}</p>
              <p>{formatMonthlyFee(getSubscription(row.subscription)?.monthInvest)}</p>
            </>
          }
        </div>
      ),
    },
    {
      title: 'Revenue',
      name: 'revenue',
      width: 150,
      cell: (row: any) => <span>${formatNumber(row.revenue || 0)}</span>,
    },
    {
      title: 'Status',
      name: 'status',
      width: 200,
      cell: (row: any) => (
        <Select
          rounded="full"
          value={row.status}
          updateValue={onStatusChange(row._id)}
          options={statusOpts.map(item => ({ name: item, value: item.toLowerCase() }))}
          className={styles.statusSelector}
        />
      ),
    },
    {
      title: 'Action',
      name: 'action',
      width: 250,
      cell: (row: any) => (
        <div className={styles.actionCell}>
          <button
            className={styles.actionButton}
            onClick={() => navigate(row._id)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const getSubscription = (id: string) => {
    const item = subscriptions.find(item => item._id === id);
    return item;
  }

  const loadVendors = ({ filter = '', sort = '', category = '', range = { from: '', to: '' } }: any) => {
    const params: any = {};
    if (filter) params.name = filter;
    if (sort) params.sort = sort;
    if (category) params.status = category;
    if (range.from) params.from = range.from;
    if (range.to) params.to = range.to;
    HttpService.get('/user/vendor/admin', params).then(response => {
      setVendors(response);
    });
  }

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const onRangeChange =
    (which: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setRange({ ...range, [which]: new Date(e.target.value) });
    };

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put(`/user/vendor/${id}`, { status: value }).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Status changed.', { variant: 'success' });
        setVendors(vendors.map(item => item._id === id ? ({ ...item, status: value }) : item));
      }
    })
  }

  const onSubmitClick = () => {
    loadVendors({ filter, sort, category, range });
  }

  const onResetClick = () => {
    setFilter('');
    setSort('');
    setCategory('');
    setRange({ from: '', to: '' });
    loadVendors({});
  }

  useEffect(() => {
    loadVendors({});
  }, []);

  return (
    <Card title="All Vendors" className={styles.root}>
      <TableToolbar
        searchTitle="Search Shop Owner or Vendor Name"
        search={filter}
        updateSearch={onFilterChange}
        rangable={true}
        range={range}
        updateRange={onRangeChange}
        downloadable={true}
        sortable={true}
        sortOpts={sortOpts}
        sort={sort}
        updateSort={(_sort: string) => setSort(_sort)}
        selectTitle="Status"
        selectOpts={statusOpts.map(item => ({ name: item, value: item.toLowerCase() }))}
        category={category}
        updateCategory={(_cat: string) => setCategory(_cat)}
        className={styles.tableToolbar}
        actions={
          <div className={styles.actions}>
            <div>
              <p>Submit</p>
              <button className={clsx(styles.button, styles.submit)} onClick={onSubmitClick}>
                Submit
              </button>
            </div>
            <div>
              <p>Reset</p>
              <button className={clsx(styles.button, styles.reset)} onClick={onResetClick}>
                Reset
              </button>
            </div>
          </div>
        }
      />
      <TableBody
        columns={columns}
        rows={vendors}
        className={styles.tableBody}
      />
    </Card>
  );
}
