import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Button, Input } from '@/components/forms';
import { Container } from '@/components/layout/customer';
import { HttpService } from '@/services';
import { RoleType, AuthContext } from '@/providers';
import { setupToken } from '@/utils';

import LoginImage from '/assets/customer/backs/login.png';
import styles from './Login.module.scss';

interface IUser {
  email: string;
  password: string;
}

const initialUser: IUser = {
  email: '',
  password: '',
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { setAccount, setIsLogin } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState<IUser>(initialUser);

  const onUserChange = (e: any) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const onNavItemClick = (path: string) => () => {
    navigate(path);
  };

  const onRoleClick = (role: string) => () => {
    navigate(`/login/${role}`);
  };

  const onSignupClick = () => {
    const role = pathname.slice('/login/'.length);
    navigate(`/sign-up/${role}`);
  };

  const onLoginClick = () => {
    const role = pathname.slice('/login/'.length);
    HttpService.post(`/user/${role}/login`, currentUser)
      .then(response => {
        const { status, token, profile } = response;
        if (status === 200) {
          setIsLogin(true);
          setAccount({
            role: role as RoleType,
            profile,
          });
          setupToken(token, role);
          enqueueSnackbar('Login successfully!', { variant: 'success' });
          navigate(role === 'vendor' ? '/vendor' : '/');
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
  };

  useEffect(() => {
    const role = pathname.slice('/login/'.length);
    const token = localStorage.getItem(`${role}_token`);
    if (token) {
      setupToken(token, role);
      HttpService.post(`/user/${role}/login`, {}).then(response => {
        const { status, profile } = response;
        if (status === 200) {
          setIsLogin(true);
          setAccount({
            role: role as RoleType,
            profile,
          });
          navigate(role === 'customer' ? '/dashboard' : '/vendor');
        } else {
          setupToken(null, role);
        }
      });
    } else {
      setupToken(null, role);
    }
  }, [pathname]);

  return (
    <div className={styles.root}>
      <ul className={styles.subNavbar}>
        {['Customer', 'Vendor'].map((role: string) => (
          <li
            key={role}
            className={clsx(
              styles.navItem,
              pathname === `/login/${role.toLowerCase()}`
                ? styles.activeItem
                : '',
            )}
            onClick={onNavItemClick(`/login/${role.toLowerCase()}`)}
          >
            {role} Sign in
          </li>
        ))}
      </ul>
      <div className={styles.loginBody}>
        <img src={LoginImage} />
        <Container className={styles.container}>
          <div className={styles.form}>
            <ul className={styles.navlink}>
              {['Customer', 'Vendor'].map((role: string) => (
                <li
                  key={role}
                  onClick={onRoleClick(role.toLowerCase())}
                  className={
                    pathname === `/login/${role.toLowerCase()}`
                      ? styles.active
                      : ''
                  }
                >
                  {role} Sign in
                </li>
              ))}
            </ul>
            <div className={styles.control}>
              <Input
                name="email"
                rounded="small"
                border="none"
                size="large"
                placeholder="Email/Phone Number"
                className={styles.input}
                value={currentUser.email}
                updateValue={onUserChange}
              />
              <Input
                name="password"
                type="password"
                rounded="small"
                border="none"
                size="large"
                placeholder="Password"
                className={styles.input}
                value={currentUser.password}
                updateValue={onUserChange}
              />
            </div>
            <span>Forgot password?</span>
            <Button className={styles.loginButton} onClick={onLoginClick}>
              Login
            </Button>
            <p className={styles.signupLink}>
              Don't have an account?<span onClick={onSignupClick}>Sign up</span>
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
