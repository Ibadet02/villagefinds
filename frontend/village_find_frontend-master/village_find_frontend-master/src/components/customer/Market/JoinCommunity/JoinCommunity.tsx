import { Container } from '@/components/layout/customer';

import styles from './JoinCommunity.module.scss';
import { Button } from '@/components/forms';

const initialCommunities = [
  {
    image: '/assets/customer/backs/linkImage2.png',
    title: 'Great Gifts for Mom',
  },
  {
    image: '/assets/customer/backs/vendortype3.png',
    title: 'What Are Your Wearing?',
  },
  {
    image: '/assets/customer/backs/linkImage2.png',
    title: '2024 Trends',
  },
];

export function JoinCommunity() {
  return (
    <Container className={styles.root}>
      <h1>Join the Community</h1>
      <div className={styles.communities}>
        {initialCommunities.map((community: any, index: number) => (
          <div key={`community-${index}`} className={styles.community}>
            <div className={styles.image}>
              <img src={community.image} />
            </div>
            <p className={styles.title}>{community.title}</p>
          </div>
        ))}
      </div>
      <div className={styles.btnWrapper}>
        <Button className={styles.moreButton}>More On YouTube</Button>
      </div>
    </Container>
  );
}
