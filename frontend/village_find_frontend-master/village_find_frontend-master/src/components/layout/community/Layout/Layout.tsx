import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { AuthContext } from '@/providers';

import { HttpService } from '@/services';

import { setupToken } from '@/utils';

export function Layout() {
  const navigate = useNavigate();
  const { setAccount, setIsLogin } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('community_token');
    if (token) {
      setupToken(token, 'community');
      HttpService.post('/communities/login', {})
        .then(response => {
          const { status, profile } = response;
          if (status === 200) {
            setIsLogin(true);
            setAccount({
              role: 'community-organizer',
              profile,
            });
          } else if (status === 401) {
            setupToken(null, 'community');
            navigate('/village-community/auth/login');
            enqueueSnackbar('Unauthorized!', { variant: 'error' });
          }
          setIsLoading(false);
        })
        .catch(err => {
          setupToken(null, 'community');
          navigate('/village-community/auth/login');
          enqueueSnackbar('Something went wrong with server.', {
            variant: 'error',
          });
          setIsLoading(false);
        });
    } else {
      navigate('/village-community/auth/login');
      setIsLoading(false);
    }
  }, []);

  return isLoading ? <></> : <Outlet />;
}
