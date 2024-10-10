import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ForgotPassword from '@/pages/ForgotPassword';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import ServicePage from '@/pages/ServicePage';
import ServiceDetail from '@/pages/ServiceDetail';
import BookingPage from '@/pages/BookingPage';
import PaymentPage from '@/pages/PaymentPage';

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
    title: 'ServiceDetail',
    path: '/service-detail',
    component: ServiceDetail,
  },
  {
    title: 'BookingPage',
    path: '/booking-page',
    component: BookingPage,
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
];

export { publicRoutes, memberRoutes, adminRoutes };
