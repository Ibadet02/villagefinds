import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Logo } from '..';
import { AuthContext } from '@/providers';
import { setupToken } from '@/utils';

import styles from './Header.module.scss';

const COMMUNITY_AUTH_HOME_PATH = '/village-community';
const LOGIN_PATH = '/auth/login';

export function Header() {
  const { isLogin, setIsLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const onBtnClick = () => {
    if (pathname === COMMUNITY_AUTH_HOME_PATH) {
      navigate('dashboard');
    } else {
      setIsLogin(false);
      setupToken(null, 'community');
      navigate(COMMUNITY_AUTH_HOME_PATH);
    }
  };

  return (
    <div
      className={clsx(styles.root, !isLogin ? styles.container : styles.fixed)}
    >
      <Logo />
      {isLogin ? (
        <button className={styles.button} onClick={onBtnClick}>
          {pathname === COMMUNITY_AUTH_HOME_PATH ? 'Dashboard' : 'Logout'}
        </button>
      ) : (
        <button
          className={styles.button}
          onClick={() => navigate(`${COMMUNITY_AUTH_HOME_PATH}${LOGIN_PATH}`)}
        >
          Login
        </button>
      )}
    </div>
  );
}
