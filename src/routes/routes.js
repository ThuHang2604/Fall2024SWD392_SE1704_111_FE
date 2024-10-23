import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/pages/LoginPage';
import ForgotPassword from '@/pages/ForgotPassword';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Manager/Dashboard';
import ServicePage from '@/pages/ServicePage';
import CartPage from '@/pages/CartPage';
import PaymentPage from '@/pages/PaymentPage';
import ServiceList from '@/pages/Manager/ServiceListPage';
import ProfilePage from '@/pages/UserProfile/Profile';
import SubscriptionsPage from '@/pages/UserProfile/Subscriptions';
import UserBooking from '@/pages/UserProfile/UserBooking';
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
    title: 'CartPage',
    path: '/Cart-page',
    component: CartPage,
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
  {
    title: 'UserBooking',
    path: '/user-booking',
    component: UserBooking,
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
