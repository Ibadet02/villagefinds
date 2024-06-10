import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6';
import clsx from 'clsx';

import { Container } from '@/components/layout/customer';

import { useWindowWidth } from '@/utils';

import { HttpService } from '@/services';

import styles from './Footer.module.scss';

interface IFooterData {
  facebook: string;
  youtube: string;
  linkedin: string;
  instagram: string;
  phone: string;
  email: string;
}

const initialData = {
  facebook: '',
  youtube: '',
  linkedin: '',
  instagram: '',
  phone: '',
  email: '',
};

const initialShopNavItems = [
  {
    title: 'Vendor Communities',
    path: '/communities',
  },
  {
    title: 'Makers & More',
    path: '/communities',
  },
  {
    title: 'Local Vendors',
    path: '/communities',
  },
  {
    title: 'Subscriptions',
    path: '/subscription',
  },
];

const initialVendorNavItems = [
  {
    title: 'Sell',
    path: '/sell',
  },
  {
    title: 'Vendor Sign up',
    path: '/sign-up/vendor',
  },
  {
    title: 'Vendor Sign in',
    path: '/login/vendor',
  },
];

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [_, breakpoint] = useWindowWidth();
  const [contact, setContact] = useState<IFooterData>(initialData);

  const screenBlackLists = ['/login/customer', '/login/vendor'];
  const minBreakLists = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];

  const onNavItemClick = (e: any, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  useEffect(() => {
    HttpService.get('/settings/marketplace/footer').then(response => {
      const result = response ?? initialData;
      setContact(result);
    });
  }, []);

  return (
    <div
      className={clsx(
        styles.root,
        screenBlackLists.includes(pathname) &&
          minBreakLists.includes(breakpoint as string)
          ? 'hidden'
          : '',
      )}
    >
      <Container className={styles.container}>
        <div className={styles.section}>
          <h4>Shop</h4>
          {initialShopNavItems.map(
            (item: { title: string; path: string }, index: number) => (
              <a
                key={index}
                href={item.path}
                onClick={e => onNavItemClick(e, item.path)}
              >
                {item.title}
              </a>
            ),
          )}
        </div>
        <div className={styles.section}>
          <h4>For Vendors</h4>
          {initialVendorNavItems.map(
            (item: { title: string; path: string }, index: number) => (
              <a
                key={index}
                href={item.path}
                onClick={e => onNavItemClick(e, item.path)}
              >
                {item.title}
              </a>
            ),
          )}
        </div>
        <div className={clsx(styles.section, styles.about)}>
          <h4>About</h4>
          <a href="/about" onClick={e => onNavItemClick(e, '/about')}>
            Our Story
          </a>
        </div>
        <div className={styles.section}>
          <h4>Contact</h4>
          <p>{contact.phone}</p>
          <p>{contact.email}</p>
          <div className={styles.socials}>
            <a href={contact.facebook} target="_blank">
              <FaFacebookF fill="#84A98C" />
            </a>
            <a href={contact.instagram} target="_blank">
              <FaInstagram fill="#84A98C" />
            </a>
            <a href={contact.youtube} target="_blank">
              <FaYoutube fill="#84A98C" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
