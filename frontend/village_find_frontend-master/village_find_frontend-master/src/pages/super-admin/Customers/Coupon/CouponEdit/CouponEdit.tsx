import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Card, TableBody } from '@/components/common';
import { Input, Select, RadioGroup, Radio } from '@/components/forms';
import { MagnifierIcon } from '@/components/icons';
import { CouponService, HttpService } from '@/services';
import { ChangeInputEvent, ITableColumn } from '@/interfaces';
import { getBubbleObject } from '@/utils/data/getBubbleObject';
import { ICoupon, couponTypes } from '@/pages/super-admin';

import ProductSvg from '/assets/admin/backs/product.svg';
import styles from './CouponEdit.module.scss';

interface ICustomer {
  firstName: string;
  lastName: string;
  email: string;
}

const customerColumns: ITableColumn[] = [
  {
    title: 'Select',
    name: 'select',
    width: 100,
    cell: (row: any) => <Radio value={row._id} />,
  },
  {
    title: 'Customer Name',
    name: 'name',
    width: 200,
    cell: (row: any) => <p>{`${row.firstName} ${row.lastName}`}</p>
  },
  {
    title: 'Email',
    name: 'email',
    width: 350,
  },
];

const productColumns: ITableColumn[] = [
  {
    title: 'Select',
    name: 'select',
    width: 100,
    cell: (row: any) => (
      <Radio label={<img src={ProductSvg} />} value={row._id} />
    ),
  },
  {
    title: 'Product Name',
    name: 'name',
    width: 200,
  },
  {
    title: 'Original Price',
    name: 'oprice',
    width: 150,
    cell: (row: any) => <span>${row.oprice}</span>,
  },
  {
    title: 'Discount',
    name: 'discount',
    width: 100,
    cell: (row: any) => <span>{row.discount ? `$${row.discount}%` : ''}</span>,
  },
  {
    title: 'Discounted Price',
    name: 'dprice',
    width: 200,
    cell: (row: any) => <span>${row.dprice}</span>,
  },
];

const initialProducts: any[] = [
  {
    id: 1,
    name: 'Black Polish Radish',
    oprice: 10,
    discount: 10,
    dprice: 9,
  },
  {
    id: 2,
    name: 'Black Polish Radish',
    oprice: 10,
    discount: 10,
    dprice: 9,
  },
  {
    id: 3,
    name: 'Black Polish Radish',
    oprice: 10,
    discount: 10,
    dprice: 9,
  },
];

const initialCoupon: ICoupon = {
  type: 'freeshipping',
  name: '',
  shipping: {
    mode: 'code',
  },
  target: {
    mode: 'global'
  },
  startDate: '',
  endDate: '',
  status: 'inactive'
}

const COUPON_PATH = '/admin/customers/coupon';

const getDateStr = (date: string) => {
  return date.split('T')[0];
}

export function CouponEdit() {
  const { id: couponId } = useParams();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState<ICoupon>(initialCoupon);
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  const updateStrForm = (field: string) => (value: string) => {
    setCoupon(getBubbleObject(field, coupon, value));
  };

  const updateInputForm = (field: string) => (e: any) => {
    setCoupon(getBubbleObject(field, coupon, typeof e === 'string' ? e : e.target.value));
  };

  const updateCondition = (field: string, index: number) => (e: any) => {
    setCoupon({
      ...coupon,
      conditions: coupon.conditions?.map((_condition: any, _index: number) =>
        _index === index
          ? { ..._condition, [field]: e.target.value }
          : _condition,
      ),
    });
  };

  const onConditionAddClick = () => {
    setCoupon({
      ...coupon,
      conditions: [...(coupon.conditions as any[]), { discount: 0 }],
    });
  };

  const onAddBtnClick = () => {
    if (couponId === 'create') {
      HttpService.post('/coupons', coupon).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Coupon created.', { variant: 'success' });
          navigate(COUPON_PATH);
        }
      });
    } else {
      HttpService.put(`/coupons/${couponId}`, coupon).then(response => {
        const { status } = response;
        if (status === 200) {
          enqueueSnackbar('Coupon updated.', { variant: 'success' });
          navigate(COUPON_PATH);
        }
      })
    }
  };

  const onCouponChange = (e: ChangeInputEvent) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    if (!couponId || couponId === 'create') return;
    CouponService.findOne(couponId).then(response => {
      const { status, coupon } = response;
      if (status === 200) setCoupon(coupon);
    });
  }, [couponId]);

  useEffect(() => {
    HttpService.get('/user/customer').then(response => {
      setCustomers(response);
    });
  }, []);

  return (
    <Card title="Coupon Center" className={styles.root}>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.control}>
            <p>Coupon Name</p>
            <Input
              name='name'
              placeholder='Name'
              value={coupon.name}
              updateValue={onCouponChange}
              className={styles.nameInput}
            />
          </div>
          <div className={styles.control}>
            <p>Coupon Type</p>
            <Select
              placeholder="Coupon Type"
              options={couponTypes}
              value={coupon.type}
              updateValue={updateStrForm('type')}
              className={styles.typeSelector}
            />
          </div>
          {coupon.type === 'percent' && (
            <div className={styles.control}>
              <p>Code</p>
              <Input
                placeholder="Code"
                value={coupon.percent?.code}
                updateValue={updateInputForm('percent.code')}
                className={styles.amountInput}
              />
            </div>
          )}
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p>Start Date</p>
              <Input
                name='startDate'
                type="date"
                value={getDateStr(coupon.startDate || '')}
                updateValue={onCouponChange}
              />
            </div>
            <div className={styles.control}>
              <p>End Date</p>
              <Input
                name='endDate'
                type="date"
                value={getDateStr(coupon.endDate || '')}
                updateValue={onCouponChange}
              />
            </div>
          </div>
          {coupon.type === 'freeshipping' && (
            <>
              <div className={styles.control}>
                <p>Coupon Use</p>
                <RadioGroup
                  value={coupon.shipping?.mode || 'code'}
                  updateValue={updateStrForm('shipping.mode')}
                >
                  <Radio label="Use Code" value="code" />
                  <Radio label="Amount Spent" value="amount" />
                </RadioGroup>
              </div>
              <div className={styles.control}>
                <p>
                  {(coupon.shipping?.mode || 'code') === 'code'
                    ? 'Code'
                    : 'Amount needed to spend'}
                </p>
                <Input
                  placeholder={
                    (coupon.shipping?.mode || 'code') === 'code' ? 'Code' : 'Amount Spent'
                  }
                  value={
                    (coupon.shipping?.mode || 'code') === 'code'
                      ? coupon.shipping?.code
                      : coupon.shipping?.amount
                  }
                  updateValue={updateInputForm(
                    (coupon.shipping?.mode || 'code') === 'code'
                      ? 'shipping.code'
                      : 'shipping.amount',
                  )}
                  className={styles.amountInput}
                  adornment={{
                    position: 'left',
                    content: '$',
                  }}
                />
              </div>
            </>
          )}
          {coupon.type === 'percent' && (
            <div className={styles.control}>
              <p>Discount %</p>
              <Input
                placeholder="Discount"
                value={coupon.percent?.discount}
                updateValue={updateInputForm('percent.discount')}
                className={styles.amountInput}
                adornment={{
                  position: 'left',
                  content: '%',
                }}
              />
            </div>
          )}
          {coupon.type === 'tiered' && (
            <div className={styles.tiered}>
              {(coupon.conditions || []).map((condition: any, index: number) => (
                <div className={styles.horizon}>
                  <div className={styles.control}>
                    {index === 0 && <p>Discount</p>}
                    <Input
                      placeholder="Discount"
                      value={condition.discount}
                      updateValue={updateCondition('discount', index)}
                      className={styles.amountInput}
                      adornment={{
                        position: 'left',
                        content: '%',
                      }}
                    />
                  </div>
                  <div className={styles.control}>
                    {index === 0 && <p>Minimum Spend</p>}
                    <Input
                      placeholder="Minimum Spend"
                      value={condition.minimum}
                      updateValue={updateCondition('minimum', index)}
                      className={styles.amountInput}
                      adornment={{
                        position: 'left',
                        content: '$',
                      }}
                    />
                  </div>
                  <div className={styles.control}>
                    {index === 0 && <p>Maximum Spend</p>}
                    <Input
                      placeholder="Minimum Spend"
                      value={condition.maximum}
                      updateValue={updateCondition('maximum', index)}
                      className={styles.amountInput}
                      adornment={{
                        position: 'left',
                        content: '$',
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className={styles.tieredButton}>
                <button onClick={onConditionAddClick}>Add +</button>
              </div>
            </div>
          )}
          <div className={styles.control}>
            <p>Who's it for?</p>
            <RadioGroup
              value={coupon.target.mode}
              updateValue={updateStrForm('target.mode')}
            >
              <Radio label="Global Coupon" value="global" />
              <Radio label="Product Specific" value="product" />
              {coupon.target.mode !== 'tiered' && (
                <Radio label="Customer Specific" value="customer" />
              )}
            </RadioGroup>
          </div>
          {coupon.target.mode !== 'global' && (
            <div className={styles.control}>
              <p>
                {coupon.target.mode === 'customer'
                  ? 'Customers'
                  : 'Products'}
              </p>
              <div className={styles.dataTable}>
                <Input
                  placeholder={`Search for a ${coupon.target.mode === 'customer'
                    ? 'customer'
                    : 'product'
                    }`}
                  size="large"
                  adornment={{
                    position: 'right',
                    content: <MagnifierIcon />,
                  }}
                  rounded="full"
                  className={styles.searchInput}
                />
                <RadioGroup value={coupon.target.id} updateValue={updateInputForm('target.id')}>
                  <TableBody
                    columns={
                      coupon.target.mode === 'customer'
                        ? customerColumns
                        : productColumns
                    }
                    rows={
                      coupon.target.mode === 'customer'
                        ? customers
                        : initialProducts
                    }
                  />
                </RadioGroup>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttonBar}>
        <button
          className={styles.cancelButton}
          onClick={() => navigate(COUPON_PATH)}
        >
          Cancel
        </button>
        <button className={styles.addButton} onClick={onAddBtnClick}>
          {couponId === 'create' ? 'Add' : 'Update'}
        </button>
      </div>
    </Card>
  );
}
