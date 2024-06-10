import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { TableToolbar, TableBody } from '@/components/common';
import { Select } from '@/components/forms';
import { TrashIcon } from '@/components/icons';
import { ITableColumn } from '@/interfaces';
import { HttpService } from '@/services';

import styles from './PickupLocation.module.scss';

const statusList: string[] = ['Active', 'Inactive'];

export function PickupLocation() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<string>('');
  const [locRows, setLocRows] = useState<any[]>([]);

  const columns: ITableColumn[] = [
    {
      title: 'Location Name',
      name: 'name',
      width: 250,
    },
    {
      title: 'Location Address',
      name: 'address',
      width: 400,
    },
    {
      title: 'Status',
      name: 'status',
      width: 250,
      cell: (row: any) => (
        <Select
          rounded="full"
          value={row.status}
          options={statusList.map(item => ({
            name: item,
            value: item.toLowerCase(),
          }))}
          className={styles.statusCell}
          updateValue={onStatusChange(row._id)}
        />
      ),
    },
    {
      title: 'Action',
      name: 'action',
      width: 250,
      cell: (row: any) => (
        <div className={styles.actionCell}>
          <button
            className={styles.actionButton}
            onClick={() => navigate(row._id)}
          >
            Edit
          </button>
          <span onClick={onDeleteClick(row._id)}>
            <TrashIcon />
          </span>
        </div>
      ),
    },
  ];

  const updateSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const onDeleteClick = (id: string) => () => {
    HttpService.delete(`/user/vendor/profile/fulfillment/location/${id}`).then(
      response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Location deleted.', { variant: 'success' });
        }
      },
    );
  };

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put(
      '/user/vendor/profile/fulfillment/location',
      { status: value },
      { id },
    ).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar(`Location is ${value} now.`, { variant: 'success' });
        setLocRows(
          locRows.map(item =>
            item._id === id ? { ...item, status: value } : item,
          ),
        );
      }
    });
  };

  useEffect(() => {
    HttpService.get('/user/vendor/profile/fulfillment/location').then(
      response => {
        setLocRows(response || []);
      },
    );
  }, []);

  return (
    <div className={styles.root}>
      <TableToolbar
        search={filter}
        updateSearch={updateSearch}
        searchTitle="Search for a location"
        searchTitleHidden={true}
        selectable={false}
        className={styles.tableToolbar}
        actions={
          <div className={styles.actionPanel}>
            <button
              className={styles.actionButton}
              onClick={() => navigate('create')}
            >
              New
            </button>
          </div>
        }
      />
      <TableBody
        columns={columns}
        rows={locRows}
        className={styles.tableBody}
      />
    </div>
  );
}
