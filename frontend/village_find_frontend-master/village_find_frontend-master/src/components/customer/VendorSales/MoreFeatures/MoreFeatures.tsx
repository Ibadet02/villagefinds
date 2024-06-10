import { Container } from '@/components/layout/customer';

import styles from './MoreFeatures.module.scss';

const initialFeatures1 = [
  {
    title: 'Set Your Own Prices',
    description:
      'We know certain markets can command different price-points. Set a different price per-market you are affiliated so you don’t miss out on potential revenue.',
  },
  {
    title: 'Item Marketing Tags',
    description:
      'Tag your items based on health and growing practices for easy search and identification.',
  },
  {
    title: 'Item Sharing',
    description:
      'Share individual items to social media for digital marketing.',
  },
  {
    title: 'Manage Inventory',
    description: 'Manage all of your item’s inventory in one location.',
  },
  {
    title: 'Financial Data',
    description:
      'All of your sale and financial data in one location so you can know where your are, where you were and where you’re going financially as a business.',
  },
  {
    title: 'Order Management',
    description: 'Manage all of your orders in one location.',
  },
  {
    title: 'Extremely Fast website load times',
    description:
      'Update the weight of each order total so you don’t lose revenue.',
  },
];

const initialFeatures2 = [
  {
    title: 'Delivery Options',
    description:
      'Offer home delivery, site delivery, or pickup multiple days per week.',
  },
  {
    title: 'Mobile',
    description:
      'Mobile interface allows you to see orders right in the field.',
  },
  {
    title: 'Automatic Order Reminders',
    description:
      'Automatic reminders are sent to customers to finish checkout or when orders are complete.',
  },
  {
    title: 'Advanced Search Capabilities',
    description:
      'Village Finds is uniquely set up to highlight both your fully branded store and the products you offer. Customers find your business more easily on our platform by using your direct store link, searching your business’s name or the items you carry.',
  },
  {
    title: 'Product Analytics',
    description: 'See which items are most popular at a glance.',
  },
  {
    title: 'Order Filters',
    description:
      'Filter orders for easy packing, harvesting, by vendor. See future orders and promote them to current or change current orders to future.',
  },
];

export function MoreFeatures() {
  return (
    <Container className={styles.root}>
      <h1>More great features</h1>
      <div className={styles.container}>
        <div className={styles.featureColumn}>
          {initialFeatures1.map((feature: any, index: number) => (
            <div key={`feature1-${index}`} className={styles.feature}>
              <p className={styles.head}>{feature.title}</p>
              <p className={styles.body}>{feature.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.featureColumn}>
          {initialFeatures2.map((feature: any, index: number) => (
            <div key={`feature1-${index}`} className={styles.feature}>
              <p className={styles.head}>{feature.title}</p>
              <p className={styles.body}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
