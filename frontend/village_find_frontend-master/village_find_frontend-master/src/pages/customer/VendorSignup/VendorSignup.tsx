import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

import { Button, Input, Radio, RadioGroup } from '@/components/forms';

import { HttpService } from '@/services';

import styles from './VendorSignup.module.scss';
import { enqueueSnackbar } from 'notistack';
import { AuthContext } from '@/providers';
import { setupToken } from '@/utils';

const initialRoles = [
  'SEO & Marketing',
  'Product Photography',
  'Writing product descriptions',
  'General business help',
];

interface IAccount {
  shopName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirm?: string;
  zipcode: string;
}

interface ICommunity {
  _id?: string;
  name: string;
  images?: {
    logoUrl: string;
    backgroundUrl: string;
  };
}

const initialAccount = {
  shopName: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirm: '',
  zipcode: '',
};

interface ISubscription {
  _id: string;
  name: string;
  description: string;
  monthInvest: number;
  expectedFee: number;
  transactionFee: number;
}

const formatMonthlyFee = (price: number) => {
  return price === 0 ? 'Free' : `$${price.toFixed(2)} a month`;
};

export function VendorSignup() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [step, setStep] = useState(0);
  const [collapseId, setCollapseId] = useState(0);
  const [maxCollapseId, setMaxCollapseId] = useState(0);
  const [roleIndex, setRoleIndex] = useState('0');

  const [account, setAccount] = useState<IAccount>(initialAccount);
  const [community, setCommunity] = useState<ICommunity | null>(null);
  const [subscription, setSubscription] = useState('');
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [codes, setCodes] = useState<string[]>(Array(5).fill(''));
  const [codeIssue, setCodeIssue] = useState('');
  const fullCode = useMemo(() => {
    return codes.join('');
  }, [codes]);

  const codeRefs = [...Array(5)].map((_: any) =>
    useRef<HTMLInputElement>(null),
  );

  const initializeStates = () => {
    setStep(0);
    setCollapseId(0);
    setMaxCollapseId(0);
    setCodeIssue('');
    setSubscription('');
    setCodes(Array(5).fill(''));
    setCommunity(null);
  };

  const navigateCollapse = (id: number) => {
    if (id <= maxCollapseId) setCollapseId(id);
  };

  const onCodeSubmit = () => {
    if (fullCode.length !== 5) {
      setCodeIssue('Invalid code');
    } else {
      // navigate(`/sign-up/vendor?community_code=${fullCode}`);
      searchParams.set('community_code', fullCode);
      setSearchParams(searchParams);
    }
  };

  const onLoginClick = (e: any) => {
    e.preventDefault();
    navigate('/login/vendor');
  };

  const onAccountChange = (e: any) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const onCodeChange = (e: any, index: number) => {
    const value = e.key;
    if (value.length === 1) {
      index === 5
        ? codeRefs[0].current?.focus()
        : codeRefs[index + 1].current?.focus();
      setCodes(
        codes.map((code: string, _index: number) =>
          index === _index ? value : code,
        ),
      );
    }
  };

  const onNextCollapse = () => {
    if (collapseId === 2) {
      setCollapseId(4);
      setMaxCollapseId(4);
    } else {
      setCollapseId(collapseId + 1);
      setMaxCollapseId(collapseId + 1);
    }
  };

  const onSignupClick = () => {
    if (account.password === account.confirm) {
      const reqJson: any = { ...account, subscription };
      if (community) reqJson.community = community._id;
      delete reqJson.confirm;

      HttpService.post('/user/vendor/register', reqJson)
        .then(response => {
          const { status, token } = response;
          if (status === 200) {
            enqueueSnackbar('Vendor signup successfully!', {
              variant: 'success',
            });

            initializeStates();
            setupToken(token, 'vendor');
            navigate('/vendor/profile/bank-detail');
          } else if (status === 500) {
            enqueueSnackbar('Something went wrong with server', {
              variant: 'error',
            });
          }
        })
        .catch(err => {
          enqueueSnackbar('Something went wrong with server', {
            variant: 'error',
          });
        });
    }
  };

  const onSignupWithoutCommunity = () => {
    navigate('/sign-up/vendor?community_code=none');
  };

  useEffect(() => {
    const communtiyCode = searchParams.get('community_code') as string;
    if (
      communtiyCode === 'none' ||
      (communtiyCode && communtiyCode.length === 5)
    ) {
      setStep(1);

      if (communtiyCode === 'none') {
        setCodes(Array(5).fill(''));
        setCollapseId(1);
        setMaxCollapseId(1);
        setCommunity(null);
      } else {
        HttpService.get(`/communities?code=${communtiyCode}`).then(response => {
          const { status, community } = response;
          if (status === 200) {
            setCodeIssue('');
            setCommunity(community);
            setCollapseId(1);
            setMaxCollapseId(1);
          } else if (status === 404) {
            setCodeIssue('Invalid code');
            setCommunity(null);
          }
        });
      }
    } else {
      setCollapseId(0);
    }

    const subscriptionName = searchParams.get('subscription') as string;
    setSubscription(subscriptionName);
  }, [searchParams]);

  useEffect(() => {
    HttpService.get('/subscriptions').then(response => {
      setSubscriptions(response)
    })
  }, []);

  return (
    <div className={clsx(styles.root, { [styles.primary]: step > 0 })}>
      {step === 0 ? (
        <div className={styles.dashboard}>
          <div className={styles.head}>
            <p className={styles.title}>
              It takes a community to build a successful company!
            </p>
            <p className={styles.text}>
              Share with us what kind of help your business may need! We provide
              education and or help in these areas.
            </p>
          </div>
          <div className={styles.body}>
            <RadioGroup
              className={styles.roleList}
              value={roleIndex}
              updateValue={(index: string) => setRoleIndex(index)}
            >
              {initialRoles.map((role: string, index: number) => (
                <div
                  key={index}
                  className={clsx(styles.role, {
                    [styles.active]: roleIndex === index.toString(),
                  })}
                  onClick={() => setRoleIndex(index.toString())}
                >
                  <Radio
                    label={role}
                    className={styles.radio}
                    value={index.toString()}
                  />
                </div>
              ))}
            </RadioGroup>
            <Button
              className={styles.nextBtn}
              onClick={() => setStep(step + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.register}>
          <div className={styles.head}>
            {collapseId === 0 && <p className={styles.title}>Vendor Sign Up</p>}
            {collapseId > 0 && fullCode !== '' && (
              <p className={styles.without} onClick={onSignupWithoutCommunity}>
                Signup without vendor community
              </p>
            )}
            {collapseId > 0 && community && (
              <div className={styles.image}>
                <img
                  src="/assets/customer/backs/vendor-signup.png"
                  alt="Primary background image"
                />
                <div className={styles.metaInfo}>
                  <img
                    src="/assets/customer/backs/shopvcom.png"
                    alt="Vendor community general logo"
                  />
                  <div className={styles.text}>
                    <p className={styles.title}>{community && community.name}</p>
                    <p>Vendor Community</p>
                  </div>
                </div>
                <div className={styles.grayLayer} />
              </div>
            )}
          </div>
          <div className={styles.body}>
            <div
              className={clsx(styles.communityCode, styles.section, {
                [styles.active]: collapseId === 0,
              })}
            >
              <div className={styles.text}>
                <p
                  className={styles.title}
                  onClick={() => navigate('/sign-up/vendor')}
                >
                  Vendor Community Code
                </p>
                {collapseId === 0 && (
                  <p className={styles.description}>
                    If you are affiliated with a vendor community, enter their
                    code below. If you are a part of a vendor community but
                    don't know your code, contact them to receive your code.
                  </p>
                )}
              </div>
              {collapseId === 0 && (
                <div className={styles.verifyBox}>
                  <div className={styles.inputBox}>
                    <div className={styles.form}>
                      {[...Array(5)].map((item: number, index: number) => (
                        <Input
                          key={index}
                          className={styles.input}
                          ref={codeRefs[index]}
                          value={codes[index]}
                          onKeyDown={e => onCodeChange(e, index)}
                        />
                      ))}
                      <Button
                        className={styles.submitBtn}
                        onClick={onCodeSubmit}
                      >
                        Submit
                      </Button>
                    </div>
                    <p className={styles.codeIssue}>{codeIssue}</p>
                  </div>
                  <div className={styles.otherOption}>
                    <div className={styles.text}>
                      <p className={styles.orText}>OR</p>
                      <p className={styles.description}>
                        I am not affiliated with a community. It's just me and
                        that's how I like it!
                      </p>
                    </div>
                    <Button
                      className={styles.justmeBtn}
                      onClick={() =>
                        navigate('/sign-up/vendor?community_code=none')
                      }
                    >
                      It's Just Me
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div
              className={clsx(styles.accountDetail, styles.section, {
                [styles.active]: collapseId === 1,
              })}
            >
              <div className={styles.text}>
                <p className={styles.title} onClick={() => navigateCollapse(1)}>
                  Account Details
                </p>
              </div>
              {collapseId === 1 && (
                <div className={styles.details}>
                  <div className={styles.elements}>
                    <Input
                      name="shopName"
                      value={account.shopName}
                      className={styles.input}
                      placeholder="Shop Name"
                      updateValue={onAccountChange}
                    />
                    <div className={styles.horizon}>
                      <Input
                        name="firstName"
                        value={account.firstName}
                        className={styles.input}
                        placeholder="First Name"
                        updateValue={onAccountChange}
                      />
                      <Input
                        name="lastName"
                        value={account.lastName}
                        className={styles.input}
                        placeholder="Last Name"
                        updateValue={onAccountChange}
                      />
                    </div>
                    <Input
                      name="phone"
                      value={account.phone}
                      className={styles.input}
                      placeholder="Phone #"
                      updateValue={onAccountChange}
                    />
                    <Input
                      name="email"
                      value={account.email}
                      className={styles.input}
                      placeholder="Email"
                      updateValue={onAccountChange}
                    />
                    <Input
                      type="password"
                      name="password"
                      value={account.password}
                      className={styles.input}
                      placeholder="Password"
                      updateValue={onAccountChange}
                    />
                    <Input
                      type="password"
                      name="confirm"
                      value={account.confirm}
                      className={styles.input}
                      placeholder="Confirm Password"
                      updateValue={onAccountChange}
                    />
                    <Input
                      name="zipcode"
                      value={account.zipcode}
                      className={styles.input}
                      placeholder="5 digit Zip Code"
                      updateValue={onAccountChange}
                    />
                  </div>
                  <div className={styles.bottom}>
                    <Button className={styles.nextBtn} onClick={onNextCollapse}>
                      Next Step
                    </Button>
                    <div className={styles.contactInfo}>
                      <p>
                        Already have an account?{' '}
                        <a
                          className={styles.login}
                          href="/login/vendor"
                          onClick={onLoginClick}
                        >
                          Log In
                        </a>
                      </p>
                      <p>
                        Want to talk to a human first?{' '}
                        <span className={styles.phone}>(203) 228-8814</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className={clsx(styles.subscription, styles.section, {
                [styles.active]: collapseId === 2,
              })}
            >
              <div className={styles.text}>
                <p className={styles.title} onClick={() => navigateCollapse(2)}>
                  Select Subscription
                </p>
              </div>
              {collapseId === 2 && (
                <div className={styles.content}>
                  <RadioGroup
                    color="secondary"
                    value={subscription}
                    updateValue={(value: string) => {
                      setSubscription(value)
                    }}
                    className={styles.variants}
                  >
                    {subscriptions.map(
                      (subscription: ISubscription, index: number) => (
                        <div key={index} className={styles.variant}>
                          <Radio
                            value={subscription._id}
                            className={styles.checkbox}
                          />
                          <div className={styles.text}>
                            <p className={styles.title}>{subscription.name}</p>
                            <p className={styles.description}>
                              {subscription.description}
                            </p>
                            <p className={styles.transaction}>
                              <span className={styles.monthFee}>
                                {formatMonthlyFee(subscription.monthInvest)}
                              </span>{' '}
                              +
                              <span className={styles.origin}>
                                {subscription.expectedFee}%
                              </span>{' '}
                              <span className={styles.current}>
                                now {subscription.transactionFee}%
                              </span>{' '}
                              transaction fee
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </RadioGroup>
                  <Button className={styles.nextBtn} onClick={onNextCollapse}>
                    Next Step
                  </Button>
                </div>
              )}
            </div>
            <div
              className={clsx(styles.agreement, styles.section, {
                [styles.active]: collapseId === 3,
              })}
            >
              <div className={styles.text}>
                <p className={styles.title} onClick={() => navigateCollapse(3)}>
                  Agreement
                </p>
              </div>
            </div>
            <div
              className={clsx(styles.billing, styles.section, {
                [styles.active]: collapseId === 4,
              })}
            >
              <div className={styles.text}>
                <p className={styles.title} onClick={() => navigateCollapse(4)}>
                  Bill Information
                </p>
              </div>
              {collapseId === 4 && (
                <div className={styles.content}>
                  <p className={styles.description}>
                    Connect your account with the worlds leading payments
                    gateway by clicking the link below. it's safe and secured by
                    Stripe.
                  </p>
                  <div className={styles.stripe}>
                    <Button
                      className={styles.connectBtn}
                      onClick={onSignupClick}
                    >
                      Connect with stripe
                    </Button>
                    <img src="/assets/customer/logos/stripe.png" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
