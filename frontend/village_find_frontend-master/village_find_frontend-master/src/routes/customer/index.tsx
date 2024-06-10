import { lazy } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// Importing customer-related components
const Login = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.Login })),
);
const CustomerSignup = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.Signup })),
);
const Dashboard = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.Dashboard })),
);
const Market = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.Market })),
);
const VendorSales = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.VendorSales })),
);
const ProductDetails = lazy(() =>
  import('@/pages/customer').then(module => ({
    default: module.ProductDetails,
  })),
);
const Checkout = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.Checkout })),
);
const Profile = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.Profile })),
);
const OrderDetail = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.OrderDetail })),
)
const About = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.About })),
);
const VendorSignup = lazy(() =>
  import('@/pages/customer').then(module => ({ default: module.VendorSignup })),
);

// Importing components from VendorCommunities under customer
const CommunityHome = lazy(() =>
  import('@/pages/customer/VendorCommunities').then(module => ({
    default: module.Home,
  })),
);
const CommunityLayout = lazy(() =>
  import('@/pages/customer/VendorCommunities').then(module => ({
    default: module.CommunityLayout,
  })),
);
const Vendor = lazy(() =>
  import('@/pages/customer/VendorCommunities').then(module => ({
    default: module.Vendor,
  })),
);
const VendorAbout = lazy(() =>
  import('@/pages/customer/VendorCommunities').then(module => ({
    default: module.VendorAbout,
  })),
);

export const customerRoutes = [
  {
    path: '',
    element: <Dashboard />,
  },
  {
    path: 'login',
    element: <Outlet />,
    children: [
      {
        path: 'customer',
        element: <Login />,
      },
      {
        path: 'vendor',
        element: <Login />,
      },
      {
        path: '*',
        element: <Navigate to="customer" />,
      },
    ],
  },
  {
    path: 'sign-up',
    element: <Outlet />,
    children: [
      {
        path: 'customer',
        element: <CustomerSignup />,
      },
      {
        path: 'vendor',
        element: <VendorSignup />,
      },
    ],
  },
  {
    path: 'sell',
    element: <VendorSales />,
  },
  {
    path: 'market',
    element: <Market />,
  },
  {
    element: <Outlet />,
    path: 'communities',
    children: [
      {
        path: '',
        element: <CommunityHome />,
      },
      {
        path: ':slug',
        element: <CommunityLayout />,
      },
    ],
  },
  {
    path: 'vendors',
    element: <Outlet />,
    children: [
      {
        path: ':id',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Vendor />,
          },
          {
            path: 'about',
            element: <VendorAbout />,
          },
        ],
      },
    ],
  },
  {
    path: 'product-detail/:id',
    element: <ProductDetails />,
  },
  {
    path: 'checkout',
    element: <Checkout />,
  },
  {
    path: 'profile',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Profile />
      },
      {
        path: 'orders/:id',
        element: <OrderDetail />
      }
    ]
  },
  {
    path: 'about',
    element: <About />,
  },
  {
    path: '*',
    element: <p>Not found!</p>,
  },
];
