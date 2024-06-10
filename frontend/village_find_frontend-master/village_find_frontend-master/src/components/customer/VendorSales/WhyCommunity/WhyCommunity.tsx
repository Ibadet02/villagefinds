import { useState } from 'react';

import { Container } from '@/components/layout/customer';

import CommunityImage1 from '/assets/customer/vendors/community1.svg';
import CommunityImage2 from '/assets/customer/vendors/community2.svg';
import MoneyImage from '/assets/customer/svgs/money.svg';
import SupportImage from '/assets/customer/svgs/support.svg';
import LookLikeImage from '/assets/customer/sales/looklike.png';
import StoreIcon from '/assets/customer/svgs/store.svg';
import OrganizerIcon from '/assets/customer/svgs/organizer.svg';
import styles from './WhyCommunity.module.scss';

interface ICommunity {
  avatar: string;
  name: string;
  description: string;
}

const initialCommunities: ICommunity[] = [
  {
    avatar: CommunityImage1,
    name: 'The Village Finds Community',
    description:
      'When you start or grow your business with Village Finds, you join a growing community of likeminded individuals using the power of eCommerce to make a difference in their lives through entrepreneurship. This community provides the support you need to get started or take your idea to the next level because they are verified small businesses like yours.',
  },
  {
    avatar: CommunityImage2,
    name: 'The Vendor Community',
    description:
      'We know how easy it is to get lost on a big platform. Sometimes you truly want to create relationships with people who make products like yours to share ideas or to build friendships with people who just get it. Our Vendor Community project, empowers local people to organize vendors and to help build real relationship while helping them connect with customers looking for what they’re selling.',
  },
];

const initialSolutions = [
  {
    title: 'Save Money',
    description:
      'Earn an extra 1% on each transaction. Your transaction fee is reduced from 7% to 6%.',
    image: MoneyImage,
  },
  {
    title: 'Receive Support',
    description:
      'Join a diverse community of like-minded small business owners and grow your on-line presence together.',
    image: SupportImage,
  },
];

const initialStatemenets = [
  {
    title: 'Keep your own store',
    description:
      'When you join a Vendor Community, you will still operate your own store. However, now your products are listed on the community page to reach more customers!',
    image: StoreIcon,
  },
  {
    title: 'Who are the Vendor Organizers?',
    description:
      'Vendor organizers are vetted by the Village Finds team and have a wealth of experience building maker or grower communities. When platforms grow, their vendors can get left behind. We believe our Vendor Community project will keep the local vibe and your needs at the forefront by empowering these organizers to focus on a select few vendors like YOU.',
    image: OrganizerIcon,
  },
];

export function WhyCommunity() {
  const [communities, setCommunities] =
    useState<ICommunity[]>(initialCommunities);

  return (
    <div id="why-community" className={styles.root}>
      <Container className={styles.container}>
        <div className={styles.wrapper}>
          <h1>What is a vendor community?</h1>
          <p>
            Village Finds' new C-commerce initiative empowers local people to
            organize small makers and growers in their communities to help them
            connect with customers looking for what they’re selling.
          </p>
          <div className={styles.ccommerce}>
            <h2>C-Commerce (Community Commerce) </h2>
            <p>
              A group of people sharing a common interest in supporting the
              efforts of growing sales and awareness of each other’s products or
              services in-person and online using a single commerce platform.
            </p>
          </div>
        </div>
        <div className={styles.comwrapper}>
          <img src="/assets/customer/sales/community.png" />
          <div className={styles.comText}>
            <h4>{communities.length} Types of community you can shop</h4>
            <div className={styles.communities}>
              {communities.map((community: ICommunity, index: number) => (
                <div key={`community-${index}`} className={styles.community}>
                  <img src={community.avatar} className={styles.avatar} />
                  <div className={styles.content}>
                    <p className={styles.header}>{community.name}</p>
                    <p>{community.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.expect}>
          <p>You can expect to</p>
          <div className={styles.solutions}>
            {initialSolutions.map((solution: any, index: number) => (
              <div key={`solution-${index}`} className={styles.solution}>
                <img src={solution.image} />
                <div className={styles.text}>
                  <p className={styles.head}>{solution.title}</p>
                  <p>{solution.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.looklike}>
          <p>What a community looks like</p>
          <img src={LookLikeImage} />
        </div>
        <div className={styles.statements}>
          {initialStatemenets.map((statement: any, index: number) => (
            <div key={`statement-${index}`} className={styles.statement}>
              <img src={statement.image} />
              <div className={styles.text}>
                <p className={styles.head}>{statement.title}</p>
                <p className={styles.body}>{statement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
