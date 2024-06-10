import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card, Select } from '@/components';
import { HttpService } from '@/services';
import { SERVER_URL } from '@/config/global';

import styles from './Community.module.scss';

const options = [
  {
    name: 'Active',
    value: 'active',
  },
  {
    name: 'Inactive',
    value: 'inactive',
  },
];

interface ICommunity {
  name: string;
  images?: {
    logoUrl: string;
  };
}

const initialCommunity: ICommunity = {
  name: '',
  images: {
    logoUrl: '',
  },
};

export function Community() {
  const [status, setStatus] = useState('inactive');
  const [community, setCommunity] = useState<ICommunity>(initialCommunity);

  const onCommunityStatusChange = (value: string) => {
    HttpService.put('/user/vendor/community', { status: value }).then(
      response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Community status changed.', { variant: 'success' });
          setStatus(value);
        }
      },
    );
  };

  useEffect(() => {
    HttpService.get('/user/vendor/community').then(response => {
      const { status, community: vendorCommunity } = response;
      if (status === 200) {
        const { community, communityStatus } = vendorCommunity;
        setStatus(communityStatus || 'inactive');
        setCommunity(community);
      }
    });
  }, []);

  return (
    <Card title="Community" className={styles.root}>
      {community && <div className={styles.artisan}>
        <img
          src={`${SERVER_URL}/${community.images?.logoUrl}`}
          className={styles.image}
        />
        <p>{community.name}</p>
        <Select
          rounded="full"
          placeholder="Active"
          className={styles.select}
          options={options}
          value={status}
          updateValue={onCommunityStatusChange}
        />
      </div>}
    </Card>
  );
}
