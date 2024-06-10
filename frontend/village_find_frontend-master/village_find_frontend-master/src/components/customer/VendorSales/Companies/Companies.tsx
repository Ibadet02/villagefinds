import { Container } from '@/components/layout/customer';

import styles from './Companies.module.scss';

const initialCompanies = [
  {
    text: "Stripe is the world's leading payments gateway that helps our technology build better",
    image: '/assets/customer/logos/stripe.png',
  },
  {
    text: "We've integrated with Shippo to make sure your online business is connected with all major parcel carriers an printing labels is a breeze",
    image: '/assets/customer/logos/shippo.png',
  },
  {
    text: 'Zippykind makes planning delivery routes, managing drivers and fulfilling deliveries as simple as possible',
    image: '/assets/customer/logos/zippy.png',
  },
  {
    text: 'Atlas Studios is a leading marketing agency that helps Village Finds conduct digital marketing for our platform and vendors',
    image: '/assets/customer/logos/atlas.png',
  },
];

export function Companies() {
  return (
    <Container className={styles.root}>
      <div className={styles.container}>
        {initialCompanies.map((company: any, index: number) => (
          <div key={`company-${index}`} className={styles.company}>
            <div className={styles.label}>
              <div className={styles.main}>
                {company.text}
                <span className={styles.picker} />
              </div>
            </div>
            <img src={company.image} />
          </div>
        ))}
      </div>
    </Container>
  );
}
