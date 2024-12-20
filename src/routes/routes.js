import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/pages/LoginPage';
import ForgotPassword from '@/pages/ForgotPassword';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Stylist/Dashboard';
import ServicePage from '@/pages/ServicePage';
import CartPage from '@/pages/CartPage';
import PaymentPage from '@/pages/PaymentPage';
import ServiceList from '@/pages/Stylist/ServiceListPage';
import ProfilePage from '@/pages/UserProfile/Profile';
import SubscriptionsPage from '@/pages/UserProfile/Subscriptions';
// import UserBooking from '@/pages/UserProfile/UserBooking';
import ReportListPage from '@/pages/Stylist/ReportListPage';
import BookingListPage from '@/pages/Stylist/BookingListPage';

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
    title: 'Forget Password',
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
  {
    title: 'Report List',
    path: '/report-list',
    component: ReportListPage,
  },
  {
    title: 'Booking List',
    path: '/booking-list',
    component: BookingListPage,
  },
];

export { publicRoutes, memberRoutes, adminRoutes };
