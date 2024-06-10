import { useEffect, useState } from 'react';
import { Steps } from '@/components/vendor';

import { SalesBoard } from '@/components/vendor/Dashboard/SalesBoard';
import { SyntheticTabs } from '@/components/vendor/Dashboard/SyntheticTabs';
import { CurrentOrders } from '@/components/vendor/Dashboard/CurrentOrders';

import { useDashStore } from '@/stores';
import { HttpService } from '@/services';

import styles from './Dashboard.module.scss';

export function Dashboard() {
  const { salesSurvey, activitySurvey, currentOrders } = useDashStore();

  const [isOpen, openShop] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    HttpService.get('/user/vendor/auth').then(response => {
      const {
        isOpen,
        isProduct,
        stripeAccountID,
        shipping,
        business,
        store,
        fulfillment,
      } = response;
      openShop(isOpen ?? false);
      if (!stripeAccountID) setStep(1);
      else if (!shipping || !business || !store || !fulfillment) {
        setStep(2);
      } else if (!isProduct) {
        setStep(3);
      } else if (!isOpen) {
        setStep(4);
      }
    });
  }, []);

  return (
    <div className={styles.root}>
      {!isOpen && <Steps step={step} />}
      <div className={styles.surveyOrChart}>
        <SalesBoard sales={salesSurvey} />
        <SyntheticTabs survey={activitySurvey} />
      </div>
      <CurrentOrders data={currentOrders} />
    </div>
  );
}
