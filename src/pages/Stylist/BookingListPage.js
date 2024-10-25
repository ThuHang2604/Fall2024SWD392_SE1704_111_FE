import React, { useEffect, useState } from 'react';
import BookingList from '@/components/TableList/BookingList/BookingList';
import { getBookingList } from '@/api/BookingApi';

function BookingListPage() {
  const [bookingList, setBookingList] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingList(page + 1, rowsPerPage);
        setBookingList(data);
      } catch (error) {
        setError('Failed to fetch bookings. Please try again later.');
      }
    };

    fetchBookings();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <BookingList
      bookingList={bookingList}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      error={error}
    />
  );
}

export default BookingListPage;
