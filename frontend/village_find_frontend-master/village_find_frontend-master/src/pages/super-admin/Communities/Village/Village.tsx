import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Card, TableBody, TableToolbar } from '@/components';
import { Input, Select } from '@/components/forms';
import { HttpService } from '@/services';
import { IRange, ITableColumn } from '@/interfaces';
import { formatDate } from '@/utils';

import styles from './Village.module.scss';

const sortOpts = [
  { name: 'Alphabetical Order', value: 'alphabeta' },
  { name: 'Recently Added', value: 'recent' },
  { name: 'Highest Revenue', value: 'highest' },
  { name: 'Lowest Revenue', value: 'lowest' },
];
const statusOpts = ['Active', 'Blocked', 'Paused', 'Inactive'];

const initialRange = {
  from: '',
  to: '',
};

const statusValues = statusOpts.map(item => item.toLowerCase());
type Status = typeof statusValues[number];

export interface ICommunityRow {
  _id?: string;
  name: string;
  organizer: {
    firstName: string;
    lastName: string;
  };
  date: Date;
  total: number;
  status: Status;
}
const COMMUNITY_PATH = '/admin/community/village';

export function VillageCommunity() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [range, setRange] = useState<IRange>(initialRange);
  const [communities, setCommunities] = useState<ICommunityRow[]>([]);

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put(`/communities/${id}`, { status: value }).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Status changed.', { variant: 'success' });
        setCommunities(communities.map(item => item._id === id ? ({ ...item, status: value }) : item))
      }
    })
  }

  const columns: ITableColumn[] = [
    {
      title: 'Village Name',
      name: 'name',
      width: 150,
    },
    {
      title: 'Village Organizer',
      name: 'organizer',
      width: 150,
      cell: (row: any) => (
        <span>
          {row.organizer && `${row.organizer.firstName} ${row.organizer.lastName}`}
        </span>
      ),
    },
    {
      title: 'Signup Date',
      name: 'signup_at',
      width: 150,
      cell: (row: any) => (
        <Input
          type="text"
          rounded="full"
          bgcolor='secondary'
          value={formatDate(new Date(row.signup_at))}
        />
      ),
    },
    {
      title: 'Total Vendors',
      name: 'total',
      width: 150,
      cell: (row: any) => <span>{(row.vendors || []).length}</span>,
    },
    {
      title: 'Status',
      name: 'status',
      width: 200,
      cell: (row: any) => (
        <Select
          rounded="full"
          value={row.status}
          updateValue={onStatusChange(row._id)}
          options={statusOpts.map(item => ({ name: item, value: item.toLowerCase() }))}
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
          <button
            className={styles.actionButton}
            onClick={() => navigate(`${COMMUNITY_PATH}/${row._id}`)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const loadCommunities = ({ filter = '', sort = '', category = '', range = { from: '', to: '' } }: any = {}) => {
    const params: any = {};
    if (filter) params.name = filter;
    if (sort) params.sort = sort;
    if (category) params.status = category;
    if (range.from) params.from = range.from;
    if (range.to) params.to = range.to;
    HttpService.get('/communities/admin', params).then(response => {
      const result = response || [];
      setCommunities(result);
    });
  };

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const onRangeChange =
    (which: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setRange({ ...range, [which]: e.target.value });
    };

  const onSubmitClick = () => {
    loadCommunities({ filter, sort, category, range });
  };

  const onResetClick = () => {
    setFilter('');
    setSort('');
    setCategory('');
    setRange(initialRange);
    loadCommunities();
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  return (
    <Card title="Village Communities" className={styles.root}>
      <TableToolbar
        searchTitle="Search Village Name"
        searchPlaceholder='Search Customer or Vendor Name'
        search={filter}
        updateSearch={onFilterChange}
        rangable={true}
        range={range}
        updateRange={onRangeChange}
        downloadable={true}
        sortable={true}
        sortOpts={sortOpts}
        sort={sort}
        updateSort={(_sort: string) => setSort(_sort)}
        selectTitle="Status"
        selectOpts={statusOpts.map(item => ({ name: item, value: item.toLowerCase() }))}
        category={category}
        updateCategory={(_cat: string) => setCategory(_cat)}
        className={styles.tableToolbar}
        actions={
          <div className={styles.actions}>
            <div className={styles.submitButtons}>
              <div>
                <p>Submit</p>
                <button
                  className={clsx(styles.button, styles.submit)}
                  onClick={onSubmitClick}
                >
                  Submit
                </button>
              </div>
              <div>
                <p>Reset</p>
                <button
                  className={clsx(styles.button, styles.reset)}
                  onClick={onResetClick}
                >
                  Reset
                </button>
              </div>
            </div>
            <div>
              <p>New</p>
              <button
                className={clsx(styles.button, styles.new)}
                onClick={() => navigate(`${COMMUNITY_PATH}/create`)}
              >
                New
              </button>
            </div>
          </div>
        }
      />
      <TableBody
        columns={columns}
        rows={communities}
        className={styles.tableBody}
      />
    </Card>
  );
}
