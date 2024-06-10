import { Outlet } from 'react-router-dom';

import { Header } from '..';

import styles from './AuthLayout.module.scss';

export function AuthLayout() {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
