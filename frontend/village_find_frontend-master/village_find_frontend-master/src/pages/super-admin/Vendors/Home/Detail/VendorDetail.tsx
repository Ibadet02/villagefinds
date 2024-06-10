import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';

import { Card, Rater, TableBody } from '@/components/common';
import { Input, Select } from '@/components/forms';
import { ClipboardIcon, StarIcon } from '@/components/icons';

import { HttpService } from '@/services';

import { formatDate } from '@/utils';

import { ITableColumn } from '@/interfaces';

import styles from './VendorDetail.module.scss';
import { SERVER_URL } from '@/config/global';

interface IVendor {
  vendorId: number;
  business?: {
    name: string;
    owner: string;
    email: string;
    phone: string;
    address: string;
  };
  community?: {
    name: string;
    images: {
      logoUrl: string;
    }
  };
  subscription?: {
    name: string;
    monthInvest: string;
    expectedFee: number;
  };
  communityStatus?: string;
  commission: string;
  monthlyFee: string;
  signupAt: string;
  status: string;
}

const initialVendor: IVendor = {
  vendorId: 0,
  commission: '',
  monthlyFee: '',
  signupAt: '',
  status: 'inactive'
}

export interface IOrder {
  date: string;
  total: number;
  commission: number;
  status: string;
}

const statusOpts: string[] = ['Active', 'Blocked', 'Paused', 'Inactive'];

const orderColumns: ITableColumn[] = [
  {
    title: 'Order Date',
    name: 'date',
    width: 200,
    cell: (row: IOrder) => <span>{formatDate(new Date(row.date))}</span>,
  },
  {
    title: 'Total Earned',
    name: 'total',
    width: 150,
    cell: (row: IOrder) => <span>${row.total.toFixed(2)}</span>,
  },
  {
    title: 'Commission',
    name: 'commission',
    width: 300,
    cell: (row: IOrder) => <span>${row.commission.toFixed(2)}</span>,
  },
  {
    title: 'Status',
    name: 'status',
    width: 150,
    cell: (row: IOrder) => (
      <p
        className={clsx(
          styles.payStatus,
          row.status === 'Paid' ? styles.paid : styles.unpaid,
        )}
      >
        {row.status}
      </p>
    ),
  },
];

const backToHomePath = '/admin/vendors';

export function VendorDetail() {
  const navigate = useNavigate();
  const { id: vendorId } = useParams();

  const [vendor, setVendor] = useState<IVendor>(initialVendor);
  const [orders, setOrders] = useState<IOrder[]>([]);

  const onBackToHome = () => {
    navigate(backToHomePath);
  };

  useEffect(() => {
    if (!vendorId) return;
    HttpService.get(`/user/vendor/admin/${vendorId}`).then(response => {
      const { status, vendor } = response;
      if (status === 200) {
        setVendor(vendor);
      }
    })
  }, [vendorId]);

  return (
    <div className={styles.root}>
      <button className={styles.backButton} onClick={onBackToHome}>
        Back
      </button>
      <div className={styles.topSection}>
        <Card title={vendor.business?.name}>
          <div className={styles.rateBar}>
            <Rater rating={3.5} />
          </div>
          <p>
            <span>Vendor Id:</span> {vendor.vendorId}
          </p>
          <p>
            <span>Shop Owner</span> - {vendor.business?.owner}
          </p>
        </Card>
        <Card title="Status">
          <Select
            placeholder="Status"
            value={vendor.status}
            options={statusOpts}
            rounded="full"
            className={styles.statusSelector}
          />
        </Card>
        <Card title="Commission">
          <Input
            type="number"
            value={vendor.commission || vendor.subscription?.expectedFee}
            adornment={{
              position: 'left',
              content: '%',
            }}
            rounded="full"
            className={styles.comInput}
          />
        </Card>
        <Card title="Village Community">
          {vendor.community && <div className={styles.communities}>
            <img src={`${SERVER_URL}/${vendor.community.images?.logoUrl}`} />
            <span>{vendor.community.name}</span>
          </div>}
        </Card>
      </div>
      <Card className={styles.vendorSection}>
        <div className={styles.vendorInfo}>
          <h2>Vendor Information</h2>
          <div className={styles.horizon}>
            <p className={styles.label}>Signup Date</p>
            <p>{formatDate(new Date(vendor.signupAt))}</p>
          </div>
          <div className={styles.horizon}>
            <p className={styles.label}>Subscription Type</p>
            <p>{vendor.subscription?.name}</p>
          </div>
          <div className={styles.horizon}>
            <p className={styles.label}>Monthly Fee</p>
            <Input
              type="number"
              rounded="full"
              adornment={{ position: 'left', content: '$' }}
              value={vendor.monthlyFee || vendor.subscription?.monthInvest}
              className={styles.feeInput}
            />
          </div>
          <div className={styles.horizon}>
            <p className={styles.label}>Shop Location</p>
            <Input
              rounded="full"
              bgcolor="secondary"
              adornment={{ position: 'right', content: <ClipboardIcon /> }}
              value={vendor.business?.address}
              className={styles.locationInput}
            />
          </div>
        </div>
        <div className={styles.contactInfo}>
          <h2>Contact Information</h2>
          <div className={styles.horizon}>
            <p className={styles.label}>Shop Owner Name</p>
            <p>{vendor.business?.name}</p>
          </div>
          <div className={styles.horizon}>
            <p className={styles.label}>Email</p>
            <p>{vendor.business?.email}</p>
          </div>
          <div className={styles.horizon}>
            <p className={styles.label}>Phone Number</p>
            <p>{vendor.business?.phone}</p>
          </div>
        </div>
      </Card>
      <Card title="Orders" className={styles.orderSection}>
        <TableBody columns={orderColumns} rows={orders} />
      </Card>
    </div>
  );
}
