import React, { useEffect, useState } from 'react';
import { Pagination, Box, Typography, Tabs, Tab } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingHistory } from '@/redux/slice/userProfileSlice';
import BookingCardView from './BookingCardView';
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
        toast.error(`Failed to fetch bookings: ${err.message || 'unknown error'}`);
      });
  }, [dispatch]);

  // Filter bookings based on tab selection (Upcoming or Past)
  const upcomingBookings = bookingHistory.filter(
    (booking) => new Date(booking.startDate) >= new Date() && ![5, 6].includes(booking.status),
  );
  const pastBookings = bookingHistory.filter(
    (booking) => new Date(booking.startDate) < new Date() || [5, 6].includes(booking.status),
  );

  // Paginate whenever booking list, page, or tab changes
  useEffect(() => {
    const bookingsToShow = tabValue === 0 ? upcomingBookings : pastBookings;
    paginateBookings(bookingsToShow, page, pageSize);
  }, [tabValue, page, pageSize, bookingHistory]);

  const paginateBookings = (bookings, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = bookings.slice(startIndex, endIndex);
    setPaginatedBookings(paginatedItems);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  const displayBookings = paginatedBookings.length > 0;

  return (
    <div>
      {error ? (
        <Typography color="error">{typeof error === 'object' ? JSON.stringify(error) : error}</Typography>
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
            <Tab label="Upcoming" />
            <Tab label="Past" />
          </Tabs>

          {/* Booking List or Placeholder */}
          {displayBookings ? (
            <BookingCardView bookings={paginatedBookings} />
          ) : (
            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
              <Typography variant="h6" color="textSecondary">
                No booking history found.
              </Typography>
              <img src="no-booking.png" alt="No bookings" style={{ maxWidth: '200px', marginTop: '20px' }} />
            </Box>
          )}

          {/* Pagination */}
          {displayBookings && (
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
          )}
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BookingHistoryPage;
