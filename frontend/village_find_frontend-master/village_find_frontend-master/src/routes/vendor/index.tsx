import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import {
  CommunityIcon,
  DashboardIcon,
  FinancialsIcon,
  LogoutIcon,
  UserIcon,
  VendorIcon,
} from '@/components/icons';

// For the vendor dashboard and profile related components
const Dashboard = lazy(() =>
  import('@/pages/vendor/Dashboard').then(module => ({
    default: module.Dashboard,
  })),
);
const ProfileHome = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.ProfileHome,
  })),
);
const BankDetail = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.BankDetail,
  })),
);
const FulfillDetail = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.FulfillDetail,
  })),
);
const Pickup = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({ default: module.Pickup })),
);
const Delivery = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.Delivery,
  })),
);
const PickupLocation = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.PickupLocation,
  })),
);
const PickupLocationCreate = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.PickupLocationCreate,
  })),
);
const ShippingService = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.ShippingService,
  })),
);
const ShippingAddress = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.ShippingAddress,
  })),
);
const ParcelSize = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.ParcelSize,
  })),
);
const ParcelCreate = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.ParcelCreate,
  })),
);
const ShippingAccount = lazy(() =>
  import('@/pages/vendor/Profile').then(module => ({
    default: module.ShippingAccount,
  })),
);

// For products related components
const General = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.General,
  })),
);
const ProductProvider = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.ProductProvider
  })),
);
const ProductLayout = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.ProductLayout,
  })),
);
const Products = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.Products,
  })),
);
const StyleCreate = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.StyleCreate,
  })),
);
const Styles = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.Styles,
  })),
);
const Specifications = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.Specifications,
  })),
);
const Customization = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.Customization,
  })),
);
const Subscription = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.Subscription,
  })),
);
const SpecCreate = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.SpecCreate,
  })),
);
const Attributes = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.Attributes,
  })),
);
const StyleCreateLayout = lazy(() =>
  import('@/pages/vendor/Products').then(module => ({
    default: module.StyleCreateLayout,
  })),
);

// Additional components
const Financials = lazy(() =>
  import('@/pages/vendor/Financials').then(module => ({
    default: module.Financials,
  })),
);
const Community = lazy(() =>
  import('@/pages/vendor/Community').then(module => ({
    default: module.Community,
  })),
);
const Customers = lazy(() =>
  import('@/pages/vendor/Customers').then(module => ({
    default: module.Customers,
  })),
);
const GoalLayout = lazy(() =>
  import('@/pages/vendor/Goals').then(module => ({
    default: module.GoalLayout,
  })),
);
const GoalHome = lazy(() =>
  import('@/pages/vendor/Goals').then(module => ({ default: module.GoalHome })),
);
const Rewards = lazy(() =>
  import('@/pages/vendor/Goals').then(module => ({ default: module.Rewards })),
);
const SupportDetail = lazy(() =>
  import('@/pages/vendor/Support').then(module => ({
    default: module.SupportDetail,
  })),
);
const SupportHome = lazy(() =>
  import('@/pages/vendor/Support').then(module => ({
    default: module.SupportHome,
  })),
);
const OrderHome = lazy(() =>
  import('@/pages/vendor/Orders').then(module => ({
    default: module.OrderHome,
  })),
);
const OrderDetail = lazy(() =>
  import('@/pages/vendor/Orders').then(module => ({
    default: module.OrderDetail,
  })),
);
const Coupons = lazy(() =>
  import('@/pages').then(module => ({ default: module.Coupons })),
);

const Logout = lazy(() =>
  import('@/pages/vendor').then(module => ({ default: module.Logout })),
)

export const vendorRoutes = [
  {
    title: 'Index',
    path: '',
    hide: true,
    element: <Navigate to="dashboard" />,
  },
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: <DashboardIcon />,
    element: <Dashboard />,
  },
  {
    title: 'Profile',
    path: 'profile',
    icon: <UserIcon />,
    element: <Outlet />,
    children: [
      {
        title: 'Business Profiles',
        path: '',
        element: <ProfileHome />,
      },
      {
        title: 'My Bank Details',
        path: 'bank-detail',
        element: <BankDetail />,
      },
      {
        title: 'Fulfillment Details',
        path: 'fulfillment',
        element: <FulfillDetail />,
        leaf: true,
        children: [
          {
            index: true,
            element: <Navigate to="pickup" />,
          },
          {
            title: 'Pickup',
            path: 'pickup',
            element: <Pickup />,
          },
          {
            title: 'Delivery',
            path: 'delivery',
            element: <Delivery />,
          },
          {
            title: 'Partnered Pickup Location',
            path: 'location',
            element: <Outlet />,
            leaf: true,
            children: [
              {
                title: 'Home',
                path: '',
                element: <PickupLocation />,
              },
              {
                title: 'Create',
                path: ':id',
                element: <PickupLocationCreate />,
              },
            ],
          },
        ],
      },
      {
        title: 'Shipping Services',
        path: 'shipping-service',
        element: <ShippingService />,
      },
      {
        title: 'Shipping Address',
        path: 'shipping-address',
        element: <ShippingAddress />,
      },
      {
        title: 'Parcel Size',
        path: 'parcel-size',
        element: <Outlet />,
        leaf: true,
        children: [
          {
            title: 'Home',
            path: '',
            element: <ParcelSize />,
          },
          {
            title: 'Create',
            path: ':id',
            element: <ParcelCreate />,
          },
        ],
      },
      {
        title: 'Shipping Account',
        path: 'shipping-account',
        element: <ShippingAccount />,
      },
    ],
  },
  {
    title: 'My Products',
    path: 'products',
    icon: <UserIcon />,
    element: <Outlet />,
    leaf: true,
    children: [
      {
        title: 'Home',
        path: '',
        hide: true,
        element: <Products />,
      },
      {
        title: 'Create & Edit',
        path: ':productId',
        element: <ProductProvider>
          <ProductLayout />
        </ProductProvider>,
        leaf: true,
        children: [
          {
            index: true,
            element: <Navigate to="general" />,
          },
          {
            title: 'General',
            path: 'general',
            element: <General />,
          },
          {
            title: 'Styles',
            path: 'style',
            element: <StyleCreateLayout />,
            children: [
              {
                index: true,
                element: <Styles />,
              },
              {
                title: 'Create',
                path: ':styleId',
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <StyleCreate />,
                  },
                  {
                    title: 'Attributes',
                    path: 'attribute',
                    element: <Attributes />,
                  },
                ],
              },
              {
                title: 'Attributes',
                path: 'attribute',
                element: <Attributes />,
              },
            ],
          },
          {
            title: 'Specifications',
            path: 'specifications',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Specifications />,
              },
              {
                title: 'Create',
                path: ':specId',
                element: <SpecCreate />,
              },
            ],
          },
          {
            title: 'Customization',
            path: 'customziation',
            element: <Customization />,
          },
          {
            title: 'Subscription',
            path: 'subscription',
            element: <Subscription />,
          },
        ],
      },
    ],
  },
  {
    title: 'Orders',
    path: 'orders',
    icon: <UserIcon />,
    element: <Outlet />,
    leaf: true,
    children: [
      {
        index: true,
        element: <OrderHome />,
      },
      {
        title: 'Detail',
        path: ':id',
        element: <OrderDetail />,
      },
    ],
  },
  {
    title: 'Financials',
    path: 'financial',
    icon: <FinancialsIcon />,
    element: <Financials />,
  },
  {
    title: 'Customers',
    path: 'customer',
    icon: <VendorIcon />,
    element: <Customers />,
  },
  {
    title: 'Community',
    path: 'community',
    icon: <CommunityIcon />,
    element: <Community />,
  },
  {
    title: 'Goals',
    path: 'goals',
    icon: <UserIcon />,
    element: <GoalLayout />,
    leaf: true,
    children: [
      {
        title: 'Home',
        path: '',
        element: <GoalHome />,
      },
      {
        title: 'Reward',
        path: 'reward',
        element: <Rewards />,
      },
    ],
  },
  {
    title: 'Coupon Center',
    path: 'coupon-center',
    icon: <UserIcon />,
    leaf: true,
    element: <Outlet />,
    children: [
      {
        title: 'Home',
        path: '',
        element: <Coupons />,
      },
    ],
  },
  {
    title: 'Support',
    path: 'support',
    icon: <UserIcon />,
    leaf: true,
    children: [
      {
        title: 'Home',
        path: '',
        element: <SupportHome />,
      },
      {
        title: 'Detail',
        path: ':id',
        element: <SupportDetail />,
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
