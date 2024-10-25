import React, { useEffect, useState } from 'react';
import BookingList from '@/components/TableList/BookingList/BookingList';
import { getBookingList } from '@/api/BookingApi';

function BookingListPage() {
  const [bookingList, setBookingList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookingList();
        const data = response?.data || [];
        setBookingList(data);
      } catch (error) {
        setError('Failed to fetch bookings. Please try again later.');
      }
    };

    fetchBookings();
  }, []);

  return <BookingList bookingList={bookingList} error={error} />;
}

export default BookingListPage;
