import { Container } from '@/components/layout/customer';
import {
  ArrowIcon,
  CartIcon,
  MagnifierIcon,
  ZipCodeIcon,
} from '@/components/icons';

import { SERVER_URL } from '@/config/global';

import styles from './HowItWorks.module.scss';

export interface IHowItWorksProps {
  title: string;
  images: string[];
}

export const initialHowData = {
  title: 'How It Works',
  images: ['assets/customer/backs/howto.png'],
};

export function HowItWorks({ title, images }: IHowItWorksProps) {
  return (
    <div className={styles.root}>
      <div className={styles.image}>
        <img src={`${SERVER_URL}/${images[0]}`} className={styles.topicImage} />
        <h1>{title}</h1>
      </div>
      <Container className={styles.container}>
        <div className={styles.step}>
          <ZipCodeIcon className={styles.icon} />
          <p>Enter Zipcode</p>
        </div>
        <span>
          <ArrowIcon className={styles.icon} />
        </span>
        <div className={styles.step}>
          <MagnifierIcon className={styles.icon} />
          <p>Find Vendors</p>
        </div>
        <span>
          <ArrowIcon className={styles.icon} />
        </span>
        <div className={styles.step}>
          <CartIcon color="pink" className={styles.icon} />
          <p>Shop Products</p>
        </div>
      </Container>
    </div>
  );
}
