import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Card } from '@/components/common';
import { CustomerChart } from '@/components/super-admin';
import { formatNumber } from '@/utils';

import styles from './Dashboard.module.scss';

const summary = {
  year: 0,
  month: 0,
  week: 0,
};

const total = {
  transaction: 0,
  averageOrder: 0,
};

const weekVisitInfo = {
  brandCount: 0,
  data: [0, 0, 0, 0, 0, 0, 0],
};

const statistics = {
  vendor: 0,
  customer: 0,
  product: 0,
};

const VENDOR_PATH = '/admin/vendors';
const CUSTOMER_PATH = '/admin/customers/home';
const SUPPORT_PATH = '/admin/support-center';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.navCards}>
        <Card className={styles.textCenter} onClick={() => navigate(VENDOR_PATH)}>
          <p>All Vendors</p>
        </Card>
        <Card className={styles.textCenter} onClick={() => navigate(CUSTOMER_PATH)}>
          <p>Customer Management</p>
        </Card>
        <Card className={styles.textCenter} onClick={() => navigate('')}>
          <p>Support Center</p>
        </Card>
        {/* <Card className={styles.textCenter}>
          <p>Support Center</p>
        </Card> */}
      </div>
      <div className={styles.summaryPanel}>
        <Card title="Sales" className={styles.sales}>
          <div className={styles.rows}>
            <div className={styles.row}>
              <p>Year to date</p>
              <p className={styles.price}>${formatNumber(summary.year)}</p>
            </div>
            <div className={styles.row}>
              <p>This month</p>
              <p className={styles.price}>${formatNumber(summary.month)}</p>
            </div>
            <div className={styles.row}>
              <p>This week</p>
              <p className={styles.price}>${formatNumber(summary.week)}</p>
            </div>
            <div className={styles.divider} />
            <div className={styles.row}>
              <p>Transactions</p>
              <p>Average Order</p>
            </div>
            <div className={clsx(styles.row, styles.totalRow)}>
              <p>{formatNumber(total.transaction)}</p>
              <p>${formatNumber(total.averageOrder)}</p>
            </div>
          </div>
        </Card>
        <Card
          title={
            <div className={styles.customerTitle}>
              <div className={styles.row}>
                <p>Customers</p>
                <span>Revenue</span>
              </div>
              <div className={styles.weekButton}>Week</div>
            </div>
          }
          className={styles.customers}
        >
          <p>
            New Customers
            <span className={styles.newCustomer}>
              {formatNumber(weekVisitInfo.brandCount)}
            </span>
          </p>
          <CustomerChart customers={weekVisitInfo.data} />
        </Card>
      </div>
      <div className={styles.statisPanel}>
        <Card>
          <div className={styles.row}>
            <p>Active Vendors</p>
            <p>{formatNumber(statistics.vendor)}</p>
          </div>
        </Card>
        <Card>
          <div className={styles.row}>
            <p>Customers</p>
            <p>{formatNumber(statistics.customer)}</p>
          </div>
        </Card>
        <Card>
          <div className={styles.row}>
            <p>Products</p>
            <p>{formatNumber(statistics.product)}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
