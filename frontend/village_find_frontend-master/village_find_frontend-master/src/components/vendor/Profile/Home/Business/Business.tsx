import { useEffect, useState } from 'react';

import { Card } from '@/components/common';
import { Input } from '@/components/forms';

import { HttpService } from '@/services';

import styles from './Business.module.scss';
import { enqueueSnackbar } from 'notistack';

export interface IBusiness {
  name: string;
  phone: string;
  owner: string;
  address: string;
  email: string;
  zipcode: string;
}

const initialBusiness: IBusiness = {
  name: '',
  phone: '',
  owner: '',
  address: '',
  email: '',
  zipcode: '',
};

export function Business() {
  const [business, setBusiness] = useState<IBusiness>(initialBusiness);

  const onBusinessChange = (e: any) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateClick = () => {
    HttpService.put('/user/vendor/profile/business', business)
      .then(response => {
        const { status, business } = response;
        if (status === 200) {
          enqueueSnackbar('Business information updated successfully!', {
            variant: 'success',
          });
          setBusiness(business ?? initialBusiness);
        } else {
          enqueueSnackbar('Something went wrong with server.', {
            variant: 'error',
          });
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/profile/business').then(response => {
      setBusiness(response ?? initialBusiness);
    });
  }, []);

  return (
    <Card title="Business Information" className={styles.root}>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.control}>
            <p>Business Name</p>
            <Input
              name="name"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Business Name"
              value={business.name}
              updateValue={onBusinessChange}
            />
          </div>
          <div className={styles.control}>
            <p>Phone Number</p>
            <Input
              name="phone"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Phone Number"
              value={business.phone}
              updateValue={onBusinessChange}
            />
          </div>
          <div className={styles.control}>
            <p>Business Owner Name</p>
            <Input
              name="owner"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Business Owner Name"
              value={business.owner}
              updateValue={onBusinessChange}
            />
          </div>
          <div className={styles.control}>
            <p>Business Address</p>
            <Input
              name="address"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Business Address"
              value={business.address}
              updateValue={onBusinessChange}
            />
          </div>
          <div className={styles.control}>
            <p>Email</p>
            <Input
              name="email"
              type="email"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Email"
              value={business.email}
              updateValue={onBusinessChange}
            />
          </div>
          <div className={styles.control}>
            <p>Business Zipcode</p>
            <Input
              name="zipcode"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Business Zipcode"
              value={business.zipcode}
              updateValue={onBusinessChange}
            />
          </div>
        </div>  
        <div className={styles.buttonBar}>
          <button onClick={onUpdateClick}>Update</button>
        </div>
      </div>
    </Card>
  );
}
