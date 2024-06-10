import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Card, TableBody, TableToolbar } from '@/components';
import { Select, Input } from '@/components/forms';
import { PrintIcon } from '@/components/icons';
import { IRange, ITableColumn } from '@/interfaces';
import { HttpService } from '@/services';

import { formatNumber } from '@/utils';

import styles from './OrderHome.module.scss';

const sortOpts = [
  { name: 'Home Delivery Only', value: 'home-delivery' },
  { name: 'Shipping Only', value: 'shipping' },
  { name: 'Pickup Only', value: 'pickup' },
  { name: 'Safe Pickup Only', value: 'safe-pickup' },
  { name: 'Subscriptions Only', value: 'subscription' },
  { name: 'Alphabetical', value: 'alphabeta' },
]
const statusOpts = ['Pending', 'Under Process', 'Dispatched', 'Shipped', 'Delivered', 'Canceled', 'Pause'];

const initialRange = {
  from: '',
  to: '',
};

export interface IVendorOrder {
  _id: string;
  customer: {
    name: string;
  };
  vendor: {
    business: {
      name: string;
    }
  };
  deliveryType: string;
  deliveryInfo: {
    classification: string;
  };
  product: {
    price: number;
    quantity: number;
    discount: number;
  };
  status: string;
  orderDate: string;
}

const statusList = [
  {
    title: 'Pending',
    name: 'pending',
    color: 'success',
  },
  {
    title: 'Under Process',
    name: 'under process',
    color: 'blue',
  },
  {
    title: 'Pause',
    name: 'pause',
    color: 'primary',
  },
  {
    title: 'Canceled',
    name: 'canceled',
    color: 'red',
  },
  {
    title: 'Complete',
    name: 'complete',
    color: 'light',
  },
];

export function OrderHome() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [range, setRange] = useState<IRange>(initialRange);
  const [tableData, setTableData] = useState<IVendorOrder[]>([]);

  const loadOrders = ({ filter = '', sort = '', category = '', range = { from: '', to: '' } }: any = {}) => {
    const params: any = {};
    if (filter) params.name = filter;
    if (sort) params.sort = sort;
    if (category) params.status = category;
    if (range.from) params.from = range.from;
    if (range.to) params.to = range.to;
    HttpService.get('/order/admin', params).then(response => {
      setTableData(response);
    });
  }

  const columns: ITableColumn[] = [
    {
      title: 'Customer Name',
      name: 'customer',
      width: 200,
      cell: (row: IVendorOrder) => (
        <span className={styles.cell}>
          {row.customer.name}
        </span>
      ),
    },
    {
      title: 'Vendor',
      name: 'vendor',
      width: 150,
      cell: (row: IVendorOrder) => (
        <span className={styles.cell}>{row.vendor.business.name}</span>
      ),
    },
    {
      title: 'Fulfillment Type',
      name: 'fulfillment',
      width: 200,
      cell: (row: IVendorOrder) => (
        <span className={styles.cell}>{row.deliveryType}</span>
      ),
    },
    {
      title: 'Order Date',
      name: 'date',
      width: 200,
      cell: (row: IVendorOrder) => (
        <Input
          type="date"
          value={row.orderDate.split('T')[0]}
          rounded="full"
          bgcolor="secondary"
        />
      ),
    },
    {
      title: 'Order Total',
      name: 'total',
      width: 150,
      cell: (row: IVendorOrder) => (
        <span>
          $
          {formatNumber(
            (row.product.price *
              row.product.quantity *
              (100 - row.product.discount)) /
            100,
          )}
        </span>
      ),
    },
    {
      title: 'Status',
      name: 'status',
      width: 200,
      cell: (row: IVendorOrder) => (
        <Select
          rounded="full"
          border="none"
          bgcolor={
            row.status === 'under process'
              ? 'blue'
              : row.status === 'canceled'
                ? 'red'
                : row.status === 'pause'
                  ? 'primary'
                  : 'white'
          }
          value={row.status}
          updateValue={onStatusChange(row._id)}
          options={statusList.map(item => ({
            ...item,
            name: item.title,
            value: item.name,
          }))}
          className={styles.statusSelector}
        />
      ),
    },
    {
      title: 'Action',
      name: 'action',
      width: 250,
      cell: (row: IVendorOrder) => (
        <div className={styles.actionCell}>
          <button
            className={styles.actionButton}
            onClick={() => navigate(row._id)}
          >
            View
          </button>
          <PrintIcon />
        </div>
      ),
    },
  ];

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const onRangeChange =
    (which: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setRange({ ...range, [which]: e.target.value });
    };

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put(`/order/admin/${id}`, { status: value }).then(response => {
      const { status } = response;
      if (status === 200) {
        setTableData(
          tableData.map((item: IVendorOrder) =>
            item._id === id ? { ...item, status: value } : item,
          ),
        );
        enqueueSnackbar('Status changed.', { variant: 'success' });
      }
    });
  };

  const onSubmitClick = () => {
    loadOrders({ filter, category, sort, range });
  }

  const onResetClick = () => {
    setFilter('');
    setCategory('');
    setSort('');
    setRange({ from: '', to: '' });
    loadOrders({});
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <Card title="All Orders" className={styles.root}>
      <TableToolbar
        searchTitle="Search Customer Name"
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
        rows={tableData}
        className={styles.tableBody}
      />
    </Card>
  );
}
