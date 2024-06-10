import { useEffect } from 'react';

import {
  Business,
  Security,
  SocialMedia,
  Store,
  ShopOpen,
} from '@/components/vendor';

import styles from './ProfileHome.module.scss';
import { useLocation } from 'react-router-dom';

export function ProfileHome() {

  return (
    <div className={styles.root}>
      <Business />
      <Security />
      <SocialMedia />
      <Store />
      <ShopOpen />
    </div>
  );
}
