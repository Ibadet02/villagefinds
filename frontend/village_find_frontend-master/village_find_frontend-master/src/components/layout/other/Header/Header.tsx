import React, { useState } from 'react';

import { Input } from '@/components/forms';
import { MagnifierIcon } from '@/components/icons';
import { Dropdown } from './Dropdown';

import styles from './Header.module.scss';

export function Header() {
  const [filter, setFilter] = useState<string>('');

  return (
    <div className={styles.root}>
      <Input
        value={filter}
        updateValue={e => setFilter(e.target.value)}
        placeholder="Search"
        rounded="full"
        border="none"
        size="large"
        adornment={{
          position: 'right',
          content: <MagnifierIcon />,
        }}
        className={styles.searchInput}
      />
      <Dropdown />
    </div>
  );
}
