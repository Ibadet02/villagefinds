import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Button, Input } from '@/components/forms';
import { AuthContext } from '@/providers';
import { useAppSelector } from '@/redux/store';
import { HttpService } from '@/services';
import { setupToken } from '@/utils';
import { ChangeInputEvent } from '@/interfaces';

import styles from './AuthPanel.module.scss';

interface IAuthPanelProps {
  isLogin: boolean;
}

interface IAuthAccount {
  email: string;
  password: string;
}

const initialAuthAccount: IAuthAccount = {
  email: '',
  password: ''
}

export function AuthPanel({ isLogin }: IAuthPanelProps) {
  const guestId = useAppSelector(state => state.guest.guestID);

  const { account, setAccount, setIsLogin } = useContext(AuthContext);
  const [isLoginPanel, setIsLoginPanel] = useState(false);
  const [authAccount, setAuthAccount] = useState<IAuthAccount>(initialAuthAccount);

  const onAuthAccountChange = (e: ChangeInputEvent) => {
    setAuthAccount({
      ...authAccount,
      [e.target.name]: e.target.value
    });
  }

  const onLoginClick = () => {
    HttpService.post(`/user/customer/login`, authAccount)
      .then(response => {
        const { status, token, profile } = response;
        if (status === 200) {
          setupToken(token, 'customer');

          HttpService.post(`/cart/migrate`, { guestId }).then(response => {
            const { status } = response;
            if (status === 200) {
              setIsLogin(true);
              setAccount({
                role: 'customer',
                profile,
              });
              enqueueSnackbar('Login successfully!', { variant: 'success' });
            }
          });
        } else if (status === 400) {
          enqueueSnackbar('Invalid credentials!', { variant: 'error' });
        } else if (status === 404) {
          enqueueSnackbar('Email does not exist!', { variant: 'error' });
        } else {
          enqueueSnackbar('Something went wrong with server.', {
            variant: 'error',
          });
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      });
    HttpService.post('/user/customer', authAccount).then(response => {

    })
  }

  return isLogin ? (
    <div className={styles.home}>
      <p>Hi, {account?.profile.firstName}!</p>
    </div>
  ) : (
    <div className={styles.auth}>
      {isLoginPanel ? (
        <div className={styles.loginPanel}>
          <p className={styles.title}>Login</p>
          <div className={styles.inputs}>
            <Input
              name='email'
              className={clsx(styles.input, styles.email)}
              placeholder="Email/Phone Number"
              value={authAccount.email}
              updateValue={onAuthAccountChange}
            />
            <Input
              name='password'
              type='password'
              className={clsx(styles.input, styles.password)}
              placeholder="Password"
              value={authAccount.password}
              updateValue={onAuthAccountChange}
            />
          </div>
          <div className={styles.buttons}>
            <Button
              className={clsx(styles.button, styles.cancel)}
              onClick={() => setIsLoginPanel(false)}
            >
              Cancel
            </Button>
            <Button className={clsx(styles.button, styles.Login)} onClick={onLoginClick}>Login</Button>
          </div>
        </div>
      ) : (
        <div className={styles.infoPanel}>
          <div className={styles.text}>
            <p className={styles.title}>Login or Signup</p>
            <p className={styles.body}>
              Login or signup to order these <span>uniquely made or grown</span>{' '}
              items below
            </p>
          </div>
          <div className={styles.buttons}>
            <Button
              className={clsx(styles.button, styles.login)}
              onClick={() => setIsLoginPanel(true)}
            >
              Login
            </Button>
            <Button className={clsx(styles.button, styles.signup)}>
              Sign up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
