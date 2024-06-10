import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import clsx from 'clsx';

import { Container } from '@/components/layout/customer/Container';

import { CategoryContext } from '@/providers';

import styles from './Navbar.module.scss';

interface INavItem {
  title: string;
  path: string;
  isemphasize?: boolean;
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;

  const { isCategoryBar, setCategoryBar } = useContext(CategoryContext);

  const navItems: INavItem[] = [
    {
      title: 'Vendor Communities',
      path: '/communities',
    },
    {
      title: 'Subscriptions',
      path: '/market?type=subscription',
    },
    {
      title: 'About',
      path: '/about',
    },
    {
      title: 'Sell',
      path: '/sell',
      isemphasize: true,
    },
  ];

  const onCatClick = () => {
    setCategoryBar(!isCategoryBar);
  };

  return (
    <div className={styles.root}>
      <Container className={styles.container}>
        <ul className={styles.navbar}>
          <li>
            <div onClick={onCatClick}>
              Categories {isCategoryBar ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </li>
          {navItems.map((navItem: INavItem) => (
            <li
              key={navItem.title}
              className={clsx({
                [styles.active]: navItem.path === `${pathname}${search}`,
                [styles.emphasize]: navItem.isemphasize,
              })}
              onClick={() => navigate(navItem.path)}
            >
              {navItem.title}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
