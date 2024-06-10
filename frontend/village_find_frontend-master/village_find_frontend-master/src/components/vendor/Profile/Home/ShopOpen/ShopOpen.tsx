import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { Radio, RadioGroup } from '@/components/forms';
import { HttpService } from '@/services';

export function ShopOpen() {
  const location = useLocation();
  const hash = location.hash;

  const [status, setStatus] = useState('closed');
  const shopOpenRef = useRef<HTMLDivElement>(null);

  const onShopOpenClick = (value: string) => {
    HttpService.put('/user/vendor/profile/open', {
      open: status === 'opened',
    }).then(response => {
      const { status } = response;
      if (status === 200) {
        setStatus(value);
        enqueueSnackbar(`Shop ${value}.`, { variant: 'success' });
      } else {
        enqueueSnackbar('Invalid user.', {
          variant: 'warning',
        });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/profile/open').then(response => {
      setStatus(!!response ? 'opened' : 'closed');
    });
  }, []);

  useEffect(() => {
    if (hash === '#shopopen') {
      console.log('Shop open!!!');
      console.log(shopOpenRef);
      if (shopOpenRef.current) {
        shopOpenRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <Card title="Shop Open" cardID="shopopen" ref={shopOpenRef}>
      <RadioGroup value={status} updateValue={onShopOpenClick}>
        <Radio value="closed" label="Closed" />
        <Radio value="opened" label="Open" />
      </RadioGroup>
    </Card>
  );
}
