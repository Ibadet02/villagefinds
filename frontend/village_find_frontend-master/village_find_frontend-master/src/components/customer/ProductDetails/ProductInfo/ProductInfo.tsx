import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaMinus, FaPlus, FaStaylinked } from 'react-icons/fa6';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { ImageUpload, Select, TextField, Button } from '@/components/forms';

import { HttpService } from '@/services';
import { IOrderDetail } from '@/pages/customer';
import { AuthContext, CartContext } from '@/providers';
import { useAppSelector } from '@/redux/store';
import { ChangeInputEvent } from '@/interfaces';
import { SERVER_URL } from '@/config/global';

import styles from './ProductInfo.module.scss';

interface ICartProduct {
  styleID: string;
  quantity: number;
  image: File | null;
}

const frequencyOpts = [
  { name: 'Weekly', value: '1-week' },
  { name: 'Every month', value: '1-month' },
  { name: 'Every 2 months', value: '2-month' },
  { name: 'Every 3 months', value: '3-month' },
  { name: 'Every 6 months', value: '6-month' },
];

const durationOpts = [
  { name: 'Week', value: 'week' },
  { name: 'Month', value: 'month' }
];

const getFrequencyName = (frequency: string) => {
  const option = frequencyOpts.find(item => item.value === frequency);
  return option?.name || '';
}

const getFrequencyUnit = (frequency: string) => {
  const values = frequency.split('-');
  const option = durationOpts.find(item => item.value === values[1]);
  return option?.name || '';
}

export function ProductInfo({
  _id: productId,
  name,
  price,
  image,
  vendor,
  community,
  styles: variants,
  inventories,
  customization = { fee: 0, customText: '' },
  subscription,
  soldByUnit,
  deliveryTypes,
}: IOrderDetail) {
  const navigate = useNavigate();

  const { isLogin, account } = useContext(AuthContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const guestID = useAppSelector(state => state.guest.guestID);

  const [cartProduct, setCartProduct] = useState<ICartProduct>({
    styleID: '',
    quantity: 1,
    image: null,
  });
  const [selectedInventID, setSelectedInventID] = useState<string>('main');
  const [attributes, setAttributes] = useState<string[]>([]);
  const [isPersonalized, setIsPersonalized] = useState<Boolean>(false);
  const [customMessage, setCustomMessage] = useState('');

  const selectedStyle = useMemo(() => {
    const variant = variants.find((type: any) => type._id === cartProduct.styleID);
    return variant;
  }, [cartProduct.styleID]);
  const selectedInvent = useMemo(() => {
    if (!cartProduct.styleID) return null;
    return inventories.find((item: any) => item._id === selectedInventID);
  }, [selectedInventID]);

  const productPrice = useMemo(() => {
    return (selectedInvent && selectedInvent.price) || price;
  }, [selectedInvent, price]);
  const productDiscount = useMemo(() => {
    return (subscription?.iscsa)
      ? (subscription.discount + (selectedStyle?.discount || 0))
      : (selectedStyle?.discount || 0)
  }, [selectedStyle, subscription]);
  const productOffPrice = useMemo(() => {
    return (productPrice * (100 - productDiscount)) / 100.0;
  }, [productPrice, productDiscount]);
  const productImage = useMemo(() => {
    return (selectedInvent && selectedInvent.image) || image;
  }, [image, selectedInvent]);
  const csaCycle = useMemo(() => {
    if (subscription?.iscsa) {
      const values = subscription.csa?.frequency.split('-') || '';
      return Number((subscription.csa?.duration || 0) / Number(values[0] || 1));
    }
    return 0;
  }, [subscription]);

  const onMinusClick = () => {
    if (cartProduct.quantity === 0) return;
    setCartProduct({ ...cartProduct, quantity: cartProduct.quantity - 1 });
  };

  const onPlusClick = () => {
    setCartProduct({ ...cartProduct, quantity: cartProduct.quantity + 1 });
  };

  const onStyleChange = (id: string) => {
    const style = variants.find(item => item._id === id);
    setCartProduct({ ...cartProduct, styleID: id });
    setAttributes(Array(style?.attributes.length).fill(''));
    if (!style?.attributes.length) {
      const inventory = inventories.find(item => item.styleId === id);
      if (inventory) setSelectedInventID(inventory._id);
    }
  };

  const onImageChange = (imageSrc: File) => {
    setCartProduct({ ...cartProduct, image: imageSrc });
  };

  const onAddCartClick = () => {
    if (!cartProduct.quantity) {
      return enqueueSnackbar('Select product quantity.', { variant: 'warning' });
    }
    if (selectedStyle && !selectedInvent) {
      return enqueueSnackbar('Select attributes.', { variant: 'warning' });
    }

    const reqJson: any = {
      vendorId: vendor._id,
      productId,
      name,
      price: productOffPrice,
      quantity: cartProduct.quantity,
      image: productImage,
      discount: productDiscount
    };
    if (subscription) reqJson.subscription = subscription;
    if (selectedStyle && selectedInvent) {
      reqJson.attributes =
        selectedStyle.attributes
          .map((item, index) => ({ name: item.name, value: attributes[index] }))
    }

    const params: any = {};
    if (isLogin) {
      params.mode = 'customer';
      params.buyerID = account?.profile._id;
    } else {
      params.mode = 'guest';
      params.buyerID = guestID;
    }

    HttpService.post('/cart', reqJson, params).then(response => {
      const { status, cartItem } = response;
      if (status === 200) {
        setCartItems([...cartItems, cartItem]);
        enqueueSnackbar('Product added to cart.', { variant: 'success' });
        navigate('/checkout');
      }
    })
  };

  const onAttributeChange = (index: number) => (value: string) => {
    const attrResults = attributes.map((item: string, id: number) => id === index ? value : item);
    if (attrResults.every(item => !!item)) {
      const inventory = inventories.find((item: any) =>
        attrResults.length === item.attrs.length &&
        item.attrs.every((attribute: string, index: number) => attrResults[index] === attribute)
      );
      if (inventory) setSelectedInventID(inventory._id);
    }
    setAttributes(attrResults);
  };

  const onImageClick = (inventory: { _id: string; styleId: string; attrs: string[]; }) => () => {
    if (!inventory) return;

    setAttributes(inventory.attrs);
    setCartProduct({ ...cartProduct, styleID: inventory.styleId });
    setSelectedInventID(inventory._id);
  };

  const onMessageChange = (e: ChangeInputEvent) => {
    if (e.target.value.length > 500) return;
    setCustomMessage(e.target.value);
  };

  const onVendorClick = () => {
    navigate(`/vendors/${vendor._id}`);
  };

  const onCommunityClick = () => {
    navigate(`/communities/${community.slug}`);
  };

  return (
    <div className={styles.root}>
      <div className={styles.link}>
        <p className={styles.toVendor} onClick={onVendorClick}>
          {vendor.shopName}
        </p>
        <div className={styles.comInfo}>
          <p className={styles.toCommunity} onClick={onCommunityClick}>
            {community.name}
          </p>
          <img
            src={`${SERVER_URL}/${community.images.logoUrl}`}
            alt="Community Logo"
          />
        </div>
      </div>
      <div className={styles.blank}></div>
      <div className={styles.images}>
        <div className={styles.smallImages}>
          {[{ _id: 'main', styleId: '', image, attrs: [] }, ...inventories]
            .filter((inventory: any) => inventory.image)
            .map((inventory: any) => (
              <img
                key={inventory._id}
                src={`${SERVER_URL}/${inventory.image}`}
                className={clsx({
                  [styles.active]:
                    selectedInventID === inventory._id
                })}
                onClick={onImageClick(inventory)}
              />
            ))}
        </div>
        <div className={styles.topicImage}>
          <img
            src={`${SERVER_URL}/${productImage}`}
          />
        </div>
        <img />
      </div>
      <div className={styles.info}>
        <div className={styles.head}>
          <p>{name}</p>
        </div>
        <div className={styles.style}>
          <p className={styles.lowerPrice}>${productOffPrice.toFixed(2)}</p>
          <p
            className={clsx(styles.realPrice, {
              hidden: productDiscount === 0,
            })}
          >
            <span className={styles.totalPrice}>
              ${productPrice.toFixed(2)}
            </span>{' '}
            <span className={styles.discount}>
              {productDiscount.toFixed(2)}% off
            </span>
          </p>
          <p className={styles.centPrice}>
            Minimum {1} {soldByUnit} at ${productPrice}/{soldByUnit}
          </p>
          {variants.length !== 0 && <div className={styles.style}>
            <Select
              placeholder="Style"
              options={variants.map((style: { _id: string; name: string }) => ({
                ...style,
                value: style._id,
              }))}
              value={cartProduct.styleID}
              updateValue={onStyleChange}
              className={styles.styleSelect}
            />
            {selectedStyle &&
              selectedStyle.attributes.map((attribute: any, index: number) => (
                <Select
                  className={styles.styleSelect}
                  placeholder={attribute.name}
                  options={attribute.values}
                  value={attributes[index]}
                  updateValue={onAttributeChange(index)}
                />
              ))}
          </div>}
        </div>
        {
          customization && customization.customText && <>
            <div className={styles.personalization}>
              <div
                className={styles.dropdown}
                onClick={() => setIsPersonalized(!isPersonalized)}
              >
                <p>Add personalization</p>
                {!isPersonalized ? (
                  <FaChevronDown size={15} />
                ) : (
                  <FaChevronUp size={15} />
                )}
              </div>
              <p>
                Personalization Fee: <span>${customization.fee.toFixed(2)}</span>
              </p>
            </div>
            {isPersonalized && <div className={styles.message}>
              <div className={styles.example}>
                <p>{customization.customText}</p>
              </div>
              <div className={styles.msgInput}>
                <TextField
                  rows={4}
                  placeholder="Type here"
                  value={customMessage}
                  updateValue={onMessageChange}
                  className={
                    customMessage.length === 500 ? styles.dangerMessage : ''
                  }
                />
                <div
                  className={clsx(styles.alerts, {
                    [styles.warning]: customMessage.length === 500,
                  })}
                >
                  <span
                    className={clsx(styles.invalidLength, {
                      hidden: customMessage.length !== 500,
                    })}
                  >
                    The message must be a maximum of 500 characters.
                  </span>
                  <span className={styles.letterLength}>
                    {500 - customMessage.length}
                  </span>
                </div>
              </div>
            </div>}
          </>
        }
        <div className={styles.logo}>
          <p>Add your logo or image here</p>
          <ImageUpload
            exWidth={0}
            exHeight={0}
            updateBaseImage={onImageChange}
          />
        </div>
        <div className={styles.quantity}>
          <span className={styles.minus} onClick={onMinusClick}>
            <FaMinus />
          </span>
          <p>{cartProduct.quantity}cnt</p>
          <span className={styles.plus} onClick={onPlusClick}>
            <FaPlus />
          </span>
        </div>
        <Button className={styles.addToCartBtn} onClick={onAddCartClick}>
          Add to Cart
        </Button>
        {subscription?.iscsa && (
          <div className={styles.local}>
            <p className={styles.header}>Subscription Information</p>
            <p className={styles.factor}>
              Fulfillment Day: <span>Determined at checkout</span>
            </p>
            <p className={clsx(styles.factor, styles.concern)}>
              Subscription Duration: <span>{`${subscription.csa?.duration} ${getFrequencyUnit(subscription.csa?.frequency || '')}${subscription.csa?.duration === 1 ? '' : 's'}`}</span>
            </p>
            <p className={clsx(styles.factor, styles.concern)}>
              Subscription Frequency: <span>{getFrequencyName(subscription.csa?.frequency || '')}</span>
            </p>
            <p className={styles.hint}>
              <span>Your card will be charged </span>$
              {productOffPrice *
                cartProduct.quantity *
                csaCycle}{' '}
              {subscription?.csa?.duration
                ? `every ${subscription.csa.duration} weeks`
                : 'every week'}{' '}
              <span>or until cancelation</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
