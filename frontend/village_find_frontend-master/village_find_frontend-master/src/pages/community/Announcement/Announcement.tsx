import { useEffect, useState, useContext } from 'react';

import { TextField } from '@/components/forms';
import { Card } from '@/components/common';

import { AuthContext } from '@/providers';

import { HttpService } from '@/services';

import styles from './Announcement.module.scss';
import { enqueueSnackbar } from 'notistack';

export function Announcement() {
  const [announcement, setAnnouncement] = useState('');
  const { account } = useContext(AuthContext);

  const formatDate = (updatedAt: Date) => {
    return updatedAt.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: 'numeric',
    });
  };

  const onSubmitClick = () => {
    HttpService.put('/communities/announcement', { announcement })
      .then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Announcement updated successfully!', {
            variant: 'success',
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
    if (!account) return;
    setAnnouncement(
      (account.profile &&
        account.profile.announcement &&
        account.profile.announcement.text) ??
        '',
    );
  }, [account]);

  return (
    <div className={styles.root}>
      <h1>Announcement</h1>
      <Card className={styles.card}>
        <div>
          <p>
            Last updated:{' '}
            {account &&
              account.profile &&
              account.profile.announcement &&
              account.profile.announcement.updated_at &&
              formatDate(new Date(account.profile.announcement.updated_at))}
          </p>
          <div className={styles.control}>
            <p className={styles.label}>Announcement</p>
            <TextField
              rows={3}
              rounded="full"
              border="none"
              bgcolor="secondary"
              value={announcement}
              className={styles.textarea}
              updateValue={(e: any) => setAnnouncement(e.target.value)}
            />
          </div>
        </div>
        <button onClick={onSubmitClick}>Submit</button>
      </Card>
    </div>
  );
}
