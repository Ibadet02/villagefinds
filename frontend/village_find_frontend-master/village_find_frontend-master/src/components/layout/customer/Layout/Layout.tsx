import { useState, useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import {
  Topbar,
  Header,
  Navbar,
  Footer,
  Container,
} from '@/components/layout/customer';
import { Categories } from '@/components/customer/Market';
import { AuthContext, CartProvider, CategoryContext, SearchbarContext } from '@/providers';
import { useAppDispatch } from '@/redux/store';
import { setGuestID } from '@/redux/reducers';
import { HttpService } from '@/services';
import { setupToken, useWindowWidth } from '@/utils';

export function Layout() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  const { isCategoryBar } = useContext(CategoryContext);
  const { showSearchbar } = useContext(SearchbarContext);
  const { isLogin, setIsLogin, setAccount } = useContext(AuthContext);

  const [isScreen, setIsScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [_, breakpoint] = useWindowWidth();

  const screenBlackLists = ['/login/customer', '/login/vendor'];
  const smallBPLists = ['none', 'xs'];

  const onWindowScroll = () => {
    if (window.scrollY < 200 && pathname.startsWith('/dashboard')) {
      showSearchbar(true);
    } else {
      showSearchbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onWindowScroll);

    return () => {
      window.removeEventListener('scroll', onWindowScroll);
    };
  }, []);

  useEffect(() => {
    if (isLogin || screenBlackLists.includes(pathname)) {
      setIsLoading(false);
      return;
    }
    const token = localStorage.getItem('customer_token');
    if (token) {
      setupToken(token, 'customer');
      HttpService.post('/user/customer/login', {})
        .then(response => {
          const { status, profile } = response;
          if (status === 200) {
            setIsLogin(true);
            setAccount({
              role: 'customer',
              profile,
            });
          } else {
            dispatch(setGuestID());
            setupToken(null, 'customer');
          }
        })
        .catch(err => {
          enqueueSnackbar('Something went wrong with server.', {
            variant: 'error',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      dispatch(setGuestID());
      setIsLoading(false);
    }
  }, []);

  return (
    <CartProvider>
      <div
        className={
          isScreen || screenBlackLists.includes(pathname) ? 'h-screen' : ''
        }
      >
        <div
          className={clsx(
            'h-full',
            smallBPLists.includes(breakpoint as string) ? 'pt-[120px]' : 'pt-40',
          )}
        >
          <div
            className={clsx(
              'fixed top-0 z-50 w-full',
              isScreen ? 'flex h-full flex-col' : '',
            )}
          >
            <Topbar />
            <Header switchToScreen={setIsScreen} />
            <Navbar />
          </div>
          {isCategoryBar && (
            <Container className="top-40">
              <Categories />
            </Container>
          )}
          {!isLoading && <Outlet />}
          <Footer />
        </div>
      </div>
    </CartProvider>
  );
}
