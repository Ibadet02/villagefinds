import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, TableBody } from '@/components/common';
import { TrashIcon } from '@/components/icons';
import { ITableColumn } from '@/interfaces';
import { HttpService } from '@/services';

import styles from './ParcelSize.module.scss';

const sizeUnitList = ['In'];
const massUnitList = ['Lbs'];

export function ParcelSize() {
  const navigate = useNavigate();

  const [parcels, setParcels] = useState<any[]>([]);

  const parcelSizeTableColumns: ITableColumn[] = [
    {
      title: 'Name',
      name: 'name',
      width: 100,
    },
    {
      title: 'Size (length x width x height)',
      name: 'size',
      width: 350,
      cell: (row: any) => (
        <span>{`${row.length.toFixed(2)} ${sizeUnit(row)} x ${row.width.toFixed(
          2,
        )} ${sizeUnit(row)} x ${row.height.toFixed(2)} ${sizeUnit(row)}`}</span>
      ),
    },
    {
      title: 'Thickness',
      name: 'thickness',
      width: 150,
      cell: (row: any) => <span>{row.thickness.toFixed(2)} mm</span>,
    },
    {
      title: 'Max Weight',
      name: 'weight',
      width: 300,
      cell: (row: any) => (
        <span>
          {row.maxWeight.toFixed(2)} {massUnit(row)}
        </span>
      ),
    },
    {
      title: 'Action',
      name: 'action',
      width: 200,
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

  const sizeUnit = (row: any) => {
    return sizeUnitList.find(item => item.toLowerCase() === row.sizeUnit) || '';
  };

  const massUnit = (row: any) => {
    return massUnitList.find(item => item.toLowerCase() === row.massUnit) || '';
  };

  const onDeleteClick = (id: string) => () => {
    HttpService.delete(`/user/vendor/profile/shipping/parcel/${id}`).then(
      response => {
        const { status } = response;
        if (status === 200) {
          setParcels(parcels.filter(item => item._id !== id));
          enqueueSnackbar('Parcel deleted.', { variant: 'success' });
        }
      },
    );
  };

  useEffect(() => {
    HttpService.get('/user/vendor/profile/shipping/parcel').then(response => {
      setParcels(response || []);
    });
  }, []);

  return (
    <Card title="Parcel Size" className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.desc}>
            <p>
              The sizes you set here will be used to calculate shipping rates.
            </p>
            <p>
              All of your products must fit into atleast one of these parcels.
            </p>
          </div>
          <div className={styles.buttonBar}>
            <button
              className={styles.button}
              onClick={() => navigate('create')}
            >
              New
            </button>
          </div>
        </div>
        <TableBody columns={parcelSizeTableColumns} rows={parcels} />
      </div>
    </Card>
  );
}
