import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Input } from '@/components/forms';
import { Container } from '@/components/layout/community';

import { HttpService } from '@/services';

import { AuthContext } from '@/providers';

import { setupToken } from '@/utils/axios/setupToken';

import styles from './Login.module.scss';

interface IAccount {
  email: string;
  password: string;
}

const initialAccount: IAccount = {
  email: '',
  password: '',
};

export function Login() {
  const navigate = useNavigate();
  const { setIsLogin, setAccount: setAccountProfile } = useContext(AuthContext);
  const [account, setAccount] = useState<IAccount>(initialAccount);

  const onAccountChange = (e: any) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };

  const onLogin = () => {
    HttpService.post('/communities/login', account)
      .then(response => {
        const { status, profile, token } = response;

        if (status === 200) {
          enqueueSnackbar('Successfully login!', { variant: 'success' });

          setIsLogin(true);
          setAccountProfile({
            role: 'community-organizer',
            profile,
          });
          setupToken(token, 'community');
          navigate('/village-community/dashboard');
        } else {
          enqueueSnackbar('Invalid credentials!', { variant: 'error' });
        }
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong with server.', {
          variant: 'error',
        });
      });
  };

  return (
    <Container className={styles.root}>
      <div className={styles.panel}>
        <h1>Login</h1>
        <Input
          name="email"
          placeholder="Email"
          className={styles.input}
          value={account.email}
          updateValue={onAccountChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className={styles.input}
          value={account.password}
          updateValue={onAccountChange}
        />
        <button onClick={onLogin}>Login</button>
        <p>
          Don't have an account?{' '}
          <Link to="/village-community/auth/register" className={styles.signup}>
            Sign Up
          </Link>
        </p>
      </div>
    </Container>
  );
}
