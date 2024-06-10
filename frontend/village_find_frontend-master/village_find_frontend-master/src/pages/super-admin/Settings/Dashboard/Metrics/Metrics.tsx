import { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, TableToolbar, TableBody } from '@/components/common';
import { Select } from '@/components/forms';
import { TrashIcon } from '@/components/icons';

import { HttpService, MetricService } from '@/services';

import { ITableColumn } from '@/interfaces';

import styles from './Metrics.module.scss';

const METRIC_PATH = '/admin/settings/dashboard/metrics';
const statusOpts = ['Active', 'Inactive'];

type IMetric = {
  _id: string;
  name: string;
  status: string;
}

export function Metrics() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  // const {
  //   metrics: storeMetrics,
  //   setMetrics: setStoreMetrics,
  //   deleteMetric: deleteStoreMetric,
  // } = useMetricStore();
  const [metrics, setMetrics] = useState<IMetric[]>([]);

  const columns: ITableColumn[] = [
    {
      title: 'Metric Name',
      name: 'name',
      width: 250,
    },
    {
      title: 'Status',
      name: 'status',
      width: 250,
      cell: (row: any) => (
        <Select
          rounded="full"
          placeholder={row.status}
          options={statusOpts.map(item => ({ name: item, value: item.toLowerCase() }))}
          className={styles.statusSelector}
          value={row.status}
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
            onClick={onClickEdit(row._id)}
          >
            Edit
          </button>
          <span onClick={onClickDelete(row._id)}>
            <TrashIcon />
          </span>
        </div>
      ),
    },
  ];

  const updateFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const updateStatus = (_category: string) => {
    setCategory(_category);
  };

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put(`/settings/general/metric/${id}`, { status: value }).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Status updated.', { variant: 'success' });
        setMetrics(metrics.map(metric => metric._id === id ? ({ ...metric, status: value }) : metric));
      }
    })
  }

  const onClickEdit = (id: string) => () => {
    navigate(`${METRIC_PATH}/${id}`);
  };

  const onClickDelete = (id: string) => () => {
    HttpService.delete(`/settings/general/metric/${id}`).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Metric deleted.', { variant: 'success' });
        setMetrics(metrics.filter(item => item._id !== id));
      }
    })
  };

  useEffect(() => {
    const params: any = {};
    if (filter) params.name = filter.toLowerCase();
    if (category) params.status = category;
    HttpService.get('/settings/general/metric', params).then(response => {
      setMetrics(response);
    })
  }, [filter, category]);

  return (
    <Card title="Metrics" className={styles.root}>
      <TableToolbar
        search={filter}
        updateSearch={updateFilter}
        searchTitle="Metric Name"
        category={category}
        updateCategory={updateStatus}
        selectTitle="Status"
        selectOpts={statusOpts.map(item => ({ name: item, value: item.toLowerCase() }))}
        className={styles.tableToolbar}
        actions={
          <div>
            <p className={styles.buttonLabel}>New</p>
            <button
              className={styles.actionButton}
              onClick={() => navigate(`${METRIC_PATH}/create`)}
            >
              New
            </button>
          </div>
        }
      />
      <TableBody
        columns={columns}
        rows={metrics}
        className={styles.tableBody}
      />
    </Card>
  );
}
