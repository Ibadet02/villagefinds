import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { enqueueSnackbar } from 'notistack';

import { StyleCreateContext } from '../Layout';
import { Input } from '@/components/forms';
import { TrashIcon } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { createStyle, updateStyle } from '@/redux/reducers';
import { IAttribute } from '@/redux/reducers';
import { HttpService } from '@/services';
import { ChangeInputEvent } from '@/interfaces';

import styles from './StyleCreate.module.scss';
import { ProductContext } from '../../../Provider';

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

export function StyleCreate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { productId, styleId } = useParams();
  const storeStyles = useAppSelector(state => state.product.styles);

  const { styleImages, setStyleImages } = useContext(ProductContext);
  const { attributes, setAttributes, styleName, setStyleName } =
    useContext(StyleCreateContext);
  const [currentAttrIndex, setCurrentAttrIndex] = useState(-1);
  const [currentValueIndex, setCurrentValueIndex] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);

  const onCreateAttrClick = () => {
    setAttributes([...attributes, { name: '', values: [] }]);
    setIsDirty(true);
  };

  const onStyleNameChange = (e: ChangeInputEvent) => {
    setStyleName(e.target.value);
    setIsDirty(true);
  };

  const onAttrNameChange = (attrIndex: number) => (e: ChangeInputEvent) => {
    setAttributes(
      attributes.map((attribute: IAttribute, index: number) =>
        index === attrIndex
          ? { ...attribute, name: e.target.value }
          : attribute,
      ),
    );
    setIsDirty(true);
  };

  const onAddValueClick = (attrIndex: number) => () => {
    setAttributes(
      attributes.map((attribute: IAttribute, index: number) =>
        index === attrIndex
          ? {
            ...attribute,
            values: [
              ...attribute.values,
              `Value${attribute.values.length + 1}`,
            ],
          }
          : attribute,
      ),
    );
    setIsDirty(true);
  };

  const onEditValueClick = (attrIndex: number, vIndex: number) => {
    setCurrentAttrIndex(attrIndex);
    setCurrentValueIndex(vIndex);
    setIsDirty(true);
  };

  const onDeleteValueClick = (e: any, attrIndex: number, vIndex: number) => {
    e.stopPropagation();
    const newValues = [...attributes[attrIndex].values];
    newValues.splice(vIndex);
    setAttributes(
      attributes.map((attribute: IAttribute, index: number) =>
        index === attrIndex ? { ...attribute, values: newValues } : attribute,
      ),
    );
  };

  const onAttrValueChange =
    (attrIndex: number, vIndex: number) => (e: ChangeInputEvent) => {
      setAttributes(
        attributes.map((attribute: IAttribute, _attrIndex: number) =>
          attrIndex === _attrIndex
            ? {
              ...attribute,
              values: attribute.values.map((value: string, _vIndex: number) =>
                _vIndex === vIndex ? e.target.value : value,
              ),
            }
            : attribute,
        ),
      );
      setIsDirty(true);
    };

  const onAttrValueBlur = () => {
    setCurrentAttrIndex(-1);
    setCurrentValueIndex(-1);
  };

  const onAttrRemoveClick = (attrIndex: number) => () => {
    setAttributes(attributes.filter((_, index) => index !== attrIndex));
    setIsDirty(true);
  }

  const onNextClick = () => {
    if (productId === 'create') {
      if (styleId === 'create') {
        const inventRows = getSubRows(attributes, 0, { attrs: [] }).map(
          (row: any, index: number) => ({
            ...row,
            index,
            price: 0,
            quantity: 0,
            status: 'active',
          }));
        dispatch(createStyle({
          index: -1,
          name: styleName,
          attributes,
          inventories: inventRows,
          images: Array(inventRows.length).fill(null),
          imageSrcs: Array(inventRows.length).fill(''),
          status: 'active'
        }));
        setStyleImages([...styleImages, { images: Array(inventRows.length).fill(null) }]);
      } else {
        dispatch(updateStyle({
          id: Number(styleId),
          style: {
            name: styleName,
            attributes,
          }
        }));
      }
      navigate('attribute');
    } else {
      if (styleId !== 'create') {
        if (!isDirty) {
          return navigate('attribute');
        }
        return HttpService.put(`/styles/${styleId}`, {
          name: styleName,
          attributes,
        }).then(response => {
          const { status } = response;
          if (status === 200) {
            enqueueSnackbar('Attributes saved!', { variant: 'success' });
            navigate('attribute');
          }
        });
      }
      HttpService.post(
        `/styles`,
        {
          name: styleName,
          attributes,
        },
        { productId },
      ).then(response => {
        const { status, styleId } = response;
        if (status === 200) {
          enqueueSnackbar('Attributes saved!', { variant: 'success' });
          navigate(pathname.replace('create', `${styleId}/attribute`));
        }
      });
    }
  };

  useEffect(() => {
    if (productId === 'create') {
      const style = storeStyles.find(item => item.index === Number(styleId));
      if (style) {
        setStyleName(style.name);
        setAttributes(style.attributes);
      }
    } else {
      if (styleId === 'create') {
        setAttributes([]);
        setStyleName('');
        setCurrentAttrIndex(-1);
        setCurrentValueIndex(-1);
        return;
      }
      HttpService.get(`/styles/${styleId}`).then(response => {
        const { status, style } = response;
        if (status === 200) {
          setAttributes(style.attributes || []);
          setStyleName(style.name || '');
        }
      });
    }
  }, [productId, styleId]);

  return (
    <div className={styles.container}>
      <div className={styles.addAttr}>
        <div className={styles.control}>
          <p>Style Name</p>
          <Input
            rounded="full"
            border="none"
            bgcolor="secondary"
            placeholder="Beeded"
            value={styleName}
            updateValue={onStyleNameChange}
          />
        </div>
        <button className={styles.button} onClick={onCreateAttrClick}>
          New Attribute
        </button>
      </div>
      <div className={styles.form}>
        {attributes.map((attribute: IAttribute, attrIndex: number) => (
          <div className={styles.attribute} key={attrIndex}>
            <div className={styles.control}>
              <div className={styles.heading}>
                <p>Attribute Name</p>
                <span onClick={onAttrRemoveClick(attrIndex)}><TrashIcon /></span>
              </div>
              <Input
                rounded="full"
                border="none"
                bgcolor="secondary"
                placeholder="Name"
                className={styles.attrNameInput}
                value={attribute.name}
                updateValue={onAttrNameChange(attrIndex)}
              />
            </div>
            <div className={styles.control}>
              <p>Attribute Values</p>
              <div className={styles.valueBar}>
                {attribute.values.map((value: string, vIndex: number) =>
                  currentAttrIndex === attrIndex &&
                    currentValueIndex === vIndex ? (
                    <Input
                      key={vIndex}
                      className={styles.valueInput}
                      value={value}
                      updateValue={onAttrValueChange(attrIndex, vIndex)}
                      onBlur={onAttrValueBlur}
                      onKeyDown={(e: KeyboardEvent) =>
                        e.keyCode === 13 && onAttrValueBlur()
                      }
                    />
                  ) : (
                    <div
                      key={vIndex}
                      className={styles.valueChip}
                      onClick={() => onEditValueClick(attrIndex, vIndex)}
                    >
                      <p>{value}</p>
                      <span
                        onClick={(e: any) =>
                          onDeleteValueClick(e, attrIndex, vIndex)
                        }
                      >
                        <FaTimes />
                      </span>
                    </div>
                  ),
                )}
                <button
                  className={styles.addButton}
                  onClick={onAddValueClick(attrIndex)}
                >
                  Add
                  <span>+</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.buttonBar}>
        <button className={styles.button} onClick={onNextClick}>
          Next
        </button>
      </div>
    </div>
  );
}
