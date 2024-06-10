import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import {
  DashboardIcon,
  UserIcon,
  VendorIcon,
  CommunityIcon,
  FinancialsIcon,
  LogoutIcon,
} from '@/components';

// Super Admin Main and Settings Pages
const Login = lazy(() =>
  import('@/pages/super-admin').then(module => ({ default: module.Login }))
);
const Dashboard = lazy(() =>
  import('@/pages/super-admin').then(module => ({ default: module.Dashboard })),
);
const SettingsLayout = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.SettingsLayout,
  })),
);
const Imagry = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Imagry,
  })),
);
const Products = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Products,
  })),
);
const Slider = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Slider,
  })),
);
const HowPage = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.HowPage,
  })),
);
const Shop = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Shop,
  })),
);
const Vendor = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Vendor,
  })),
);
const ReadyToShop = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.ReadyToShop,
  })),
);
const Footer = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Footer,
  })),
);
const ProductTags = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.ProductTags,
  })),
);
const NewProductTag = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.NewProductTag,
  })),
);
const Metrics = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Metrics,
  })),
);
const NewMetric = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.NewMetric,
  })),
);
const Categories = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Categories,
  })),
);
const NewCategory = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.NewCategory,
  })),
);
const Posts = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.Posts,
  })),
);
const NewPost = lazy(() =>
  import('@/pages/super-admin/Settings').then(module => ({
    default: module.NewPost,
  })),
);

// Super Admin Customer Pages
const CustomerHome = lazy(() =>
  import('@/pages/super-admin/Customers').then(module => ({
    default: module.CustomerHome,
  })),
);
const Coupons = lazy(() =>
  import('@/pages/super-admin/Customers').then(module => ({
    default: module.Coupons,
  })),
);
const CustomerEdit = lazy(() =>
  import('@/pages/super-admin/Customers').then(module => ({
    default: module.CustomerEdit,
  })),
);
const CouponEdit = lazy(() =>
  import('@/pages/super-admin/Customers').then(module => ({
    default: module.CouponEdit,
  })),
);

// Super Admin Orders Pages
const OrderHome = lazy(() =>
  import('@/pages/super-admin/Orders').then(module => ({
    default: module.OrderHome,
  })),
);
const OrderDetail = lazy(() =>
  import('@/pages/super-admin/Orders').then(module => ({
    default: module.OrderDetail,
  })),
);

// Super Admin Vendors Pages
const VendorsHome = lazy(() =>
  import('@/pages/super-admin/Vendors').then(module => ({
    default: module.VendorsHome,
  })),
);
const VendorDetail = lazy(() =>
  import('@/pages/super-admin/Vendors').then(module => ({
    default: module.VendorDetail,
  })),
);
const Subscription = lazy(() =>
  import('@/pages/super-admin/Vendors').then(module => ({
    default: module.Subscription,
  })),
);
const SubscriptionDet = lazy(() =>
  import('@/pages/super-admin/Vendors').then(module => ({
    default: module.NewSubscription
  })))

// Super Admin Communities Pages
const VillageCommunity = lazy(() =>
  import('@/pages/super-admin/Communities').then(module => ({
    default: module.VillageCommunity,
  })),
);
const VillageEdit = lazy(() =>
  import('@/pages/super-admin/Communities').then(module => ({
    default: module.VillageEdit,
  })),
);

// Super Admin Financials Page
const Transactions = lazy(() =>
  import('@/pages/super-admin/Financials').then(module => ({
    default: module.Transactions,
  })),
);

const Logout = lazy(() =>
  import('@/pages/super-admin').then(module => ({
    default: module.Logout
  }))
)

export const superAdminRoutes = [
  {
    index: true,
    element: <Navigate to="login" />,
    hide: true,
  },
  {
    path: 'login',
    element: <Login />,
    hide: true,
  },
  {
    title: 'Dashboard',
    path: 'dashboard',
    element: <Dashboard />,
    icon: <DashboardIcon />,
  },
  {
    title: 'Settings',
    path: 'settings',
    element: <SettingsLayout />,
    icon: <UserIcon />,
    children: [
      {
        title: 'Marketplace',
        path: 'market',
        element: <Outlet />,
        children: [
          {
            title: 'Imagry',
            path: 'imagry',
            element: <Imagry />,
          },
          {
            title: 'Featured Products',
            path: 'products',
            element: <Products />,
          },
          {
            title: 'Home Page',
            path: 'home-page',
            element: <Outlet />,
            leaf: true,
            children: [
              {
                title: 'Home Slider',
                path: '',
                element: <Slider />,
              },
              {
                title: 'How It Works',
                path: 'how',
                element: <HowPage />,
              },
              {
                title: 'Shop Intentionally',
                path: 'shop',
                element: <Shop />,
              },
              {
                title: 'Vendor Community Images',
                path: 'v-com',
                element: <Vendor />,
              },
              {
                title: 'Ready To Shop Images',
                path: 'ready-to-shop',
                element: <ReadyToShop />,
              },
            ],
          },
          {
            title: 'Footer',
            path: 'footer',
            element: <Footer />,
          },
        ],
      },
      {
        title: 'Dashboard',
        path: 'dashboard',
        element: <Outlet />,
        children: [
          {
            title: 'Product Tags',
            path: 'tags',
            element: <Outlet />,
            leaf: true,
            children: [
              {
                title: 'Home',
                path: '',
                element: <ProductTags />,
              },
              {
                title: 'New',
                path: ':id',
                element: <NewProductTag />,
              },
            ],
          },
          {
            title: 'Metrics',
            path: 'metrics',
            element: <Outlet />,
            leaf: true,
            children: [
              {
                title: 'Home',
                path: '',
                element: <Metrics />,
              },
              {
                title: 'New',
                path: ':id',
                element: <NewMetric />,
              },
            ],
          },
          {
            title: 'Category Management',
            path: 'category',
            element: <Outlet />,
            leaf: true,
            children: [
              {
                title: 'Home',
                path: '',
                element: <Categories />,
              },
              {
                title: 'New',
                path: ':id',
                element: <NewCategory />,
              },
            ],
          },
          {
            title: 'Support Center',
            path: 'posts',
            element: <Outlet />,
            leaf: true,
            children: [
              {
                title: 'Home',
                path: '',
                element: <Posts />,
              },
              {
                title: 'New',
                path: ':id',
                element: <NewPost />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Customers',
    path: 'customers',
    element: <Outlet />,
    icon: <UserIcon />,
    children: [
      {
        title: 'Customer Management',
        path: 'home',
        leaf: true,
        element: <Outlet />,
        children: [
          {
            title: 'Home',
            path: '',
            element: <CustomerHome />,
          },
          {
            title: 'Edit',
            path: ':id',
            element: <CustomerEdit />,
          },
        ],
      },
      {
        title: 'Coupon Management',
        path: 'coupon',
        leaf: true,
        element: <Outlet />,
        children: [
          {
            title: 'Home',
            path: '',
            element: <Coupons />,
          },
          {
            title: 'Edit',
            path: ':id',
            element: <CouponEdit />,
          },
        ],
      },
    ],
  },
  {
    title: 'Order Management',
    path: 'orders',
    element: <Outlet />,
    icon: <UserIcon />,
    children: [
      {
        title: 'All Orders',
        path: '',
        element: <Outlet />,
        leaf: true,
        children: [
          {
            title: '',
            path: '',
            element: <OrderHome />,
          },
          {
            title: 'Detail',
            path: ':id',
            element: <OrderDetail />,
          },
        ],
      },
    ],
  },
  {
    title: 'Vendor Management',
    path: 'vendors',
    element: <Outlet />,
    icon: <VendorIcon />,
    children: [
      {
        title: 'All Vendors',
        path: '',
        element: <Outlet />,
        leaf: true,
        children: [
          {
            title: 'Home',
            path: '',
            element: <VendorsHome />,
          },
          {
            title: 'Detail',
            path: ':id',
            element: <VendorDetail />,
          },
        ],
      },
      {
        title: 'Subscription Packages',
        path: 'subscription',
        leaf: true,
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Subscription />,
          },
          {
            path: ':id',
            element: <SubscriptionDet />
          }
        ]
      },
    ],
  },
  {
    title: 'Community',
    path: 'community',
    element: <Outlet />,
    icon: <CommunityIcon />,
    children: [
      {
        title: 'Village Communities',
        path: 'village',
        element: <Outlet />,
        leaf: true,
        children: [
          {
            title: 'Home',
            path: '',
            element: <VillageCommunity />,
          },
          {
            title: 'Edit',
            path: ':id',
            element: <VillageEdit />,
          },
        ],
      },
      // {
      //   title: 'Featured Communities',
      //   path: 'featured',
      //   element: <></>,
      // },
    ],
  },
  {
    title: 'Financials',
    path: 'financials',
    element: <Outlet />,
    icon: <FinancialsIcon />,
    children: [
      {
        title: 'Customer Transactions',
        path: 'transactions',
        element: <Transactions />,
      },
    ],
  },
  {
    title: 'Logout',
    path: 'logout',
    element: <Logout />,
    icon: <LogoutIcon />,
  },
];
