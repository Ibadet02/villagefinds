import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Sidebar, Header } from '@/components/layout/other';
import { HttpService } from '@/services';
import { AuthContext } from '@/providers';
import { setupToken } from '@/utils';
import { useAppDispatch } from '@/redux/store';
import { loadSubscriptions, loadMetrics } from '@/redux/reducers';

import styles from './Layout.module.scss';

const blackList = [
  '/admin/login'
];

export function Layout() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isVendor = location.pathname.startsWith('/vendor');

  const { isLogin, setIsLogin, setAccount } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (blackList.includes(pathname)) return;
    if (isLogin) {
      setIsLoading(false);
      return;
    }
    const userRole = isVendor ? 'vendor' : 'admin';
    const tokenKey = `${userRole}_token`;
    const token = localStorage.getItem(tokenKey);
    if (token) {
      setupToken(token, userRole);
      if (isVendor) {
        HttpService.post(`/user/vendor/login`, {})
          .then(response => {
            const { status, profile } = response;
            if (status === 200) {
              setIsLogin(true);
              setAccount({
                role: 'vendor',
                profile,
              });
            } else {
              setupToken(null, 'vendor');
              navigate('/login/vendor');
            }
          })
          .catch(err => {
            setupToken(null, 'vendor');
            navigate('/login/vendor');
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        HttpService.post('/admin/login', {}).then(response => {
          const { status } = response;
          if (status === 200) {
            setIsLogin(true);
          } else {
            setupToken(null, 'admin');
          }
        }).catch(err => {
          setupToken(null, 'admin')
        }).finally(() => { setIsLoading(false) });
      }
    } else {
      navigate(isVendor ? '/login/vendor' : '/admin/login');
    }
  }, [pathname]);

  useEffect(() => {
    HttpService.get('/subscriptions').then(response => {
      dispatch(loadSubscriptions(response));
    });
    HttpService.get('/settings/general/metric').then(response => {
      dispatch(loadMetrics(response));
    })
  }, []);

  return (
    blackList.includes(pathname)
      ? <Outlet />
      : <div className={styles.root}>
        <Sidebar />
        <div className={styles.container}>
          <Header />
          {!isLoading && <Outlet />}
        </div>
      </div>
  );
}
