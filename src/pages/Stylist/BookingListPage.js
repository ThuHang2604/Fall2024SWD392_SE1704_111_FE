import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingList from '@/components/TableList/BookingList/BookingList';
import { getBookingsOfStylist } from '@/redux/slice/userBooking'; // Redux thunk
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';

function BookingListPage() {
  const dispatch = useDispatch();
  const bookingList = useSelector((state) => state.booking.bookings); // Use booking list from Redux state
  const error = useSelector((state) => state.booking.error); // Use error from Redux state
  const isLoading = useSelector((state) => state.booking.isLoading);

  const [loading, setLoading] = useState(true); // Local loading state for delay

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true); // Start loading indicator
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      dispatch(getBookingsOfStylist()).finally(() => setLoading(false)); // Fetch bookings and stop loading after
    };

    fetchBookings();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <BookingList bookingList={bookingList} error={error} fetchBookings={() => dispatch(getBookingsOfStylist())} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default BookingListPage;
