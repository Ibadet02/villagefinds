import { Container } from '@/components/layout/customer';

import styles from './ShopIntention.module.scss';
import { SERVER_URL } from '@/config/global';

const initialTexts = [
  {
    header: '1 . Only true makers & growers live here',
    content:
      "We believe that if a marketplace says it's for small batch makers and growers, it should honor that mission. At Village Finds we vet all of our vendors to make sure they are truly small businesses. Small business shouldn't have to compete with big business.",
  },
  {
    header: '2 . Focused on community',
    content:
      'Village Finds is focused on small business development. To do this on a large scale and keep true to our mission, we created the Vendor Community. These communities are led by local people to ensure vendors have the support they need to thrive and to have a real person they can know and trust on their side.',
  },
  {
    header: '3 . Supporting woman founders',
    content:
      'It is one of our core purposes to support the many woman founders creating and growing high quality creative products.',
  },
  {
    header: '4 . Many ways to shop',
    content:
      "Whether you're shopping for artisan maker goods or finding local farmers in your area, Village Finds' unique marketplace helps you find that perfect item for your home, office or dinner table.",
  },
  {
    header: '5 . Impact local economies',
    content:
      'For every dollar spent on local and small businesses, .67 on average gets put back into the local economy. Your dollar goes so much farther with Village Finds.',
  },
];

export interface IShopIntentionProps {
  title: string;
  subtitle: string;
  bodyText: {
    header: string;
    content: string;
  }[];
  images: string[];
}

export const initialShopIntention = {
  title: 'Shop Intentionally',
  subtitle: 'Your reasons to shop with Village Finds',
  bodyText: initialTexts,
  images: [
    'assets/customer/backs/shop.png',
    'assets/customer/backs/intention.png',
  ],
};

export function ShopIntention({
  title,
  subtitle,
  bodyText,
  images,
}: IShopIntentionProps) {
  return (
    <div className={styles.root}>
      <img src={`${SERVER_URL}/${images[0]}`} className={styles.shopImage} />
      <Container className={styles.intention}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className={styles.reason}>
          <div className={styles.orders}>
            {bodyText.map((item: any, index: number) => (
              <div key={`text-${index}`} className={styles.order}>
                <h5>{item.header}</h5>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
          <img src={`${SERVER_URL}/${images[1]}`} />
        </div>
      </Container>
    </div>
  );
}
