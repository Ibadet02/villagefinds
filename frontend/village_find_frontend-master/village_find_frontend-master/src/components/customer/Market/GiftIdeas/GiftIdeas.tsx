import { Container } from '@/components/layout/customer';

import styles from './GiftIdeas.module.scss';
import { Button } from '@/components/forms';

const initialGift = {
  title: 'Gyuto Chef Knife',
  price: 80.0,
  totprice: 160.0,
  pound: 1,
  dollarPerCent: 160,
  tags: ['Hand Forged', 'Hand Forged'],
  description:
    'Ready within 2 hours for pickup inside the store We’ll hold orders with for 24 hours. After that your order will be refunded.',
};

export function GiftIdeas() {
  return (
    <Container className={styles.root}>
      <div className={styles.wrapper}>
        <h1>Great gift ideas</h1>
        <div className={styles.container}>
          <div className={styles.image}>
            <img src="/assets/customer/products/product6.png" />
          </div>
          <div className={styles.text}>
            <p className={styles.head}>Gyuto Chef Knife</p>
            <div className={styles.pricing}>
              <p className={styles.price}>${initialGift.price.toFixed(2)}</p>
              <div className={styles.totprice}>
                <span className={styles.totprice}>
                  ${initialGift.totprice.toFixed(2)}
                </span>
                <span className={styles.discount}>
                  {(initialGift.price / initialGift.totprice) * 100}% off
                </span>
              </div>
              <p className={styles.minimum}>
                Minimum {initialGift.pound.toFixed(2)} lb at $
                {initialGift.dollarPerCent.toFixed(2)}/cnt
              </p>
            </div>
            <div className={styles.tags}>
              {initialGift.tags.map((tag: string, index: number) => (
                <span key={`tag-${index}`}>{tag}</span>
              ))}
            </div>
            <p>{initialGift.description}</p>
            <Button className={styles.button}>Shop This Item</Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
