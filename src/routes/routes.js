import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/pages/LoginPage';
import ForgotPassword from '@/pages/ForgotPassword';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Manager/Dashboard';
import ServicePage from '@/pages/ServicePage';
import BookingPage from '@/pages/BookingPage';
import PaymentPage from '@/pages/PaymentPage';
import ServiceList from '@/pages/Manager/ServiceListPage';
import ProfilePage from '@/pages/UserProfile/Profile';
import SubscriptionsPage from '@/pages/UserProfile/Subscriptions';
const publicRoutes = [
  {
    title: 'Home',
    path: '/',
    component: HomePage,
  },
  {
    title: 'Login',
    path: '/login',
    component: LoginPage,
  },
  {
    title: 'Login',
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    title: 'Register',
    path: '/register',
    component: RegisterPage,
  },
  {
    title: 'ServicePage',
    path: '/service-page',
    component: ServicePage,
  },
  {
    title: 'BookingPage',
    path: '/booking-page',
    component: BookingPage,
  },
  {
    title: 'Profile',
    path: '/profile',
    component: ProfilePage,
  },
  {
    title: 'Subscriptions',
    path: '/subscriptions',
    component: SubscriptionsPage,
  },
];

const memberRoutes = [
  {
    title: 'Payment',
    path: '/payment',
    component: PaymentPage,
  },
];

const adminRoutes = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    component: Dashboard,
  },
  {
    title: 'Service List',
    path: '/service-list',
    component: ServiceList,
  },
];

export { publicRoutes, memberRoutes, adminRoutes };
