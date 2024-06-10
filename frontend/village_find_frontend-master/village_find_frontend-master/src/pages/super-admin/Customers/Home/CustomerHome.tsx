import { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Card, TableBody, TableToolbar } from '@/components';
import { Select } from '@/components/forms';
import { TrashIcon } from '@/components/icons';

import { HttpService } from '@/services';

import { ICustomer, IRange, ITableColumn } from '@/interfaces';

import styles from './CustomerHome.module.scss';

const initialRange = {
  from: '',
  to: '',
};

const sortOpts = [
  { name: 'Alphabetical Order', value: 'alphabeta' },
  { name: 'Recently Added', value: 'recent' },
  { name: 'Highest Revenue', value: 'highest' },
  { name: 'Lowest Revenue', value: 'lowest' },
];
const statusOpts = ['Active', 'Inactive'];
const CUSTOMER_PATH = '/admin/customers/home';

export function CustomerHome() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [range, setRange] = useState<IRange>(initialRange);
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  const columns: ITableColumn[] = [
    {
      title: 'Customer Name',
      name: 'name',
      width: 200,
      cell: (row: any) => (
        <span className={styles.cell}>
          {row.fullName}
        </span>
      ),
    },
    {
      title: 'Email',
      name: 'email',
      width: 200,
      cell: (row: any) => <span className={styles.cell}>{row.email}</span>,
    },
    {
      title: 'Status',
      name: 'status',
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
      title: 'Phone Number',
      name: 'phone',
      width: 200,
      cell: (row: any) => <span className={styles.cell}>{row.phone}</span>,
    },
    {
      title: 'Address',
      name: 'address',
      width: 200,
      cell: (row: any) => <span className={styles.cell}>{row.address}</span>,
    },
    {
      title: 'Action',
      name: 'action',
      width: 250,
      cell: (row: any) => (
        <div className={styles.actionCell}>
          <button
            className={styles.actionButton}
            onClick={() => navigate(`${CUSTOMER_PATH}/${row._id}`)}
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

  const loadCustomers = ({ filter = '', sort = '', category = '', range = { from: '', to: '' } }: any) => {
    const params: any = {};
    if (filter) params.name = filter;
    if (sort) params.sort = sort;
    if (category) params.status = category;
    if (range.from) params.from = range.from;
    if (range.to) params.to = range.to;
    HttpService.get('/user/customer/admin', params).then(response => {
      setCustomers(response || []);
    })
  }

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const onRangeChange =
    (which: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setRange({ ...range, [which]: e.target.value });
    };

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put(`/user/customer/${id}`, { status: value }).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Status changed.', { variant: 'success' });
        setCustomers(customers.map(item => item._id === id ? ({ ...item, status: value }) : item));
      }
    })
  }

  const onDeleteClick = (id: string) => () => {
    HttpService.delete(`/user/customer/${id}`).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Customer removed.', { variant: 'success' });
        setCustomers(customers.filter(item => item._id !== id));
      }
    })
  };

  const onSubmitClick = () => {
    loadCustomers({ filter, sort, category, range });
  };

  const onResetClick = () => {
    setFilter('');
    setCategory('');
    setSort('');
    setRange({
      from: '',
      to: '',
    });
    loadCustomers({});
  };

  useEffect(() => {
    loadCustomers({});
  }, []);

  return (
    <Card title="Customer Management" className={styles.root}>
      <TableToolbar
        searchTitle="Search Customer Name"
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
        }
      />
      <TableBody
        columns={columns}
        rows={customers}
        className={styles.tableBody}
      />
    </Card>
  );
}
