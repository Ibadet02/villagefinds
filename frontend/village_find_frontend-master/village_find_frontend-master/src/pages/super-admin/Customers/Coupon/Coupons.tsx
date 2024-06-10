import { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, TableToolbar, TableBody } from '@/components/common';
import { Select } from '@/components/forms';
import { TrashIcon } from '@/components/icons';
import { HttpService } from '@/services';
import { ITableColumn } from '@/interfaces';

import styles from './Coupons.module.scss';

export interface ICoupon {
  _id?: string;
  name: string;
  type: string;
  shipping?: {
    mode: string;
    code?: string;
    amount?: number;
  };
  percent?: {
    code: string;
    discount: number;
  };
  conditions?: {
    minimum: number;
    maximum: number;
    discount: number;
  }[];
  target: {
    mode: string;
    id?: string;
  };
  startDate: string;
  endDate: string;
  status: string;
}

export interface ICouponType {
  name: string;
  value: string;
}

const COUPON_PATH = '/admin/customers/coupon';

const statusOpts: string[] = ['Active', 'Inactive'];

export const couponTypes: ICouponType[] = [
  {
    name: 'Free Shipping',
    value: 'freeshipping'
  },
  {
    name: 'Percent',
    value: 'percent'
  },
  {
    name: 'Tiered',
    value: 'tiered'
  }
];

const getCouponName = (value: string) => {
  const couponType = couponTypes.find(item => item.value === value);
  return couponType?.name ?? '';
}

export function Coupons() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [coupons, setCoupons] = useState<ICoupon[]>([]);

  const columns: ITableColumn[] = [
    {
      title: 'Coupon Name',
      name: 'code',
      width: 250,
      cell: (row: any) => (
        <div>{row.name}</div>
      ),
    },
    {
      title: 'Type',
      name: 'type',
      width: 250,
      cell: (row: any) => (
        <p>{getCouponName(row.type)}</p>
      )
    },
    {
      title: 'Status',
      name: 'status',
      width: 250,
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
      title: 'Discount',
      name: 'discount',
      width: 250,
      cell: (row: any) => <div>{row.type === 'percent' && `${row.percent.discount}%`}</div>,
    },
    {
      title: 'Action',
      name: 'action',
      width: 250,
      cell: (row: any) => (
        <div className={styles.actionCell}>
          <button
            className={styles.actionButton}
            onClick={() => navigate(`${COUPON_PATH}/${row._id}`)}
          >
            Edit
          </button>
          <span onClick={onDeleteClick(row._id)}>
            <TrashIcon />
          </span>
        </div>
      ),
    },
  ];

  const updateFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const updateStatus = (_category: string) => {
    setCategory(_category);
  };

  const onDeleteClick = (id: string) => () => {
    HttpService.delete(`/coupons/${id}`).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Coupon deleted.', { variant: 'success' });
        setCoupons(coupons.filter(item => item._id !== id));
      }
    })
  };

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put(`/coupons/${id}`, { status: value }).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Status changed.', { variant: 'success' });
        setCoupons(coupons.map(item => item._id === id ? ({ ...item, status: value }) : item));
      }
    })
  }

  useEffect(() => {
    const params: any = {};
    if (filter) params.name = filter;
    if (category) params.status = category;
    HttpService.get('/coupons', params).then(response => {
      setCoupons(response);
    });
  }, [filter, category]);

  return (
    <Card title="Coupon Center" className={styles.root}>
      <TableToolbar
        search={filter}
        updateSearch={updateFilter}
        searchTitle="Coupon Name"
        category={category}
        updateCategory={updateStatus}
        selectTitle="Status"
        selectOpts={statusOpts.map(item => ({ name: item, value: item.toLowerCase() }))}
        className={styles.tableToolbar}
        actions={
          <div>
            <p className={styles.buttonLabel}>New</p>
            <button
              className={styles.actionButton}
              onClick={() => navigate(`${COUPON_PATH}/create`)}
            >
              New
            </button>
          </div>
        }
      />
      <TableBody
        columns={columns}
        rows={coupons}
        className={styles.tableBody}
      />
    </Card>
  );
}
