import React, { useEffect, useState } from 'react';
import { Pagination, Box, Typography, Tabs, Tab } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingHistory } from '@/redux/slice/userProfileSlice'; // Import the thunk action
import BookingCardView from './BookingCardView'; // Component to render bookings
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingHistoryPage = () => {
  const dispatch = useDispatch();
  const { bookingHistory, isLoading, error } = useSelector((state) => state.userProfile);

  const [page, setPage] = useState(1); // Current page for pagination
  const [pageSize] = useState(4); // Items per page (4 bookings)
  const [paginatedBookings, setPaginatedBookings] = useState([]); // Current page's bookings
  const [tabValue, setTabValue] = useState(0); // Tab control (0 for Upcoming, 1 for Past)

  // Fetch booking history on component mount
  useEffect(() => {
    dispatch(getBookingHistory())
      .unwrap()
      .catch((err) => {
        toast.error(`Failed to fetch bookings: ${err.message}`);
      });
  }, [dispatch]);

  // Filter bookings based on tab selection (Upcoming or Past)
  const upcomingBookings = bookingHistory.filter((booking) => new Date(booking.startDate) >= new Date());
  const pastBookings = bookingHistory.filter((booking) => new Date(booking.startDate) < new Date());

  // Paginate whenever booking list, page, or tab changes
  useEffect(() => {
    const bookingsToShow = tabValue === 0 ? upcomingBookings : pastBookings;
    paginateBookings(bookingsToShow, page, pageSize);
  }, [tabValue, page, pageSize, bookingHistory]);

  const paginateBookings = (bookings, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = bookings.slice(startIndex, endIndex); // Extract items for current page
    setPaginatedBookings(paginatedItems);
  };

  const handlePageChange = (event, value) => {
    setPage(value); // Update page number on change
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue); // Switch between Upcoming and Past tabs
    setPage(1); // Reset to page 1 when changing tabs
  };

  return (
    <div>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Monoton, Fantasy', mb: 3 }}>
            MANAGE YOUR BOOKINGS
          </Typography>
          <Typography variant="body1" gutterBottom>
            Review your bookings and make any needed changes.
          </Typography>
          {/* Tabs: Upcoming and Past */}
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: '20px' }}>
            <Tab label="Past" />
            <Tab label="Upcoming" />
          </Tabs>

          {/* Booking List for the Selected Tab */}
          <BookingCardView bookings={paginatedBookings} />

          {/* Pagination */}
          <Box display="flex" justifyContent="center" sx={{ marginTop: '20px' }}>
            <Pagination
              count={
                tabValue === 0
                  ? Math.ceil(upcomingBookings.length / pageSize)
                  : Math.ceil(pastBookings.length / pageSize)
              }
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BookingHistoryPage;
