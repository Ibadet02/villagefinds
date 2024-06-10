import { useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import clsx from 'clsx';

import { Button, Radio } from '@/components/forms';

import { useOnClickOutside } from '@/utils';

import styles from './CartDialog.module.scss';

interface ICartDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialCartItems = [
  {
    isActive: true,
    image: '/assets/customer/products/product1.png',
    title: 'Mystery Awesome Box',
    quantity: 1,
    price: 10.93,
    minimum: 2.99,
  },
  {
    image: '/assets/customer/products/product2.png',
    title: 'Mystery Awesome Box',
    quantity: 1,
    price: 80.93,
    minimum: 2.99,
  },
  {
    image: '/assets/customer/products/product7.png',
    title: 'Mystery Awesome Box',
    quantity: 1,
    price: 80.93,
    minimum: 2.99,
  },
  {
    image: '/assets/customer/products/product6.png',
    title: 'Mystery Awesome Box',
    quantity: 1,
    price: 80.93,
    minimum: 2.99,
  },
];

export function CartDialog({ open, onClose }: ICartDialogProps) {
  const [totalPrice] = useState<number>(81.27);
  const [cartItems, setCartItems] = useState<any[]>(initialCartItems);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  useEffect(() => {
    if (cartRef.current === null) return;
    useOnClickOutside(cartRef, onClose, 'mousedown');
  }, []);

  return (
    <div className={clsx(styles.root, !open ? styles.hide : '')}>
      <div className={styles.cart} ref={cartRef}>
        <div className={styles.header}>
          <div className={styles.title}>
            <p>My Cart</p>
            <span>
              <img src={'/assets/customer/svgs/trash.svg'} />
            </span>
          </div>
          <Button className={styles.closeBtn} onClick={onClose}>
            Close
          </Button>
        </div>
        <div className={styles.content}>
          {cartItems.map((cartItem: any, index: number) => (
            <div key={index} className={styles.cartItem}>
              <div className={styles.cartInfo}>
                <Radio />
                <img src={cartItem.image} />
                <div className={styles.text}>
                  <p className={styles.title}>{cartItem.title}</p>
                  <p className={styles.minimumPrice}>
                    Minimum ${cartItem.quantity} Bunch at $
                    {cartItem.minimum.toFixed(2)}/bu
                  </p>
                </div>
              </div>
              <div className={styles.cartPrice}>
                <div className={styles.quantity}>
                  <span className={styles.minus}>
                    <FaMinus />
                  </span>
                  <p>{cartItem.quantity}</p>
                  <span className={styles.plus}>
                    <FaPlus fill="white" />
                  </span>
                </div>
                <div className={styles.price}>${cartItem.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <div className={styles.text}>
            <p className={styles.title}>Subtotal</p>
            <p className={styles.price}>${totalPrice.toFixed(2)}</p>
          </div>
          <Button className={styles.checkBtn}>Checkout</Button>
        </div>
      </div>
    </div>
  );
}
