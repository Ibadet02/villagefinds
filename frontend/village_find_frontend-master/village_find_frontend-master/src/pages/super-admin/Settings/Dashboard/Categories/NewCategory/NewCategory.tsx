import { ChangeEvent, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, Input, Select } from '@/components';

import { CategoryService } from '@/services';

import { useCategoryStore } from '@/stores';

import { ICategory } from '@/interfaces';

import styles from './NewCategory.module.scss';

const initialCategory: ICategory = {
  name: '',
  status: '',
};
const initialStatus = ['Active', 'Inactive'];

const backToPath = '/admin/settings/dashboard/category';

export function NewCategory() {
  const navigate = useNavigate();
  const { id: categoryId }: any = useParams();
  const { updateCategory: updateStoreCategory } = useCategoryStore();
  const [category, setCategory] = useState<ICategory>(initialCategory);

  const updateCatName = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, name: e.target.value });
  };

  const updateCatStatus = (status: string) => {
    setCategory({ ...category, status });
  };

  const onCreateClick = () => {
    if (categoryId === 'create') {
      CategoryService.createOne(category)
        .then(() => {
          enqueueSnackbar('Category added successfully!', {
            variant: 'success',
          });
          navigate(backToPath);
        })
        .catch(err => {
          enqueueSnackbar('Error occured!', { variant: 'error' });
        });
    } else {
      CategoryService.updateOne(categoryId, category)
        .then(() => {
          enqueueSnackbar('Category updated successfully!', {
            variant: 'success',
          });
          updateStoreCategory(categoryId, category);
          navigate(backToPath);
        })
        .catch(err => {
          enqueueSnackbar('Error occured!', { variant: 'error' });
        });
    }
  };

  useEffect(() => {
    if (!categoryId || categoryId === 'create') {
      setCategory(initialCategory);
    } else {
      CategoryService.findOne(categoryId).then(category => {
        setCategory(category);
      });
    }
  }, [categoryId]);

  return (
    <Card title="New Category" className={styles.root}>
      <div className={styles.form}>
        <div className={styles.control}>
          <p>Category Name</p>
          <Input
            value={category.name}
            updateValue={updateCatName}
            placeholder="Category Name"
          />
        </div>
        <div className={styles.control}>
          <p>Status</p>
          <Select
            value={category.status}
            updateValue={updateCatStatus}
            placeholder="Status"
            options={initialStatus}
          />
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button
          className={styles.cancelButton}
          onClick={() => navigate(backToPath)}
        >
          Cancel
        </button>
        <button className={styles.addButton} onClick={onCreateClick}>
          {categoryId === 'create' ? 'Add' : 'Edit'}
        </button>
      </div>
    </Card>
  );
}
