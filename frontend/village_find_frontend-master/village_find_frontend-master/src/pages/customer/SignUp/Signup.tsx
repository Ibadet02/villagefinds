import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Button, Input, Radio, RadioGroup } from '@/components/forms';
import { Container } from '@/components/layout/customer';

import { AuthContext } from '@/providers';
import { HttpService } from '@/services';
import { setupToken } from '@/utils';

import styles from './Signup.module.scss';

interface IAccount {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  zipcode: string;
  password: string;
  confirm: string;
}

const initialAccount = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  zipcode: '',
  password: '',
  confirm: '',
};

export function Signup() {
  const navigate = useNavigate();
  const { setIsLogin, setAccount: setAuthAccount } = useContext(AuthContext);

  const [account, setAccount] = useState<IAccount>(initialAccount);
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const onAccountChange = (e: any) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const onSignupClick = () => {
    const errors: any = {};
    Object.keys(account).forEach((key: string) => {
      if (!(account as any)[key]) errors[key] = 'This field should not be empty.';
    });
    if (account.password.length < 6) errors.password = 'Password should be at least 6 characters.';
    if (account.password !== account.confirm) errors.confirm = 'Password does not match.';

    setErrors(errors);

    if (!Object.keys(errors).length) {
      HttpService.post('/user/customer/register', account)
        .then(response => {
          const { status, token, profile } = response;
          if (status === 200) {
            enqueueSnackbar('Signup successfully!', { variant: 'success' });
            setIsLogin(true);
            setupToken(token, 'customer');
            setAuthAccount({ role: 'customer', profile });
            navigate('/');
          }
        })
        .catch(err => {
          enqueueSnackbar('Signup failed!', { variant: 'error' });
        });
    }
  };

  return (
    <div className={styles.root}>
      <Container className={styles.container}>
        <h1>Sign Up!</h1>
        <p className={styles.subtitle}>Let's get to know</p>
        <div className={styles.form}>
          <Input
            name="firstName"
            size="large"
            border="solid"
            placeholder="First Name"
            borderColor="primary"
            className={styles.input}
            value={account.firstName}
            updateValue={onAccountChange}
            error={errors.firstName}
          />
          <Input
            name="lastName"
            size="large"
            border="solid"
            placeholder="Last Name"
            borderColor="primary"
            className={styles.input}
            value={account.lastName}
            updateValue={onAccountChange}
            error={errors.lastName}
          />
          <Input
            name="phone"
            size="large"
            border="solid"
            placeholder="Phone Number"
            borderColor="primary"
            className={styles.input}
            value={account.phone}
            updateValue={onAccountChange}
            error={errors.phone}
          />
          <Input
            type="email"
            name="email"
            size="large"
            border="solid"
            placeholder="Email"
            borderColor="primary"
            className={styles.input}
            value={account.email}
            updateValue={onAccountChange}
            error={errors.email}
          />
          <Input
            name="zipcode"
            size="large"
            border="solid"
            placeholder="Zip Code"
            borderColor="primary"
            className={styles.input}
            value={account.zipcode}
            updateValue={onAccountChange}
            error={errors.zipcode}
          />
          <Input
            name="password"
            type="password"
            size="large"
            border="solid"
            placeholder="Create Password"
            borderColor="primary"
            className={styles.input}
            value={account.password}
            updateValue={onAccountChange}
            error={errors.password}
          />
          <Input
            name="confirm"
            type="password"
            size="large"
            border="solid"
            placeholder="Confirm Password"
            borderColor="primary"
            className={styles.input}
            value={account.confirm}
            updateValue={onAccountChange}
            error={errors.confirm}
          />
          <div className={styles.terms}>
            <h2>Terms And Conditions</h2>
          </div>
          <RadioGroup
            value={accepted ? ['accept'] : []}
            updateValue={() => setAccepted(!accepted)}
            multiple={true}
          >
            <Radio
              label="I accept the terms and conditions"
              className={styles.agreeRadio}
              value='accept'
            />
          </RadioGroup>
          <Button className={styles.signupBtn} onClick={onSignupClick} disabled={!accepted}>
            Register
          </Button>
        </div>
      </Container>
    </div>
  );
}
