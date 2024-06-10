import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, TableBody } from '@/components/common';
import { Input, Select } from '@/components/forms';
import { TrashIcon } from '@/components/icons';

import { HttpService } from '@/services';
import { ChangeInputEvent, ITableColumn } from '@/interfaces';
import { useAppDispatch } from '@/redux/store';
import { resetProduct } from '@/redux/reducers';
import { capitalizeFirstLetter } from '@/utils';
import { SERVER_URL } from '@/config/global';

import styles from './Products.module.scss';

interface IProductItem {
  _id: string;
  name: string;
  sku?: string;
  inventory?: string;
  status: string;
}

const statusList = ['Active', 'Inactive', 'Delete'];
const sortOptions = ['Newest', 'Oldest', 'Active', 'Inactive'];

export function Products() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [nameFilter, setNameFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [skuFilter, setSkuFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const onStatusChange = (productId: string) => (value: string) => {
    HttpService.put(`/products/${productId}`, { status: value }).then(
      response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar(
            `Product status changed to ${capitalizeFirstLetter(value)}.`,
            { variant: 'success' },
          );
          setProducts(
            products.map((product: IProductItem) =>
              product._id === productId
                ? { ...product, status: value }
                : product,
            ),
          );
        }
      },
    );
  };

  const onNewBtnClick = () => {
    dispatch(resetProduct());
    navigate('create');
  }

  const onProductDeleteClick = (id: string) => () => {
    HttpService.delete(`/products/${id}`).then(response => {
      const { status } = response;
      if (status === 200) {
        setProducts(products.filter(item => item._id !== id));
        enqueueSnackbar('Product deleted.', { variant: 'success' });
      }
    });
  };

  const productsTableColumns: ITableColumn[] = [
    {
      title: 'Image',
      name: 'image',
      width: 100,
      cell: (row: any) => <img src={`${SERVER_URL}/${row.image}`} />,
    },
    {
      title: 'Product Name',
      name: 'name',
      width: 200,
    },
    {
      title: 'Product SKU',
      name: 'sku',
      width: 150,
    },
    {
      title: 'Status',
      name: 'status',
      width: 250,
      cell: (row: any) => (
        <Select
          rounded="full"
          bgcolor="white"
          border="solid"
          className={styles.statusSelect}
          options={statusList.map(item => ({
            name: item,
            value: item.toLowerCase(),
          }))}
          value={row.status.toLowerCase()}
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
          <button className={styles.button} onClick={() => navigate(row._id)}>
            Edit
          </button>
          <span onClick={onProductDeleteClick(row._id)}>
            <TrashIcon />
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const params: any = {
      name: nameFilter,
      id: idFilter,
      sku: skuFilter,
      sortBy,
    };
    HttpService.get('/products/vendor', params).then(response => {
      setProducts(response);
    });
  }, [nameFilter, idFilter, skuFilter, sortBy]);

  return (
    <Card title="My Products" className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.control}>
            <p>Product Name</p>
            <Input
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Product Name"
              value={nameFilter}
              updateValue={(e: ChangeInputEvent) =>
                setNameFilter(e.target.value)
              }
            />
          </div>
          <div className={styles.control}>
            <p>Product Id</p>
            <Input
              type="number"
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Product Id"
              value={idFilter}
              updateValue={(e: ChangeInputEvent) => setIdFilter(e.target.value)}
            />
          </div>
          <div className={styles.control}>
            <p>Product SKU</p>
            <Input
              rounded="full"
              border="none"
              bgcolor="secondary"
              placeholder="Product SKU"
              value={skuFilter}
              updateValue={(e: ChangeInputEvent) =>
                setSkuFilter(e.target.value)
              }
            />
          </div>
          <div className={styles.control}>
            <p>Sort By</p>
            <Select
              rounded="full"
              border="none"
              bgcolor="primary"
              placeholder="Sort By"
              className={styles.select}
              options={sortOptions.map(item => ({
                name: item,
                value: item.toLowerCase(),
              }))}
              value={sortBy}
              updateValue={(value: string) => setSortBy(value)}
            />
          </div>
          <div className={styles.buttonBar}>
            <button
              className={styles.button}
              onClick={onNewBtnClick}
            >
              New
            </button>
          </div>
        </div>
        <TableBody columns={productsTableColumns} rows={products} />
      </div>
    </Card>
  );
}
