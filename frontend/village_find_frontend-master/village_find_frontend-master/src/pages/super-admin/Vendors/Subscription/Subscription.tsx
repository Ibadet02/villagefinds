import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, TableToolbar, TableBody } from '@/components/common';
import { Select } from '@/components/forms';
import { TrashIcon } from '@/components/icons';
import { ITableColumn } from '@/interfaces';
import { HttpService } from '@/services';

import styles from './Subscription.module.scss';
import { enqueueSnackbar } from 'notistack';

export interface ISubscription {
  name: string;
  description: string;
  monthInvest: number;
  expectedFee: number;
  transactionFee: number;
  status: string;
}

const statusOps: string[] = ['Active', 'Blocked', 'Paused', 'Inactive'];

const MAIN_PATH = '/admin/vendors/subscription';

export function Subscription() {
  const navigate = useNavigate();

  const [subsData, setSubsData] = useState<ISubscription[]>([]);

  const columns: ITableColumn[] = [
    {
      title: 'Subscription Name',
      name: 'name',
      width: 250,
    },
    {
      title: 'Title',
      name: 'title',
      width: 350,
      cell: (row: any) => <p>{`$${row.monthInvest.toFixed(2)}`} per month + {`${row.transactionFee.toFixed(2)}`}% transaction fee.</p>
    },
    {
      title: 'Status',
      name: 'status',
      width: 250,
      cell: (row: any) => (
        <Select
          rounded="full"
          value={row.status}
          options={statusOps.map(item => ({ name: item, value: item.toLowerCase() }))}
          className={styles.statusSelector}
        />
      ),
    },
    {
      title: 'Action',
      name: 'action',
      width: 250,
      cell: (row: any) => (
        <div className={styles.actionCell}>
          <button className={styles.actionButton} onClick={() => navigate(`${MAIN_PATH}/${row._id}`)}>Edit</button>
          <span onClick={() => onDeleteClick(row)}>
            <TrashIcon />
          </span>
        </div>
      ),
    },
  ];

  const onDeleteClick = (row: any) => {
    HttpService.delete(`/subscriptions/${row._id}`).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar(`Subscription ${row.name.toLowerCase()} deleted.`, { variant: 'success' })
      }
    })
  }

  useEffect(() => {
    HttpService.get('/subscriptions').then(response => {
      setSubsData(response);
    })
  }, []);

  return (
    <Card title="Subscription Packages" className={styles.root}>
      <TableToolbar
        searchable={false}
        selectable={false}
        className={styles.tableToolbar}
        actions={
          <div className={styles.toolbarAction}>
            <p className={styles.buttonLabel}>New</p>
            <button className={styles.actionButton} onClick={() => navigate(`${MAIN_PATH}/create`)}>
              New
            </button>
          </div>
        }
      />
      <TableBody
        columns={columns}
        rows={subsData}
        className={styles.tableBody}
      />
    </Card>
  );
}
