import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { TextField } from '@/components/forms';
import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';

import styles from './Rewards.module.scss';

export function Rewards() {
  const [rewards, setRewards] = useState<string[]>(Array(3).fill(''));

  const onRewardsChange = (index: number) => (e: ChangeInputEvent) => {
    setRewards(
      rewards.map((_value: string, _index: number) =>
        index === _index ? e.target.value : _value,
      ),
    );
  };

  const onUpdateClick = () => {
    HttpService.put('/user/vendor/rewards', rewards).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Rewards updated.', { variant: 'success' });
      }
    });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/rewards').then(response => {
      const { status, rewards } = response;
      if (status === 200) {
        setRewards([...(rewards || []), ...Array(3).fill('')].slice(0, 3));
      }
    });
  }, []);

  return (
    <Card title="Rewards" className={styles.root}>
      <p>
        Starting a business can be a challenge. Sometimes you need to set some
        goals AND rewards for your hard work and success. Below, create several
        rewards you'll give yourself when you meet your goals!
      </p>
      <div className={styles.form}>
        <div className={styles.control}>
          <p>Reward 1</p>
          <TextField
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Share your reward and what you need to do to achieve it!"
            className={styles.textField}
            rows={2}
            value={rewards[0]}
            updateValue={onRewardsChange(0)}
          />
        </div>
        <div className={styles.control}>
          <p>Reward 2</p>
          <TextField
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Share your reward and what you need to do to achieve it!"
            className={styles.textField}
            rows={2}
            value={rewards[1]}
            updateValue={onRewardsChange(1)}
          />
        </div>
        <div className={styles.control}>
          <p>Reward 3</p>
          <TextField
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Share your reward and what you need to do to achieve it!"
            className={styles.textField}
            rows={2}
            value={rewards[2]}
            updateValue={onRewardsChange(2)}
          />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button className={styles.button} onClick={onUpdateClick}>
          Update
        </button>
      </div>
    </Card>
  );
}
