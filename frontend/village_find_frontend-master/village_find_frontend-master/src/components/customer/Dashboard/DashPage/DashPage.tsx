import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from '@/components/layout/customer';
import { Input } from '@/components/forms';
import { MagnifierIcon } from '@/components/icons';
import { SERVER_URL } from '@/config/global';
import { SearchbarContext } from '@/providers';

import HeroVideo from '/assets/customer/videos/hero.mp4';
import styles from './DashPage.module.scss';

export interface IDashPageProps {
  title: string;
  subtitle: string;
  images: string[];
}

export const initialDashPageData = {
  title: 'Shop directly from our growing community of vendors',
  subtitle:
    'Groups of small and local vendors growing together on a single marketplace.',
  images: ['assets/customer/backs/dashboard.png'],
};

export function DashPage({ title, subtitle, images }: IDashPageProps) {
  const navigate = useNavigate();

  const { isSearchbar } = useContext(SearchbarContext);

  const [search, setSearch] = useState('');

  const onSearchChange = (e: any) => {
    setSearch(e.target.value);
  };

  const onSearchDown = (e: any) => {
    if (e.keyCode === 13) {
      navigate(`/market?search=${search}`);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.imageWrapper}>
        <video src={HeroVideo} controls autoPlay muted loop />
        <div className={styles.grayLayer} />
      </div>
      <Container className={styles.searchBar}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {isSearchbar && (
          <Input
            size="large"
            border="none"
            rounded="full"
            placeholder="Search for anything"
            className={styles.searchInput}
            adornment={{
              position: 'right',
              content: <MagnifierIcon />,
            }}
            value={search}
            updateValue={onSearchChange}
            onKeyDown={onSearchDown}
          />
        )}
      </Container>
    </div>
  );
}
