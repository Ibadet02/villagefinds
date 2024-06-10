import { useState } from 'react';
import { Card } from '@/components/common';

import { CloseIcon, CustomerChart, Input, MagnifierIcon, Select } from '@/components';
import { CurrentOrders } from '@/components/vendor';
import { formatNumber } from '@/utils';

import styles from './Financials.module.scss';
import { ChangeInputEvent } from '@/interfaces';

interface IRange {
  from: string;
  to: string;
}

export function Financials() {
  const surveyData = {
    sales: 0,
    transaction: 0,
    avgOrder: 0,
  };
  const earnings = [
    0, 0, 0, 0, 0, 0, 0,
  ];
  const transactions = 0;

  const orders: any[] = [
    // {
    //   id: 653,
    //   customer: 'Brandon Monti',
    //   type: 'Shipping',
    //   date: new Date('02/28/2024'),
    //   amount: 200.58,
    //   status: 'Paid' as StatusType,
    // },
  ];

  const [filter, setFilter] = useState('');
  const [range, setRange] = useState<IRange>({ from: '', to: '' });

  return (
    <div className={styles.root}>
      <div className={styles.survey}>
        <div className={styles.board}>
          <Card className={styles.card}>
            <div>
              <h3>Sales</h3>
              <p>Year to date</p>
            </div>
            <span className={styles.sales}>
              ${formatNumber(surveyData.sales)}
            </span>
          </Card>
          <Card className={styles.card}>
            <div>
              <h3>Transactions</h3>
              <p>Year to date</p>
            </div>
            <span className={styles.trans}>
              ${formatNumber(surveyData.transaction)}
            </span>
          </Card>
          <Card className={styles.card}>
            <div>
              <h3>Transactions</h3>
              <p>Year to date</p>
            </div>
            <span className={styles.avg}>
              ${surveyData.avgOrder.toFixed(2)}
            </span>
          </Card>
        </div>
        <Card className={styles.revenue}>
          <div className={styles.header}>
            <h1>Revenue</h1>
            <Select
              rounded="full"
              border="none"
              bgcolor="dark"
              placeholder="Week"
              className={styles.duration}
            />
          </div>
          <p>
            Number of Transactions <span>{transactions}</span>
          </p>
          <CustomerChart customers={earnings} />
        </Card>
      </div>
      <div className={styles.currentOrder}>
        <div className={styles.toolbar}>
          <div className={styles.control}>
            <p>Search</p>
            <Input
              name='serach'
              placeholder='Search'
              value={filter}
              border='none'
              rounded='full'
              updateValue={(e: ChangeInputEvent) => setFilter(e.target.value)}
              adornment={{
                position: 'right',
                content: <MagnifierIcon />
              }}
              className={styles.input}
            />
          </div>
          <div className={styles.control}>
            <p>From</p>
            <Input
              name='from'
              type='date'
              placeholder='Search'
              border='none'
              rounded='full'
              value={range.from}
              updateValue={(e: ChangeInputEvent) => setRange({ ...range, from: e.target.value })}
              adornment={{
                position: 'right',
                content: <CloseIcon />
              }}
              className={styles.input}
            />
          </div>
          <div className={styles.control}>
            <p>To</p>
            <Input
              name='to'
              type='date'
              placeholder='Search'
              border='none'
              rounded='full'
              value={range.to}
              updateValue={(e: ChangeInputEvent) => setRange({ ...range, to: e.target.value })}
              adornment={{
                position: 'right',
                content: <CloseIcon />
              }}
              className={styles.input}
            />
          </div>
        </div>
        <CurrentOrders title={true} data={orders} />
      </div>
    </div>
  );
}
