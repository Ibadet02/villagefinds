import { Link, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import styles from './SettingsLayout.module.scss';

export interface IRightNavItem {
  title: string;
  path: string;
}

export const rightNavItems = [
  {
    title: 'Home Slider',
    path: '/',
  },
  {
    title: 'How It Works',
    path: '/how',
  },
  {
    title: 'Shop Intentionally',
    path: '/shop',
  },
  {
    title: 'Vendor Community Images',
    path: '/v-com',
  },
  {
    title: 'Ready To Shop Images',
    path: '/ready-to-shop',
  },
];

export const homePagePath = '/admin/settings/market/home-page';

export function SettingsLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Outlet />
      </div>
      <div
        className={
          pathname.includes('/home-page')
            ? styles.rightNavbar
            : clsx(styles.rightNavbar, styles.emptyNavbar)
        }
      >
        {pathname.includes('/home-page') &&
          rightNavItems.map((item: IRightNavItem) => (
            <Link key={item.path} to={`${homePagePath}${item.path}`}>
              <p
                className={
                  pathname === `${homePagePath}${item.path}`
                    ? styles.activeNavItem
                    : ''
                }
              >
                {item.title}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
}
