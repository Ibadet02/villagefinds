import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

const Home = lazy(() =>
  import('@/pages/community').then(module => ({ default: module.Home })),
);
const Dashboard = lazy(() =>
  import('@/pages/community').then(module => ({ default: module.Dashboard })),
);
const Profile = lazy(() =>
  import('@/pages/community').then(module => ({ default: module.Profile })),
);
const Earning = lazy(() =>
  import('@/pages/community').then(module => ({ default: module.Earning })),
);
const Announcement = lazy(() =>
  import('@/pages/community').then(module => ({
    default: module.Announcement,
  })),
);
const Events = lazy(() =>
  import('@/pages/community').then(module => ({ default: module.Events })),
);
const DetailView = lazy(() =>
  import('@/pages/community').then(module => ({ default: module.DetailView })),
);

const Login = lazy(() =>
  import('@/pages/community/Auth').then(module => ({ default: module.Login })),
);
const Signup = lazy(() =>
  import('@/pages/community/Auth').then(module => ({ default: module.Signup })),
);

const AuthLayout = lazy(() =>
  import('@/components/layout/community').then(module => ({
    default: module.AuthLayout,
  })),
);
const HomeLayout = lazy(() =>
  import('@/components/layout/community').then(module => ({
    default: module.HomeLayout,
  })),
);

export const communityRoutes = [
  {
    path: '',
    element: <Home />,
  },
  {
    path: '',
    element: <HomeLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'earning',
        element: <Earning />,
      },
      {
        path: 'announcement',
        element: <Announcement />,
      },
      {
        path: 'events',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Events />,
          },
          {
            path: ':id',
            element: <DetailView />,
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Signup />,
      },
    ],
  },
];
