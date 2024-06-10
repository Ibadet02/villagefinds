import { Container } from '@/components/layout/customer';

import styles from './WhoWork.module.scss';

const initialWorkers = [
  {
    title: 'Artisan Makers',
    description:
      'Connect with new customers across the country who are already shopping local and looking for something high quality and unique! Ship your products nationally with a powerful online shipping experience.',
  },
  {
    title: 'Farmers',
    description:
      "Help new and existing local customers find your farm and allow them to reserve items for pickup or offer delivery to their home or pickup location. Customers are looking for online shipping. It's time to give them what they want!",
  },
  {
    title: 'Farm Box Subscriptions',
    description:
      'Offer your CSA subscribers multiple subscription options such as pay up front or as they go. Manage orders super easy with our customer management tools.',
  },
];

export function WhoWork() {
  return (
    <div className={styles.root}>
      <Container className={styles.container}>
        <div className={styles.text}>
          <div className={styles.head}>
            <h1>Who we work with</h1>
            <div className={styles.list}>
              <span className={styles.rect} />
              <span className={styles.circle} />
              <span className={styles.tri} />
              <span className={styles.squ} />
            </div>
          </div>
          <div className={styles.workers}>
            {initialWorkers.map((worker: any, index: number) => (
              <div key={`worker-${index}`} className={styles.worker}>
                <p className={styles.head}>{worker.title}</p>
                <p className={styles.body}>{worker.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.images}>
          <img src="/assets/customer/backs/vendortype1.png" />
          <img src="/assets/customer/backs/vendortype2.png" />
          <img src="/assets/customer/backs/vendortype4.png" />
        </div>
      </Container>
    </div>
  );
}
