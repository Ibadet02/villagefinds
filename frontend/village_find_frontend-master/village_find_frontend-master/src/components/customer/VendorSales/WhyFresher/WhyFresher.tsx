import { Container } from '@/components/layout/customer';

import styles from './WhyFresher.module.scss';

const initialReasons = [
  {
    title: 'Join a supportive community',
    description:
      'Whether you join a Vendor Community or go out valiantly on your own, Village Finds provides real human support for you and your business. Call, email or text and hear from a real team member and not a chat bot and best of all, no tickets.',
  },
  {
    title: 'Organic Growth',
    description:
      'When you launch your online store, your items are discovered on the Village Finds marketplace. When each vendor brings new customers to the platform, those customers have and opportunity to see your fantastic products as well!',
  },
  {
    title: 'Get Hands-on SEO Support',
    description:
      "Village Finds' team of marketing professionals will help you better understand how to harness SEO and social presence to grow visibility for your products.",
  },
  {
    title: 'Professional Business Support',
    description:
      'The Village Finds team has professionals on staff that can offer free business consultations to help you think about your next business move or to answer those tough questions.',
  },
  {
    title: 'Control your own shipping platform connection',
    description:
      'Save money on shipping and enjoy fully transparent shipping costs by managing your own shipping dashboard.',
  },
  {
    title: 'Keeping your existing website',
    description:
      'Connect your existing website with your Village Finds store easily by adding a simple show now button on your website.',
  },
  {
    title: 'Advanced Search Capabilities',
    description:
      'Village Finds is uniquely set up to highlight both your fully branded store and the products you offer. Customers find your business more easily on our platform by using your direct store link, searching your business’s name or the items you carry.',
  },
];

export function WhyFresher() {
  return (
    <div id="why-village-finds" className={styles.root}>
      <div className={styles.back}>
        <Container className={styles.container}>
          <h1>Why Village Finds?</h1>
        </Container>
      </div>
      <Container className={styles.reasons}>
        {initialReasons.map((reason: any, index: number) => (
          <div key={`reason-${index}`} className={styles.reason}>
            <p className={styles.head}>{reason.title}</p>
            <p>{reason.description}</p>
          </div>
        ))}
      </Container>
      <div className={styles.simpleTech}>
        <Container className={styles.container}>
          <h1>Simple tech meets people</h1>
          <p>
            Your small business needs simple tools to grow your online sales
            efficiently. Village Finds' powerfully simple on-line stores connect
            your growing business to your customers with the support of a
            dedicated community. For Village Finds, community isn’t a buzzword;
            it’s baked into every aspect of what we do.
          </p>

          <div className={styles.images}>
            <div className={styles.text}>
              <p>No Code</p>
              <p>No Headaches</p>
            </div>
            <img
              src="/assets/customer/sales/tech1.png"
              className={styles.image1}
            />
            <img
              src="/assets/customer/sales/tech2.png"
              className={styles.image2}
            />
            <img
              src="/assets/customer/sales/tech3.png"
              className={styles.image3}
            />
          </div>
        </Container>
      </div>
    </div>
  );
}
