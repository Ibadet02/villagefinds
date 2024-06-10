import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { enqueueSnackbar } from 'notistack';

import { StyleCreateContext } from '../Layout';
import { ProductContext } from '../../../Provider';
import { Button, Input, Select, TableBody } from '@/components';
import { ChangeInputEvent } from '@/interfaces';
import { HttpService } from '@/services';
import { IAttribute, updateStyle } from '@/redux/reducers';
import { SERVER_URL } from '@/config/global';

import styles from './Attributes.module.scss';

const statusOpts = ['Active', 'Inactive', 'Delete'];
const PRODUCT_PATH = '/vendor/products';

const getSubRows = (
  attrs: IAttribute[],
  index: number,
  current: { attrs: String[] },
): any[] => {
  if (attrs.length === 0) return [current];
  return attrs[0].values
    .map((value: string) =>
      getSubRows(attrs.slice(1), index + 1, {
        attrs: [
          ...current.attrs,
          value
        ],
      }),
    )
    .flat(1);
};

export function Attributes() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { styleId, productId } = useParams();

  const storeStyles = useAppSelector(state => state.product.styles);
  const currentStyleID = useAppSelector(state => state.product.currentStyleID);

  const { styleName, setStyleName, attributes, setAttributes } =
    useContext(StyleCreateContext);
  const { styleImages, setStyleImages } = useContext(ProductContext);

  const [rows, setRows] = useState<any[]>([]);
  const [images, setImages] = useState<(File | null)[]>([]);
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);

  const onRowChange = (id: number) => (e: ChangeInputEvent) => {
    setRows(rows => rows.map((row: any) =>
      id === row.index
        ? { ...row, [e.target.name]: e.target.value }
        : row
    ));
  };

  const onStatusChange = (id: number) => (value: string) => {
    setRows(rows => rows.map((row: any) =>
      id === row.index
        ? { ...row, status: value }
        : row
    ));
  };

  const onImageChange = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const result = e.target?.result;
      if (result) {
        const results = imageSrcs.map((item: string, index: number) =>
          index === id ? (result as string) : item,
        );
        setImageSrcs(results);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
    const results = images.map((image: File | null, index: number) =>
      index === id ? e.target.files && e.target.files[0] : image);
    setImages(results);
  };

  const columns = useMemo(
    () => [
      ...attributes.map((attribute: IAttribute, index: number) => ({
        title: attribute.name,
        name: attribute.name.toLowerCase(),
        width: 100,
        cell: (row: any) => (
          <div className={styles.cell}>
            {row.attrs[index]}
          </div>
        ),
      })),
      {
        title: 'Price',
        name: 'price',
        width: 150,
        cell: (row: any) => (
          <Input
            name="price"
            rounded="full"
            className={styles.priceInput}
            value={row.price ?? 0}
            updateValue={onRowChange(row.index)}
            adornment={{
              position: 'left',
              content: '$',
            }}
          />
        ),
      },
      {
        title: 'Inventory',
        name: 'inventory',
        width: 150,
        cell: (row: any) => (
          <Input
            name="quantity"
            placeholder="Inventory"
            rounded="full"
            className={styles.inventoryInput}
            value={row.quantity || ''}
            updateValue={onRowChange(row.index)}
          />
        ),
      },
      {
        title: 'Status',
        name: 'status',
        width: 150,
        cell: (row: any) => (
          <Select
            rounded="full"
            options={statusOpts.map(status => ({
              name: status,
              value: status.toLowerCase(),
            }))}
            className={styles.statusSelect}
            value={row.status}
            updateValue={onStatusChange(row.index)}
          />
        ),
      },
      {
        title: 'Image',
        name: 'image',
        width: 300,
        cell: (row: any) => (
          <Input
            type="file"
            rounded="full"
            border="none"
            bgcolor="secondary"
            className={styles.imageInput}
            updateValue={onImageChange(row.index)}
          />
        ),
      },
      {
        title: 'Dimensions',
        name: 'dimensions',
        width: 200,
        cell: (row: any) => (
          <div className={styles.dimensions}>
            <img
              src={imageSrcs[row.index]
                || `${SERVER_URL}/${row.image}`}
              alt="inventory"
            />
            <span>+</span>
          </div>
        ),
      },
    ],
    [attributes, images, imageSrcs],
  );

  const onUpdateClick = () => {
    if (productId === 'create') {
      const updateStyleID = styleId === 'create' ? currentStyleID : Number(styleId);
      dispatch(updateStyle({
        id: updateStyleID,
        style: {
          inventories: rows,
          imageSrcs
        }
      }));
      setStyleImages(styleImages.map((style: { images: (File | null)[] }, index: number) =>
        index === updateStyleID ? { ...style, images } : style
      ));
      navigate(`${PRODUCT_PATH}/${productId}/style`);
      enqueueSnackbar(`Style ${styleId === 'create' ? 'created' : 'updated'}.`, { variant: 'success' });
    } else {
      HttpService.put(`/styles/${styleId}/inventory`, rows).then(response => {
        const { status, ids } = response;
        if (status === 200) {
          const imageWithIDs = new FormData();
          const liveIDs: string[] = [];
          images.forEach((image: File | null, index: number) => {
            if (image) {
              liveIDs.push(ids[index]);
              imageWithIDs.append('images', image);
            }
          });
          imageWithIDs.append('inventIDs', JSON.stringify(liveIDs));

          HttpService.put(`/inventories/image`, imageWithIDs, {
            styleId,
          }).then(response => {
            const { status } = response;
            if (status === 200) {
              enqueueSnackbar('Inventories saved.', {
                variant: 'success',
              });
              navigate(`${PRODUCT_PATH}/${productId}/style`);
            } else if (status === 404) {
              navigate(`${PRODUCT_PATH}`);
              enqueueSnackbar('Product is not valid!', { variant: 'warning' });
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    if (productId === 'create') {
      const updateStyleID = styleId === 'create' ? currentStyleID : Number(styleId);
      const style = storeStyles[updateStyleID];
      if (style) {
        setRows(style.inventories);
        setImages(styleImages[updateStyleID].images);
        setImageSrcs(style.imageSrcs);
      }
    } else {
      HttpService.get(`/styles/${styleId}`).then(response => {
        const { status, style } = response;
        if (status === 200) {
          const { name, attributes, inventories } = style;
          setStyleName(name);
          setAttributes(attributes);
          if (inventories.length === 0) {
            const resultRows = getSubRows(attributes, 0, { attrs: [] })
              .map((item, index) => ({ ...item, index, status: 'active' }))
            setRows(resultRows);
            setImages(Array(resultRows.length).fill(null));
            setImageSrcs(Array(resultRows.length).fill(null));
          } else {
            setRows(
              inventories.map((inventory: any, index: number) => ({
                ...inventory,
                index,
                status: inventory.status || 'active',
              })),
            );
            setImages(Array(inventories.length).fill(null));
            setImageSrcs(Array(inventories.length).fill(''));
          }
        }
      });
    }
  }, [productId, styleId, currentStyleID, storeStyles]);

  return (
    <div className={styles.container}>
      <p className={styles.heading}>
        <span>Style Name: </span>
        {styleName}
      </p>
      <TableBody columns={columns} rows={rows} />
      <div className={styles.buttons}>
        <Button className={styles.updateBtn} onClick={onUpdateClick}>
          {productId === 'create' ? 'Save' : 'Update'}
        </Button>
      </div>
    </div>
  );
}
