import { Container } from '@/components/layout/customer';

import ShopVComImage from '/assets/customer/backs/shopvcom.png';
import styles from './VCommunities.module.scss';
import { useContext, useEffect, useState } from 'react';
import { HttpService } from '@/services';
import { Link, useNavigate } from 'react-router-dom';
import { CategoryContext } from '@/providers';

const initialCommunities = [
  {
    name: 'Field Of Artisans',
    detail: 'Over 600 artisans making unique one-of-a-kind items.',
    category: 'Wood Working',
    image: ShopVComImage,
  },
  {
    name: 'Field Of Artisans',
    detail: 'Over 600 artisans making unique one-of-a-kind items.',
    category: 'Wood Working',
    image: ShopVComImage,
  },
  {
    name: 'Field Of Artisans',
    detail: 'Over 600 artisans making unique one-of-a-kind items.',
    category: 'Wood Working',
    image: ShopVComImage,
  },
  {
    name: 'Field Of Artisans',
    detail: 'Over 600 artisans making unique one-of-a-kind items.',
    category: 'Wood Working',
    image: ShopVComImage,
  },
];

interface ICommunity {
  name: string;
  slug: string;
  images: {
    logoUrl: string;
    backgroundUrl: string;
  };
  shortDesc: string;
  categories: string[];
}

export function VCommunities() {
  const navigate = useNavigate();
  const { categories } = useContext(CategoryContext);
  const [communities, setCommunities] = useState<ICommunity[]>([]);

  useEffect(() => {
    HttpService.get('/communities').then(response => {
      setCommunities(response || []);
    });
  }, []);

  return (
    <Container className={styles.root}>
      <div className={styles.head}>
        <h1>Vendor Communities</h1>
        <p>
          Village Finds' new Vendor Communities initiative empowers local people
          to organize small makers and growers in their communities to help them
          connect with people like you looking for what they’re selling.
        </p>
      </div>
      <div className={styles.container}>
        <p className={styles.title}>Shop Vendor Communities</p>
        <div className={styles.communities}>
          {communities.map((community: ICommunity, index: number) => (
            <div
              key={`shop-v-com-${index}`}
              className={styles.shopvcom}
              onClick={() => navigate(`/communities/${community.slug}`)}
            >
              <img src={community.images?.logoUrl} />
              <div className={styles.vcomText}>
                <p className={styles.name}>{community.name}</p>
                <span className={styles.detail}>{community.shortDesc}</span>
                <p className={styles.catLabel}>Category</p>
                {categories
                  .filter(item =>
                    community.categories.includes(item.name.toLowerCase()),
                  )
                  .map((item: any, index: number) => (
                    <span key={index} className={styles.category}>
                      {item.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
