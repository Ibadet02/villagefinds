import { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, TableToolbar, TableBody } from '@/components/common';
import { Select } from '@/components/forms';
import { TrashIcon } from '@/components/icons';
import { HttpService } from '@/services';
import { ITableColumn } from '@/interfaces';

import styles from './Posts.module.scss';

const options = [
  {
    name: 'Active',
    value: 'active',
  },
  {
    name: 'Inactive',
    value: 'inactive',
  },
];
const postPathPrefix = '/admin/settings/dashboard/posts';

export function Posts() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [posts, setPosts] = useState<any[]>([]);

  const columns: ITableColumn[] = [
    {
      title: 'Post Name',
      name: 'title',
      width: 250,
    },
    {
      title: 'Topic',
      name: 'topic',
      width: 250,
    },
    {
      title: 'Status',
      name: 'status',
      width: 250,
      cell: (row: any) => (
        <Select
          rounded="full"
          value={row.status || 'inactive'}
          updateValue={onStatusChange(row._id)}
          options={options}
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
            onClick={() => navigate(`${postPathPrefix}/${row._id}`)}
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

  const updateFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const updateStatus = (_category: string) => {
    setCategory(_category);
  };

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put('/settings/general/support', { id }).then(response => {
      const { message } = response;
      if (message === 'updated') {
        enqueueSnackbar('Post status updated.', { variant: 'success' });
        setPosts(
          posts.map(item =>
            item._id === id ? { ...item, status: value } : item,
          ),
        );
      }
    });
  };

  const onDeleteClick = (id: string) => () => {
    HttpService.delete('/settings/general/support', { id }).then(response => {
      const { message } = response;
      if (message === 'deleted') {
        enqueueSnackbar('Post deleted.', { variant: 'success' });
        setPosts(posts.filter(item => item._id !== id))
      }
    });
  };

  useEffect(() => {
    HttpService.get('/settings/general/support').then(response => {
      setPosts(response || []);
    });
  }, [filter, category]);

  return (
    <Card title="Support Center" className={styles.root}>
      <TableToolbar
        search={filter}
        updateSearch={updateFilter}
        searchTitle="Metric Name"
        category={category}
        updateCategory={updateStatus}
        selectTitle="Status"
        selectOpts={options}
        className={styles.tableToolbar}
        actions={
          <div>
            <p className={styles.buttonLabel}>New</p>
            <button
              className={styles.actionButton}
              onClick={() => navigate(`${postPathPrefix}/create`)}
            >
              New
            </button>
          </div>
        }
      />
      <TableBody columns={columns} rows={posts} className={styles.tableBody} />
    </Card>
  );
}
