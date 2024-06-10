import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { TableBody } from '@/components/common';
import { GridIcon, TrashIcon } from '@/components/icons';
import { HttpService } from '@/services';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { ISpecification, deleteSpec } from '@/redux/reducers';
import { ITableColumn } from '@/interfaces';

import styles from './Specifications.module.scss';

export type ISpecWithID = ISpecification & { _id?: string };

const SPEC_KEYS = [
  'SKU',
  'UPC',
  'Weight',
  'Height',
  'Width',
  'Length',
  'Package Quantity',
];
const PRODUCT_PATH = '/vendor/products';

const getSpecName = (name: string) => {
  const spec = SPEC_KEYS.find(item => item.toLowerCase() === name);
  return spec;
}

export function Specifications() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const storeSpecs = useAppSelector(state => state.product.specifications);

  const [specifications, setSpecifications] = useState<ISpecWithID[]>([]);

  const onDeleteClick = (id: string) => () => {
    if (productId === 'create') {
      dispatch(deleteSpec(Number(id)));
    } else {
      HttpService.put(
        `/products/${productId}/specification`,
        specifications.filter(item => item._id !== id),
      ).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Specification deleted.', { variant: 'success' });
          setSpecifications(specifications.filter(item => item._id !== id));
        }
      });
    }
  };

  const onEditClick = (id: number | string) => () => {
    navigate(`${PRODUCT_PATH}/${productId}/specifications/${id}`);
  }

  const stylesTableColumns: ITableColumn[] = [
    {
      title: 'Specification Name',
      name: 'name',
      width: 400,
      cell: (row: any) => (
        <div className={styles.name}>
          <GridIcon />
          <span>{getSpecName(row.name)}</span>
        </div>
      ),
    },
    {
      title: 'Action',
      name: 'action',
      width: 250,
      cell: (row: any) => (
        <div className={styles.action}>
          <button className={styles.button} onClick={onEditClick(productId === 'create' ? row.index : row._id)}>
            Edit
          </button>
          <span onClick={onDeleteClick(productId === 'create' ? row.index : row._id)}>
            <TrashIcon />
          </span>
        </div>
      ),
    },
  ];

  const onOrderChange = (ids: string[]) => {
    const orderedRows = ids.map((id: string) => specifications.find(item => item._id === id)).filter(item => item);
    HttpService.put(`/products/${productId}/specification`, orderedRows).then(response => {
      const { status } = response;
      if (status === 200) {
        enqueueSnackbar("Order changed.", { variant: 'success' });
      }
    })
  }

  useEffect(() => {
    if (productId === 'create') {
      setSpecifications(storeSpecs);
    } else {
      HttpService.get(`/products/${productId}/specification`).then(response => {
        const { status, specifications } = response;
        if (status === 200) {
          setSpecifications(specifications);
        }
      });
    }
  }, [productId, storeSpecs]);

  return (
    <div className={styles.container}>
      <div className={styles.buttonBar}>
        <button
          className={styles.button}
          onClick={() =>
            navigate(`${PRODUCT_PATH}/${productId}/specifications/create`)
          }
        >
          New
        </button>
      </div>
      <TableBody selectable={true} columns={stylesTableColumns} rows={specifications} setRows={setSpecifications} onRowMove={onOrderChange} />
    </div>
  );
}
