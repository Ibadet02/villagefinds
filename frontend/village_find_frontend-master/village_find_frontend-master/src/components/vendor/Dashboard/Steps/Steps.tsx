import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Card } from '@/components/common';
import { LogoutIcon } from '@/components/icons';

import styles from './Steps.module.scss';

interface IStep {
  num: number;
  title: string;
  body: string;
  path: string;
}

const steps: IStep[] = [
  {
    num: 1,
    title: 'Connect to Stripe',
    body: 'Profile > My Bank Details',
    path: '/vendor/profile/bank-detail',
  },
  {
    num: 2,
    title: 'Complete Profile',
    body: 'Profile > Complete all steps within the profile dropdown',
    path: '/vendor/profile',
  },
  {
    num: 3,
    title: 'Create a product',
    body: 'My Products > New',
    path: '/vendor/products/create/general',
  },
  {
    num: 4,
    title: 'Open Your Shop!',
    body: 'Profile > Open',
    path: '/vendor/profile#shopopen',
  },
];

interface IStepsProps {
  step: number;
  className?: string;
}

export function Steps({ step, className = '' }: IStepsProps) {
  const navigate = useNavigate();

  const onClickStep = (_step: IStep) => {
    navigate(_step.path);
  };

  return (
    <Card title="First things first" className={styles.root}>
      <div className={styles.steps}>
        {steps.map((_step: IStep) => (
          <div
            className={clsx(
              styles.step,
              _step.num === step ? styles.active : '',
            )}
            onClick={_step.num === step ? () => onClickStep(_step) : () => {}}
          >
            <LogoutIcon className={styles.icon} />
            <h4>Step {_step.num}</h4>
            <p className={styles.title}>{_step.title}</p>
            <p>{_step.body}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
