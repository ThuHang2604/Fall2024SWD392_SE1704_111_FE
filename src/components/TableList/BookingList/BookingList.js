import React from 'react';
import { Box, Typography } from '@mui/material';
import BookingListTable from './BookingListTable';

function BookingList({ bookingList, error, fetchBookings }) {
  // console.log('Booking List prop in BookingList component:', bookingList);
  // console.log('Booking List from Redux:', bookingList);

  return (
    <div>
      <Typography variant="h3" sx={{ marginLeft: '10px', marginBottom: '20px', fontSize: 40, fontFamily: 'fantasy' }}>
        Booking List
      </Typography>

      {error ? (
        <Box sx={{ textAlign: 'center', color: 'red', marginBottom: '10px' }}>
          <Typography variant="body1" sx={{ fontSize: 18 }}>
            {error.message || 'An error occurred'}
          </Typography>
        </Box>
      ) : (
        <BookingListTable bookingList={bookingList} fetchBookings={fetchBookings} />
      )}
    </div>
  );
}

export default BookingList;
