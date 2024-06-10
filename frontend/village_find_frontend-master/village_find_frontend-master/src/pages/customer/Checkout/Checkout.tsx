import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import clsx from 'clsx';

import { Container } from '@/components/layout/customer';

import {
  AuthPanel,
  MyCart,
  OrderSummary,
  Payment,
  ShippingMode,
  Complete,
} from '@/components/customer/Checkout';
import { useAppSelector } from '@/redux/store';
import { AuthContext, CartContext } from '@/providers';
import { HttpService } from '@/services';
import { STRIPE_PUBLISH_KEY } from '@/config/global';

import styles from './Checkout.module.scss';

const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);

export function Checkout() {
  const [searchParams] = useSearchParams();

  const { isLogin } = useContext(AuthContext);
  const { cartItems, setCartItems, summary } = useContext(CartContext);

  const [step, setStep] = useState(0);
  const [donation, setDonation] = useState(1);
  const [shipping, setShipping] = useState('');

  const onNextStep = () => {
    setStep(step + 1);
  };

  useEffect(() => {
  }, []);

  useEffect(() => {
    const step = searchParams.get('step');
    if (!step) {
      setStep(0);
    } else if (step === 'shipping') {
      setStep(1);
    }
  }, [searchParams]);

  return (
    <Container
      className={clsx(styles.root, { [styles.fullWidth]: step === 3 })}
    >
      <div className={styles.contentPanel}>
        {step !== 3 && <AuthPanel isLogin={isLogin} />}
        {step === 0 ? (
          <MyCart
            isLogin={isLogin}
            onNextStep={onNextStep}
            setCartItems={setCartItems}
            donation={donation}
            setDonation={setDonation}
          />
        ) : step === 1 ? (
          <ShippingMode onNextStep={onNextStep} shipping={shipping} setShipping={setShipping} />
        ) : step === 2 ? (
          <Elements stripe={stripePromise}>
            <Payment
              onNextStep={onNextStep}
              summary={summary}
              cartItems={cartItems}
              donation={donation}
              shipping={shipping}
            />
          </Elements>
        ) : (
          <Complete />
        )}
      </div>
      {step !== 3 && (
        <div className={styles.summary}>
          <OrderSummary summary={summary} />
        </div>
      )}
    </Container>
  );
}
