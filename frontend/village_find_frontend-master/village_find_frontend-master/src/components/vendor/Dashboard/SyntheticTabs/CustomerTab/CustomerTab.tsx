import { CustomerChart } from '@/components/super-admin';

import styles from './CustomerTab.module.scss';

interface ICustomerTabProps {
  count: number;
  data: number[];
}

export function CustomerTab({ count, data }: ICustomerTabProps) {
  return (
    <div className={styles.root}>
      <p>
        New Customers <span>{count}</span>
      </p>
      <CustomerChart customers={data} />
    </div>
  );
}
