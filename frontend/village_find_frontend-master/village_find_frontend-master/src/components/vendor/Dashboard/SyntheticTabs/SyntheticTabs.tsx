import { useState } from 'react';
import clsx from 'clsx';

import { Card, TableBody } from '@/components/common';
import { CustomerTab } from './CustomerTab';
import { PopularItemTab } from './PopularItemTab';
import { TotalTab } from './TotalTab';

import { IActivitySurvey } from '@/stores';

import styles from './SyntheticTabs.module.scss';

interface INavItem {
  title: string;
  name: string;
  render: (data: any) => React.ReactNode;
}

const navItems: INavItem[] = [
  {
    title: 'Customers',
    name: 'customer',
    render: (data: IActivitySurvey) => <CustomerTab {...data.customers} />,
  },
  {
    title: 'Pouplar Items',
    name: 'product',
    render: (data: IActivitySurvey) => (
      <PopularItemTab data={data.popularItems} />
    ),
  },
  {
    title: 'Totals',
    name: 'total',
    render: (data: IActivitySurvey) => <TotalTab {...data.totals} />,
  },
];

export interface ISyntheticTabsProps {
  survey: IActivitySurvey;
  className?: string;
}

export function SyntheticTabs({ survey, className = '' }: ISyntheticTabsProps) {
  const [tabname, setTabname] = useState(navItems[0].name);

  return (
    <Card className={clsx(styles.root, className)}>
      <ul className={styles.nav}>
        {navItems.map((navItem: INavItem) => (
          <li
            key={navItem.name}
            className={tabname === navItem.name ? styles.active : ''}
            onClick={() => setTabname(navItem.name)}
          >
            {navItem.title}
          </li>
        ))}
      </ul>
      {navItems.map((navItem: INavItem) =>
        navItem.name === tabname ? <>{navItem.render(survey)}</> : <></>,
      )}
    </Card>
  );
}
