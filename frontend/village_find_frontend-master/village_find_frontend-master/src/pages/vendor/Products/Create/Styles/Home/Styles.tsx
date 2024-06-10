import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { TableBody } from '@/components/common';
import { Input, Select } from '@/components/forms';
import { GridIcon, TrashIcon } from '@/components/icons';

import { ChangeInputEvent, ITableColumn } from '@/interfaces';
import { HttpService } from '@/services';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { deleteStyle, updateStyle } from '@/redux/reducers';
import { IStyle } from '@/redux/reducers';

import styles from './Styles.module.scss';

const statusOptions = ['Active', 'Inactive'];
const PRODUCT_PATH = '/vendor/products';

type IStyleWithID = IStyle & { _id?: string };

export function Styles() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const storeStyles = useAppSelector(state => state.product.styles);
  const [productStyles, setProductStyles] = useState<IStyleWithID[]>([]);

  const onDiscountChange = (id: string | number) => (e: ChangeInputEvent) => {
    setProductStyles(productStyles =>
      productStyles.map((style: IStyleWithID) =>
        (productId === 'create' ? id === style.index : id === style._id)
          ? { ...style, discount: Number(e.target.value) }
          : style,
      ),
    );
  };

  const onStatusChange = (id: string | number) => (value: string) => {
    if (productId === 'create') {
      dispatch(updateStyle({
        id: Number(id),
        style: { status: value }
      }))
    } else {
      HttpService.put(`/styles/${id}/status`, { status: value }).then(
        response => {
          const { status } = response;
          if (status === 200) {
            enqueueSnackbar('Status updated.', { variant: 'success' });
            setProductStyles(
              productStyles.map(item =>
                item._id === id ? { ...item, status: value } : item,
              ),
            );
          }
        },
      );
    }
  };

  const onRowPosChange = (ids: string[]) => {
    if (productId === 'create') {
    } else {
      HttpService.put('/styles/order/place', ids, { productID: productId }).then(
        response => {
          const { status } = response;
          if (status === 200) {
            enqueueSnackbar('Styles order changed.', { variant: 'success' });
          }
        },
      );
    }
  };

  const onDiscountUpdateClick = (id: number | string) => () => {
    if (productId === 'create') {
      setProductStyles(productStyles => {
        const style = productStyles.find((style: IStyleWithID) => (productId === 'create' ? id === style.index : id === style._id));
        dispatch(updateStyle({
          id: Number(id),
          style: { discount: style?.discount }
        }));
        return productStyles;
      })
    }
    else {
      setProductStyles(productStyles => {
        const style = productStyles.find((item: IStyleWithID) => {
          if (productId === 'create') return item.index === id;
          return item._id === id;
        });
        HttpService.put(`/styles/${id}/discount`, {
          discount: style?.discount || 0,
        }).then(response => {
          const { status } = response;
          if (status === 200) {
            enqueueSnackbar('Discount updated!', { variant: 'success' });
          }
        });
        return productStyles;
      })
    }
  };

  const onEditClick = (id: number | string) => () => {
    navigate(id.toString());
  };

  const onDeleteClick = (id: number | string) => () => {
    if (productId === 'create') {
      dispatch(deleteStyle(Number(id)));
    } else {
      HttpService.delete(`/styles/${id}`).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Style deleted.', { variant: 'success' });
        }
      })
    }
  }

  const stylesTableColumns: ITableColumn[] = useMemo(() => [
    {
      title: 'Style Name',
      name: 'name',
      width: 150,
      cell: (row: any) => (
        <div className={styles.name}>
          <GridIcon />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      title: 'Discount',
      name: 'discount',
      width: 400,
      cell: (row: any) => (
        <div className={styles.discountCell}>
          <Input
            type="number"
            rounded="full"
            placeholder="Discount"
            adornment={{
              position: 'right',
              content: '%',
            }}
            className={styles.discount}
            value={row.discount}
            updateValue={onDiscountChange(productId === 'create' ? row.index : row._id)}
          />
          <button
            className={styles.button}
            onClick={onDiscountUpdateClick(productId === 'create' ? row.index : row._id)}
          >
            Update
          </button>
        </div>
      ),
    },
    {
      title: 'Status',
      name: 'status',
      width: 150,
      cell: (row: any) => (
        <Select
          placeholder="Active"
          rounded="full"
          className={styles.status}
          options={statusOptions.map(item => ({
            name: item,
            value: item.toLowerCase(),
          }))}
          value={row.status || 'inactive'}
          updateValue={onStatusChange(productId === 'create' ? row.index : row._id)}
        />
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
        </div >
      ),
    },
  ], [productId]);

  useEffect(() => {
    if (productId === 'create') {
      setProductStyles(storeStyles);
    } else {
      HttpService.get(`/products/vendor/${productId}/style`).then(response => {
        setProductStyles(response || []);
      })
      // HttpService.get('/styles/vendor', { productId }).then(response => {
      //   const { status, styles, orderIDS } = response;
      //   if (status === 200) {
      //     setProductStyles(
      //       orderIDS.map((orderID: string) =>
      //         styles.find((item: any) => item._id === orderID),
      //       ),
      //     );
      //   }
      // });
    }
  }, [productId, storeStyles]);

  return (
    <div className={styles.container}>
      <div className={styles.buttonBar}>
        <button
          className={styles.button}
          onClick={() => navigate(`${PRODUCT_PATH}/${productId}/style/create`)}
        >
          New
        </button>
      </div>
      <TableBody
        columns={stylesTableColumns}
        rows={productStyles}
        setRows={setProductStyles}
        selectable={true}
        onRowMove={onRowPosChange}
      />
    </div>
  );
}
