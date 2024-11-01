import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, adminRoutes } from './routes/routes';
import './App.css';

import DefaultLayout from './layout/DefaultLayout';
import AdminLayout from './layout/AdminLayout';
import ProfileLayout from './layout/ProfileLayout/ProfileLayout';
import SubscriptionPage from './pages/UserProfile/Subscriptions';
import ProfilePage from './pages/UserProfile/Profile';
import UserBooking from './pages/UserProfile/UserBooking';
import BookingHistoryPage from './pages/UserProfile/Booking/BookingHistoryPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Puclic routes */}
          <Route>
            {publicRoutes.map((item, index) => {
              const Layout = item.layout || DefaultLayout;
              const Page = item.component;
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>
          {/* Profile Routes */}
          <Route path="/user" element={<ProfileLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="subscriptions" element={<SubscriptionPage />} />
            <Route path="booking" element={<BookingHistoryPage />} />
            <Route index element={<Navigate to="profile" replace />} />
          </Route>
          {/* Admin routes */}
          <Route>
            {adminRoutes.map((item, index) => {
              const Layout = item.layout || AdminLayout;
              const Page = item.component;
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
