import { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { StripeCardNumberElement } from '@stripe/stripe-js';
import { enqueueSnackbar } from 'notistack';
import { FaCheck } from 'react-icons/fa6';

import { ICartItem, ISummary } from '@/pages/customer';
import { Button, Input } from '@/components/forms';
import { HttpService } from '@/services';

import styles from './Payment.module.scss';

interface IPayment {
  email: string;
  cardNumber: string;
  expireDate: string;
  verifyCode: string;
  cardName: string;
  country: string;
  zipcode: string;
  phoneNumber: string;
  isOneClick: boolean;
}

const initialPayment: IPayment = {
  email: '',
  cardNumber: '',
  expireDate: '',
  verifyCode: '',
  cardName: '',
  country: '',
  zipcode: '',
  phoneNumber: '',
  isOneClick: false,
};

interface IPaymentProps {
  onNextStep: () => void;
  summary: ISummary;
  cartItems: ICartItem[];
  donation: number;
  shipping: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '12px',
      fontFamily: 'Calibri',
      color: '#3F3F3F',
      '::placeholder': {
        color: '#3F3F3F',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export function Payment({
  onNextStep = () => { },
  summary,
  cartItems,
  donation,
  shipping
}: IPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [payment, setPayment] = useState<IPayment>(initialPayment);

  const onPaymentChange = (e: any) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const onOneClickChange = () => {
    setPayment({ ...payment, isOneClick: !payment.isOneClick });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      enqueueSnackbar('Payment information invalid.', { variant: 'warning' });
      return;
    }

    (async () => {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        enqueueSnackbar('Card number is invalid.', {
          variant: 'warning',
        });
        return;
      }

      // const { paymentMethod, error } =
      //   await stripe.createPaymentMethod({ type: 'card', card: cardNumberElement });
      // if (error) {
      //   console.error(error);
      // } else {
      //   fetch('/create-payment-intent', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ paymentMethodId: paymentMethod.id })
      //   }).then(response => response.json()).then(data => {
      //     stripe.confirmCardPayment(data.clientSecret);
      //   });
      // }

      // const { error, token } = await stripe.createToken(cardNumberElement);
      // if (error) {
      //   enqueueSnackbar(error.message, { variant: 'warning' });
      //   return;
      // }

      HttpService.post('/cart/checkout', {
        cartItems,
        donation,
      }).then(response => {
        const { status } = response;
        if (status === 200) {
          onNextStep();
        }
      });

      // HttpService.post('/stripe/create-payment-method', {
      //   detail: payment,
      //   token: token.id,
      // }).then(response => {
      //   const { status } = response;
      //   if (status === 200) {
      //     enqueueSnackbar('Payment success.', { variant: 'success' });
      //   }
      // });
    })();
  };

  return (
    <div className={styles.root}>
      <p className={styles.head}>Pay With Card</p>

      <form onSubmit={handleSubmit} className={styles.body}>
        <div className={styles.element}>
          <p className={styles.title}>Email</p>
          <Input
            name="email"
            placeholder="Email"
            className={styles.input}
            value={payment.email}
            updateValue={onPaymentChange}
          />
        </div>
        <div className={styles.element}>
          <label className={styles.title}>Card Information</label>
          <div className={styles.vertics}>
            <div className={styles.element}>
              <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <div className={styles.vdivider} />
            <div className={styles.horizon}>
              <div className={styles.element}>
                <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              <div className={styles.hdivider} />
              <div className={styles.element}>
                <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.element}>
          <p className={styles.title}>Cardholder Name</p>
          <Input
            name="cardName"
            placeholder="Full Name on Card"
            className={styles.input}
            value={payment.cardName}
            updateValue={onPaymentChange}
          />
        </div>
        <div className={styles.element}>
          <p className={styles.title}>Country or Region</p>
          <div className={styles.vertics}>
            <Input
              name="country"
              placeholder="United States"
              className={styles.input}
              value={payment.country}
              updateValue={onPaymentChange}
            />
            <div className={styles.vdivider} />
            <Input
              name="zipcode"
              placeholder="ZIP"
              className={styles.input}
              value={payment.zipcode}
              updateValue={onPaymentChange}
            />
          </div>
        </div>
        <div className={styles.element}>
          <p className={styles.title}>Country or Region</p>
          <div className={styles.vertics}>
            <div className={styles.saveLink}>
              <div className={styles.checkPanel} onClick={onOneClickChange}>
                <span>{payment.isOneClick && <FaCheck size={12} />}</span>
                <p className={styles.label}>
                  Save my info for 1-click checkout with Link
                </p>
              </div>
              <p className={styles.statement}>
                Securely pay on Stripe Docs Demos and everywhere Link is
                accepted
              </p>
            </div>
            <div className={styles.vdivider} />
            <Input
              name="phoneNumber"
              placeholder="(201) 555-0123"
              className={styles.input}
              value={payment.phoneNumber}
              updateValue={onPaymentChange}
            />
          </div>
        </div>

        <Button className={styles.payBtn} disabled={!stripe}>
          Pay
        </Button>
      </form>
    </div>
  );
}
