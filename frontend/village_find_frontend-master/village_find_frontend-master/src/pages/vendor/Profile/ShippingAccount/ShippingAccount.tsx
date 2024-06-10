import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { HttpService } from '@/services';

import ShippoLogo from '/assets/vendor/backs/shippo.png';
import styles from './ShippingAccount.module.scss';

export function ShippingAccount() {
  const [isShippoConnected, setIsShippoConnected] = useState(false);

  const onConnectClick = () => {
    HttpService.get('/user/vendor/shippo/on-board').then(response => {
      const { status } = response;
      if (status === 200) {
        setIsShippoConnected(true);
        enqueueSnackbar('Shippo account connected.', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/shippo/check').then(response => {
      const { status } = response;
      if (status === 200) {
        setIsShippoConnected(true);
      }
    })
  }, [])

  return (
    <Card title="Create your Shippo Shipping Account" className={styles.root}>
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.logo}>
            {isShippoConnected && <span>Shippo connected</span>}
            <img src={ShippoLogo} />
          </div>
          <button onClick={onConnectClick} disabled={isShippoConnected}>Click Here</button>
        </div>
      </div>
    </Card>
  );
}
