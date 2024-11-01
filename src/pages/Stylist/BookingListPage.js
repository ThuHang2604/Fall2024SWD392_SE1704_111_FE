import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingList from '@/components/TableList/BookingList/BookingList';
import { getBookingList } from '@/api/BookingApi';

function BookingListPage() {
  const [bookingList, setBookingList] = useState([]);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await getBookingList();
      const data = response?.data || [];
      setBookingList(data);
    } catch (error) {
      setError('Failed to fetch bookings. Please try again later.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <BookingList bookingList={bookingList} error={error} fetchBookings={fetchBookings} />;
      <ToastContainer position="top-right" autoClose="3000" />
    </>
  );
}

export default BookingListPage;
