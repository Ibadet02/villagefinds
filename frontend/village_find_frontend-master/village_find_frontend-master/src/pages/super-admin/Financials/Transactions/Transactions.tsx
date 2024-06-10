import React from 'react';

import { Dashboard, CustomerHome } from '@/pages/super-admin';

import styles from './Transactions.module.scss';

export function Transactions() {
  return (
    <div className={styles.root}>
      <Dashboard />
      <CustomerHome />
    </div>
  );
}
