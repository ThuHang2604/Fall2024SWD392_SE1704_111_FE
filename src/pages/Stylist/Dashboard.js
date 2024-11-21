import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookings } from '@/redux/slice/userBooking';
import { fetchUserList } from '@/redux/slice/userSlice';
import './style.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);
  const { users } = useSelector((state) => state.users);

  const [bookingStatusData, setBookingStatusData] = useState({});
  const [userStatusData, setUserStatusData] = useState({});
  const [servicePriceData, setServicePriceData] = useState({});
  const [stylistBookingData, setStylistBookingData] = useState({});

  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(fetchUserList());
  }, [dispatch]);

  useEffect(() => {
    if (bookings.length > 0) {
      const bookingStatus = bookings.reduce((acc, booking) => {
        const statusLabel = booking.status === 1 ? 'Active' : booking.status === 2 ? 'Inactive' : 'Inactive';

        acc[statusLabel] = (acc[statusLabel] || 0) + 1;
        return acc;
      }, {});

      const userStatus = users.reduce((acc, user) => {
        const statusLabel = user.status === 1 ? 'Active' : user.status === 2 ? 'Inactive' : 'Unknown';
        acc[statusLabel] = (acc[statusLabel] || 0) + 1;
        return acc;
      }, {});

      const servicePrices = bookings.reduce((acc, booking) => {
        if (Array.isArray(booking?.services)) {
          booking.services.forEach((service) => {
            acc[service.serviceName] = (acc[service.serviceName] || 0) + service.price;
          });
        }
        return acc;
      }, {});

      const totalPrice = Object.values(servicePrices).reduce((sum, price) => sum + price, 0);
      servicePrices['Total'] = totalPrice;

      const stylistBookings = bookings.reduce((acc, booking) => {
        if (Array.isArray(booking?.services)) {
          booking.services.forEach((service) => {
            acc[service.stylistName] = (acc[service.stylistName] || 0) + 1;
          });
        }
        return acc;
      }, {});

      setBookingStatusData(bookingStatus);
      setUserStatusData(userStatus);
      setServicePriceData(servicePrices);
      setStylistBookingData(stylistBookings);
    }
  }, [bookings, users]);

  const bookingStatusChartData = {
    labels: Object.keys(bookingStatusData),
    datasets: [
      {
        label: 'Bookings by Status',
        data: Object.values(bookingStatusData),
        backgroundColor: ['#1e88e5', '#e53935'],
      },
    ],
  };

  const userStatusChartData = {
    labels: Object.keys(userStatusData),
    datasets: [
      {
        label: 'Users by Status',
        data: Object.values(userStatusData),
        backgroundColor: ['#ffeb3b', '#ff5722', '#9e9e9e'],
      },
    ],
  };

  const servicePriceChartData = {
    labels: Object.keys(servicePriceData),
    datasets: [
      {
        label: 'Total Price by Service ($)',
        data: Object.values(servicePriceData),
        backgroundColor: ['#26c6da', '#ab47bc', '#8bc34a', '#ff7043', '#ffee58', '#ff5722'],
      },
    ],
  };

  const stylistPieChartData = {
    labels: Object.keys(stylistBookingData),
    datasets: [
      {
        label: 'Bookings by Stylist',
        data: Object.values(stylistBookingData),
        backgroundColor: ['#42a5f5', '#66bb6a', '#ff7043', '#ab47bc', '#ffee58'],
      },
    ],
  };

  const commonChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label === 'Total Price by Service ($)') {
              return `$${context.raw.toLocaleString()}`;
            }
            return context.raw;
          },
        },
        backgroundColor: '#222',
        titleColor: '#ffeb3b',
        bodyColor: '#fff',
        cornerRadius: 4,
      },
    },
  };

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Roboto, sans-serif',
        minHeight: '100vh',
        color: '#3f51b5',
      }}
    >
      <h1 style={{ textAlign: 'center', fontWeight: 700 }}>Dashboard</h1>

      {/* Row: Pie Chart and Bar Chart */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {/* Booking Status */}
        <div
          style={{
            background: '#1e1e1e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h2 style={{ textAlign: 'center', color: '#1e88e5', marginBottom: '15px' }}>Booking ID by Status</h2>
          <Bar data={bookingStatusChartData} options={commonChartOptions} />
        </div>

        {/* User Status */}
        <div
          style={{
            background: '#1e1e1e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h2 style={{ textAlign: 'center', color: '#ffeb3b', marginBottom: '15px' }}>User ID by Status</h2>
          <Bar data={userStatusChartData} options={commonChartOptions} />
        </div>
      </div>

      {/* Row: Other Bar Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)', // Two columns for side-by-side layout
          gap: '20px',
        }}
      >
        {/* Pie Chart */}
        <div
          style={{
            background: '#1e1e1e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
            height: '620px',
            // Set a smaller height
          }}
        >
          <h2 style={{ textAlign: 'center', color: '#42a5f5', marginBottom: '15px' }}>Bookings by Stylist</h2>
          <Pie
            data={stylistPieChartData}
            options={{
              ...commonChartOptions,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#fff' },
                },
              },
              aspectRatio: 1, // Ensures a square layout for the pie chart
            }}
            height={650}
          />
        </div>

        {/* Bar Chart: "Total Price by Service" */}
        <div
          style={{
            background: '#1e1e1e',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
            height: '620px',
          }}
        >
          <h2 style={{ textAlign: 'center', color: '#26c6da', marginBottom: '15px' }}>Total Price by Service</h2>
          <Bar
            data={servicePriceChartData}
            options={{
              ...commonChartOptions,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#fff' },
                },
              },
              maintainAspectRatio: false, // Allows dynamic resizing
              scales: {
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                },
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                },
              },
            }}
            height={650} // Reduce chart height
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
