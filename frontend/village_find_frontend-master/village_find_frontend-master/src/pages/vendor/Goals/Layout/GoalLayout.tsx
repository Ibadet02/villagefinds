import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import styles from './GoalLayout.module.scss';

interface INavItem {
  title: string;
  path: string;
}

const pathPrefix = '/vendor/goals';

const navItems: INavItem[] = [
  {
    title: 'Goals',
    path: '',
  },
  {
    title: 'Rewards',
    path: '/reward',
  },
];

export function GoalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <ul className={styles.rightBar}>
        {navItems.map((navItem: INavItem) => (
          <li
            key={navItem.title}
            className={clsx(
              styles.navItem,
              pathname === `${pathPrefix}${navItem.path}`
                ? styles.activeItem
                : '',
            )}
            onClick={() => navigate(`${pathPrefix}${navItem.path}`)}
          >
            {navItem.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
