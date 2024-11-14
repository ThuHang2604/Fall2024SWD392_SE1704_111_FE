import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Tab,
  Tabs,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingHistory } from '@/redux/slice/userProfileSlice';

const UserBooking = () => {
  const dispatch = useDispatch();
  const { bookingHistory } = useSelector((state) => state.userProfile);

  const [loading, setLoading] = useState(true); // Loading state with delay
  const [tabValue, setTabValue] = useState(0); // Tab control (0 for Upcoming, 1 for Past)
  const [anchorEl, setAnchorEl] = useState(null); // Menu control for each booking
  const open = Boolean(anchorEl);

  // Fetch booking history on component mount with a delay
  useEffect(() => {
    const loadBookingHistory = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second
      dispatch(getBookingHistory()).finally(() => setLoading(false));
    };

    loadBookingHistory();
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
      <Button variant="outlined" endIcon={<MoreVertIcon />} onClick={handleMenuOpen} sx={{ mt: 1 }}>
        Manage
      </Button>
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
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!loading && (
        <Box sx={{ display: 'flex', gap: '30px', flexDirection: { xs: 'column', md: 'row' } }}>
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

            {/* Tabs: Upcoming and Past */}
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Upcoming" />
              <Tab label="Past" />
            </Tabs>

            {/* Display Bookings based on tab */}
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
      )}
    </Container>
  );
};

export default UserBooking;
