import { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, TableToolbar, TableBody } from '@/components/common';
import { Select } from '@/components/forms';

import { TrashIcon } from '@/components/icons';

import { HttpService, TagService } from '@/services';

import { useTagsStore } from '@/stores';

import { ITableColumn } from '@/interfaces';

import styles from './ProductTags.module.scss';

const TAG_PATH = '/admin/settings/dashboard/tags';
const STATUS_OPTS = ['Active', 'Inactive'];

type ITag = {
  _id: string;
  name: string;
  status: string;
}

export function ProductTags() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<ITag[]>([]);
  // const {
  //   tags: storeTags,
  //   setTags: setStoreTags,
  //   deleteTag: deleteStoreTag,
  // } = useTagsStore();

  const onEditClick = (id: string) => {
    navigate(`${TAG_PATH}/${id}`);
  };

  const statuses: string[] = ['Active', 'Inactive'];
  const columns: ITableColumn[] = [
    {
      title: 'Tag Name',
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
          options={STATUS_OPTS.map(item => ({ name: item, value: item.toLowerCase() }))}
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
            onClick={() => onEditClick(row._id)}
          >
            Edit
          </button>
          <span onClick={() => onDeleteClick(row._id)}>
            <TrashIcon />
          </span>
        </div>
      ),
    },
  ];

  const updateFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const onStatusChange = (id: string) => (value: string) => {
    HttpService.put(`/settings/general/tag/${id}`, { status: value }).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Tag status updated.', { variant: 'success' });
        setTags(tags.map(item => item._id === id ? ({ ...item, status: value }) : item))
      }
    })
  }

  const updateStatus = (_category: string) => {
    setCategory(_category);
  };

  const onDeleteClick = (id: string) => {
    HttpService.delete(`/settings/general/tag/${id}`).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar('Product tag deleted.', { variant: 'success' })
        setTags(tags.filter(item => item._id !== id));
      }
    })
  };

  useEffect(() => {
    const params: any = {};
    if (filter) params.name = filter;
    if (category) params.status = category;
    HttpService.get('/settings/general/tag', params).then(response => {
      setTags(response);
    })
  }, [filter, category]);

  return (
    <Card title="Product Tags" className={styles.root}>
      <TableToolbar
        search={filter}
        updateSearch={updateFilter}
        searchTitle="Tag Name"
        category={category}
        updateCategory={updateStatus}
        selectTitle="Status"
        selectOpts={STATUS_OPTS.map(item => ({ name: item, value: item.toLowerCase() }))}
        className={styles.tableToolbar}
        actions={
          <div>
            <p className={styles.buttonLabel}>New</p>
            <button
              className={styles.actionButton}
              onClick={() => navigate(`${TAG_PATH}/create`)}
            >
              New
            </button>
          </div>
        }
      />
      <TableBody
        columns={columns}
        rows={tags}
        className={styles.tableBody}
      />
    </Card>
  );
}
