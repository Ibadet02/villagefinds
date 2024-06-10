import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';

import { Input, Select } from '@/components/forms';
import { Container } from '@/components/layout/customer';
import { VComCard } from '@/components/customer/common';
import { CategoryContext } from '@/providers';
import { HttpService } from '@/services';

import styles from './Home.module.scss';

interface ICommunity {
  vcomId: string;
  backImage: string;
  logoImage: string;
  title: string;
  description: string;
  vendors: number;
  categories: string[];
}

export function Home() {
  const [searchParams] = useSearchParams();
  const { categories } = useContext(CategoryContext);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState<string>('');
  const [communities, setCommunities] = useState<ICommunity[]>([]);

  const onCategoryChange = (value: string) => {
    setCategory(value);
  };

  useEffect(() => {
    const category = searchParams.get('category') || '';
    setCategory(category);
  }, [searchParams]);

  useEffect(() => {
    HttpService.get(`/communities`, {
      name: filter,
      category,
    }).then(response => {
      const result = (response ?? []).map((community: any) => ({
        vcomId: community.slug,
        backImage: community.images && community.images.backgroundUrl,
        logoImage: community.images && community.images.logoUrl,
        title: community.name,
        description: community.shortDesc,
        vendors: community.vendors,
        categories: community.categories,
      }));
      setCommunities(result);
    });
  }, [filter, category]);

  return (
    <Container className={styles.root}>
      <div className={styles.dashboard}>
        <h2>Vendor Communities</h2>
      </div>
      <div className={styles.container}>
        <div className={styles.head}>
          <h1>What is a vendor community?</h1>
          <p>
            Village Finds' new C-commerce initiative empowers local people to
            organize small makers and growers in their communities to help them
            connect with customers looking for what they’re selling.
          </p>
        </div>
        <div className={styles.main}>
          <div className={styles.leftbar}>
            <p>Community Interest</p>
            <ul className={styles.categories}>
              {[
                { name: 'All Categories', value: '' },
                ...categories.map(item => ({
                  ...item,
                  value: item.name.toLowerCase(),
                })),
              ].map((_category: any, _index: number) => (
                <li
                  key={_index}
                  onClick={() => setCategory(_category.value)}
                  className={category === _category.value ? styles.active : ''}
                >
                  <span />
                  <p>{_category.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.section}>
            <div className={styles.selectors}>
              <Select
                rounded="full"
                placeholder="Community Interest"
                options={[
                  { name: 'All Categories', value: '' },
                  ...categories.map(item => ({
                    ...item,
                    value: item.name.toLowerCase(),
                  })),
                ]}
                border="none"
                bgcolor="primary"
                className={styles.interests}
                value={category}
                updateValue={onCategoryChange}
              />
              <Input
                size="large"
                rounded="full"
                placeholder="Search Communities or Community Interests"
                borderColor="primary"
                className={styles.search}
                adornment={{
                  position: 'right',
                  content: <FaMagnifyingGlass fill="white" />,
                }}
              />
            </div>
            <div className={styles.header}>
              <div className={styles.title}>
                <p>{ }</p>
                <span>{communities.length} Communities</span>
              </div>
              <Input
                rounded="full"
                placeholder="Search for a community"
                adornment={{
                  position: 'right',
                  content: <FaMagnifyingGlass fill="#652F90" />,
                }}
                className={styles.filterInput}
                value={filter}
                updateValue={(e: any) => setFilter(e.target.value)}
              />
            </div>
            <div className={styles.body}>
              {communities.map((community: any, index: number) => (
                <VComCard key={index} {...community} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
