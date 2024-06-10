import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { Card } from '@/components/common';
import { Input, TextField } from '@/components/forms';

import styles from './GoalHome.module.scss';
import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';
import { enqueueSnackbar } from 'notistack';

interface IGoals {
  reason: string;
  business: string;
  revenue: string;
}

const initialGoals: IGoals = {
  reason: '',
  business: '',
  revenue: '',
};

export function GoalHome() {
  const [goals, setGoals] = useState<IGoals>(initialGoals);

  const onGoalsChange = (e: ChangeInputEvent) => {
    setGoals({ ...goals, [e.target.name]: e.target.value });
  };

  const onUpdateClick = () => {
    HttpService.put('/user/vendor/goals', goals).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Business goals updated.', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/goals').then(response => {
      const { status, goals } = response;
      if (status === 200) {
        setGoals(goals);
      }
    });
  }, []);

  return (
    <Card title="Goals" className={styles.root}>
      <div className={styles.form}>
        <div className={styles.control}>
          <p>Why did you start your business?</p>
          <TextField
            name="reason"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Share how to customize"
            className={styles.textField}
            value={goals.reason}
            updateValue={onGoalsChange}
          />
        </div>
        <div className={styles.control}>
          <p>Your Personal Business Goal</p>
          <TextField
            name="business"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Share how to customize"
            className={styles.textField}
            value={goals.business}
            updateValue={onGoalsChange}
          />
        </div>
        <div className={styles.control}>
          <p>Your Yearly Revenue Goal</p>
          <Input
            name="revenue"
            type="number"
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Revenue Goal"
            adornment={{
              position: 'left',
              content: '$',
            }}
            className={styles.revInput}
            value={goals.revenue}
            updateValue={onGoalsChange}
          />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button className={styles.button}>Cancel</button>
        <button
          className={clsx(styles.button, styles.updateBtn)}
          onClick={onUpdateClick}
        >
          Update
        </button>
      </div>
    </Card>
  );
}
