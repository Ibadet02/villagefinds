import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';

import {
  CommunityLayout,
  CustomerLayout,
  OtherLayout,
} from '@/components/layout';

import { superAdminRoutes } from '@/routes/super-admin';
import { customerRoutes } from '@/routes/customer';
import { vendorRoutes } from '@/routes/vendor';
import { communityRoutes } from '@/routes/community';
import { LoadingSpinner } from '@/components';

const routes = [
  {
    path: 'admin',
    element: <OtherLayout />,
    children: superAdminRoutes,
  },
  {
    path: 'vendor',
    element: <OtherLayout />,
    children: vendorRoutes,
  },
  {
    path: 'village-community',
    element: <CommunityLayout />,
    children: communityRoutes,
  },
  {
    path: '',
    element: <CustomerLayout />,
    children: customerRoutes,
  },
];

function Routes() {
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const appRoutes = useRoutes(routes);

  useEffect(() => {
    if (customerRoutes.length && vendorRoutes.length && communityRoutes.length && customerRoutes.length) {
      setIsRouteLoading(true);
    }
  }, [superAdminRoutes, customerRoutes, vendorRoutes, communityRoutes]);

  return !isRouteLoading ? <LoadingSpinner isPageLoading={true} /> : appRoutes;
}

export { superAdminRoutes, customerRoutes, vendorRoutes, routes };

export default Routes;
