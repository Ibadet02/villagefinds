import { useState } from 'react';

import { Button, Input } from '@/components/forms';

import styles from './Registration.module.scss';

interface IRegistrationProps {
  link: string;
  updateLink: (_: string) => void;
  onFinalUpdate: (_: string) => void;
}

export function Registration({
  link,
  updateLink,
  onFinalUpdate = () => {},
}: IRegistrationProps) {
  return (
    <div className={styles.root}>
      <div className={styles.text}>
        <h2>Use an external event link</h2>
        <p>
          When a person clicks the button "register", they will be sent to the
          location of the link provided.
        </p>
      </div>
      <div className={styles.control}>
        <Input
          placeholder="Event Link"
          rounded="full"
          bgcolor="secondary"
          border="none"
          className={styles.input}
          value={link}
          updateValue={(e: any) => updateLink(e.target.value)}
        />
        <Button
          className={styles.updateButton}
          onClick={() => onFinalUpdate(link)}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
