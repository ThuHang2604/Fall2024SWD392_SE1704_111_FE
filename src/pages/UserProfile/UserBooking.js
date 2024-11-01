import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Tab, Tabs, Button, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingHistory } from '@/redux/slice/userProfileSlice'; // Import từ slice

const UserBooking = () => {
  const dispatch = useDispatch();
  const { bookingHistory } = useSelector((state) => state.userProfile); // Lấy lịch sử từ Redux store
  const [tabValue, setTabValue] = useState(0); // Điều khiển tab hiện tại
  const [anchorEl, setAnchorEl] = useState(null); // Điều khiển menu cho mỗi booking
  const open = Boolean(anchorEl);

  // Gọi API để lấy dữ liệu lịch sử booking
  useEffect(() => {
    dispatch(getBookingHistory());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderBookingItem = (booking) => (
    <Box
      key={booking.serviceId}
      sx={{ borderBottom: '1px solid #ddd', pb: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}
    >
      <div>
        <Typography variant="h6">{booking.serviceName}</Typography>
        <Typography variant="body2">
          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">Total Price: ${booking.totalPrice}</Typography>
      </div>
      <div>
        <></>
        <></>
        <Button variant="outlined" endIcon={<MoreVertIcon />} onClick={handleMenuOpen} sx={{ mt: 1 }}>
          Manage
        </Button>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={handleMenuClose}>Book Again</MenuItem>
        <MenuItem onClick={handleMenuClose}>Reschedule</MenuItem>
        <MenuItem onClick={handleMenuClose}>Cancel</MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Container maxWidth={false} sx={{ mt: 4, maxWidth: '1400px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '30px',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Nội dung chính */}
        <Box
          sx={{
            border: '3px solid black',
            borderRadius: 2,
            padding: 4,
            width: '728px',
            textAlign: 'left',
            flexGrow: 1,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Monoton, Fantasy', mb: 3 }}>
            MANAGE YOUR BOOKINGS
          </Typography>
          <Typography variant="body1" gutterBottom>
            Review your bookings and make any needed changes.
          </Typography>

          {/* Tabs: Upcoming và Past */}
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Upcoming" />
            <Tab label="Past" />
          </Tabs>

          {/* Hiển thị Booking theo tab */}
          {tabValue === 0 && (
            <Box>
              {bookingHistory?.filter((b) => new Date(b.startDate) >= new Date()).length === 0 ? (
                <Typography>No upcoming bookings found.</Typography>
              ) : (
                bookingHistory
                  ?.filter((b) => new Date(b.startDate) >= new Date())
                  .map((booking) => renderBookingItem(booking))
              )}
            </Box>
          )}
          {tabValue === 1 && (
            <Box>
              {bookingHistory?.filter((b) => new Date(b.startDate) < new Date()).length === 0 ? (
                <Typography>No past bookings found.</Typography>
              ) : (
                bookingHistory
                  ?.filter((b) => new Date(b.startDate) < new Date())
                  .map((booking) => renderBookingItem(booking))
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default UserBooking;
