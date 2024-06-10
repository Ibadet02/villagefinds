import { ChangeEvent, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card } from '@/components/common';
import { Input, Select } from '@/components/forms';

import { HttpService } from '@/services';

import styles from './NewMetric.module.scss';

type IMetric = {
  _id?: string;
  name: string;
  status: string;
}

const initialMetric: IMetric = {
  name: '',
  status: '',
};
const METRIC_PATH = '/admin/settings/dashboard/metrics';
const STATUS_OPTS: string[] = ['Active', 'Inactive'];

export function NewMetric() {
  const { id: metricId }: any = useParams();
  const navigate = useNavigate();
  const [metric, setMetric] = useState<IMetric>(initialMetric);

  const updateMetricName = (e: ChangeEvent<HTMLInputElement>) => {
    setMetric({ ...metric, name: e.target.value });
  };

  const updateMetricStatus = (status: string) => {
    setMetric({ ...metric, status });
  };

  const onMetricCreate = () => {
    if (metricId === 'create') {
      HttpService.post('/settings/general/metric', metric).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('New metric created.', { variant: 'success' });
          navigate(METRIC_PATH);
        }
      })
    } else {
      HttpService.put(`/settings/general/metric/${metric._id}`, metric).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Metric updated.', { variant: 'success' });
          navigate(METRIC_PATH);
        }
      })
    }
  };

  useEffect(() => {
    if (!metricId || metricId === 'create') {
      setMetric(initialMetric);
    } else {
      HttpService.get(`/settings/general/metric/${metricId}`).then(response => {
        setMetric(response);
      })
    }
  }, [metricId]);

  return (
    <Card title="New Metric" className={styles.root}>
      <div className={styles.form}>
        <div className={styles.control}>
          <p>Metric Name</p>
          <Input
            value={metric.name}
            updateValue={updateMetricName}
            placeholder="Metric Name"
          />
        </div>
        <div className={styles.control}>
          <p>Status</p>
          <Select
            value={metric.status}
            updateValue={updateMetricStatus}
            placeholder="Status"
            options={STATUS_OPTS.map(item => ({ name: item, value: item.toLowerCase() }))}
          />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button
          className={styles.cancelButton}
          onClick={() => navigate(METRIC_PATH)}
        >
          Cancel
        </button>
        <button className={styles.addButton} onClick={onMetricCreate}>
          {metricId === 'create' ? 'Add' : 'Edit'}
        </button>
      </div>
    </Card>
  );
}
