import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, Input, Select, TextField } from '@/components';
import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';
import { ISubscription } from '../Subscription';

import styles from './NewSubscription.module.scss';

const initialSubsc: ISubscription = {
  name: '',
  description: '',
  monthInvest: 0,
  expectedFee: 0,
  transactionFee: 0,
  status: 'active',
};

const statusOpts = ['Active', 'Inactive'];

const BACK_PATH = '/admin/vendors/subscription';

export function NewSubscription() {
  const { id: subscID } = useParams();
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState<ISubscription>(initialSubsc);

  const onSubscChange = (e: ChangeInputEvent) => {
    setSubscription({ ...subscription, [e.target.name]: e.target.value })
  }

  const onAddClick = () => {
    if (subscID === 'create') {
      HttpService.post('/subscriptions', subscription).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Subscription added.', { variant: 'success' });
          navigate(BACK_PATH);
        }
      })
    } else {
      HttpService.put(`/subscriptions/${subscID}`, subscription).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Subscription updated.', { variant: 'success' });
          navigate(BACK_PATH);
        }
      })
    }
  }

  useEffect(() => {
    if (!subscID || subscID === 'create') return;
    HttpService.get(`/subscriptions/${subscID}`).then(response => {
      setSubscription(response);
    })
  }, [subscID]);

  return (
    <Card title="New Subscription" className={styles.root}>
      <div className={styles.form}>
        <div className={styles.control}>
          <p>Name</p>
          <Input
            name='name'
            placeholder="Name"
            value={subscription.name}
            updateValue={onSubscChange}
          />
        </div>
        <div className={styles.control}>
          <p>Description</p>
          <TextField name='description' placeholder='Description' value={subscription.description} updateValue={onSubscChange} />
        </div>
        <div className={styles.control}>
          <p>Monthly Investment</p>
          <Input type='number' name='monthInvest' placeholder='Monthly Investment' value={subscription.monthInvest} updateValue={onSubscChange} />
        </div>
        <div className={styles.control}>
          <p>Transaction Fee</p>
          <Input type='number' name='transactionFee' placeholder='Transaction Fee' value={subscription.transactionFee} updateValue={onSubscChange} />
        </div>
        <div className={styles.control}>
          <p>Discount Fee</p>
          <Input type='number' name='expectedFee' placeholder='Expected Fee' value={subscription.expectedFee} updateValue={onSubscChange} />
        </div>
        <div className={styles.control}>
          <p>Status</p>
          <Select
            placeholder="Status"
            options={statusOpts.map(item => ({ name: item, value: item.toLowerCase() }))}
            value={subscription.status}
            updateValue={(value: string) => setSubscription({ ...subscription, status: value })}
          />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button className={styles.cancelButton} onClick={() => navigate(BACK_PATH)}>Cancel</button>
        <button className={styles.addButton} onClick={onAddClick}>{subscID === 'create' ? 'Add' : 'Update'}</button>
      </div>
    </Card>
  );
}
