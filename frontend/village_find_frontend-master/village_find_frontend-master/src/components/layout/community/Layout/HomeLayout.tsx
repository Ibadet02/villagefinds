import { useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { AuthContext } from '@/providers';

import { SERVER_URL } from '@/config/global';

import styles from './HomeLayout.module.scss';

const initialNavItems = [
  {
    name: 'Dashboard',
    path: 'dashboard',
  },
  {
    name: 'Your Profile',
    path: 'profile',
  },
  {
    name: 'Your Earnings',
    path: 'earning',
  },
  {
    name: 'Announcement',
    path: 'announcement',
  },
  {
    name: 'Events',
    path: 'events',
  },
];

export function HomeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { account } = useContext(AuthContext);

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img
            src={`${SERVER_URL}/${
              account &&
              account.profile &&
              account.profile.images &&
              account.profile.images.logoUrl
            }
              `}
          />
          <p>{account && account.profile && account.profile.name}</p>
        </div>
        <ul className={styles.navbar}>
          {initialNavItems.map((item: any, index: number) => (
            <li
              key={index}
              className={clsx(styles.navitem, {
                [styles.active]: pathname.endsWith(item.path),
              })}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
